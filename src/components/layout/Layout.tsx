import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores'
import {
  LayoutGrid,
  Users,
  Gamepad2,
  FileText,
  LogOut,
  Menu,
  X,
  Shield,
} from 'lucide-react'
import SnapBar from './SnapBar'

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const navItems = [
    { path: '/admin', label: 'Tổng quan', icon: LayoutGrid, exact: true },
    { path: '/admin/accounts', label: 'Người chơi', icon: Users },
    { path: '/admin/rooms', label: 'Phòng co-op', icon: Gamepad2 },
    { path: '/admin/audit-logs', label: 'Nhật ký', icon: FileText },
  ]

  const brand = (
    <Link to="/admin" className="flex items-center gap-2.5 min-w-0">
      <img
        src="/logo.jpg"
        alt="Hold My Hand"
        className="w-9 h-9 object-cover rounded-lg shadow-md flex-shrink-0"
      />
      {!sidebarCollapsed && (
        <span className="font-bold text-base text-white truncate">
          HOLD MY HAND
        </span>
      )}
    </Link>
  )

  const userCard = user ? (
    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0">
        {(user.displayName || user.username).charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">
          {user.displayName || user.username}
        </p>
        <p className="text-[10px] uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1">
          <Shield className="w-2.5 h-2.5" />
          Admin Access
        </p>
      </div>
    </div>
  ) : null

  const compactUser = user ? (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold shadow-lg">
      {(user.displayName || user.username).charAt(0).toUpperCase()}
    </div>
  ) : null

  const footer = (
    <button
      onClick={handleLogout}
      title={sidebarCollapsed ? 'Đăng xuất' : undefined}
      className={`flex items-center rounded-lg text-sm text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors w-full ${
        sidebarCollapsed ? 'justify-center h-10' : 'gap-2 px-3 py-2'
      }`}
    >
      <LogOut className="w-4 h-4 flex-shrink-0" />
      {!sidebarCollapsed && <span>Đăng xuất</span>}
    </button>
  )

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 flex font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Desktop Sidebar (SnapBar) */}
      <div className="hidden lg:block relative z-30 flex-shrink-0">
        <SnapBar
          theme="admin"
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
          brand={brand}
          userCard={userCard}
          userCardCompact={compactUser}
          items={navItems}
          footer={footer}
        />
      </div>

      {/* Mobile Sidebar (drawer) */}
      <aside
        className={`fixed lg:hidden inset-y-0 left-0 z-50 w-72 bg-[#0a0d14] border-r border-slate-800/80 transform transition-transform flex flex-col h-screen ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800 flex-shrink-0">
          {brand}
          <button
            className="text-slate-400 hover:text-white"
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
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="p-3 border-t border-white/10">{footer}</div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Top Banner Hero Header */}
        <header
          className="relative bg-cover bg-center border-b border-slate-800/80 shadow-2xl flex-shrink-0"
          style={{ backgroundImage: `url('/banner_cosmic.jpg')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/90 to-[#0a0d14] backdrop-blur-[2px]" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4 flex flex-col justify-between min-h-[180px]">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <button
                className="lg:hidden text-white/80"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
              <Link
                to="/portal"
                className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                <img
                  src="/logo.jpg"
                  alt="Logo"
                  className="w-6 h-6 rounded object-cover border border-white/20"
                />
                <span>Về trang Portal</span>
              </Link>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full font-medium shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="hidden sm:inline">Giao diện xem trước</span>
                </div>
                <span className="hidden md:inline font-bold tracking-wider text-slate-400 uppercase text-[11px]">
                  ADMIN PORTAL
                </span>
              </div>
            </div>

            <div className="py-4">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                Phía sau mỗi cuộc phiêu lưu.
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 font-medium max-w-2xl leading-relaxed">
                Quản lý cộng đồng. Kết nối người chơi. Giữ nhịp cuộc hành trình.
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}