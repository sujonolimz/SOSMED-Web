<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">Home</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li v-if="isAdmin" class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Master
            </a>
            <ul class="dropdown-menu">
              <li>
                <router-link v-if="isHaveAccForm" class="dropdown-item" to="/form">Form</router-link>
              </li>
              <li>
                <router-link v-if="isHaveAccGroup" class="dropdown-item" to="/group"
                  >Group</router-link
                >
              </li>
              <li>
                <router-link v-if="isHaveAccGroupAccess" class="dropdown-item" to="/groupaccess"
                  >Group Access</router-link
                >
              </li>
              <li>
                <router-link v-if="isHaveAccPostLimit" class="dropdown-item" to="/postinglimit"
                  >Posting Limit</router-link
                >
              </li>
              <li>
                <router-link v-if="isHaveAccUser" class="dropdown-item" to="/user">User</router-link>
              </li>
            </ul>
          </li>
          <li v-if="isAdmin" class="nav-item">
            <router-link class="nav-link" to="/about">About</router-link>
          </li>
          <li class="nav-item"></li>
          <!-- Add more links here -->
        </ul>
        <span class="navbar-text" style="padding-right: 2%;"> {{ userid }} | {{ username }}</span>
        <span class="navbar-text">
          <a
            class="nav-link"
            href="#"
            role="button"
            aria-expanded="false"
            @click="logout"
            >Log Out</a
          >
        </span>
      </div>
    </div>
  </nav>
</template>

<script>
import { isHaveFormAccess } from "./js-file/auth";

export default {
  name: "Navbar",
  data() {
    return {
      isAdmin: false,
      userid: '',
      username: '',
      isHaveAccForm: false,
      isHaveAccGroup: false,
      isHaveAccGroupAccess: false,
      isHaveAccPostLimit: false,
      isHaveAccUser: false,
    };
  },
  methods: {
    logout() {
      // remove local storage
      localStorage.removeItem("auth");
      localStorage.removeItem("userID");
      localStorage.removeItem("userName");
      localStorage.removeItem("groupID");
      localStorage.removeItem("dept");
      localStorage.removeItem("token");

      this.isAuthenticated = false;
      // redirect to login page
      this.$router.push({ name: "Login" });
    },
    checkUserStatus() {
      var dept = localStorage.getItem("dept");
      if (dept == "Admin") {
        this.isAdmin = true;
      }
    },
    loadUserData(){
      this.userid = localStorage.getItem("userID");
      this.username = localStorage.getItem("userName");
    },
    async checkIsHaveAccess(formID){
      try {
        var response = await isHaveFormAccess(this.userid, formID);

        if (response == "ERR_NETWORK") {
          this.$swal.fire({
            icon: "warning",
            title: "Network",
            text: "Network error when access the server, please try again later or try to relogin !",
            showConfirmButton: true,
          });
          return;
        }

        if (response != "undefined") {
          if (response.isSuccess) {
            if(formID == "TForm"){
              this.isHaveAccForm = true;
            }
            else if(formID == "TGroup"){
              this.isHaveAccGroup = true;
            }
            else if(formID == "TGroupAccess"){
              this.isHaveAccGroupAccess = true;
            }
            else if(formID == "TPostingLimit"){
              this.isHaveAccPostLimit = true;
            }
            else if(formID == "TUser"){
              this.isHaveAccUser = true;
            }
              
          } else {
            
            if(formID == "TForm"){
              this.isHaveAccForm = false;
            }
            else if(formID == "TGroup"){
              this.isHaveAccGroup = false;
            }
            else if(formID == "TGroupAccess"){
              this.isHaveAccGroupAccess = false;
            }
            else if(formID == "TPostingLimit"){
              this.isHaveAccPostLimit = false;
            }
            else if(formID == "TUser"){
              this.isHaveAccUser = false;
            }
            
            // this.$swal.fire({
            //   icon: "warning",
            //   title: "Not Authorized",
            //   text: response.message,
            //   showConfirmButton: false,
            //   timer: 2000,
            // });
          }
        }
      } catch (error) {
        this.$swal.fire({
          icon: "error",
          title: "Error",
          text: error,
          showConfirmButton: true,
        });
      }
    }
  },
  mounted() {
    this.checkUserStatus();
    this.loadUserData();

    //Check form access
    this.checkIsHaveAccess('TForm');
    this.checkIsHaveAccess('TGroup');
    this.checkIsHaveAccess('TGroupAccess');
    this.checkIsHaveAccess('TPostingLimit');
    this.checkIsHaveAccess('TUser');
  },
};
</script>

<style scoped>
/* Add any additional styling here */
</style>
