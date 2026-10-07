import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { profileApi } from '@/api'
import { useAuthStore } from '@/stores'
import {
  Gamepad2,
  Trophy,
  Clock,
  Heart,
  ArrowRight,
  Play,
  History,
  User as UserIcon,
} from 'lucide-react'
import type { GameHistoryResponse } from '@/types'

export default function PortalHome() {
  const { user } = useAuthStore()
  const [history, setHistory] = useState<GameHistoryResponse | null>(null)

  useEffect(() => {
    profileApi.getHistory().then(setHistory).catch(console.error)
  }, [])

  const stats = [
    {
      label: 'Tổng trận',
      value: history?.totalGames ?? 0,
      icon: Gamepad2,
      color: 'from-pink-500 to-rose-600',
    },
    {
      label: 'Hoàn thành',
      value: history?.completedGames ?? 0,
      icon: Trophy,
      color: 'from-amber-500 to-orange-600',
    },
    {
      label: 'Thời gian',
      value: `${history?.totalPlaytimeMin ?? 0}p`,
      icon: Clock,
      color: 'from-indigo-500 to-purple-600',
    },
    {
      label: 'Tổng điểm',
      value: history?.totalScore ?? 0,
      icon: Heart,
      color: 'from-emerald-500 to-teal-600',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500/20 via-purple-600/20 to-indigo-500/20 backdrop-blur-xl border border-white/10 p-8">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="relative">
          <p className="text-purple-200 text-sm mb-1">Chào mừng trở lại 👋</p>
          <h1 className="text-3xl font-bold text-white">
            {user?.displayName || user?.username}
          </h1>
          <p className="text-purple-200 mt-2 max-w-lg">
            Sẵn sàng cho một hành trình mới cùng gia đình? Hãy tạo hoặc tham gia một phòng chơi để bắt đầu.
          </p>
          <div className="flex gap-3 mt-6">
            <Link
              to="/portal/lobby"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all"
            >
              <Play className="w-4 h-4" />
              Vào sảnh chơi
            </Link>
            <Link
              to="/portal/history"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
            >
              <History className="w-4 h-4" />
              Xem lịch sử
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div
              key={s.label}
              className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5"
            >
              <div
                className={`absolute -right-4 -top-4 w-20 h-20 rounded-full bg-gradient-to-br ${s.color} opacity-20 blur-2xl`}
              />
              <div className="relative">
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-purple-200 mt-0.5">{s.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickLink
          to="/portal/profile"
          icon={UserIcon}
          title="Hồ sơ của tôi"
          desc="Cập nhật thông tin cá nhân, đổi mật khẩu"
        />
        <QuickLink
          to="/portal/lobby"
          icon={Gamepad2}
          title="Sảnh chơi"
          desc="Tạo hoặc tham gia phòng với người chơi khác"
        />
        <QuickLink
          to="/portal/history"
          icon={History}
          title="Lịch sử"
          desc="Xem lại các trận đấu đã chơi"
        />
      </div>
    </div>
  )
}

function QuickLink({
  to,
  icon: Icon,
  title,
  desc,
}: {
  to: string
  icon: any
  title: string
  desc: string
}) {
  return (
    <Link
      to={to}
      className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-white/20 transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500/20 to-purple-600/20 flex items-center justify-center text-pink-300 group-hover:scale-110 transition-transform">
          <Icon className="w-5 h-5" />
        </div>
        <ArrowRight className="w-4 h-4 text-purple-300 group-hover:translate-x-1 transition-transform" />
      </div>
      <h3 className="font-semibold text-white mt-3">{title}</h3>
      <p className="text-xs text-purple-200 mt-1">{desc}</p>
    </Link>
  )
}
