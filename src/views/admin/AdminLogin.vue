<template>
    <div class="login-container">
        <div class="login-box">
            <h2>後台系統登入</h2>

            <form @submit.prevent="handleSubmit">
                <div class="form-group" :class="{ 'has-error': errors.username }">
                    <label for="username">管理員帳號</label>
                    <input type="text" id="username" v-model="username" placeholder="請輸入帳號，例如：root"
                        @blur="validateUsername" />
                    <div class="error-message" v-if="errors.username">{{ errors.username }}</div>
                </div>

                <div class="form-group" :class="{ 'has-error': errors.password }">
                    <label for="password">密碼</label>
                    <div class="password-input">
                        <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password"
                            placeholder="請輸入密碼" @input="validatePassword" @blur="validatePassword" />
                        <button type="button" class="toggle-password" @click="togglePasswordVisibility">
                            {{ showPassword ? '隱藏' : '顯示' }}
                        </button>
                    </div>
                    <div class="error-message" v-if="errors.password">{{ errors.password }}</div>
                </div>

                <div class="form-group remember-me">
                    <input type="checkbox" id="remember" v-model="rememberMe" />
                    <label for="remember">記住我</label>
                </div>

                <div class="form-group">
                    <button type="submit" :disabled="isLoading || hasErrors" class="login-button">
                        {{ isLoading ? '登入中...' : '登入' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const username = ref('sa')
const password = ref('P@ssw0rd')
const rememberMe = ref(false)
const showPassword = ref(false)
const isLoading = ref(false)
const router = useRouter()

const errors = reactive({
    username: '',
    password: ''
})

const hasErrors = computed(() => {
    return !!errors.username || !!errors.password || !username.value || !password.value
})

const validateUsername = () => {
    if (!username.value.trim()) {
        errors.username = '帳號不能為空'
        return false
    }
    errors.username = ''
    return true
}

const validatePassword = () => {
    if (!password.value.trim()) {
        errors.password = '密碼不能為空'
        return false
    }
    if (password.value.length < 4) {
        errors.password = '密碼長度至少 4 字元'
        return false
    }
    errors.password = ''
    return true
}

const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value
}

const handleSubmit = async () => {
    if (!validateUsername() || !validatePassword()) return

    try {
        isLoading.value = true

        const response = await axios.post('http://localhost:8080/admin/login', {
            username: username.value,
            password: password.value
        }, {
            withCredentials: true // 🔐 記得攜帶 Session
        })

        const data = response.data
        if (data.success) {
            alert('登入成功！')
            router.push('/admin/dashboard')
        } else {
            alert(data.message || '登入失敗')
        }
    } catch (err) {
        console.error('API 錯誤', err)
        alert('伺服器錯誤，請稍後再試')
    } finally {
        isLoading.value = false
    }
}
</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
}

.login-box {
    width: 380px;
    padding: 20px;
    background-color: white;
    border-radius: 15px;
}

h2 {
    text-align: center;
    margin-bottom: 20px;
    color: #333;
}

.form-group {
    margin-top: 20px;
}

label {
    display: block;
    font-weight: 500;
    color: #333;
    padding: 4px 0;
}

input[type="text"],
input[type="password"] {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    transition: border 0.3s ease;
}

input:focus {
    outline: none;
    border-color: #4a90e2;
}

.password-input {
    position: relative;
    display: flex;
}

.toggle-password {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #4a90e2;
    cursor: pointer;
}

.login-button {
    width: 100%;
    padding: 12px 0;
    background-color: #4a90e2;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 500;
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
    margin-top: 4px;
}

.remember-me {
    display: flex;
    align-items: center;
}

.remember-me input {
    margin-right: 8px;
}

.form-links {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
}

.form-links a {
    color: #4a90e2;
    text-decoration: none;
    font-size: 14px;
}

.form-links a:hover {
    text-decoration: underline;
}

.password-strength {
    margin-top: 8px;
    font-size: 14px;
    display: flex;
    align-items: center;
}

.strength-indicator {
    width: 60px;
    height: 4px;
    margin-right: 8px;
    border-radius: 2px;
}

.strength-indicator.medium {
    background-color: #f39c12;
}

.strength-indicator.strong {
    background-color: #2ecc71;
}
</style>