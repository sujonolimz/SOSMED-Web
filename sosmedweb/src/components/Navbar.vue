<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/home">Home</router-link>
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
          <li class="nav-item dropdown">
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
          <li class="nav-item">
            <router-link class="nav-link" to="/about">About</router-link>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
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
  data() {},
  methods: {
    logout() {
      localStorage.removeItem("auth");
      this.isAuthenticated = false;
      this.$router.push({ name: "Login" });
    },
  },
};
</script>

<style scoped>
/* Add any additional styling here */
</style>
