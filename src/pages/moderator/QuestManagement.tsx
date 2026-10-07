import { useEffect, useState } from 'react'
import { chaptersApi, questsApi } from '@/api'
import { Card } from '@/components/ui'
import { ScrollText } from 'lucide-react'
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
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Quests</h1>
        <p className="text-slate-500 mt-1 text-sm">Danh sách quest trong game</p>
      </div>

      <Card className="p-5">
        <label className="block text-sm font-medium text-slate-700 mb-2">Chapter</label>
        <select
          value={selectedChapter}
          onChange={(e) => setSelectedChapter(e.target.value)}
          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {chapters.map((ch) => (
            <option key={ch.id} value={ch.id}>
              {ch.name}
            </option>
          ))}
        </select>
      </Card>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Đang tải...</div>
      ) : quests.length === 0 ? (
        <Card className="p-12 text-center">
          <ScrollText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">Chưa có quest nào trong chapter này</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {quests
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((quest) => (
              <Card key={quest.id} className="p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {quest.orderIndex}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900">{quest.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">{quest.description}</p>
                    <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-medium">
                      {quest.questType}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      )}
    </div>
  )
}
