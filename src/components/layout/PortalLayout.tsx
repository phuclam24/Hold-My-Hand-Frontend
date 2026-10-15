import { useState } from 'react'
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
  Bell,
} from 'lucide-react'
import SnapBar from './SnapBar'

export default function PortalLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const menuItems = [
    { path: '/portal', label: 'Trang chủ', icon: Home, exact: true },
    { path: '/portal/profile', label: 'Hồ sơ', icon: User },
    { path: '/portal/history', label: 'Lịch sử chơi', icon: History },
    { path: '/portal/lobby', label: 'Sảnh chờ', icon: Gamepad2 },
  ]

  const brand = (
    <Link to="/portal" className="flex items-center gap-2.5 min-w-0">
      <img
        src="/logo.jpg"
        alt="Hold My Hand"
        className="w-9 h-9 object-cover rounded-lg shadow-md flex-shrink-0"
      />
      {!sidebarCollapsed && (
        <span className="font-bold text-lg text-white truncate">
          Hold My Hand
        </span>
      )}
    </Link>
  )

  const userCard = (
    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
        {(user?.displayName || user?.username || 'U').charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">
          {user?.displayName || user?.username}
        </p>
        <p className="text-xs text-purple-200 truncate">{user?.email}</p>
      </div>
    </div>
  )

  const compactUser = (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
      {(user?.displayName || user?.username || 'U').charAt(0).toUpperCase()}
    </div>
  )

  const footer = (
    <button
      onClick={handleLogout}
      title={sidebarCollapsed ? 'Đăng xuất' : undefined}
      className={`flex items-center rounded-lg text-sm text-purple-200 hover:bg-white/5 hover:text-white transition-colors ${
        sidebarCollapsed ? 'justify-center h-10 w-full' : 'gap-2 w-full px-3 py-2'
      }`}
    >
      <LogOut className="w-4 h-4 flex-shrink-0" />
      {!sidebarCollapsed && <span>Đăng xuất</span>}
    </button>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar (SnapBar) */}
      <div className="hidden lg:block relative z-30">
        <SnapBar
          theme="portal"
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
          brand={brand}
          userCard={userCard}
          userCardCompact={compactUser}
          items={menuItems}
          footer={footer}
        />
      </div>

      {/* Mobile Sidebar (drawer) */}
      <aside
        className={`fixed lg:hidden inset-y-0 left-0 z-50 w-72 bg-white/5 backdrop-blur-2xl border-r border-white/10 transform transition-transform flex flex-col h-screen ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/10 flex-shrink-0">
          {brand}
          <button
            className="text-white/60 hover:text-white"
            onClick={() => setMobileOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-4 py-5 border-b border-white/10">{userCard}</div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/portal' &&
                location.pathname.startsWith(item.path))
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-500/20 to-purple-600/20 text-white border border-pink-500/30'
                    : 'text-purple-200 hover:bg-white/5 hover:text-white'
                }`}
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
        <header className="sticky top-0 h-16 bg-white/5 backdrop-blur-xl border-b border-white/10 px-6 flex items-center justify-between flex-shrink-0 z-30">
          <button
            className="lg:hidden text-white/80"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-white">
            {menuItems.find((m) => m.path === location.pathname)?.label ||
              'Portal'}
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