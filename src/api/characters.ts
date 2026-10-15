import api from '@/lib/api'
import type { Character, CreateCharacterRequest, UpdateCharacterRequest } from '@/types'

export const charactersApi = {
  /** Game endpoint (cho player runtime) */
  getAll: async (): Promise<Character[]> => {
    const response = await api.get<Character[]>('/api/game/characters')
    return response.data
  },

  getById: async (id: string): Promise<Character> => {
    const response = await api.get<Character>(`/api/game/characters/${id}`)
    return response.data
  },

  /** Mod endpoint — CRUD nhân vật */
  create: async (data: CreateCharacterRequest): Promise<Character> => {
    const response = await api.post<Character>('/api/mod/characters', data)
    return response.data
  },

  update: async (id: string, data: UpdateCharacterRequest): Promise<Character> => {
    const response = await api.put<Character>(`/api/mod/characters/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/mod/characters/${id}`)
  },
}
