<template>
  <div class="admin-dashboard">
    <!-- 側邊導航欄 -->
    <div class="sidebar" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <div class="sidebar-header">
        <h3 v-if="!sidebarCollapsed">遊戲商城</h3>
        <span v-else>GS</span>
        <button class="toggle-btn" @click="toggleSidebar">
          <i class="fas" :class="sidebarCollapsed ? 'fa-angle-right' : 'fa-angle-left'"></i>
        </button>
      </div>
      <div class="sidebar-menu">
        <ul>
          <li v-for="item in navItems" :key="item.section" :class="{ active: activeSection === item.section }"
            @click="activeSection = item.section">
            <a href="#">
              <i :class="getIconForSection(item.section)"></i>
              <span v-if="!sidebarCollapsed">{{ item.name }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>

    <!-- 主內容區域 -->
    <div class="main-content" :class="{ 'content-expanded': sidebarCollapsed }">
      <!-- 頂部狀態欄 -->
      <div class="top-navbar">
        <div class="search-container">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="搜尋..." />
        </div>
        <div class="navbar-right">
          <div class="notification">
            <i class="fas fa-bell"></i>
            <span class="badge">3</span>
          </div>
          <div class="message">
            <i class="fas fa-envelope"></i>
            <span class="badge">5</span>
          </div>
          <div class="user-profile">
            <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="管理員頭像" />
            <span>管理員</span>
            <i class="fas fa-chevron-down"></i>
          </div>
        </div>
      </div>

      <!-- 儀表板內容：根據 activeSection 顯示不同區塊 -->
      <div class="dashboard-content">
        <!-- 控制台（Dashboard） -->
        <template v-if="activeSection === 'dashboard'">
          <div class="dashboard-header">
            <h2>管理員儀表板</h2>
            <div class="date-picker">
              <i class="fas fa-calendar"></i>
              <span>{{ currentDate }}</span>
            </div>
          </div>
          <!-- 功能卡片 -->
          <div class="dashboard-cards">
            <div class="dashboard-card" v-for="card in dashboardItems" :key="card.title"
              @click="activeSection = card.section">
              <div class="card-icon" :class="getColorClassForSection(card.section)">
                <i :class="getIconForSection(card.section)"></i>
              </div>
              <div class="card-content">
                <h3>{{ card.title }}</h3>
                <p>{{ card.desc }}</p>
              </div>
            </div>
          </div>
          <!-- 數據卡片 -->
          <div class="stat-cards">
            <div class="stat-card">
              <div class="stat-card-icon" style="background-color: rgba(90, 50, 234, 0.2)">
                <i class="fas fa-users" style="color: #5a32ea"></i>
              </div>
              <div class="stat-card-info">
                <h4>總用戶數</h4>
                <h3>{{ userCount.toLocaleString() }}</h3>
                <p>
                  <i class="fas fa-arrow-up"></i>
                  <span>{{ userGrowth }}%</span> 較上月
                </p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-card-icon" style="background-color: rgba(255, 84, 84, 0.2)">
                <i class="fas fa-gamepad" style="color: #ff5454"></i>
              </div>
              <div class="stat-card-info">
                <h4>遊戲數量</h4>
                <h3>{{ gameCount.toLocaleString() }}</h3>
                <p>
                  <i class="fas fa-arrow-up"></i>
                  <span>{{ gameGrowth }}%</span> 較上月
                </p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-card-icon" style="background-color: rgba(46, 202, 106, 0.2)">
                <i class="fas fa-shopping-cart" style="color: #2eca6a"></i>
              </div>
              <div class="stat-card-info">
                <h4>本月訂單</h4>
                <h3>{{ orderCount.toLocaleString() }}</h3>
                <p>
                  <i class="fas fa-arrow-down"></i>
                  <span>{{ orderGrowth }}%</span> 較上月
                </p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-card-icon" style="background-color: rgba(255, 159, 67, 0.2)">
                <i class="fas fa-dollar-sign" style="color: #ff9f43"></i>
              </div>
              <div class="stat-card-info">
                <h4>本月收入</h4>
                <h3>NT$ {{ revenue.toLocaleString() }}</h3>
                <p>
                  <i class="fas fa-arrow-up"></i>
                  <span>{{ revenueGrowth }}%</span> 較上月
                </p>
              </div>
            </div>
          </div>
          <!-- 最新訂單 -->
          <div class="recent-orders">
            <div class="table-header">
              <h3>最新訂單</h3>
              <button class="view-all-btn" @click="activeSection = 'orders'">
                查看全部
              </button>
            </div>
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>訂單編號</th>
                    <th>用戶</th>
                    <th>遊戲</th>
                    <th>價格</th>
                    <th>狀態</th>
                    <th>日期</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="order in recentOrders" :key="order.id">
                    <td>#{{ order.id }}</td>
                    <td>
                      <div class="user-info">
                        <img :src="order.userAvatar" :alt="order.userName" />
                        <span>{{ order.userName }}</span>
                      </div>
                    </td>
                    <td>{{ order.game }}</td>
                    <td>NT$ {{ order.price.toLocaleString() }}</td>
                    <td>
                      <span class="status-badge" :class="order.status.toLowerCase()">{{ order.status }}</span>
                    </td>
                    <td>{{ order.date }}</td>
                    <td>
                      <div class="action-buttons">
                        <button class="action-btn view"><i class="fas fa-eye"></i></button>
                        <button class="action-btn edit"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete"><i class="fas fa-trash"></i></button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>

        <!-- 遊戲管理 -->
        <template v-else-if="activeSection === 'games'">
          <h2>遊戲管理</h2>
          <!-- 後續可改成自己的 GameManager 元件 -->
          <!-- TODO: 這裡串接 Spring Boot 取得遊戲資料 -->
          <div style="padding: 40px 0; text-align: center;">這裡可以顯示遊戲管理內容</div>
        </template>

        <!-- 訂單管理 -->
        <template v-else-if="activeSection === 'orders'">
          <h2>訂單管理</h2>
          <!-- 後續可改成自己的 OrderManager 元件 -->
          <!-- TODO: 這裡串接 Spring Boot 取得訂單資料 -->
          <div style="padding: 40px 0; text-align: center;">這裡可以顯示訂單管理內容</div>
        </template>

        <!-- 用戶管理 -->
        <template v-else-if="activeSection === 'users'">
          <h2>用戶管理</h2>
          <!-- TODO: 用戶管理相關內容 -->
          <div style="padding: 40px 0; text-align: center;">這裡可以顯示用戶管理內容</div>
        </template>

        <!-- 評論管理 -->
        <template v-else-if="activeSection === 'reviews'">
          <h2>評論管理</h2>
          <!-- TODO: 評論管理相關內容 -->
          <div style="padding: 40px 0; text-align: center;">這裡可以顯示評論管理內容</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

// 檢查登入狀態
onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:8080/admin/me', {
      withCredentials: true
    });

    if (!res.data.isLoggedIn) {
      router.push('/admin/login')
    } else {
      console.log('目前登入者：', res.data.username)
    }
  } catch (err) {
    alert('伺服器錯誤')
  }
});

