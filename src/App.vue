<!-- <template>
  <div class="layout">
    <Header />
    <div class="container">
        <router-view /> 
      </div>
    <Footer />
  </div>
</template> -->

<template>
  <!-- 主內容 -->
  <div class="page-content container">
    <router-view />
  </div>
</template>

<script setup>
import AdminLogin from './views/admin/AdminLogin.vue';
import AdminDashboard from './views/admin/AdminDashboard.vue';
</script>

<style>
@import './styles/base.css';
@import './styles/variables.css';
@import './styles/layout.css';

/* Sticky Footer 關鍵樣式 */
.page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.page-content {
  flex: 1; /* 撐滿可用空間，讓 Footer 推到底 */
}

/* * {
  outline: 1px solid red;
} */
</style>
