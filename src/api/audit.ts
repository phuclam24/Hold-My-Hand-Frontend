import api from '@/lib/api'
import type { ModActionLog } from '@/types'

export const auditApi = {
  getAll: async (): Promise<ModActionLog[]> => {
    const response = await api.get<ModActionLog[]>('/api/admin/logs')
    return response.data
  },
}
