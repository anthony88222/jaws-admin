// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// 匯入頁面元件
import AdminLogin from '../views/admin/AdminLogin.vue'
import AdminDashboard from '../views/admin/AdminDashboard.vue'
import AdminGames from '../views/admin/AdminGames.vue'

const routes = [
  { path: '/', name: 'AdminLogin', component: AdminLogin },
  { path: '/admin/dashboard', name: 'AdminDashboard', component: AdminDashboard },
  { path: '/admin/games', name: 'AdminGames', component: AdminGames }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
