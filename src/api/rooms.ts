import api, { queueApiRequest } from '@/lib/api'
import type { ActiveRoom } from '@/types'

export const roomsApi = {
  getActiveRooms: async (): Promise<ActiveRoom[]> => {
    const response = await queueApiRequest(() => api.get<ActiveRoom[]>('/api/admin/lobbies'))
    return response.data
  },
}
