import api from '@/lib/api'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  TokenResponse,
  User,
} from '@/types'

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/api/auth/login', credentials)
    return response.data
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>('/api/auth/register', data)
    return response.data
  },

  logout: async (): Promise<void> => {
    await api.post('/api/auth/logout')
  },

  refreshToken: async (refreshToken: string): Promise<TokenResponse> => {
    const response = await api.post<TokenResponse>('/api/auth/refresh', { refreshToken })
    return response.data
  },

  /**
   * Google OAuth login — gửi idToken từ Google Sign-In.
   * Backend sẽ tự tạo tài khoản mới nếu email chưa tồn tại.
   */
  googleLogin: async (idToken: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/api/auth/google', { idToken })
    return response.data
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/api/player/profile')
    return response.data
  },
}
