import { useEffect, useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores'
import {
  LayoutGrid,
  Users,
  BookOpen,
  ScrollText,
  Shield,
  ArrowDown,
  LogOut,
  Home,
} from 'lucide-react'
import { charactersApi, chaptersApi, questsApi } from '@/api'

export default function ModeratorLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const [stats, setStats] = useState({
    characters: 0,
    chapters: 0,
    quests: 0,
  })

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [chars, chaps] = await Promise.all([
          charactersApi.getAll().catch(() => []),
          chaptersApi.getAll().catch(() => []),
        ])
        let qCount = 0
        for (const ch of chaps) {
          const qList = await questsApi.getByChapter(ch.id).catch(() => [])
          qCount += qList.length
        }
        setStats({
          characters: chars.length,
          chapters: chaps.length,
          quests: qCount,
        })
      } catch (e) {
        console.error(e)
      }
    }
    loadStats()
  }, [location.pathname])

  const navItems = [
    { path: '/moderator', label: 'Tổng quan', icon: LayoutGrid, count: null, exact: true },
    { path: '/moderator/characters', label: 'Character Stats', icon: Users, count: stats.characters },
    { path: '/moderator/chapters', label: 'Chapters', icon: BookOpen, count: stats.chapters },
    { path: '/moderator/quests', label: 'Quests', icon: ScrollText, count: stats.quests },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#06080d] text-slate-100 font-sans selection:bg-yellow-400 selection:text-slate-950 flex flex-col overflow-x-hidden">
      {/* Top Floating Mini Navbar */}
      <header className="sticky top-0 z-50 bg-[#06080d]/80 backdrop-blur-md border-b border-white/5">
        <div className="w-full px-6 md:px-12 lg:px-16 h-16 flex items-center justify-between">
          <Link to="/moderator" className="flex items-center gap-3 group">
            <img
              src="/logo.jpg"
              alt="Hold My Hand Logo"
              className="w-8 h-8 object-contain rounded-lg shadow-md group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-tight text-white leading-none">
                HOLD MY HAND
              </span>
              <span className="text-[8px] tracking-widest text-slate-400 font-bold uppercase mt-0.5">
                MODERATOR PORTAL
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-slate-300 hover:text-white transition-all"
            >
              <Home className="w-3.5 h-3.5" />
              Trang chủ
            </Link>
            {user && (
              <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                <div className="w-7 h-7 rounded-lg bg-yellow-400 flex items-center justify-center font-extrabold text-slate-950 text-xs">
                  {(user.displayName || user.username).charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-bold text-slate-300 hidden sm:inline-block">
                  {user.displayName || user.username}
                </span>
                <button
                  onClick={handleLogout}
                  title="Đăng xuất"
                  className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Header Section matching exact screenshot */}
      <section className="relative pt-12 pb-16 md:pt-16 md:pb-20 border-b border-white/10 overflow-hidden">
        {/* Mountain Night Background Artwork */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 scale-105"
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2000&auto=format&fit=crop)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06080d] via-[#06080d]/60 to-[#06080d]/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#06080d]/95 via-transparent to-[#06080d]/95" />
        </div>

        <div className="relative z-10 w-full px-6 md:px-12 lg:px-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            {/* Tagline Line & Label */}
            <div className="inline-flex items-center gap-2.5">
              <span className="h-[2px] w-6 bg-yellow-400 rounded-full" />
              <span className="text-[11px] font-bold tracking-[0.2em] text-slate-200 uppercase">
                KHÔNG GIAN ĐIỀU HÀNH GAME
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
              Giữ nhịp hành trình.
              <br />
              Kết nối thế giới.
            </h1>

            {/* Subtitle */}
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-normal max-w-md">
              Mỗi nhân vật, mỗi chương, mỗi nhiệm vụ.
              <br />
              Cùng tạo nên thế giới của Hold My Hand.
            </p>

            {/* Left Moderator Access Badge */}
            <div className="pt-1">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-[11px] font-bold uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5" />
                MODERATOR ACCESS
              </span>
            </div>
          </div>

          {/* Right Subtitle Arrow */}
          <div className="self-end text-right hidden md:block">
            <span className="text-[10px] font-bold tracking-[0.25em] text-slate-400 uppercase inline-flex items-center gap-2">
              THE WORLD, IN YOUR HANDS <ArrowDown className="w-3.5 h-3.5 text-slate-300" />
            </span>
          </div>
        </div>
      </section>

      {/* Sub-Navigation Tabs Bar matching exact screenshot */}
      <div className="sticky top-16 z-40 bg-[#090c14]/95 backdrop-blur-xl border-b border-white/10">
        <div className="w-full px-6 md:px-12 lg:px-16 flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-4 md:gap-8 py-3">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = item.exact
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path)

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center gap-2 text-xs font-bold transition-all py-2 px-1 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'text-yellow-400'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-yellow-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.count !== null && (
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                      {item.count}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-[-13px] left-0 right-0 h-[2px] bg-yellow-400" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Right Status Indicator */}
          <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            <span>QUYỀN MODERATOR</span>
          </div>
        </div>
      </div>

      {/* Main Workspace Area */}
      <main className="flex-1 w-full bg-[#06080d] py-10">
        <div className="w-full px-6 md:px-12 lg:px-16">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

