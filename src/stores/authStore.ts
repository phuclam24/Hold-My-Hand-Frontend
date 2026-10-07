import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, LoginRequest, LoginResponse, RegisterRequest } from '@/types'
import { authApi } from '@/api'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (credentials: LoginRequest) => Promise<User>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  refreshAccessToken: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null })
        try {
          const data: LoginResponse = await authApi.login(credentials)
          const user: User = {
            userId: data.userId,
            username: data.username,
            email: data.email,
            role: data.role as User['role'],
            displayName: data.displayName,
            avatarUrl: data.avatarUrl,
            sessionId: data.sessionId,
          }
          localStorage.setItem('accessToken', data.accessToken)
          localStorage.setItem('refreshToken', data.refreshToken)
          set({
            user,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          })
          return user
        } catch (error: any) {
          const message = error.response?.data?.message || error.response?.data || 'Đăng nhập thất bại'
          set({
            error: typeof message === 'string' ? message : 'Đăng nhập thất bại',
            isLoading: false,
          })
          throw error
        }
      },

      register: async (data: RegisterRequest) => {
        set({ isLoading: true, error: null })
        try {
          await authApi.register(data)
          set({ isLoading: false })
        } catch (error: any) {
          const message = error.response?.data?.message || error.response?.data || 'Đăng ký thất bại'
          set({
            error: typeof message === 'string' ? message : 'Đăng ký thất bại',
            isLoading: false,
          })
          throw error
        }
      },

      logout: async () => {
        try {
          await authApi.logout()
        } catch {
          // ignore
        }
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        })
      },

      refreshAccessToken: async () => {
        const refreshToken = get().refreshToken
        if (!refreshToken) throw new Error('No refresh token')
        try {
          const data = await authApi.refreshToken(refreshToken)
          localStorage.setItem('accessToken', data.accessToken)
          localStorage.setItem('refreshToken', data.refreshToken)
          set({ accessToken: data.accessToken, refreshToken: data.refreshToken })
        } catch (error) {
          // Refresh failed, logout
          await get().logout()
          throw error
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
