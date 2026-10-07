import api from '@/lib/api'
import type { ActiveRoom } from '@/types'

export const roomsApi = {
  getActiveRooms: async (): Promise<ActiveRoom[]> => {
    const response = await api.get<ActiveRoom[]>('/api/admin/rooms/active')
    return response.data
  },
}
