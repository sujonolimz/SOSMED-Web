<template>
  <div id="app">
    <Navbar v-if="isAuthenticated"></Navbar>
    <!-- <posting v-if="isAuthenticated"></posting> -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  // name: 'App'
  data() {
    return {
      isAuthenticated: false,
    };
  },
  created() {
    this.checkAuth();
  },
  methods: {
    checkAuth() {
      this.isAuthenticated = localStorage.getItem("auth") === "true";
    },
    logout() {
      localStorage.removeItem("auth");
      this.isAuthenticated = false;
      this.$router.push({ name: "Login" });
    },
  },
  watch: {
    $route() {
      this.checkAuth();
    },
  },
};
</script>

<script setup>
import Navbar from "./components/Navbar.vue";
import posting from "./views/Posting.vue";
</script>

<style scoped>
nav {
  margin-bottom: 1em;
}
nav a {
  margin-right: 1em;
}

</style>
