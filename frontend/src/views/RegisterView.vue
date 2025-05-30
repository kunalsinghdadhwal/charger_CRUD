<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Form data
const registerForm = reactive({
  fullName: '',
  email: '',
  password: '',
})

// Form state
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const showPassword = ref(false)

// Form validation
const fullNameError = ref('')
const emailError = ref('')
const passwordError = ref('')

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validateForm = () => {
  fullNameError.value = ''
  emailError.value = ''
  passwordError.value = ''

  if (!registerForm.fullName.trim()) {
    fullNameError.value = 'Full name is required'
    return false
  }

  if (registerForm.fullName.trim().length < 2) {
    fullNameError.value = 'Full name must be at least 2 characters'
    return false
  }

  if (!registerForm.email) {
    emailError.value = 'Email is required'
    return false
  }

  if (!validateEmail(registerForm.email)) {
    emailError.value = 'Please enter a valid email address'
    return false
  }

  if (!registerForm.password) {
    passwordError.value = 'Password is required'
    return false
  }

  if (registerForm.password.length < 8) {
    passwordError.value = 'Password must be at least 8 characters'
    return false
  }

  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(registerForm.password)) {
    passwordError.value =
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    return false
  }

  return true
}

const handleRegister = async () => {
  if (!validateForm()) return

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    // Call the backend API endpoint with credentials for future cookie support
    const response = await fetch('https://charger-crud.vercel.app/api/v1/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include credentials for future cookie support
      body: JSON.stringify(registerForm),
    })

    const data = await response.json()

    if (response.ok && data.success) {
      successMessage.value = data.message || 'Account created successfully! Redirecting to login...'

      // Reset form
      Object.assign(registerForm, {
        fullName: '',
        email: '',
        password: '',
      })

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } else {
      errorMessage.value = data.message || 'Registration failed'
    }
  } catch (error) {
    console.error('Registration error:', error)
    errorMessage.value = 'Network error. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const goToLogin = () => {
  router.push('/login')
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="register-container">
    <div class="register-card">
      <!-- Header -->
      <div class="register-header">
        <div class="brand-icon">⚡</div>
        <h1 class="register-title">Create Account</h1>
        <p class="register-subtitle">Join EV Manager and start managing your charging stations</p>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="success-alert">
        <span class="success-icon">✅</span>
        {{ successMessage }}
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="error-alert">
        <span class="error-icon">⚠️</span>
        {{ errorMessage }}
      </div>

      <!-- Register Form -->
      <form @submit.prevent="handleRegister" class="register-form">
        <!-- Full Name Field -->
        <div class="form-group">
          <label for="fullName" class="form-label">Full Name</label>
          <div class="input-wrapper">
            <span class="input-icon">👤</span>
            <input
              id="fullName"
              v-model="registerForm.fullName"
              type="text"
              class="form-input"
              :class="{ 'input-error': fullNameError }"
              placeholder="Enter your full name"
              autocomplete="name"
            />
          </div>
          <span v-if="fullNameError" class="field-error">{{ fullNameError }}</span>
        </div>

        <!-- Email Field -->
        <div class="form-group">
          <label for="email" class="form-label">Email Address</label>
          <div class="input-wrapper">
            <span class="input-icon">📧</span>
            <input
              id="email"
              v-model="registerForm.email"
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
              v-model="registerForm.password"
              :type="showPassword ? 'text' : 'password'"
              class="form-input"
              :class="{ 'input-error': passwordError }"
              placeholder="Create a strong password"
              autocomplete="new-password"
            />
            <button type="button" @click="togglePasswordVisibility" class="password-toggle">
              {{ showPassword ? '👁️' : '👁️‍🗨️' }}
            </button>
          </div>
          <span v-if="passwordError" class="field-error">{{ passwordError }}</span>
          <div class="password-requirements">
            <p class="requirements-title">Password must contain:</p>
            <ul class="requirements-list">
              <li :class="{ 'requirement-met': registerForm.password.length >= 8 }">
                At least 8 characters
              </li>
              <li :class="{ 'requirement-met': /(?=.*[a-z])/.test(registerForm.password) }">
                One lowercase letter
              </li>
              <li :class="{ 'requirement-met': /(?=.*[A-Z])/.test(registerForm.password) }">
                One uppercase letter
              </li>
              <li :class="{ 'requirement-met': /(?=.*\d)/.test(registerForm.password) }">
                One number
              </li>
            </ul>
          </div>
        </div>

        <!-- Submit Button -->
        <button type="submit" class="register-button" :disabled="isLoading">
          <span v-if="isLoading" class="loading-spinner"></span>
          {{ isLoading ? 'Creating Account...' : 'Create Account' }}
        </button>
      </form>

      <!-- Login Link -->
      <div class="register-footer">
        <p class="login-prompt">
          Already have an account?
          <button @click="goToLogin" class="login-link">Sign In</button>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.register-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  width: 100%;
  max-width: 450px;
  position: relative;
  overflow: hidden;
}

.register-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
}

.register-header {
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

.register-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.register-subtitle {
  color: #6b7280;
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.4;
}

.success-alert {
  background: #dcfce7;
  border: 1px solid #bbf7d0;
  color: #16a34a;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
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

.success-icon,
.error-icon {
  flex-shrink: 0;
}

.register-form {
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

.password-requirements {
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.requirements-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.5rem 0;
}

.requirements-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.requirements-list li {
  font-size: 0.75rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.requirements-list li::before {
  content: '•';
  color: #ef4444;
  font-weight: bold;
}

.requirements-list li.requirement-met {
  color: #16a34a;
}

.requirements-list li.requirement-met::before {
  content: '✓';
  color: #16a34a;
}

.register-button {
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

.register-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.register-button:disabled {
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

.register-footer {
  text-align: center;
  margin-top: 2rem;
}

.login-prompt {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
}

.login-link {
  color: #667eea;
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.3s ease;
}

.login-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 480px) {
  .register-card {
    padding: 2rem 1.5rem;
    margin: 1rem;
  }

  .register-title {
    font-size: 1.5rem;
  }

  .register-subtitle {
    font-size: 0.875rem;
  }

  .brand-icon {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }
}
</style>
