import api from '@/lib/api'
import type {
  Chapter,
  CreateChapterRequest,
  UpdateChapterRequest,
} from '@/types'

/**
 * Mod chapters API — full CRUD cho moderator.
 * Endpoint: /api/mod/chapters
 */
export const modChaptersApi = {
  getAll: async (): Promise<Chapter[]> => {
    const response = await api.get<Chapter[]>('/api/mod/chapters')
    return response.data
  },

  getById: async (id: string): Promise<Chapter> => {
    const response = await api.get<Chapter>(`/api/mod/chapters/${id}`)
    return response.data
  },

  create: async (data: CreateChapterRequest): Promise<Chapter> => {
    const response = await api.post<Chapter>('/api/mod/chapters', data)
    return response.data
  },

  update: async (id: string, data: UpdateChapterRequest): Promise<Chapter> => {
    const response = await api.put<Chapter>(`/api/mod/chapters/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/mod/chapters/${id}`)
  },
}