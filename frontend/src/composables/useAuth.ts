import { ref, computed } from 'vue'
import type { User } from '../types/auth'

const API_BASE_URL = 'https://charger-crud.vercel.app/api/v1'

// Global reactive state for authentication
const user = ref<User | null>(null)
const isLoading = ref(false)

// Initialize user from localStorage on app load
const initializeAuth = () => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
        try {
            user.value = JSON.parse(storedUser)
        } catch (error) {
            console.error('Error parsing stored user data:', error)
            localStorage.removeItem('user')
        }
    }
}

// Helper function to get cookie value
const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null
    return null
}

export const useAuth = () => {
    // Computed properties
    const isAuthenticated = computed(() => {
        // Check if user exists in memory and if access token cookie exists
        return !!user.value && !!getCookie('accessToken')
    })

    // Login function
    const login = async (email: string, password: string) => {
        isLoading.value = true

        try {
            const response = await fetch(`${API_BASE_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Important for cookies
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()

            if (data.success) {
                // Store user data in localStorage and reactive state
                user.value = data.data.user
                localStorage.setItem('user', JSON.stringify(data.data.user))

                // Trigger storage event for cross-component updates
                window.dispatchEvent(new Event('storage'))

                // Note: Cookies are automatically set by the backend with httpOnly flag
                // The backend sets both accessToken and refreshToken cookies

                return { success: true, user: data.data.user }
            } else {
                return { success: false, message: data.message || 'Login failed' }
            }
        } catch (error) {
            console.error('Login error:', error)
            return { success: false, message: 'Invalid Credentials. Please try again.' }
        } finally {
            isLoading.value = false
        }
    }

    // Logout function
    const logout = async () => {
        isLoading.value = true

        try {
            const response = await fetch(`${API_BASE_URL}/users/logout`, {
                method: 'POST',
                credentials: 'include',
            })

            // Clear user data regardless of response status
            user.value = null
            localStorage.removeItem('user')

            // Trigger storage event for cross-component updates
            window.dispatchEvent(new Event('storage'))

            if (response.ok) {
                return { success: true }
            } else {
                console.error('Logout request failed, but local state cleared')
                return { success: false, message: 'Logout request failed' }
            }
        } catch (error) {
            console.error('Logout error:', error)
            // Still clear local state even if request fails
            user.value = null
            localStorage.removeItem('user')
            window.dispatchEvent(new Event('storage'))
            return { success: false, message: 'Network error during logout' }
        } finally {
            isLoading.value = false
        }
    }

    // Get current user from backend
    const getCurrentUser = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/current-user`, {
                method: 'GET',
                credentials: 'include',
            })
            console.log('Get current user response:', response)

            if (response.ok) {
                const data = await response.json()
                user.value = data.data
                localStorage.setItem('user', JSON.stringify(data.data))
                return { success: true, user: data.data }
            } else {
                // Token might be expired, clear local state
                user.value = null
                localStorage.removeItem('user')
                return { success: false, message: 'Authentication expired' }
            }
        } catch (error) {
            console.error('Get current user error:', error)
            return { success: false, message: 'Network error' }
        }
    }

    // Change password function
    const changePassword = async (currentPassword: string, newPassword: string) => {
        isLoading.value = true

        try {
            const response = await fetch(`${API_BASE_URL}/users/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ currentPassword, newPassword }),
            })

            const data = await response.json()

            if (response.ok && data.success) {
                return { success: true, message: data.message || 'Password changed successfully' }
            } else {
                return { success: false, message: data.message || 'Failed to change password' }
            }
        } catch (error) {
            console.error('Change password error:', error)
            return { success: false, message: 'Network error. Please try again.' }
        } finally {
            isLoading.value = false
        }
    }

    // Refresh token function (for handling token expiration)
    const refreshToken = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/refresh-token`, {
                method: 'POST',
                credentials: 'include',
            })

            if (response.ok) {
                return { success: true }
            } else {
                // Refresh failed, clear auth state
                user.value = null
                localStorage.removeItem('user')
                return { success: false }
            }
        } catch (error) {
            console.error('Refresh token error:', error)
            return { success: false }
        }
    }

    // Protected API request wrapper
    const authenticatedRequest = async (url: string, options: RequestInit = {}) => {
        try {
            const response = await fetch(url, {
                ...options,
                credentials: 'include',
            })

            // If unauthorized, try to refresh token once
            if (response.status === 401) {
                const refreshResult = await refreshToken()
                if (refreshResult.success) {
                    // Retry the original request
                    return await fetch(url, {
                        ...options,
                        credentials: 'include',
                    })
                } else {
                    // Refresh failed, clear auth state
                    // Navigation will be handled by the router guard
                    user.value = null
                    localStorage.removeItem('user')
                    return response
                }
            }

            return response
        } catch (error) {
            console.error('Authenticated request error:', error)
            throw error
        }
    }

    return {
        // State
        user: computed(() => user.value),
        isLoading: computed(() => isLoading.value),
        isAuthenticated,

        // Methods
        login,
        logout,
        getCurrentUser,
        changePassword,
        refreshToken,
        authenticatedRequest,
        initializeAuth,
    }
}
