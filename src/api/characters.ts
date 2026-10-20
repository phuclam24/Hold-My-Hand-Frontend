import api, { queueApiRequest } from '@/lib/api'
import type { Character } from '@/types'

export const charactersApi = {
  getAll: async (): Promise<Character[]> => {
    const response = await queueApiRequest(() => api.get<Character[]>('/api/mod/characters'))
    return response.data
  },

  getById: async (id: string): Promise<Character> => {
    const response = await queueApiRequest(() => api.get<Character>(`/api/mod/characters/${id}`))
    return response.data
  },

  update: async (id: string, data: Omit<Character, 'id'>): Promise<Character> => {
    const response = await queueApiRequest(() =>
      api.put<Character>(`/api/mod/characters/${id}`, data),
    )
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await queueApiRequest(() => api.delete(`/api/mod/characters/${id}`))
  },
}
