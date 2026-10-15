import { useEffect, useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores'
import {
  LayoutGrid,
  Users,
  BookOpen,
  ScrollText,
  LogOut,
  Home,
  Menu,
  X,
} from 'lucide-react'
import { charactersApi, chaptersApi, questsApi } from '@/api'
import SnapBar from './SnapBar'

export default function ModeratorLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

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
    { path: '/moderator', label: 'Tổng quan', icon: LayoutGrid, exact: true },
    {
      path: '/moderator/characters',
      label: 'Characters',
      icon: Users,
      badge: stats.characters,
    },
    {
      path: '/moderator/chapters',
      label: 'Chapters',
      icon: BookOpen,
      badge: stats.chapters,
    },
    {
      path: '/moderator/quests',
      label: 'Quests',
      icon: ScrollText,
      badge: stats.quests,
    },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const brand = (
    <Link to="/moderator" className="flex items-center gap-3 min-w-0">
      <img
        src="/logo.jpg"
        alt="Hold My Hand Logo"
        className="w-9 h-9 object-contain rounded-lg shadow-md flex-shrink-0"
      />
      {!sidebarCollapsed && (
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-black tracking-tight text-white leading-none truncate">
            HOLD MY HAND
          </span>
          <span className="text-[8px] tracking-widest text-slate-400 font-bold uppercase mt-0.5 truncate">
            MODERATOR PORTAL
          </span>
        </div>
      )}
    </Link>
  )

  const userCard = user ? (
    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
      <div className="w-10 h-10 rounded-lg bg-yellow-400 flex items-center justify-center font-extrabold text-slate-950 text-sm flex-shrink-0">
        {(user.displayName || user.username).charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">
          {user.displayName || user.username}
        </p>
        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
          Quyền Moderator
        </p>
      </div>
    </div>
  ) : null

  const compactUser = user ? (
    <div className="w-10 h-10 rounded-lg bg-yellow-400 flex items-center justify-center font-extrabold text-slate-950 text-sm">
      {(user.displayName || user.username).charAt(0).toUpperCase()}
    </div>
  ) : null

  const footer = (
    <div className="space-y-2">
      <Link
        to="/"
        title={sidebarCollapsed ? 'Trang chủ' : undefined}
        className={`flex items-center rounded-lg text-xs font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all ${
          sidebarCollapsed
            ? 'justify-center h-10 w-full'
            : 'gap-1.5 px-3 py-2'
        }`}
      >
        <Home className="w-3.5 h-3.5 flex-shrink-0" />
        {!sidebarCollapsed && <span>Trang chủ</span>}
      </Link>
      <button
        onClick={handleLogout}
        title={sidebarCollapsed ? 'Đăng xuất' : undefined}
        className={`flex items-center rounded-lg text-sm text-slate-300 hover:bg-rose-500/10 hover:text-rose-400 transition-colors w-full ${
          sidebarCollapsed ? 'justify-center h-10' : 'gap-2 px-3 py-2'
        }`}
      >
        <LogOut className="w-4 h-4 flex-shrink-0" />
        {!sidebarCollapsed && <span>Đăng xuất</span>}
      </button>
    </div>
  )

  const extraHeader = (
    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
      <span>Quyền Moderator</span>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#06080d] text-slate-100 font-sans selection:bg-yellow-400 selection:text-slate-950 flex overflow-x-hidden">
      {/* Desktop Sidebar (SnapBar) */}
      <div className="hidden lg:block relative z-30 flex-shrink-0">
        <SnapBar
          theme="moderator"
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
          brand={brand}
          userCard={userCard}
          userCardCompact={compactUser}
          items={navItems}
          footer={footer}
          extraHeader={extraHeader}
        />
      </div>

      {/* Mobile Sidebar (drawer) */}
      <aside
        className={`fixed lg:hidden inset-y-0 left-0 z-50 w-72 bg-[#0b0e17] border-r border-white/10 transform transition-transform flex flex-col h-screen ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/10 flex-shrink-0">
          {brand}
          <button
            className="text-white/60 hover:text-white"
            onClick={() => setMobileOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-3 py-4 border-b border-white/10">{userCard}</div>
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname === item.path ||
                location.pathname.startsWith(item.path + '/')
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? 'bg-yellow-400/15 text-yellow-400 border border-yellow-400/30'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium flex-1">{item.label}</span>
                {item.badge !== undefined && item.badge !== null && (
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
        <div className="p-3 border-t border-white/10 space-y-2">{footer}</div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Floating Mini Navbar */}
        <header className="sticky top-0 z-20 bg-[#06080d]/80 backdrop-blur-md border-b border-white/5">
          <div className="w-full px-6 md:px-12 lg:px-16 h-16 flex items-center justify-between">
            <button
              className="lg:hidden text-white/80"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            {/* Hero Header Section matching exact screenshot */}
            <div className="hidden lg:flex items-center gap-4">
              <span className="h-[2px] w-6 bg-yellow-400 rounded-full" />
              <span className="text-[11px] font-bold tracking-[0.2em] text-slate-200 uppercase">
                Không gian điều hành game
              </span>
            </div>
            <div className="flex items-center gap-2 pl-2 border-l border-white/10">
              <div className="w-7 h-7 rounded-lg bg-yellow-400 flex items-center justify-center font-extrabold text-slate-950 text-xs">
                {(user?.displayName || user?.username || 'M').charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-bold text-slate-300 hidden sm:inline-block">
                {user?.displayName || user?.username}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 w-full bg-[#06080d] py-10">
          <div className="w-full px-6 md:px-12 lg:px-16">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}