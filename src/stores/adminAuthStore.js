import { defineStore } from "pinia";
import axios from "@/axios";

export const useAdminAuthStore = defineStore("adminAuth", {
  state: () => ({ token: "", admin: null }),
  persist: true,
  actions: {
    login(payload) {
      this.token = payload.accessToken;
      return true;
    },
    async fetchAdminProfile() {
      const res = await axios.get("/me");
      this.admin = res.data.data;
    },
    logout() {
      this.token = "";
      this.admin = null;
    },
  },
});
