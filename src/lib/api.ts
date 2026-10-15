import axios from 'axios'
import { useAuthStore } from '@/stores'

let refreshPromise: Promise<void> | null = null
let sessionExpired = false
let apiRequestQueue: Promise<void> = Promise.resolve()

export async function queueApiRequest<T>(request: () => Promise<T>): Promise<T> {
  const previousRequest = apiRequestQueue
  let releaseRequest!: () => void
  apiRequestQueue = new Promise<void>((resolve) => {
    releaseRequest = resolve
  })

  await previousRequest
  try {
    return await request()
  } finally {
    releaseRequest()
  }
}

function refreshAccessTokenOnce() {
  if (!refreshPromise) {
    refreshPromise = useAuthStore.getState().refreshAccessToken().finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

async function expireSession() {
  if (sessionExpired) return
  sessionExpired = true
  await useAuthStore.getState().logout()
  window.location.href = '/login'
}

const API_BASE_URL = import.meta.env.VITE_API_URL

if (!API_BASE_URL) {
  throw new Error('VITE_API_URL is not configured')
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const isLoginOrRefresh =
    config.url?.includes('/api/auth/login') || config.url?.includes('/api/auth/refresh')
  if (isLoginOrRefresh) {
    delete config.headers.Authorization
    return config
  }

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
      const isAuthRequest = error.config?.url?.includes('/api/auth/')
      if (isAuthRequest) {
        return Promise.reject(error)
      }

      const refreshToken = useAuthStore.getState().refreshToken
      if (!error.config || error.config._retry) {
        return Promise.reject(error)
      }

      if (!refreshToken) {
        await expireSession()
        return Promise.reject(error)
      }

      error.config._retry = true
      try {
        await refreshAccessTokenOnce()
        sessionExpired = false
        error.config.headers.Authorization = `Bearer ${useAuthStore.getState().accessToken}`
        return api.request(error.config)
      } catch (refreshError) {
        const refreshStatus = axios.isAxiosError(refreshError)
          ? refreshError.response?.status
          : undefined
        if (refreshStatus === 400 || refreshStatus === 401 || refreshStatus === 403) {
          await expireSession()
        }
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

export default api
