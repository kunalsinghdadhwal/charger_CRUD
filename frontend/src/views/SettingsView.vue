<template>
  <div class="p-6 max-w-xl mx-auto space-y-6">
    <h1 class="text-2xl font-bold">Settings</h1>

    <!-- Profile Info -->
    <div class="bg-white p-4 rounded shadow">
      <h2 class="text-lg font-semibold mb-2">Profile</h2>
      <p><strong>Name:</strong> {{ user?.fullName }}</p>
      <p><strong>Email:</strong> {{ user?.email }}</p>
    </div>

    <!-- Change Password -->
    <div class="bg-white p-4 rounded shadow">
      <h2 class="text-lg font-semibold mb-4">Change Password</h2>
      <form @submit.prevent="handleChangePassword" class="space-y-3">
        <div>
          <label class="block font-medium">Current Password</label>
          <input
            v-model="currentPassword"
            type="password"
            class="border rounded w-full px-3 py-2 mt-1"
            required
          />
        </div>
        <div>
          <label class="block font-medium">New Password</label>
          <input
            v-model="newPassword"
            type="password"
            class="border rounded w-full px-3 py-2 mt-1"
            required
          />
        </div>
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Change Password
        </button>
        <p v-if="passwordMessage" class="text-sm mt-2 text-green-600">
          {{ passwordMessage }}
        </p>
      </form>
    </div>

    <!-- Logout Button -->
    <button @click="handleLogout" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
      Logout
    </button>
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
input {
  outline: none;
}
</style>
