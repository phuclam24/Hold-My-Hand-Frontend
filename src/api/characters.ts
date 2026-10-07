import api from '@/lib/api'
import type { Character } from '@/types'

export const charactersApi = {
  getAll: async (): Promise<Character[]> => {
    const response = await api.get<Character[]>('/api/game/characters')
    return response.data
  },

  getById: async (id: string): Promise<Character> => {
    const response = await api.get<Character>(`/api/game/characters/${id}`)
    return response.data
  },
}
