import { createRouter, createMemoryHistory } from "vue-router";

import Login from "@/components/Login.vue";
import Home from "@/views/Home.vue";
import About from "@/views/About.vue";
import NotFound from "@/views/NotFound.vue";
import Form from "@/views/masters/Form.vue";
import Group from "@/views/masters/Group.vue";
import GroupAccess from "@/views/masters/GroupAccess.vue";
import PostingLimit from "@/views/masters/PostingLimit.vue";
import User from "@/views/masters/User.vue";
import Posting from "@/views/Posting.vue";
import LoginHistory from "@/views/UserLoginHistory.vue"

const routes = [
  {
    path: "/",
    redirect: (to) => {
      const isAuthenticated = localStorage.getItem("auth") === "true";
      return isAuthenticated ? { name: "Home" } : { name: "Login" };
    },
  },
  { path: "/login", name: "Login", component: Login },
  { path: "/", name: "Home", component: Home },
  { path: "/about", name: "About", component: About },
  { path: "/form", name: "Form", component: Form },
  { path: "/group", name: "Group", component: Group },
  { path: "/groupaccess", name: "GroupAccess", component: GroupAccess },
  { path: "/postinglimit", name: "PostingLimit", component: PostingLimit },
  { path: "/user", name: "User", component: User },
  { path: "/posting", name: "Posting", component: Posting },
  { path: "/loginhistory", name: "LoginHistory", component: LoginHistory },
  {
    path: "/:pathMatch(.*)*", // Catch-all route for undefined paths
    name: 'NotFound',
    component: NotFound
  },
];

const router = createRouter({
  history: createMemoryHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation guard to protect routes
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("auth") === "true";
  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !isAuthenticated
  ) {
    next({ name: "Login" });
  } else {
    next();
  }
});

export default router;
