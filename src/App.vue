<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" v-if="isLoginPage" />
    <el-container v-else style="height:100vh">
      <el-aside width="200px" class="aside-dark">
        <el-menu router :default-active="$route.path" background-color="#1f1f2e" text-color="#fff"
          active-text-color="#00a9ff">
          <el-menu-item index="/admin">Dashboard</el-menu-item>
          <el-menu-item index="/admin/games">遊戲管理</el-menu-item>
          <el-menu-item index="/admin/promotions">促銷管理</el-menu-item>
        </el-menu>
        <!-- 登出按鈕置底 -->
        <div class="logout-container">
          <el-button type="danger" @click="handleLogout">登出</el-button>
        </div>
      </el-aside>
      <el-container>
        <el-main class="main-wrapper">
          <component :is="Component" />
        </el-main>
      </el-container>
    </el-container>
  </router-view>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";
import { useAdminAuthStore } from "@/stores/adminAuthStore";

const route = useRoute();
const router = useRouter();
const adminAuth = useAdminAuthStore();
const isLoginPage = computed(() => route.path === "/admin/login");

// ❎ 登出後導回登入頁
function handleLogout() {
  adminAuth.logout();
  router.push("/admin/login");
}
</script>

<style>
html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
}
.aside-dark {
  background: #1f1f2e;
  color: #fff;
  display: flex;
  flex-direction: column;
}

.el-menu-item:hover {
  background: #534b4b;
}

.logout-container {
  margin-top: auto;
  padding: 16px;
}

.header-bar {
  padding-left: 20px;
  background: #9e9e9e;
  font-weight: bold;
}

.el-main.main-wrapper {
  padding: 20px;
  background: #fff;
  flex: 1;
}

/* * {
  outline: 1px solid red;
} */
</style>