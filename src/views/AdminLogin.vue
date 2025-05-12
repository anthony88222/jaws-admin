<template>
    <div class="login-container">
        <div class="login-box">
            <h2>後台系統登入</h2>

            <form @submit.prevent="handleSubmit">
                <!-- 帳號欄位 -->
                <div class="form-group" :class="{ 'has-error': errors.username }">
                    <label for="username">管理員帳號</label>
                    <input type="text" id="username" v-model="username" placeholder="請輸入帳號" autocomplete="username"
                        autocapitalize="off" spellcheck="false" @blur="validateUsername" />
                    <div class="error-message" v-if="errors.username">{{ errors.username }}</div>
                </div>

                <!-- 密碼欄位 -->
                <div class="form-group" :class="{ 'has-error': errors.password }">
                    <label for="password">密碼</label>
                    <div class="password-input">
                        <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password"
                            placeholder="請輸入密碼" autocomplete="current-password" @input="validatePassword"
                            @blur="validatePassword" />
                        <button type="button" class="toggle-password" @click="togglePasswordVisibility">
                            {{ showPassword ? '隱藏' : '顯示' }}
                        </button>
                    </div>
                    <div class="error-message" v-if="errors.password">{{ errors.password }}</div>
                </div>

                <!-- 記住我
                <div class="form-group remember-me">
                    <input type="checkbox" id="remember" v-model="rememberMe" />
                    <label for="remember">記住我</label>
                </div> -->

                <!-- 登入按鈕 -->
                <div class="form-group">
                    <button type="submit" class="login-button" :disabled="isLoading || hasErrors">
                        {{ isLoading ? '登入中...' : '登入' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminAuthStore } from '@/stores/adminAuthStore'
import axios from '@/axios'

const router = useRouter()
const adminAuth = useAdminAuthStore()

const username = ref('sa')
const password = ref('P@ssw0rd')
const rememberMe = ref(false)
const showPassword = ref(false)
const isLoading = ref(false)

const errors = reactive({ username: '', password: '' })

const validateUsername = () => {
    if (!username.value.trim()) {
        errors.username = '帳號不能為空';
        return false;
    }
    errors.username = '';
    return true;
}

const validatePassword = () => {
    if (!password.value.trim()) {
        errors.password = '密碼不能為空';
        return false;
    }
    if (password.value.length < 4) {
        errors.password = '密碼長度至少 4 字元';
        return false;
    }
    errors.password = '';
    return true;
}

const hasErrors = computed(() => !validateUsername() || !validatePassword())

const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value
}

const handleSubmit = async () => {
    if (!validateUsername() || !validatePassword()) return;
    isLoading.value = true;
    try {
        const res = await axios.post("/login", { username: username.value, password: password.value });
        const data = res.data;
        if (data.success) {
            adminAuth.login(data.data);
            await new Promise((r) => setTimeout(r, 100));
            await adminAuth.fetchAdminProfile();
            router.push("/admin/dashboard");
        } else alert(data.message || "登入失敗");
    } catch (err) {
        console.error("❌ 登入錯誤:", err);
        alert(err.response?.data?.message || "伺服器錯誤");
    } finally {
        isLoading.value = false;
    }
};



onMounted(async () => {
    if (adminAuth.token) {
        try {
            await adminAuth.fetchAdminProfile()
            router.push('/admin/dashboard')
        } catch {
            adminAuth.logout()
        }
    }
})
</script>

<style scoped>
*,
*::before,
*::after {
    box-sizing: border-box;
}

.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
    padding: 1rem;
}

.login-box {
    width: 100%;
    max-width: 400px;
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
}

h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #333;
}

.form-group {
    margin-top: 1rem;
}

label {
    display: block;
    font-weight: 500;
    color: #333;
    margin-bottom: 0.5rem;
}

input[type="text"],
input[type="password"] {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 16px;
}

input:focus {
    outline: none;
    border-color: #4a90e2;
}

.password-input {
    position: relative;
}

.toggle-password {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #4a90e2;
    font-size: 14px;
    cursor: pointer;
}

.login-button {
    width: 100%;
    padding: 12px 0;
    background-color: #4a90e2;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    font-size: 16px;
    margin-top: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.login-button:hover {
    background-color: #3a80d2;
}

.login-button:disabled {
    background-color: #a0c0e8;
    cursor: not-allowed;
}

.has-error input {
    border-color: #e74c3c;
}

.error-message {
    color: #e74c3c;
    font-size: 14px;
    margin-top: 0.25rem;
}

.remember-me {
    display: flex;
    align-items: center;
    margin-top: 0.75rem;
}

.remember-me input {
    margin-right: 0.5rem;
}
</style>
