import axios from 'axios'
import { useAuthStore } from '@/stores'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5181'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try refresh token
      const refreshToken = useAuthStore.getState().refreshToken
      if (refreshToken && !error.config._retry) {
        error.config._retry = true
        try {
          await useAuthStore.getState().refreshAccessToken()
          error.config.headers.Authorization = `Bearer ${useAuthStore.getState().accessToken}`
          return api.request(error.config)
        } catch {
          useAuthStore.getState().logout()
          window.location.href = '/login'
        }
      } else {
        useAuthStore.getState().logout()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