// 側邊欄收合狀態
const sidebarCollapsed = ref(false);

// 當前選擇的功能區塊（section）
const activeSection = ref('dashboard'); // 預設顯示 dashboard

// 側邊欄選單資料（不用 route，用 section）
const navItems = [
  { name: "控制台", section: "dashboard" },
  { name: "遊戲管理", section: "games" },
  { name: "訂單管理", section: "orders" },
  { name: "用戶管理", section: "users" },
  { name: "評論管理", section: "reviews" },
];

// 儀表板卡片（同樣用 section 控制）
const dashboardItems = [
  { title: "遊戲管理", desc: "編輯、上架、下架遊戲", section: "games" },
  { title: "訂單管理", desc: "審查與查詢訂單", section: "orders" },
  { title: "用戶管理", desc: "查看與修改用戶資料", section: "users" },
  { title: "評論管理", desc: "處理用戶回報與不當留言", section: "reviews" },
];

// 日期
const currentDate = new Date().toLocaleDateString("zh-TW", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

// 假數據（之後可以用API取代）
const userCount = ref(1000);
const userGrowth = ref(7);
const gameCount = ref(288);
const gameGrowth = ref(3);
const orderCount = ref(215);
const orderGrowth = ref(-2);
const revenue = ref(152320);
const revenueGrowth = ref(16);

const recentOrders = ref(0);

// 側邊欄收合/展開
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
};

// 區塊 icon（section 對應到 font-awesome icon）
const getIconForSection = (section) => {
  const iconMap = {
    dashboard: "fas fa-tachometer-alt",
    games: "fas fa-gamepad",
    orders: "fas fa-shopping-cart",
    users: "fas fa-users",
    reviews: "fas fa-comment",
  };
  return iconMap[section] || "fas fa-circle";
};

// 卡片顏色（section 對應到 class 名稱）
const getColorClassForSection = (section) => {
  const colorMap = {
    dashboard: "icon-purple",
    games: "icon-red",
    orders: "icon-green",
    users: "icon-blue",
    reviews: "icon-orange",
  };
  return colorMap[section] || "icon-default";
};
</script>


<style scoped>
/* ========= 全域基本設定 ========= */
* {
  margin: 0;
  box-sizing: border-box;
}

/* ========= 外層結構 ========= */
.admin-dashboard {
  display: flex;
  height: 82.9vh;
  background-color: #f5f6fa;
  overflow: hidden;
}

