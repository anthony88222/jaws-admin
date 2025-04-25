import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import GameManagement from '../views/GameManagement.vue'
import PromotionView from '../views/PromotionView.vue'

const routes = [
  { path: '/admin', name: 'Dashboard', component: DashboardView },
  { path: '/admin/games', name: 'GameManagement', component: GameManagement },
  { path: '/admin/promotions', name: 'PromotionView', component: PromotionView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
