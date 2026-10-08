import { useEffect, useState } from 'react'
import { charactersApi } from '@/api'
import { Gamepad2, Users } from 'lucide-react'
import type { Character } from '@/types'


export default function CharacterStats() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    charactersApi
      .getAll()
      .then(setCharacters)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Character Stats
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Quản lý nhân vật trong game (Unity đọc từ API này lúc runtime)
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold">
          <Users className="w-4 h-4 text-yellow-400" />
          <span>Tổng: {characters.length} nhân vật</span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400 text-sm font-medium animate-pulse">
          Đang tải dữ liệu nhân vật...
        </div>
      ) : characters.length === 0 ? (
        <div className="p-12 text-center bg-[#0c1019] border border-white/10 rounded-2xl">
          <Gamepad2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Chưa có nhân vật nào trong hệ thống</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {characters.map((c) => (
            <div
              key={c.id}
              className="p-6 bg-[#0c1019] border border-white/10 hover:border-yellow-400/30 rounded-2xl transition-all duration-300 space-y-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-amber-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 font-bold text-lg">
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{c.name}</h3>
                  <span
                    className={`inline-block mt-1 text-[11px] px-2.5 py-0.5 rounded-full font-bold tracking-wide ${
                      c.role === 'Dad'
                        ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {c.role}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                <span>Trạng thái</span>
                <span
                  className={`inline-flex items-center gap-1.5 font-semibold ${
                    c.isActive ? 'text-emerald-400' : 'text-slate-500'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      c.isActive ? 'bg-emerald-400' : 'bg-slate-500'
                    }`}
                  />
                  {c.isActive ? 'Hoạt động' : 'Tạm khóa'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

