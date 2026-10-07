import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { Gamepad2, BookOpen, ScrollText, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { charactersApi, chaptersApi, questsApi } from '@/api'

export default function ModDashboard() {
  const [stats, setStats] = useState({
    totalCharacters: 0,
    totalChapters: 0,
    totalQuests: 0,
  })

  useEffect(() => {
    const loadStats = async () => {
      try {
        const characters = await charactersApi.getAll()
        const chapters = await chaptersApi.getAll()
        let totalQuests = 0
        for (const ch of chapters) {
          const quests = await questsApi.getByChapter(ch.id)
          totalQuests += quests.length
        }
        setStats({
          totalCharacters: characters.length,
          totalChapters: chapters.length,
          totalQuests,
        })
      } catch (error) {
        console.error('Failed to load stats:', error)
      }
    }
    loadStats()
  }, [])

  const statCards = [
    { label: 'Nhân vật', value: stats.totalCharacters, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Chapters', value: stats.totalChapters, icon: BookOpen, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Quests', value: stats.totalQuests, icon: ScrollText, color: 'text-purple-600', bg: 'bg-purple-100' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Moderator Dashboard</h1>
        <p className="text-slate-500 mt-1 text-sm">Quản lý nội dung game</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="p-6">
              <CardContent className="flex items-center gap-4 p-0">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <CardHeader className="p-0 mb-4 border-0">
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            <a
              href="/moderator/characters"
              className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Gamepad2 className="w-5 h-5 text-indigo-600" />
              <span className="text-sm font-medium text-slate-900">Quản lý Character Stats</span>
            </a>
            <a
              href="/moderator/chapters"
              className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span className="text-sm font-medium text-slate-900">Quản lý Chapters</span>
            </a>
            <a
              href="/moderator/quests"
              className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ScrollText className="w-5 h-5 text-indigo-600" />
              <span className="text-sm font-medium text-slate-900">Quản lý Quests</span>
            </a>
          </div>
        </Card>

        <Card className="p-6">
          <CardHeader className="p-0 mb-4 border-0">
            <CardTitle>Thống kê</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">Tổng nội dung</span>
                <span className="font-medium">{stats.totalCharacters + stats.totalChapters + stats.totalQuests}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '70%' }} />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
