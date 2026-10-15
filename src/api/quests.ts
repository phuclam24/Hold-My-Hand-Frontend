import api, { queueApiRequest } from '@/lib/api'
import type { Quest, PaginatedResponse } from '@/types'

export const questsApi = {
  getAll: async (params?: {
    page?: number
    pageSize?: number
    chapterId?: string
    difficulty?: string
  }): Promise<PaginatedResponse<Quest>> => {
    const response = await queueApiRequest(() =>
      api.get<PaginatedResponse<Quest>>('/api/mod/quests', { params }),
    )
    return response.data
  },

  getById: async (id: string): Promise<Quest> => {
    const response = await queueApiRequest(() => api.get<Quest>(`/api/mod/quests/${id}`))
    return response.data
  },

  create: async (data: Omit<Quest, 'id' | 'isCompleted'>): Promise<Quest> => {
    const response = await queueApiRequest(() => api.post<Quest>('/api/mod/quests', data))
    return response.data
  },

  update: async (id: string, data: Partial<Quest>): Promise<Quest> => {
    const response = await queueApiRequest(() => api.put<Quest>(`/api/mod/quests/${id}`, data))
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await queueApiRequest(() => api.delete(`/api/mod/quests/${id}`))
  },

  getByChapter: async (chapterId: string): Promise<Quest[]> => {
    const response = await queueApiRequest(() =>
      api.get<Quest[]>('/api/mod/quests', { params: { chapterId } }),
    )
    return response.data
  },
}
