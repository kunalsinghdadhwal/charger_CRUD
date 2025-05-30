<template>
  <div class="p-6 max-w-xl mx-auto space-y-6">
    <h1 class="text-2xl font-bold">Settings</h1>

    <!-- Profile Info -->
    <div class="bg-white p-4 rounded shadow">
      <h2 class="text-lg font-semibold mb-2">Profile</h2>
      <p><strong>Name:</strong> {{ user?.name }}</p>
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

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const user = ref(null)
const currentPassword = ref('')
const newPassword = ref('')
const passwordMessage = ref('')
const router = useRouter()

const fetchProfile = async () => {
  try {
    const res = await axios.get('/api/auth/me', { withCredentials: true })
    user.value = res.data.user
  } catch (err) {
    console.error(err)
    router.push('/') // redirect if unauthenticated
  }
}

onMounted(fetchProfile)

const handleChangePassword = async () => {
  try {
    await axios.post(
      '/api/auth/change-password',
      {
        currentPassword: currentPassword.value,
        newPassword: newPassword.value,
      },
      { withCredentials: true },
    )
    passwordMessage.value = 'Password changed successfully.'
    currentPassword.value = ''
    newPassword.value = ''
  } catch (err) {
    passwordMessage.value = 'Error changing password.'
    console.error(err)
  }
}

const handleLogout = async () => {
  try {
    await axios.post('/api/auth/logout', {}, { withCredentials: true })
    router.push('/')
  } catch (err) {
    console.error(err)
  }
}
</script>

<style scoped>
input {
  outline: none;
}
</style>
