import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, BookOpen, ScrollText, ArrowRight, Search } from 'lucide-react'
import { charactersApi, chaptersApi, questsApi } from '@/api'

export default function ModDashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState({
    totalCharacters: 0,
    totalChapters: 0,
    totalQuests: 0,
  })

  useEffect(() => {
    const loadStats = async () => {
      try {
        const characters = await charactersApi.getAll().catch(() => [])
        const chapters = await chaptersApi.getAll().catch(() => [])
        let totalQuests = 0
        for (const ch of chapters) {
          const quests = await questsApi.getByChapter(ch.id).catch(() => [])
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

  const categories = [
    {
      index: '/01',
      title: 'Character Stats',
      subtitle: 'Chỉ số và thuộc tính nhân vật',
      actionText: 'Quản lý nhân vật',
      link: '/moderator/characters',
      icon: Users,
      highlight: false,
    },
    {
      index: '/02',
      title: 'Chapters',
      subtitle: 'Các chương trong hành trình',
      actionText: 'Quản lý chapters',
      link: '/moderator/chapters',
      icon: BookOpen,
      highlight: true,
    },
    {
      index: '/03',
      title: 'Quests',
      subtitle: 'Nhiệm vụ và mục tiêu khám phá',
      actionText: 'Quản lý quests',
      link: '/moderator/quests',
      icon: ScrollText,
      highlight: false,
    },
  ]

  const filteredCategories = categories.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Workspace Header Section */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase font-mono">
          WORKSPACE / OVERVIEW
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Tổng quan game
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Quản lý nội dung. Chăm chút từng hành trình.
            </p>
          </div>

          {/* Search Bar Input */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Tìm kiếm nội dung..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0d101a] border border-white/10 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400/40 transition-colors"
            />
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-600" />
          </div>
        </div>
      </div>

      {/* 3 Top Summary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Character Stats */}
        <Link
          to="/moderator/characters"
          className="group relative p-5 bg-[#0b0e17] hover:bg-[#0e121e] border border-white/10 hover:border-white/20 rounded-2xl transition-all duration-300 flex items-center justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold">
              <Users className="w-3.5 h-3.5 text-slate-400 group-hover:text-yellow-400 transition-colors" />
              <span>Nhân vật</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-white font-sans tracking-tight">
                {stats.totalCharacters}
              </span>
              <span className="text-[11px] text-slate-500 font-normal">nội dung</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
        </Link>

        {/* Card 2: Chapters */}
        <Link
          to="/moderator/chapters"
          className="group relative p-5 bg-[#0b0e17] hover:bg-[#0e121e] border border-white/10 hover:border-white/20 rounded-2xl transition-all duration-300 flex items-center justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5 text-slate-400 group-hover:text-yellow-400 transition-colors" />
              <span>Chapters</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-white font-sans tracking-tight">
                {stats.totalChapters}
              </span>
              <span className="text-[11px] text-slate-500 font-normal">nội dung</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
        </Link>

        {/* Card 3: Quests */}
        <Link
          to="/moderator/quests"
          className="group relative p-5 bg-[#0b0e17] hover:bg-[#0e121e] border border-white/10 hover:border-white/20 rounded-2xl transition-all duration-300 flex items-center justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold">
              <ScrollText className="w-3.5 h-3.5 text-slate-400 group-hover:text-yellow-400 transition-colors" />
              <span>Quests</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-white font-sans tracking-tight">
                {stats.totalQuests}
              </span>
              <span className="text-[11px] text-slate-500 font-normal">nội dung</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      {/* Bottom Category Grid Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white tracking-tight">Quản lý nội dung</h3>
          <span className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase font-mono">
            03 DANH MỤC
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredCategories.map((cat) => {
            const Icon = cat.icon
            return (
              <div
                key={cat.index}
                className="group relative bg-[#0b0e17] border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:border-white/20 transition-all duration-300 min-h-[190px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-colors ${
                        cat.highlight
                          ? 'bg-yellow-400/10 border-yellow-400/30 text-yellow-400'
                          : 'bg-white/5 border-white/10 text-slate-300 group-hover:text-yellow-400 group-hover:border-yellow-400/30'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-mono font-medium text-slate-500">
                      {cat.index}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white tracking-tight">{cat.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{cat.subtitle}</p>
                </div>

                <div className="pt-5">
                  <Link
                    to={cat.link}
                    className={`inline-flex items-center gap-1.5 text-xs font-bold transition-all ${
                      cat.highlight
                        ? 'text-yellow-400 hover:text-yellow-300'
                        : 'text-slate-400 hover:text-white group-hover:text-yellow-400'
                    }`}
                  >
                    <span>{cat.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}


