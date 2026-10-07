import api from '@/lib/api'
import type {
  Account,
  CreateAccountRequest,
  UpdateAccountRequest,
  BanAccountRequest,
  ModActionLog,
} from '@/types'

export const accountsApi = {
  getAll: async (): Promise<Account[]> => {
    const response = await api.get<Account[]>('/api/admin/accounts')
    return response.data
  },

  getById: async (id: string): Promise<Account> => {
    const response = await api.get<Account>(`/api/admin/accounts/${id}`)
    return response.data
  },

  create: async (data: CreateAccountRequest): Promise<Account> => {
    const response = await api.post<Account>('/api/admin/accounts', data)
    return response.data
  },

  update: async (id: string, data: UpdateAccountRequest): Promise<Account> => {
    const response = await api.put<Account>(`/api/admin/accounts/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/admin/accounts/${id}`)
  },

  ban: async (id: string, data: BanAccountRequest): Promise<void> => {
    await api.post(`/api/admin/accounts/${id}/ban`, data)
  },

  unban: async (id: string): Promise<void> => {
    await api.post(`/api/admin/accounts/${id}/unban`)
  },

  getLogs: async (): Promise<ModActionLog[]> => {
    const response = await api.get<ModActionLog[]>('/api/admin/logs')
    return response.data
  },

  getActiveRooms: async (): Promise<unknown[]> => {
    const response = await api.get<unknown[]>('/api/admin/rooms/active')
    return response.data
  },
}
