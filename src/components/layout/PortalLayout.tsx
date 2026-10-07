import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores'
import {
  Home,
  User,
  History,
  Gamepad2,
  LogOut,
  Menu,
  X,
  Heart,
  Bell,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/utils'

export default function PortalLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const menuItems = [
    { path: '/portal', label: 'Trang chủ', icon: Home },
    { path: '/portal/profile', label: 'Hồ sơ', icon: User },
    { path: '/portal/history', label: 'Lịch sử chơi', icon: History },
    { path: '/portal/lobby', label: 'Sảnh chờ', icon: Gamepad2 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky lg:top-0 inset-y-0 left-0 z-50 w-72 bg-white/5 backdrop-blur-2xl border-r border-white/10 transform transition-transform lg:transform-none flex flex-col h-screen',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/10 flex-shrink-0">
          <Link to="/portal" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/40">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white">Hold My Hand</span>
          </Link>
          <button
            className="lg:hidden text-white/60 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Player card */}
        <div className="px-4 py-5 border-b border-white/10">
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {(user?.displayName || user?.username || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user?.displayName || user?.username}
              </p>
              <p className="text-xs text-purple-200 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/portal' && location.pathname.startsWith(item.path))
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
                  isActive
                    ? 'bg-gradient-to-r from-pink-500/20 to-purple-600/20 text-white border border-pink-500/30'
                    : 'text-purple-200 hover:bg-white/5 hover:text-white'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="px-3 py-4 border-t border-white/10 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-purple-200 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <header className="sticky top-0 z-30 h-16 bg-white/5 backdrop-blur-xl border-b border-white/10 px-6 flex items-center justify-between flex-shrink-0">
          <button
            className="lg:hidden text-white/80"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-white">
            {menuItems.find((m) => m.path === location.pathname)?.label || 'Portal'}
          </h1>
          <button className="relative w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/80 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
        </header>

        <main className="flex-1 p-6 overflow-auto relative">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
