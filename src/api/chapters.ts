import api from '@/lib/api'
import type { Chapter, Quest } from '@/types'

export const chaptersApi = {
  getAll: async (): Promise<Chapter[]> => {
    const response = await api.get<Chapter[]>('/api/game/chapters')
    return response.data
  },

  getById: async (id: string): Promise<Chapter> => {
    const response = await api.get<Chapter>(`/api/game/chapters/${id}`)
    return response.data
  },

  getQuests: async (chapterId: string): Promise<Quest[]> => {
    const response = await api.get<Quest[]>(`/api/game/chapters/${chapterId}/quests`)
    return response.data
  },
}

export const questsApi = {
  getByChapter: async (chapterId: string): Promise<Quest[]> => {
    const response = await api.get<Quest[]>(`/api/game/chapters/${chapterId}/quests`)
    return response.data
  },

  getById: async (chapterId: string, questId: string): Promise<Quest> => {
    const response = await api.get<Quest>(`/api/game/chapters/${chapterId}/quests/${questId}`)
    return response.data
  },
}
