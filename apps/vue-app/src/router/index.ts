import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import { useAuthStore } from "../stores/auth.store";
import LoginPage from "../features/auth/LoginPage.vue";
import UsersPage from "../features/users/UsersPage.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/users",
  },
  {
    path: "/login",
    name: "login",
    component: LoginPage,
  },
  {
    path: "/users",
    name: "users",
    component: UsersPage,
    meta: {
      requiresAuth: true,
    },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  if (authStore.token && !authStore.user) {
    await authStore.refreshMe();
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return {
      name: "login",
      query: {
        redirect: to.fullPath,
      },
    };
  }

  if (to.name === "login" && authStore.isAuthenticated) {
    return {
      name: "users",
    };
  }

  return true;
});
