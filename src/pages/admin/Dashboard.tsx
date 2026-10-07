import { useEffect, useState } from 'react'
import { Card } from '@/components/ui'
import {
  Users,
  Shield,
  AlertTriangle,
  Activity,
  TrendingUp,
  UserCheck,
  UserX,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { accountsApi } from '@/api'
import type { Account, ActiveRoom, ModActionLog } from '@/types'

export default function AdminDashboard() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [rooms, setRooms] = useState<ActiveRoom[]>([])
  const [logs, setLogs] = useState<ModActionLog[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const [accData, roomData, logData] = await Promise.all([
          accountsApi.getAll(),
          accountsApi.getActiveRooms().catch(() => []) as Promise<ActiveRoom[]>,
          accountsApi.getLogs().catch(() => []),
        ])
        setAccounts(accData)
        setRooms(roomData)
        setLogs(logData.slice(0, 8))
      } catch (e) {
        console.error(e)
      }
    }
    load()
  }, [])

  const total = accounts.length
  const active = accounts.filter((a) => a.isActive && !a.isBanned).length
  const banned = accounts.filter((a) => a.isBanned).length
  const players = accounts.filter((a) => a.role === 'Player').length

  const stats = [
    {
      label: 'Tổng người dùng',
      value: total,
      delta: '+12.5%',
      deltaUp: true,
      icon: Users,
      gradient: 'from-indigo-500 to-purple-600',
      iconBg: 'bg-white/20',
    },
    {
      label: 'Đang hoạt động',
      value: active,
      delta: '+8.2%',
      deltaUp: true,
      icon: UserCheck,
      gradient: 'from-emerald-500 to-teal-600',
      iconBg: 'bg-white/20',
    },
    {
      label: 'Players',
      value: players,
      delta: '+24.1%',
      deltaUp: true,
      icon: Shield,
      gradient: 'from-amber-500 to-orange-600',
      iconBg: 'bg-white/20',
    },
    {
      label: 'Bị khóa',
      value: banned,
      delta: '-2.4%',
      deltaUp: false,
      icon: UserX,
      gradient: 'from-rose-500 to-pink-600',
      iconBg: 'bg-white/20',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Chào mừng trở lại — đây là tổng quan hệ thống Hold My Hand
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div
              key={s.label}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${s.gradient} p-5 text-white shadow-lg`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-white/80">{s.label}</p>
                  <p className="text-3xl font-bold mt-2">{s.value.toLocaleString()}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs">
                    {s.deltaUp ? (
                      <ArrowUp className="w-3 h-3" />
                    ) : (
                      <ArrowDown className="w-3 h-3" />
                    )}
                    <span>{s.delta}</span>
                    <span className="text-white/70">vs tháng trước</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl ${s.iconBg} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              {/* Decorative blob */}
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full" />
            </div>
          )
        })}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent activity */}
        <Card className="lg:col-span-2 p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                Hoạt động gần đây
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">System audit logs</p>
            </div>
            <Link
              to="/admin/audit-logs"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Xem tất cả →
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {logs.length === 0 ? (
              <p className="text-center text-slate-400 py-12">Chưa có hoạt động nào</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="px-6 py-3 flex items-center justify-between hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      log.action === 'BAN' ? 'bg-rose-500' :
                      log.action === 'UNBAN' ? 'bg-emerald-500' :
                      log.action === 'DELETE' ? 'bg-rose-500' :
                      log.action === 'CREATE' ? 'bg-emerald-500' :
                      'bg-indigo-500'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {log.action} <span className="text-slate-500 font-normal">→ {log.targetType}</span>
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(log.createdAt).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-400 truncate max-w-[120px]">
                    {log.targetId.slice(-8)}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Active rooms */}
        <Card className="p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                Phòng đang chơi
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Live lobbies</p>
            </div>
            <Link to="/admin/rooms" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              Xem →
            </Link>
          </div>
          <div className="p-6 space-y-3">
            {rooms.length === 0 ? (
              <p className="text-center text-slate-400 py-8 text-sm">Không có phòng nào</p>
            ) : (
              rooms.slice(0, 5).map((room) => (
                <div
                  key={room.lobbyCode}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm font-semibold text-slate-900">
                      {room.lobbyCode}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        room.status === 'InGame'
                          ? 'bg-emerald-100 text-emerald-700'
                          : room.status === 'Waiting'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {room.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">
                    {room.player1Username || 'Waiting...'}
                    {room.player2Username ? ` ↔ ${room.player2Username}` : ' (1/2)'}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Top players */}
      <Card className="p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Người dùng mới nhất
            </h3>
          </div>
          <Link
            to="/admin/accounts"
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Quản lý →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Ngày tạo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {accounts
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5)
                .map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {a.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{a.username}</p>
                          <p className="text-xs text-slate-500">{a.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          a.role === 'Admin'
                            ? 'bg-rose-100 text-rose-700'
                            : a.role === 'Moderator'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-indigo-100 text-indigo-700'
                        }`}
                      >
                        {a.role}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                          a.isBanned
                            ? 'bg-rose-100 text-rose-700'
                            : a.isActive
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          a.isBanned ? 'bg-rose-500' : a.isActive ? 'bg-emerald-500' : 'bg-slate-400'
                        }`} />
                        {a.isBanned ? 'Banned' : a.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-500">
                      {new Date(a.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
