<template>
    <div>
        <h2>使用者列表</h2>

        <!-- 👻 載入中顯示骨架屏 -->
        <el-skeleton v-if="loading" animated :rows="5" />

        <!-- ✅ 資料載入完成後 -->
        <template v-else>
            <!-- ✅ 有資料時顯示表格 -->
            <el-table v-if="users.length > 0" :data="users" stripe style="width: 100%">
                <el-table-column prop="id" label="ID" width="60" />
                <el-table-column prop="username" label="帳號" />
                <el-table-column prop="email" label="Email" />
                <el-table-column prop="experience" label="XP" width="80" />
                <el-table-column prop="isActive" label="狀態" width="80">
                    <template #default="{ row }">
                        <span :style="{ color: row.isActive ? '#67C23A' : '#F56C6C' }">
                            {{ row.isActive ? '啟用' : '停用' }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="140">
                    <template #default="{ row }">
                        <el-button size="small" :type="row.isActive ? 'warning' : 'success'" @click="toggleActive(row)"
                            :loading="row.loading">
                            {{ row.isActive ? '停用' : '啟用' }}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 🚫 沒有資料時顯示空狀態 -->
            <el-empty v-else description="目前沒有使用者資料" />
        </template>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/axios' // 用你自訂的 axios instance

const users = ref([])
const loading = ref(true)

async function fetchUsers() {
    loading.value = true
    try {
        const { data: res } = await axios.get('/users')
        users.value = res.data.map((user) => ({ ...user, loading: false })) // 加入 loading 屬性
    } catch (err) {
        console.error('❌ 載入使用者失敗', err)
    } finally {
        loading.value = false
    }
}

async function toggleActive(user) {
    const path = user.isActive
        ? `/users/${user.id}/deactivate`
        : `/users/${user.id}/activate`

    try {
        user.loading = true
        await axios.put(path)
        user.isActive = !user.isActive
        ElMessage.success(user.isActive ? '使用者已啟用 ✅' : '使用者已停用 ❌')
    } catch (err) {
        console.error('❌ 切換狀態失敗', err)
        ElMessage.error('操作失敗，請稍後再試')
    } finally {
        user.loading = false
    }
}

onMounted(fetchUsers)
</script>
