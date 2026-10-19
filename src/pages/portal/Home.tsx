import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { profileApi } from '@/api'
import { useAuthStore } from '@/stores'
import { MagicCard } from '@/components/ui'
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
}
const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const },
  },
}

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
      glow: 'rose',
    },
    {
      label: 'Hoàn thành',
      value: history?.completedGames ?? 0,
      icon: Trophy,
      color: 'from-amber-500 to-orange-600',
      glow: 'amber',
    },
    {
      label: 'Thời gian',
      value: `${history?.totalPlaytimeMin ?? 0}p`,
      icon: Clock,
      color: 'from-indigo-500 to-purple-600',
      glow: 'indigo',
    },
    {
      label: 'Tổng điểm',
      value: history?.totalScore ?? 0,
      icon: Heart,
      color: 'from-emerald-500 to-teal-600',
      glow: 'emerald',
    },
  ]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Welcome card */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500/20 via-purple-600/20 to-indigo-500/20 backdrop-blur-xl border border-white/10 p-8 group"
      >
        {/* Animated blob layers */}
        <motion.div
          className="absolute -right-20 -top-20 w-64 h-64 bg-pink-500/30 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -left-20 -bottom-20 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.6, 0.4, 0.6] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Animated shimmer line */}
        <div className="absolute inset-0 pointer-events-none opacity-30 group-hover:opacity-60 transition-opacity">
          <div className="absolute top-0 left-[-50%] h-px w-1/2 bg-gradient-to-r from-transparent via-amber-300 to-transparent animate-shimmer" />
        </div>
        <div className="relative">
          <motion.p
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-purple-200 text-sm mb-1"
          >
            Chào mừng trở lại 👋
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-3xl font-bold text-white bg-gradient-to-r from-white via-amber-100 to-white bg-clip-text"
          >
            {user?.displayName || user?.username}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="text-purple-200 mt-2 max-w-lg"
          >
            Sẵn sàng cho một hành trình mới cùng gia đình? Hãy tạo hoặc tham gia một phòng chơi để bắt đầu.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="flex gap-3 mt-6"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/portal/lobby"
                className="relative inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all overflow-hidden"
              >
                <span className="absolute inset-0 -z-0">
                  <span className="absolute inset-0 rounded-xl bg-pink-400 animate-radar opacity-60" />
                </span>
                <Play className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Vào sảnh chơi</span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, x: 2 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/portal/history"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
              >
                <History className="w-4 h-4" />
                Xem lịch sử
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {stats.map((s, idx) => {
          const Icon = s.icon
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.2 + idx * 0.1, duration: 0.6 }}
              whileHover={{ y: -6, scale: 1.03 }}
            >
              <MagicCard
                glowColor={s.glow as any}
                intensity={3}
                className="relative overflow-hidden p-5"
              >
                <motion.div
                  className={`absolute -right-4 -top-4 w-20 h-20 rounded-full bg-gradient-to-br ${s.color} opacity-20 blur-2xl`}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 4 + idx, repeat: Infinity, ease: 'easeInOut' }}
                />
                <div className="relative">
                  <motion.div
                    whileHover={{ rotate: 12, scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-lg`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </motion.div>
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-xs text-purple-200 mt-0.5">{s.label}</p>
                </div>
              </MagicCard>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Quick links */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {[
          {
            to: '/portal/profile',
            icon: UserIcon,
            title: 'Hồ sơ của tôi',
            desc: 'Cập nhật thông tin cá nhân, đổi mật khẩu',
          },
          {
            to: '/portal/lobby',
            icon: Gamepad2,
            title: 'Sảnh chơi',
            desc: 'Tạo hoặc tham gia phòng với người chơi khác',
          },
          {
            to: '/portal/history',
            icon: History,
            title: 'Lịch sử',
            desc: 'Xem lại các trận đấu đã chơi',
          },
        ].map((q, i) => (
          <motion.div
            key={q.to}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <Link to={q.to} className="block">
              <MagicCard glowColor="rose" intensity={3} className="p-5">
                <div className="flex items-start justify-between">
                  <motion.div
                    whileHover={{ rotate: -10, scale: 1.18 }}
                    transition={{ type: 'spring', stiffness: 220 }}
                    className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500/30 to-purple-600/30 flex items-center justify-center text-pink-300 shadow-[0_0_18px_rgba(236,72,153,0.4)]"
                  >
                    <q.icon className="w-5 h-5" />
                  </motion.div>
                  <motion.div
                    animate={{ x: [0, 6, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <ArrowRight className="w-4 h-4 text-purple-300" />
                  </motion.div>
                </div>
                <h3 className="font-semibold text-white mt-3">{q.title}</h3>
                <p className="text-xs text-purple-200 mt-1">{q.desc}</p>
              </MagicCard>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}