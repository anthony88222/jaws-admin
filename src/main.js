// src/main.js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

// 🧠 建立 Pinia 實例
const pinia = createPinia();
// 💾 使用 pinia-plugin-persistedstate 插件
pinia.use(piniaPluginPersistedstate);

// 🚀 建立 Vue App 並掛載
const app = createApp(App);

// 📦 使用套件順序：先 pinia、再 router、最後 UI 框架
app.use(pinia);
app.use(router);
app.use(ElementPlus);

// ⛳ 掛載到畫面上
app.mount("#app");
