<template>
  <div class="settings-container">
    <!-- Header Section -->
    <header class="settings-header">
      <div class="header-content">
        <h1 class="settings-title">Account Settings</h1>
        <p class="settings-subtitle">Manage your profile and account preferences</p>
      </div>
    </header>

    <!-- Main Content -->
    <div class="settings-main">
      <div class="settings-content">
        <!-- Profile Info Card -->
        <div class="settings-card">
          <div class="card-header">
            <h2 class="card-title">Profile Information</h2>
          </div>
          <div class="card-body">
            <div class="profile-field">
              <label class="field-label">Full Name</label>
              <p class="field-value">{{ user?.fullName || 'Loading...' }}</p>
            </div>
            <div class="profile-field">
              <label class="field-label">Email Address</label>
              <p class="field-value">{{ user?.email || 'Loading...' }}</p>
            </div>
          </div>
        </div>

        <!-- Change Password Card -->
        <div class="settings-card">
          <div class="card-header">
            <h2 class="card-title">Change Password</h2>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleChangePassword" class="password-form">
              <div class="form-group">
                <label for="currentPassword" class="form-label">Current Password</label>
                <input
                  id="currentPassword"
                  v-model="currentPassword"
                  type="password"
                  class="form-input"
                  placeholder="Enter your current password"
                  required
                />
              </div>
              <div class="form-group">
                <label for="newPassword" class="form-label">New Password</label>
                <input
                  id="newPassword"
                  v-model="newPassword"
                  type="password"
                  class="form-input"
                  placeholder="Enter your new password"
                  required
                />
              </div>
              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="isLoading"
              >
                <span v-if="isLoading" class="loading-spinner"></span>
                {{ isLoading ? 'Updating...' : 'Update Password' }}
              </button>
              <div v-if="passwordMessage" class="message-alert" :class="{ 'success': passwordMessage.includes('successfully') }">
                {{ passwordMessage }}
              </div>
            </form>
          </div>
        </div>

        <!-- Account Actions Card -->
        <div class="settings-card">
          <div class="card-header">
            <h2 class="card-title">Account Actions</h2>
          </div>
          <div class="card-body">
            <div class="action-group">
              <p class="action-description">
                Sign out of your account on this device. You'll need to sign in again to access your dashboard.
              </p>
              <button @click="handleLogout" class="btn btn-danger">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const { user, logout, changePassword, getCurrentUser, isLoading } = useAuth()

const currentPassword = ref('')
const newPassword = ref('')
const passwordMessage = ref('')
const router = useRouter()

const fetchProfile = async () => {
  const result = await getCurrentUser()
  if (!result.success) {
    router.push('/login')
  }
}

onMounted(fetchProfile)

const handleChangePassword = async () => {
  if (!currentPassword.value || !newPassword.value) {
    passwordMessage.value = 'Please fill in all fields.'
    return
  }

  const result = await changePassword(currentPassword.value, newPassword.value)
  
  if (result.success) {
    passwordMessage.value = result.message
    currentPassword.value = ''
    newPassword.value = ''
  } else {
    passwordMessage.value = result.message
  }
}

const handleLogout = async () => {
  const result = await logout()
  router.push('/login')
}
</script>

<style scoped>
.settings-container {
  min-height: 100vh;
  background-color: #f8fafc;
  padding: 1rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

/* Header Styles */
.settings-header {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.header-content {
  padding: 2rem;
  text-align: center;
}

.settings-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.settings-subtitle {
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
}

/* Main Content */
.settings-main {
  max-width: 800px;
  margin: 0 auto;
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Card Styles */
.settings-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.2s;
}

.settings-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.card-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.card-icon {
  font-size: 1.5rem;
  opacity: 0.7;
}

.card-body {
  padding: 2rem;
}

/* Profile Information */
.profile-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.profile-field:last-child {
  margin-bottom: 0;
}

.field-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.field-value {
  font-size: 1rem;
  color: #1f2937;
  background: #f9fafb;
  padding: 0.875rem 1rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  margin: 0;
}

/* Form Styles */
.password-form {
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

.form-input {
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input::placeholder {
  color: #9ca3af;
}

/* Button Styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

.btn-icon {
  font-size: 1rem;
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

/* Message Alert */
.message-alert {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.message-alert.success {
  background: #dcfce7;
  color: #16a34a;
  border-color: #bbf7d0;
}

/* Account Actions */
.action-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.action-description {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.5;
}

/* Responsive Design */
@media (max-width: 768px) {
  .settings-container {
    padding: 0.5rem;
  }

  .header-content {
    padding: 1.5rem 1rem;
  }

  .settings-title {
    font-size: 1.5rem;
  }

  .card-header {
    padding: 1rem 1.5rem;
  }

  .card-body {
    padding: 1.5rem;
  }

  .btn {
    width: 100%;
  }

  .action-group {
    text-align: center;
  }
}

@media (max-width: 480px) {
  .card-header {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }

  .card-icon {
    order: -1;
  }
}
</style>
