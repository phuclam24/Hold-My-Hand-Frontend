import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
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
import { MagicCard } from '@/components/ui'
import type { Account, ActiveRoom, ModActionLog } from '@/types'

const stats = [
  { key: 'total', glow: 'cyan', icon: Users, label: 'Tổng người chơi', sub: '— Thành viên cộng đồng' },
  { key: 'online', glow: 'emerald', icon: Wifi, label: 'Đang trực tuyến', sub: '— Người chơi đang kết nối' },
  { key: 'rooms', glow: 'amber', icon: Gamepad2, label: 'Phòng co-op', sub: '— Cuộc hành trình đang diễn ra' },
  { key: 'banned', glow: 'rose', icon: Lock, label: 'Tài khoản bị khóa', sub: '— Cộng đồng được bảo vệ' },
]

const colorMap: Record<string, string> = {
  cyan: 'from-cyan-500 to-blue-600',
  emerald: 'from-emerald-500 to-teal-600',
  amber: 'from-amber-400 to-orange-500',
  rose: 'from-rose-500 to-pink-600',
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
}
const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
}

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
  const values: Record<string, number> = {
    total: totalPlayers,
    online: onlinePlayers,
    rooms: rooms.length,
    banned: bannedPlayers,
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Sub-header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight bg-gradient-to-r from-white via-amber-100 to-white bg-clip-text">
            Tổng quan portal
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Chào mừng trở lại, Admin. Một hành trình mới bắt đầu từ đây.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Vừa cập nhật</span>
          </div>
          <motion.button
            onClick={loadData}
            disabled={loading}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141a26] border border-slate-800 hover:bg-[#1a2232] text-xs font-medium text-slate-200 hover:text-white transition-colors disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </motion.button>
        </div>
      </motion.div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon
          return (
            <motion.div
              key={s.key}
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.02 }}
            >
              <MagicCard glowColor={s.glow as any} intensity={3} className="relative p-4 overflow-hidden">
                <motion.div
                  className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${colorMap[s.glow]} blur-2xl opacity-20`}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 5 + idx * 0.6, repeat: Infinity, ease: 'easeInOut' }}
                />
                <div className="flex items-center justify-between relative">
                  <span className="text-xs font-medium text-slate-400">{s.label}</span>
                  <motion.div
                    whileHover={{ rotate: 12, scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className={`w-8 h-8 rounded-lg bg-${s.glow}-500/10 border border-${s.glow}-500/20 text-${s.glow}-400 flex items-center justify-center`}
                    style={{
                      color:
                        s.glow === 'cyan'
                          ? '#22d3ee'
                          : s.glow === 'emerald'
                          ? '#10b981'
                          : s.glow === 'amber'
                          ? '#f59e0b'
                          : '#fb7185',
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.div>
                </div>
                <motion.div
                  key={values[s.key]}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl font-extrabold text-white my-1 tracking-tight"
                >
                  {values[s.key].toLocaleString()}
                </motion.div>
                <p className="text-[11px] text-slate-500 font-normal">{s.sub}</p>
              </MagicCard>
            </motion.div>
          )
        })}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <motion.div variants={itemVariants}>
          <MagicCard glowColor="amber" intensity={3} className="flex flex-col justify-between min-h-[300px]">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/60">
                <div>
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    Hoạt động gần đây
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Nhịp chuyển động của portal</p>
                </div>
                <motion.div whileHover={{ x: 3 }}>
                  <Link
                    to="/admin/audit-logs"
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-medium"
                  >
                    <span>Xem tất cả</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>
              </div>
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
                    {logs.map((log, i) => (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.05, duration: 0.5 }}
                        className="py-2.5 flex items-center justify-between text-xs hover:bg-white/[0.02] px-2 rounded transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <motion.span
                            animate={{ scale: [1, 1.4, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
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
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </MagicCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <MagicCard glowColor="emerald" intensity={3} className="flex flex-col justify-between min-h-[300px]">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/60">
                <div>
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Gamepad2 className="w-4 h-4 text-amber-400" />
                    Phòng đang chơi ({rooms.length})
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Cùng nhau, đi xa hơn</p>
                </div>
                <motion.div whileHover={{ x: 3 }}>
                  <Link
                    to="/admin/rooms"
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-medium"
                  >
                    <span>Xem phòng</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>
              </div>
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
                    {rooms.slice(0, 4).map((room, i) => (
                      <motion.div
                        key={room.lobbyCode}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.08 }}
                        whileHover={{ x: 4 }}
                        className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs hover:border-amber-400/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                            {room.lobbyCode}
                          </span>
                          <span className="text-slate-300">
                            {room.player1Username || '-'} vs {room.player2Username || '-'}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">
                          {room.status}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </MagicCard>
        </motion.div>
      </div>

      {/* Latest Players */}
      <motion.div variants={itemVariants}>
        <MagicCard glowColor="indigo" intensity={3} interactive={false}>
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/60 mb-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              Người chơi mới nhất
            </h3>
            <motion.div whileHover={{ x: 3 }}>
              <Link
                to="/admin/accounts"
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-medium"
              >
                <span>Quản lý người chơi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
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
                  accounts.slice(0, 5).map((acc, i) => (
                    <motion.tr
                      key={acc.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + i * 0.07 }}
                      whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                      className="transition-colors"
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <motion.div
                            whileHover={{ scale: 1.15 }}
                            className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm"
                          >
                            {acc.username.charAt(0).toUpperCase()}
                          </motion.div>
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
                            } animate-pulse`}
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
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </MagicCard>
      </motion.div>
    </motion.div>
  )
}