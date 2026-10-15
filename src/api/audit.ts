import api, { queueApiRequest } from '@/lib/api'
import type { ModActionLog } from '@/types'

export const auditApi = {
  getAll: async (): Promise<ModActionLog[]> => {
    const response = await queueApiRequest(() => api.get<ModActionLog[]>('/api/admin/logs'))
    return response.data
  },
}
