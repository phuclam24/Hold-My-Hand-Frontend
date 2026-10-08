import { useEffect, useState } from 'react'
import { roomsApi } from '@/api'
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Phòng co-op</h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Theo dõi các phòng chơi đang hoạt động trong hệ thống
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="w-4 h-4 accent-amber-500 rounded bg-slate-900 border-slate-700"
            />
            Tự động làm mới
          </label>
          <button
            onClick={loadRooms}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#141a26] border border-slate-800 rounded-lg text-xs font-medium text-slate-200 hover:text-white hover:bg-[#1a2232] transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#111622]/90 border border-slate-800/80 p-4 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">Tổng phòng</p>
              <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
        </div>
        <div className="bg-[#111622]/90 border border-slate-800/80 p-4 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">Đang chờ</p>
              <p className="text-2xl font-bold text-amber-400 mt-1">{stats.waiting}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
        </div>
        <div className="bg-[#111622]/90 border border-slate-800/80 p-4 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">Sẵn sàng</p>
              <p className="text-2xl font-bold text-purple-400 mt-1">{stats.ready}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
        </div>
        <div className="bg-[#111622]/90 border border-slate-800/80 p-4 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">Đang chơi</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{stats.inGame}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#111622]/90 border border-slate-800/80 rounded-xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800/60 bg-slate-900/40">
          <h3 className="font-bold text-white text-sm">Danh sách phòng đang mở</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold tracking-wider text-[11px] uppercase bg-slate-900/40">
                <th className="px-6 py-3">Mã phòng</th>
                <th className="px-6 py-3">Người chơi 1 (Dad)</th>
                <th className="px-6 py-3">Người chơi 2 (Child)</th>
                <th className="px-6 py-3">Trạng thái</th>
                <th className="px-6 py-3">Thời gian tạo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-slate-300">
              {loading && rooms.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Đang tải danh sách phòng...
                  </td>
                </tr>
              ) : rooms.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <Activity className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-300 font-medium">Không có phòng nào đang hoạt động</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Các phòng sẽ xuất hiện khi người chơi tạo lobby trong game
                    </p>
                  </td>
                </tr>
              ) : (
                rooms.map((room) => (
                  <tr key={room.lobbyCode} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-3">
                      <span className="font-mono font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded border border-amber-400/20">
                        {room.lobbyCode}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                          {(room.player1Username || '?').charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white font-medium">{room.player1Username || '—'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      {room.player2Username ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                            {room.player2Username.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-white font-medium">{room.player2Username}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic text-[11px]">Đang chờ người chơi thứ 2...</span>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full font-semibold border ${
                          room.status === 'InGame'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : room.status === 'Waiting'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : room.status === 'Ready'
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            room.status === 'InGame'
                              ? 'bg-emerald-400 animate-pulse'
                              : room.status === 'Waiting'
                              ? 'bg-amber-400'
                              : room.status === 'Ready'
                              ? 'bg-purple-400'
                              : 'bg-slate-500'
                          }`}
                        />
                        {room.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-400 text-xs">
                      {new Date(room.createdAt).toLocaleString('vi-VN')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
