import { createApp } from 'vue'
import App from './App.vue'
import './styles/base.css'
import './styles/variables.css'
import './styles/layout.css'
import router from './router'

import axios from 'axios'
axios.defaults.withCredentials = true


const app = createApp(App)
app.use(router)
app.mount('#app')
