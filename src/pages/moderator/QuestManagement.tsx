import { useEffect, useState } from 'react'
import { chaptersApi, questsApi } from '@/api'
import { ScrollText, Layers } from 'lucide-react'
import type { Chapter, Quest } from '@/types'

export default function QuestManagement() {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [quests, setQuests] = useState<Quest[]>([])
  const [selectedChapter, setSelectedChapter] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    chaptersApi.getAll().then((data) => {
      setChapters(data)
      if (data.length > 0) {
        setSelectedChapter(data[0].id)
      }
    })
  }, [])

  useEffect(() => {
    if (!selectedChapter) return
    setLoading(true)
    questsApi
      .getByChapter(selectedChapter)
      .then(setQuests)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [selectedChapter])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Quests</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Danh sách quest trong game</p>
        </div>

        {/* Chapter Selector */}
        <div className="flex items-center gap-3 bg-[#0c1019] border border-white/10 rounded-xl px-3.5 py-2">
          <Layers className="w-4 h-4 text-yellow-400" />
          <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">Chapter:</span>
          <select
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(e.target.value)}
            className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
          >
            {chapters.map((ch) => (
              <option key={ch.id} value={ch.id} className="bg-[#0c1019] text-white">
                {ch.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400 text-sm font-medium animate-pulse">
          Đang tải quest...
        </div>
      ) : quests.length === 0 ? (
        <div className="p-12 text-center bg-[#0c1019] border border-white/10 rounded-2xl">
          <ScrollText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Chưa có quest nào trong chapter này</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quests
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((quest) => (
              <div
                key={quest.id}
                className="p-6 bg-[#0c1019] border border-white/10 hover:border-yellow-400/30 rounded-2xl transition-all duration-300 flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400 font-mono text-sm font-extrabold flex-shrink-0">
                  #{quest.orderIndex}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white text-base">{quest.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{quest.description}</p>
                  <div className="mt-3">
                    <span className="inline-block text-[11px] px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300 font-semibold">
                      Loại: {quest.questType}
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

