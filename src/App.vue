<template>
  <el-container style="height: 100vh"> 
    <el-aside width="200px" class="aside-dark">
      <el-menu
        :default-active="$route.path"
        router
        background-color="#1f1f2e"
        text-color="#fff"
        active-text-color="#00a9ff"
      >
        <el-menu-item index="/admin">Dashboard</el-menu-item>
        <el-menu-item index="/admin/games">遊戲管理</el-menu-item>
        <el-menu-item index="/admin/promotions">促銷管理</el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header-bar">Admin Panel</el-header>

      <!-- 刪掉行內 style，交給 class 控管 -->
      <el-main class="main-wrapper" style="flex:1">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>  /* 千萬別加 scoped！ */

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

/* 側欄 */
.aside-dark {
  background:#1f1f2e;
  color:#fff;
}

/* 側欄 hover */
.el-menu-item:hover {
  background:#534b4b;
}

/* 標題列 */
.header-bar {
  color:#000;
  font-weight:bold;
  padding-left:20px;
  background-color: #9e9e9e;
}

.el-footer-bar {
  background-color: #1f1f2e;
  color: #ffffff;
}

/* 主內容——關鍵 */
.el-main.main-wrapper {
  padding: 20px;        /* ✅ 留白但不影響 flex 高度 */
  flex: 1 1 auto;       /* 再保險一次，確保撐滿 */
  background: #ffffff;  /* 若想淡灰底 */ /* 60px ≈ header 高度，自己量 */
}

/* 若 body 還有漸層，順手砍掉 */
body {
  background:none;
}
</style>
