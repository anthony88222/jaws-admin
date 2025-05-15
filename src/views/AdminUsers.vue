<template>
    <div>
        <h2>使用者列表</h2>

        <!-- 🔍 搜尋欄 -->
        <div style="margin-bottom: 16px; display: flex; gap: 8px;">
            <el-input v-model="keyword" placeholder="輸入帳號、Email或簽名" @keyup.enter="handleSearch" clearable
                style="width: 240px;" />
            <el-button type="primary" @click="handleSearch">搜尋</el-button>
            <el-button @click="resetSearch" plain>重設</el-button>
        </div>

        <!-- 🕓 載入中 -->
        <el-skeleton v-if="loading" animated :rows="5" />

        <!-- 📋 表格資料 -->
        <template v-else>
            <el-table v-if="users.length > 0" :data="users" stripe style="width: 100%;">
                <el-table-column prop="id" label="ID" width="60" />
                <el-table-column prop="username" label="帳號" />
                <el-table-column prop="email" label="Email" />

                <!-- 角色 -->
                <el-table-column prop="role" label="角色" width="90">
                    <template #default="{ row }">
                        <el-tag :type="row.role === 'ROLE_ADMIN' ? 'danger' : 'info'">
                            {{ row.role === 'ROLE_ADMIN' ? '管理員' : '用戶' }}
                        </el-tag>
                    </template>
                </el-table-column>

                <!-- 等級 -->
                <el-table-column label="等級" width="60">
                    <template #default="{ row }">
                        LV.{{ row.level }}
                    </template>
                </el-table-column>

                <!-- 經驗值 -->
                <el-table-column label="經驗值" width="150">
                    <template #default="{ row }">
                        {{ row.currentExp }} / {{ row.expPerLevel }} EXP
                    </template>
                </el-table-column>

                <!-- 錢包 -->
                <el-table-column prop="wallet" label="錢包" width="120">
                    <template #default="{ row }">
                        <span v-if="!isNaN(Number(row.wallet))">
                            NT${{ Number(row.wallet).toLocaleString() }}
                        </span>
                        <span v-else>
                            NT$ 0
                        </span>
                    </template>
                </el-table-column>


                <!-- 狀態 -->
                <el-table-column prop="isActive" label="狀態" width="80">
                    <template #default="{ row }">
                        <span :style="{ color: row.isActive ? '#67C23A' : '#F56C6C' }">
                            {{ row.isActive ? '啟用' : '停用' }}
                        </span>
                    </template>
                </el-table-column>

                <!-- 註冊時間 -->
                <el-table-column prop="createdAt" label="註冊日期" width="120" />
                <el-table-column prop="updatedAt" label="最後更新" width="120" />

                <!-- 遊戲隱私 -->
                <el-table-column prop="gamesPrivacy" label="遊戲隱私" width="80">
                    <template #default="{ row }">
                        <el-switch v-model="row.gamesPrivacy" disabled />
                    </template>
                </el-table-column>

                <!-- 評論隱私 -->
                <el-table-column prop="reviewsPrivacy" label="評論隱私" width="80">
                    <template #default="{ row }">
                        <el-switch v-model="row.reviewsPrivacy" disabled />
                    </template>
                </el-table-column>

                <!-- 簽名 -->
                <el-table-column prop="signature" label="個人簽名" width="140" show-overflow-tooltip />

                <!-- 操作 -->
                <el-table-column label="操作" width="180">
                    <template #default="{ row }">
                        <el-button size="small" @click="viewProfile(row)">查看</el-button>
                        <el-button size="small" :type="row.isActive ? 'warning' : 'success'" @click="toggleActive(row)"
                            :loading="row.loading">
                            {{ row.isActive ? '停用' : '啟用' }}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 空狀態 -->
            <el-empty v-else description="目前沒有使用者資料" />
        </template>
    </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/axios'

// 搜尋用關鍵字
const keyword = ref('')
const users = ref([])
const loading = ref(true)

/**
 * 🧠 統一等級計算函數
 */
function calculateExpLevel(exp = 0) {
    const expPerLevel = 1000
    const level = Math.floor(exp / expPerLevel)
    const currentExp = exp % expPerLevel
    const expPercent = (currentExp / expPerLevel) * 100
    return {
        level,
        currentExp,
        expPercent: Math.min(100, expPercent),
        expPerLevel
    }
}

/**
 * 載入使用者資料
 */
async function fetchUsers(searchKey = '') {
    loading.value = true
    try {
        const { data: res } = await axios.get('/users', {
            params: { keyword: searchKey }
        })

        users.value = res.data.map(user => {
            const expData = calculateExpLevel(user.experience || 0)

            return {
                ...user,
                ...expData,
                loading: false,
                avatarUrl: user.avatarUrl || user.avatar_url || '',
                gamesPrivacy: !!user.gamesPrivacy || !!user.games_privacy,
                reviewsPrivacy: !!user.reviewsPrivacy || !!user.reviews_privacy,
                createdAt: (user.createdAt || user.created_at || '').slice(0, 10),
                updatedAt: (user.updatedAt || user.updated_at || '').slice(0, 10)
            }
        })

    } catch (err) {
        console.error('❌ 載入使用者失敗', err)
    } finally {
        loading.value = false
    }
}

function handleSearch() {
    fetchUsers(keyword.value.trim())
}

function resetSearch() {
    keyword.value = ''
    fetchUsers('')
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

function viewProfile(user) {
    alert(`查看用戶：${user.username}\nEmail: ${user.email}`)
}

onMounted(() => fetchUsers())
</script>
