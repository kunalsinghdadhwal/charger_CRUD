import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { useAuth } from './composables/useAuth'

const app = createApp(App)

app.use(router)

// Initialize authentication state on app startup
const { initializeAuth } = useAuth()
initializeAuth()

app.mount('#app')
