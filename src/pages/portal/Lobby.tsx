import { useState } from 'react'
import { Card } from '@/components/ui'
import { useNotificationStore } from '@/stores'
import { Gamepad2, Plus, Hash, Users, ArrowLeftRight, Play } from 'lucide-react'
export default function PortalLobby() {
  const [joinCode, setJoinCode] = useState('')
  const { addNotification } = useNotificationStore()

  const handleCreate = () => {
    addNotification({
      type: 'info',
      title: 'Lobby',
      message: 'Tính năng này sẽ kết nối với Unity Game Client. Mở game để tạo lobby.',
    })
  }

  const handleJoin = () => {
    if (!joinCode.trim()) {
      addNotification({ type: 'error', title: 'Lỗi', message: 'Nhập mã phòng' })
      return
    }
    addNotification({
      type: 'info',
      title: 'Lobby',
      message: `Mở game và nhập mã ${joinCode.toUpperCase()} để tham gia.`,
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 mb-4 shadow-2xl shadow-pink-500/40">
          <Gamepad2 className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white">Sảnh chờ</h1>
        <p className="text-purple-200 mt-2">
          Tạo phòng mới hoặc tham gia cùng bạn bè qua mã code
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-8 hover:border-pink-500/30 transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mb-5 shadow-lg shadow-pink-500/30 group-hover:scale-110 transition-transform">
            <Plus className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Tạo phòng mới</h2>
          <p className="text-purple-200 text-sm mb-6">
            Tạo một lobby mới và mời người chơi thứ hai tham gia. Bạn sẽ đóng vai <strong className="text-pink-300">Dad</strong>.
          </p>
          <button
            onClick={handleCreate}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold rounded-xl shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            Tạo phòng
          </button>
        </Card>

        {/* Join */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-8 hover:border-purple-500/30 transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-5 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
            <Hash className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Tham gia phòng</h2>
          <p className="text-purple-200 text-sm mb-6">
            Nhập mã 6 ký tự mà bạn của bạn đã chia sẻ. Bạn sẽ đóng vai <strong className="text-purple-300">Child</strong>.
          </p>
          <div className="space-y-3">
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 6))}
              placeholder="NHẬP MÃ"
              maxLength={6}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-center text-2xl font-mono tracking-[0.5em] placeholder-purple-300/30 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all uppercase"
            />
            <button
              onClick={handleJoin}
              disabled={joinCode.length < 6}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" />
              Tham gia
            </button>
          </div>
        </Card>
      </div>

      {/* Info */}
      <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl border-white/10 p-6">
        <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
          <ArrowLeftRight className="w-5 h-5 text-pink-400" />
          Cách chơi
        </h3>
        <ol className="space-y-2 text-sm text-purple-200 list-decimal list-inside">
          <li>Người chơi 1 tạo phòng — đóng vai <strong className="text-pink-300">Dad</strong></li>
          <li>Chia sẻ mã 6 ký tự cho người chơi 2</li>
          <li>Người chơi 2 nhập mã để tham gia — đóng vai <strong className="text-purple-300">Child</strong></li>
          <li>Có thể đổi vai trò (Swap) trước khi game bắt đầu</li>
          <li>Nhấn Ready khi cả hai đã sẵn sàng để bắt đầu</li>
        </ol>
      </Card>
    </div>
  )
}
