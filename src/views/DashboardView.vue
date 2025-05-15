<template>
  <div>
    <h2>歡迎進入後台管理系統</h2>
    <p>請選擇左側功能進行操作。</p>
  </div>
</template>

<script setup>
import { useAdminAuthStore } from '@/stores/adminAuthStore'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const auth = useAdminAuthStore()
const router = useRouter()

onMounted(async () => {
  if (!auth.token) {
    router.push('/admin/login')
    return
  }
  try {
    await auth.fetchAdminProfile()
  } catch (err) {
    auth.logout()
    router.push('/admin/login')
  }
})
</script>
