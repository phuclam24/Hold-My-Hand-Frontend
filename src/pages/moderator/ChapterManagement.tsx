import { useEffect, useState } from 'react'
import { chaptersApi } from '@/api'
import { BookOpen } from 'lucide-react'
import type { Chapter } from '@/types'

export default function ChapterManagement() {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    chaptersApi
      .getAll()
      .then(setChapters)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Chapters</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Danh sách các chapter trong game</p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold">
          <BookOpen className="w-4 h-4 text-yellow-400" />
          <span>Tổng: {chapters.length} chương</span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400 text-sm font-medium animate-pulse">
          Đang tải dữ liệu chapter...
        </div>
      ) : chapters.length === 0 ? (
        <div className="p-12 text-center bg-[#0c1019] border border-white/10 rounded-2xl">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Chưa có chapter nào</p>
        </div>
      ) : (
        <div className="space-y-4">
          {chapters
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((chapter) => (
              <div
                key={chapter.id}
                className="p-6 bg-[#0c1019] border border-white/10 hover:border-yellow-400/30 rounded-2xl transition-all duration-300 flex items-start sm:items-center gap-5"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-amber-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 font-extrabold text-xl flex-shrink-0 font-mono">
                  {chapter.orderIndex}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-white tracking-tight">{chapter.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{chapter.description}</p>
                  <div className="flex gap-2 mt-3">
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 font-semibold tracking-wide">
                      Theme: {chapter.theme}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

