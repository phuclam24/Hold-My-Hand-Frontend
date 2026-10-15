import api, { queueApiRequest } from '@/lib/api'
import type { Chapter, Quest } from '@/types'

export const chaptersApi = {
  getAll: async (): Promise<Chapter[]> => {
    const response = await queueApiRequest(() => api.get<Chapter[]>('/api/mod/chapters'))
    return response.data
  },

  getById: async (id: string): Promise<Chapter> => {
    const response = await queueApiRequest(() => api.get<Chapter>(`/api/mod/chapters/${id}`))
    return response.data
  },

  getQuests: async (chapterId: string): Promise<Quest[]> => {
    const response = await queueApiRequest(() => api.get<Quest[]>('/api/mod/quests', { params: { chapterId } }))
    return response.data
  },
}

export const questsApi = {
  getByChapter: async (chapterId: string): Promise<Quest[]> => {
    const response = await queueApiRequest(() => api.get<Quest[]>('/api/mod/quests', { params: { chapterId } }))
    return response.data
  },

  getById: async (_chapterId: string, questId: string): Promise<Quest> => {
    const response = await queueApiRequest(() => api.get<Quest>(`/api/mod/quests/${questId}`))
    return response.data
  },
}
