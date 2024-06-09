<template>
  <div class="login-container">
    <h2 style="text-align: center;">Login</h2>
    <form @submit.prevent="onLogin">
      <div class="form-group">
        <label for="userId" class="tabs-modify">User ID</label>
        <input
          type="text"
          v-model="userID"
          id="userId"
          placeholder="input User ID"
          autocomplete="off"
        />
      </div>
      <div class="form-group">
        <label for="password" class="tabs-modify">Password</label>
        <input
          type="password"
          v-model="password"
          id="password"
          placeholder="input Password"
          autocomplete="off"
        />
      </div>
      <button class="btn btn-outline-primary" style="width: 100%">Login</button>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import { login } from "./js-file/auth";
import { useRouter } from "vue-router";

export default {
  data() {
    return {
      userID: "",
      password: "",
    };
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  methods: {
    async onLogin() {
      if (this.userID === "" || this.password === "") {
        this.$swal.fire({
          icon: "warning",
          title: "Login",
          text: "please input User ID and Password",
          showConfirmButton: true,
        });
        return;
      }

      var response = await login(this.userID, this.password);
      if (response.isSuccess) {
        localStorage.setItem("auth", "true");
        this.$router.push({ name: "Home" });

        this.$swal.fire({
          position: "top-end",
          icon: "success",
          title: "Login Success",
          showConfirmButton: false,
          timer: 800,
        });
      } else {
        this.$swal.fire({
          icon: "warning",
          title: "Login",
          text: response.message,
          showConfirmButton: true,
        });
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 1em;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-group {
  margin-bottom: 1em;
}

.form-group label {
  display: block;
  margin-bottom: 0.5em;
}

.form-group input {
  width: 100%;
  padding: 0.5em;
  box-sizing: border-box;
}

button {
  padding: 0.5em 1em;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
