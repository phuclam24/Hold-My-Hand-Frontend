import { useEffect, useState } from 'react'
import { chaptersApi } from '@/api'
import { Card } from '@/components/ui'
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
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Chapters</h1>
        <p className="text-slate-500 mt-1 text-sm">Danh sách các chapter trong game</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Đang tải...</div>
      ) : chapters.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">Chưa có chapter nào</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {chapters
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((chapter) => (
              <Card key={chapter.id} className="p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {chapter.orderIndex}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{chapter.name}</h3>
                    <p className="text-sm text-slate-500 mt-0.5">{chapter.description}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium">
                        {chapter.theme}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      )}
    </div>
  )
}
