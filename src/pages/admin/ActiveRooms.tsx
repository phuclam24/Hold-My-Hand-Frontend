import { useEffect, useState } from 'react'
import { roomsApi } from '@/api'
import { Card } from '@/components/ui'
import { Activity, Clock, Users, RefreshCw } from 'lucide-react'
import type { ActiveRoom } from '@/types'

export default function ActiveRooms() {
  const [rooms, setRooms] = useState<ActiveRoom[]>([])
  const [loading, setLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)

  const loadRooms = async () => {
    setLoading(true)
    try {
      const data = await roomsApi.getActiveRooms()
      setRooms(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRooms()
  }, [])

  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(loadRooms, 10000)
    return () => clearInterval(interval)
  }, [autoRefresh])

  const stats = {
    total: rooms.length,
    waiting: rooms.filter((r) => r.status === 'Waiting').length,
    inGame: rooms.filter((r) => r.status === 'InGame').length,
    ready: rooms.filter((r) => r.status === 'Ready').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Active Rooms</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Theo dõi các phòng đang hoạt động trong hệ thống
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded"
            />
            Auto refresh
          </label>
          <button
            onClick={loadRooms}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Tổng phòng</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
            </div>
            <Activity className="w-8 h-8 text-indigo-500" />
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Đang chờ</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">{stats.waiting}</p>
            </div>
            <Clock className="w-8 h-8 text-amber-500" />
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Sẵn sàng</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{stats.ready}</p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Đang chơi</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.inGame}</p>
            </div>
            <Activity className="w-8 h-8 text-emerald-500" />
          </div>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900">Danh sách phòng</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                  Lobby Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                  Player 1 (Dad)
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                  Player 2 (Child)
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && rooms.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Đang tải...
                  </td>
                </tr>
              ) : rooms.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">Không có phòng nào đang hoạt động</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Các phòng sẽ xuất hiện khi người chơi tạo lobby
                    </p>
                  </td>
                </tr>
              ) : (
                rooms.map((room) => (
                  <tr key={room.lobbyCode} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3">
                      <span className="font-mono font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                        {room.lobbyCode}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {(room.player1Username || '?').charAt(0).toUpperCase()}
                        </div>
                        <span className="text-slate-900">{room.player1Username || '—'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      {room.player2Username ? (
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                            {room.player2Username.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-slate-900">{room.player2Username}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-xs">Waiting...</span>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold ${
                          room.status === 'InGame'
                            ? 'bg-emerald-100 text-emerald-700'
                            : room.status === 'Waiting'
                            ? 'bg-amber-100 text-amber-700'
                            : room.status === 'Ready'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            room.status === 'InGame'
                              ? 'bg-emerald-500 animate-pulse'
                              : room.status === 'Waiting'
                              ? 'bg-amber-500'
                              : room.status === 'Ready'
                              ? 'bg-purple-500'
                              : 'bg-slate-400'
                          }`}
                        />
                        {room.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-500 text-xs">
                      {new Date(room.createdAt).toLocaleString('vi-VN')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
