import { createRouter, createWebHistory } from "vue-router";
import { useAdminAuthStore } from "@/stores/adminAuthStore";

import AdminLogin from "@/views/AdminLogin.vue";
import DashboardView from "@/views/DashboardView.vue";
import GameManagement from "@/views/GameManagement.vue";
import PromotionView from "@/views/PromotionView.vue";
import AdminUsers from "../views/AdminUsers.vue";

const routes = [
  { path: "/", redirect: "/admin/login" },
  { path: "/admin/login", name: "AdminLogin", component: AdminLogin },
  { path: "/admin", redirect: "/admin/dashboard" },
  {
    path: "/admin/dashboard",
    name: "Dashboard",
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/users",
    name: "AdminUsers",
    component: AdminUsers,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/games",
    name: "GameManagement",
    component: GameManagement,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/promotions",
    name: "PromotionView",
    component: PromotionView,
    meta: { requiresAuth: true },
  },
  { path: "/:pathMatch(.*)*", redirect: "/admin/login" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = useAdminAuthStore();
  const isLoggedIn = !!auth.token && !!auth.admin;

  if (to.meta.requiresAuth && !isLoggedIn) {
    return next("/admin/login");
  }
  if (to.path === "/admin/login" && isLoggedIn) {
    return next("/admin/dashboard");
  }
  next();
});

export default router;
