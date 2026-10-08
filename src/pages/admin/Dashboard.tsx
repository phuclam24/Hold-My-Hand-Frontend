import { useEffect, useState } from 'react'
import {
  Users,
  Activity,
  Clock,
  RotateCw,
  Zap,
  Gamepad2,
  ArrowRight,
  Wifi,
  Lock,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { accountsApi } from '@/api'
import type { Account, ActiveRoom, ModActionLog } from '@/types'

export default function AdminDashboard() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [rooms, setRooms] = useState<ActiveRoom[]>([])
  const [logs, setLogs] = useState<ModActionLog[]>([])
  const [loading, setLoading] = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      const [accData, roomData, logData] = await Promise.all([
        accountsApi.getAll().catch(() => []),
        accountsApi.getActiveRooms().catch(() => []) as Promise<ActiveRoom[]>,
        accountsApi.getLogs().catch(() => []),
      ])
      setAccounts(accData)
      setRooms(roomData)
      setLogs(logData.slice(0, 8))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const totalPlayers = accounts.length
  const onlinePlayers = accounts.filter((a) => a.isActive && !a.isBanned).length
  const bannedPlayers = accounts.filter((a) => a.isBanned).length

  return (
    <div className="space-y-6">
      {/* Overview Sub-Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Tổng quan portal</h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Chào mừng trở lại, Admin. Một hành trình mới bắt đầu từ đây.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Vừa cập nhật</span>
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141a26] border border-slate-800 hover:bg-[#1a2232] text-xs font-medium text-slate-200 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-[#111622]/90 border border-slate-800/80 rounded-xl p-4 shadow-lg backdrop-blur-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Tổng người chơi</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white my-1 tracking-tight">
            {totalPlayers.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 font-normal">— Thành viên cộng đồng</p>
        </div>

        {/* Card 2 */}
        <div className="bg-[#111622]/90 border border-slate-800/80 rounded-xl p-4 shadow-lg backdrop-blur-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Đang trực tuyến</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Wifi className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white my-1 tracking-tight">
            {onlinePlayers.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 font-normal">— Người chơi đang kết nối</p>
        </div>

        {/* Card 3 */}
        <div className="bg-[#111622]/90 border border-slate-800/80 rounded-xl p-4 shadow-lg backdrop-blur-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Phòng co-op</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Gamepad2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white my-1 tracking-tight">
            {rooms.length.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 font-normal">— Cuộc hành trình đang diễn ra</p>
        </div>

        {/* Card 4 */}
        <div className="bg-[#111622]/90 border border-slate-800/80 rounded-xl p-4 shadow-lg backdrop-blur-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Tài khoản bị khóa</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white my-1 tracking-tight">
            {bannedPlayers.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 font-normal">— Cộng đồng được bảo vệ</p>
        </div>
      </div>

      {/* Main Grid Section (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left Column: Recent Activity */}
        <div className="bg-[#111622]/90 border border-slate-800/80 rounded-xl p-5 shadow-xl flex flex-col justify-between min-h-[300px]">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/60">
              <div>
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Hoạt động gần đây
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Nhịp chuyển động của portal</p>
              </div>
              <Link
                to="/admin/audit-logs"
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-medium transition-colors"
              >
                <span>Xem tất cả</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Content */}
            <div className="pt-4">
              {logs.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-800/60 border border-slate-700/50 flex items-center justify-center text-slate-400 mb-3">
                    <Activity className="w-6 h-6" />
                  </div>
                  <h4 className="text-white font-semibold text-sm">Chưa có hoạt động mới</h4>
                  <p className="text-slate-400 text-xs mt-1">
                    Mọi hoạt động của portal sẽ được ghi nhận tại đây.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-800/50">
                  {logs.map((log) => (
                    <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            log.action === 'BAN'
                              ? 'bg-rose-500'
                              : log.action === 'UNBAN'
                              ? 'bg-emerald-500'
                              : 'bg-amber-500'
                          }`}
                        />
                        <span className="font-semibold text-slate-200">{log.action}</span>
                        <span className="text-slate-400">→ {log.targetType}</span>
                      </div>
                      <span className="text-slate-500 font-mono">
                        {new Date(log.createdAt).toLocaleTimeString('vi-VN')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Active Rooms */}
        <div className="bg-[#111622]/90 border border-slate-800/80 rounded-xl p-5 shadow-xl flex flex-col justify-between min-h-[300px]">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/60">
              <div>
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-amber-400" />
                  Phòng đang chơi ({rooms.length})
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Cùng nhau, đi xa hơn</p>
              </div>
              <Link
                to="/admin/rooms"
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-medium transition-colors"
              >
                <span>Xem phòng</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Content */}
            <div className="pt-4">
              {rooms.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-800/60 border border-slate-700/50 flex items-center justify-center text-slate-400 mb-3">
                    <Gamepad2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-white font-semibold text-sm">Chưa có phòng đang chơi</h4>
                  <p className="text-slate-400 text-xs mt-1">
                    Nhưng cuộc phiêu lưu tiếp theo đang chờ bắt đầu.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {rooms.slice(0, 4).map((room) => (
                    <div
                      key={room.lobbyCode}
                      className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                          {room.lobbyCode}
                        </span>
                        <span className="text-slate-300">
                          {room.player1Username || 'Player 1'} vs {room.player2Username || 'Player 2'}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">
                        {room.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Latest Players */}
      <div className="bg-[#111622]/90 border border-slate-800/80 rounded-xl p-5 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/60 mb-4">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            Người chơi mới nhất
          </h3>
          <Link
            to="/admin/accounts"
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-medium transition-colors"
          >
            <span>Quản lý người chơi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold tracking-wider text-[11px] uppercase">
                <th className="pb-3 px-3">Người chơi</th>
                <th className="pb-3 px-3">Vai trò</th>
                <th className="pb-3 px-3">Trạng thái</th>
                <th className="pb-3 px-3">Ngày tham gia</th>
                <th className="pb-3 px-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-slate-300">
              {accounts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    Chưa có dữ liệu người chơi
                  </td>
                </tr>
              ) : (
                accounts.slice(0, 5).map((acc) => (
                  <tr key={acc.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                          {acc.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-white">{acc.username}</p>
                          <p className="text-[10px] text-slate-400">{acc.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-medium">
                        {acc.role}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          acc.isBanned
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            acc.isBanned ? 'bg-rose-400' : 'bg-emerald-400'
                          }`}
                        />
                        {acc.isBanned ? 'Bị khóa' : 'Hoạt động'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {new Date(acc.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        to="/admin/accounts"
                        className="text-amber-400 hover:text-amber-300 hover:underline text-[11px] font-medium"
                      >
                        Chi tiết
                      </Link>
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