/* ========= 側邊欄 (Sidebar) ========= */
.sidebar {
  width: 190px;
  height: 100%;
  background: linear-gradient(180deg, #3a3a3a 0%, #202020 100%);
  color: #fff;
  transition: all 0.3s ease;
  overflow-y: auto;
  z-index: 1000;
}

.sidebar-collapsed {
  width: 70px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

.toggle-btn {
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 1rem;
}

.sidebar-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-menu ul li {
  position: relative;
  cursor: pointer;
}

.sidebar-menu ul li a {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  color: #b3b3b3;
  text-decoration: none;
  transition: all 0.3s ease;
}

.sidebar-menu ul li a i {
  font-size: 1.1rem;
  min-width: 30px;
}

.sidebar-menu ul li a span {
  margin-left: 10px;
}

.sidebar-menu ul li.active a,
.sidebar-menu ul li a:hover {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.1);
}

/* ========= 主要內容區（Main Content） ========= */
.main-content {
  flex: 1;
  transition: all 0.3s ease;
  overflow-y: auto;
}

.content-expanded {
  margin-left: 0;
}

/* ========= 頂部狀態欄 (Top Navbar) ========= */
.top-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 25px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.search-container {
  display: flex;
  align-items: center;
  background-color: #f5f6fa;
  border-radius: 16px;
  padding: 8px 15px;
  width: 300px;
}

.search-container i {
  color: #888;
  margin-right: 10px;
}

.search-container input {
  border: none;
  background: transparent;
  outline: none;
  width: 100%;
  color: #555;
}

.navbar-right {
  display: flex;
  align-items: center;
}

.notification,
.message {
  position: relative;
  margin-right: 25px;
  cursor: pointer;
}

.notification i,
.message i {
  font-size: 1.2rem;
  color: #555;
}

.badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #ff5454;
  color: #fff;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-profile {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.user-profile img {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
}

.user-profile span {
  margin-right: 10px;
  font-weight: 500;
  color: #333;
}

/* ========= 儀表板內容 (Dashboard Content) ========= */
.dashboard-content {
  padding: 25px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.dashboard-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
}

.date-picker {
  display: flex;
  align-items: center;
  background-color: #fff;
  color: #333;
  padding: 8px 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.date-picker i {
  margin-right: 10px;
}

/* ========= 功能卡片 (Dashboard Cards) ========= */
.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
}

.dashboard-card {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.card-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.card-icon i {
  font-size: 1.5rem;
}

.icon-purple {
  background-color: rgba(90, 50, 234, 0.1);
  color: #5a32ea;
}

.icon-red {
  background-color: rgba(255, 84, 84, 0.1);
  color: #ff5454;
}

.icon-green {
  background-color: rgba(46, 202, 106, 0.1);
  color: #2eca6a;
}

.icon-blue {
  background-color: rgba(0, 123, 255, 0.1);
  color: #007bff;
}

.icon-orange {
  background-color: rgba(255, 159, 67, 0.1);
  color: #ff9f43;
}

.card-content h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.card-content p {
  font-size: 0.9rem;
  color: #777;
}

/* ========= 數據卡片 (Stat Cards) ========= */
.stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 25px;
}

.stat-card {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
}

.stat-card-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.stat-card-icon i {
  font-size: 1.5rem;
}

.stat-card-info h4 {
  font-size: 0.9rem;
  color: #777;
  margin-bottom: 5px;
}

.stat-card-info h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.stat-card-info p {
  font-size: 0.8rem;
  color: #777;
  display: flex;
  align-items: center;
}

.stat-card-info p i {
  margin-right: 5px;
}

.stat-card-info p i.fa-arrow-up {
  color: #2eca6a;
}

.stat-card-info p i.fa-arrow-down {
  color: #ff5454;
}

.stat-card-info p span {
  font-weight: 600;
  margin-right: 5px;
}

/* ========= 最新訂單表格 (Recent Orders Table) ========= */
.recent-orders {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.table-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.view-all-btn {
  padding: 8px 15px;
  background-color: #5a32ea;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.view-all-btn:hover {
  background-color: #4a22d0;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead tr {
  background-color: #f8f9fa;
}

th,
td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  font-weight: 600;
  color: #555;
  font-size: 0.9rem;
}

td {
  color: #333;
  font-size: 0.9rem;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-info img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
}

.status-badge {
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.已完成 {
  background-color: rgba(46, 202, 106, 0.1);
  color: #2eca6a;
}

.status-badge.處理中 {
  background-color: rgba(255, 159, 67, 0.1);
  color: #ff9f43;
}

.status-badge.已取消 {
  background-color: rgba(255, 84, 84, 0.1);
  color: #ff5454;
}

.action-buttons {
  display: flex;
  gap: 5px;
}

.action-btn {
  width: 30px;
  height: 30px;
  border-radius: 5px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s;
}

.action-btn.view {
  background-color: rgba(90, 50, 234, 0.1);
  color: #5a32ea;
}

.action-btn.edit {
  background-color: rgba(255, 159, 67, 0.1);
  color: #ff9f43;
}

.action-btn.delete {
  background-color: rgba(255, 84, 84, 0.1);
  color: #ff5454;
}

.action-btn:hover {
  opacity: 0.8;
}

/* ========= 響應式設計 ========= */
@media (max-width: 1200px) {
  .stat-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: -250px;
  }

  .sidebar.active {
    left: 0;
  }

  .main-content {
    margin-left: 0;
  }

  .stat-cards {
    grid-template-columns: 1fr;
  }

  .search-container {
    width: 200px;
  }
}

@media (max-width: 576px) {
  .top-navbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .search-container {
    width: 100%;
    margin-bottom: 15px;
  }

  .navbar-right {
    width: 100%;
    justify-content: space-between;
  }
}
</style>