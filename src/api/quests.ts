import api from '@/lib/api'
import type {
  Quest,
  CreateQuestRequest,
  UpdateQuestRequest,
} from '@/types'

/**
 * Mod quests API — full CRUD.
 * Endpoint: /api/mod/quests
 */
export const questsApi = {
  getAll: async (params?: { chapterId?: string }): Promise<Quest[]> => {
    const response = await api.get<Quest[]>('/api/mod/quests', { params })
    return response.data
  },

  getById: async (id: string): Promise<Quest> => {
    const response = await api.get<Quest>(`/api/mod/quests/${id}`)
    return response.data
  },

  create: async (data: CreateQuestRequest): Promise<Quest> => {
    const response = await api.post<Quest>('/api/mod/quests', data)
    return response.data
  },

  update: async (id: string, data: UpdateQuestRequest): Promise<Quest> => {
    const response = await api.put<Quest>(`/api/mod/quests/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/mod/quests/${id}`)
  },

  getByChapter: async (chapterId: string): Promise<Quest[]> => {
    const response = await api.get<Quest[]>('/api/mod/quests', {
      params: { chapterId },
    })
    return response.data
  },
}