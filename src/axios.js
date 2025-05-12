import axios from "axios";
import { useAdminAuthStore } from "@/stores/adminAuthStore";

const instance = axios.create({ baseURL: "/api/admin", timeout: 5000 });
instance.interceptors.request.use((config) => {
  const isAuthRoute =
    config.url.includes("/login") || config.url.includes("/register");
  if (!isAuthRoute) {
    const store = useAdminAuthStore();
    if (store.token) config.headers.Authorization = `Bearer ${store.token}`;
  }
  return config;
});
export default instance;
