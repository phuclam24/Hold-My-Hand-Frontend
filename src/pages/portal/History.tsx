import { useEffect, useState } from 'react'
import { profileApi } from '@/api'
import { Card } from '@/components/ui'
import { History, Trophy, Clock, Target, Gamepad2 } from 'lucide-react'
import type { GameHistoryResponse, GameHistoryItem } from '@/types'

export default function PortalHistory() {
  const [history, setHistory] = useState<GameHistoryResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    profileApi
      .getHistory()
      .then(setHistory)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading || !history) {
    return (
      <div className="text-center py-12 text-purple-200">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500" />
      </div>
    )
  }

  const stats = [
    {
      label: 'Tổng trận',
      value: history.totalGames,
      icon: Gamepad2,
      gradient: 'from-pink-500 to-rose-600',
    },
    {
      label: 'Hoàn thành',
      value: history.completedGames,
      icon: Trophy,
      gradient: 'from-amber-500 to-orange-600',
    },
    {
      label: 'Bỏ dở',
      value: history.abandonedGames,
      icon: Clock,
      gradient: 'from-rose-500 to-pink-600',
    },
    {
      label: 'Tổng điểm',
      value: history.totalScore,
      icon: Target,
      gradient: 'from-indigo-500 to-purple-600',
    },
  ]

  return (
    <div className="space-y-6">
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
                className={`absolute -right-4 -top-4 w-20 h-20 rounded-full bg-gradient-to-br ${s.gradient} opacity-20 blur-2xl`}
              />
              <div className="relative">
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${s.gradient} flex items-center justify-center mb-3`}
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

      {/* History list */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
          <History className="w-5 h-5 text-pink-400" />
          <h2 className="font-semibold text-white">Trận đấu gần đây</h2>
        </div>

        {history.recentGames.length === 0 ? (
          <div className="text-center py-16">
            <Gamepad2 className="w-12 h-12 text-purple-300/40 mx-auto mb-3" />
            <p className="text-purple-200">Chưa có trận đấu nào</p>
            <p className="text-xs text-purple-300 mt-1">Hãy vào sảnh chơi để bắt đầu!</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {history.recentGames.map((game) => (
              <HistoryItem key={game.sessionId} game={game} />
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

function HistoryItem({ game }: { game: GameHistoryItem }) {
  const statusColors: Record<string, string> = {
    Active: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    Completed: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    Abandoned: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  }

  return (
    <div className="px-6 py-4 hover:bg-white/5 transition-colors flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-mono font-semibold text-pink-300">
            {game.lobbyCode.slice(0, 4)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-mono text-sm font-semibold text-white">{game.lobbyCode}</p>
            <span
              className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                statusColors[game.status] || 'bg-white/10 text-white/70 border-white/10'
              }`}
            >
              {game.status}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-purple-200 border border-white/10">
              {game.role}
            </span>
          </div>
          <p className="text-xs text-purple-300 mt-1">
            {new Date(game.startedAt).toLocaleString('vi-VN')}
            {game.durationMin != null && ` • ${game.durationMin} phút`}
          </p>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-lg font-bold text-white">{game.totalScore}</p>
        <p className="text-xs text-purple-300">điểm</p>
      </div>
    </div>
  )
}
