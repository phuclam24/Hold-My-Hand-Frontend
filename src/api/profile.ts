import api from '@/lib/api'
import type { ProfileResponse, UpdateProfileRequest, GameHistoryResponse } from '@/types'

export const profileApi = {
  getProfile: async (): Promise<ProfileResponse> => {
    const response = await api.get<ProfileResponse>('/api/player/profile')
    return response.data
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<ProfileResponse> => {
    const response = await api.put<ProfileResponse>('/api/player/profile', data)
    return response.data
  },

  getHistory: async (): Promise<GameHistoryResponse> => {
    const response = await api.get<GameHistoryResponse>('/api/player/history')
    return response.data
  },
}
