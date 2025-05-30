<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { login, isLoading } = useAuth()

// Form data
const loginForm = reactive({
  email: '',
  password: '',
})

// Form state
const errorMessage = ref('')
const showPassword = ref(false)

// Form validation
const emailError = ref('')
const passwordError = ref('')

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validateForm = () => {
  emailError.value = ''
  passwordError.value = ''

  if (!loginForm.email) {
    emailError.value = 'Email is required'
    return false
  }

  if (!validateEmail(loginForm.email)) {
    emailError.value = 'Please enter a valid email address'
    return false
  }

  if (!loginForm.password) {
    passwordError.value = 'Password is required'
    return false
  }

  if (loginForm.password.length < 6) {
    passwordError.value = 'Password must be at least 6 characters'
    return false
  }

  return true
}

const handleLogin = async () => {
  if (!validateForm()) return

  errorMessage.value = ''

  const result = await login(loginForm.email, loginForm.password)
  
  if (result.success) {
    router.push('/dashboard')
  } else {
    errorMessage.value = result.message || 'Login failed'
  }
}

const goToRegister = () => {
  router.push('/register')
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <!-- Header -->
      <div class="login-header">
        <div class="brand-icon">⚡</div>
        <h1 class="login-title">Welcome Back</h1>
        <p class="login-subtitle">Sign in to your EV Manager account</p>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="error-alert">
        <span class="error-icon">⚠️</span>
        {{ errorMessage }}
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="login-form">
        <!-- Email Field -->
        <div class="form-group">
          <label for="email" class="form-label">Email Address</label>
          <div class="input-wrapper">
            <span class="input-icon">📧</span>
            <input
              id="email"
              v-model="loginForm.email"
              type="email"
              class="form-input"
              :class="{ 'input-error': emailError }"
              placeholder="Enter your email"
              autocomplete="email"
            />
          </div>
          <span v-if="emailError" class="field-error">{{ emailError }}</span>
        </div>

        <!-- Password Field -->
        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <div class="input-wrapper">
            <span class="input-icon">🔒</span>
            <input
              id="password"
              v-model="loginForm.password"
              :type="showPassword ? 'text' : 'password'"
              class="form-input"
              :class="{ 'input-error': passwordError }"
              placeholder="Enter your password"
              autocomplete="current-password"
            />
            <button type="button" @click="togglePasswordVisibility" class="password-toggle">
              {{ showPassword ? '👁️' : '👁️‍🗨️' }}
            </button>
          </div>
          <span v-if="passwordError" class="field-error">{{ passwordError }}</span>
        </div>

        <!-- Submit Button -->
        <button type="submit" class="login-button" :disabled="isLoading">
          <span v-if="isLoading" class="loading-spinner"></span>
          {{ isLoading ? 'Signing In...' : 'Sign In' }}
        </button>
      </form>

      <!-- Register Link -->
      <div class="login-footer">
        <p class="register-prompt">
          Don't have an account?
          <button @click="goToRegister" class="register-link">Create Account</button>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.login-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  width: 100%;
  max-width: 400px;
  position: relative;
  overflow: hidden;
}

.login-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.brand-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 1rem;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.login-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.login-subtitle {
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
}

.error-alert {
  background: #fee2e2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.error-icon {
  flex-shrink: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: #9ca3af;
  font-size: 1.1rem;
  z-index: 1;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input.input-error {
  border-color: #ef4444;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  color: #9ca3af;
  transition: color 0.3s ease;
}

.password-toggle:hover {
  color: #667eea;
}

.field-error {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.login-button {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.login-footer {
  text-align: center;
  margin-top: 2rem;
}

.register-prompt {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
}

.register-link {
  color: #667eea;
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.3s ease;
}

.register-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 480px) {
  .login-card {
    padding: 2rem 1.5rem;
    margin: 1rem;
  }

  .login-title {
    font-size: 1.5rem;
  }

  .brand-icon {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }
}
</style>
