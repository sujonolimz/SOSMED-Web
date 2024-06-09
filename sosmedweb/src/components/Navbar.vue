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
        <ul class="navbar-nav">
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
                <router-link class="dropdown-item" to="/form">Form</router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/group"
                  >Group</router-link
                >
              </li>
              <li>
                <router-link class="dropdown-item" to="/groupaccess"
                  >Group Access</router-link
                >
              </li>
              <li>
                <router-link class="dropdown-item" to="/postinglimit"
                  >Posting Limit</router-link
                >
              </li>
              <li>
                <router-link class="dropdown-item" to="/user">User</router-link>
              </li>
            </ul>
          </li>
          <li v-if="isAdmin" class="nav-item">
            <router-link class="nav-link" to="/about">About</router-link>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              href="#"
              role="button"
              aria-expanded="false"
              @click="logout"
              >Log Out</a
            >
          </li>
          <!-- Add more links here -->
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
  data() {
    return {
      isAdmin: false
    }
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
    checkUserStatus(){

      var dept = localStorage.getItem("dept");
      if(dept == "Admin"){
        this.isAdmin = true;
      }
    }
  },
  mounted() {
    this.checkUserStatus();
  }
};
</script>

<style scoped>
/* Add any additional styling here */
</style>
