<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const { user, isAuthenticated, logout } = useAuth()

const handleLogout = async () => {
  try {
    await logout()
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>

<template>
  <div class="app">
    <!-- Navigation Header -->
    <header v-if="isAuthenticated" class="app-header">
      <div class="header-content">
        <div class="brand">
          <RouterLink to="/dashboard" class="brand-link">
            EV Charger Management
          </RouterLink>
        </div>
        
        <nav class="main-nav">
          <RouterLink to="/dashboard" class="nav-link">Dashboard</RouterLink>
          <RouterLink to="/settings" class="nav-link">Settings</RouterLink>
        </nav>

        <div class="user-menu">
          <span class="user-greeting">Welcome, {{ user?.fullName }}</span>
          <button @click="handleLogout" class="logout-btn">Logout</button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="app-main" :class="{ 'with-header': isAuthenticated }">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
/* Import clean, modern fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #1f2937;
  background-color: #f9fafb;
  min-height: 100vh;
}

/* Header Styles */
.app-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  height: 64px;
}

.brand {
  flex-shrink: 0;
}

.brand-link {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  text-decoration: none;
  transition: color 0.2s ease;
}

.brand-link:hover {
  color: #3b82f6;
}

.main-nav {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-left: 3rem;
}

.nav-link {
  color: #6b7280;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: #3b82f6;
  background-color: #f3f4f6;
}

.nav-link.router-link-active {
  color: #3b82f6;
  background-color: #eff6ff;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-greeting {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.logout-btn {
  background: #f3f4f6;
  color: #6b7280;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

/* Main Content */
.app-main {
  flex: 1;
}

.app-main.with-header {
  padding-top: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    padding: 0 0.75rem;
    height: 56px;
  }
  
  .brand-link {
    font-size: 1rem;
  }
  
  .main-nav {
    margin-left: 1rem;
    gap: 1rem;
  }
  
  .nav-link {
    padding: 0.375rem 0.75rem;
    font-size: 0.8rem;
  }
  
  .user-greeting {
    display: none;
  }
  
  .logout-btn {
    padding: 0.375rem 0.75rem;
    font-size: 0.8rem;
  }
}

@media (max-width: 640px) {
  .main-nav {
    display: none;
  }
  
  .header-content {
    justify-content: space-between;
  }
}

/* Global reset for better typography */
* {
  box-sizing: border-box;
}

html {
  line-height: 1.6;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  padding: 0;
}
</style>
