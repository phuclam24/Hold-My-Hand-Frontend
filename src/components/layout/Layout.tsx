import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores'
import {
  LayoutGrid,
  Users,
  Gamepad2,
  FileText,
  LogOut,
} from 'lucide-react'
import { cn } from '@/utils'

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const navItems = [
    { path: '/admin', label: 'Tổng quan', icon: LayoutGrid },
    { path: '/admin/accounts', label: 'Người chơi', icon: Users },
    { path: '/admin/rooms', label: 'Phòng co-op', icon: Gamepad2 },
    { path: '/admin/audit-logs', label: 'Nhật ký hệ thống', icon: FileText },
  ]

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Banner Hero Header */}
      <header
        className="relative bg-cover bg-center border-b border-slate-800/80 shadow-2xl"
        style={{ backgroundImage: `url('/banner_cosmic.jpg')` }}
      >
        {/* Dark overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/90 to-[#0a0d14] backdrop-blur-[2px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4 flex flex-col justify-between min-h-[220px]">
          {/* Top Sub-bar */}
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
            <Link to="/portal" className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors">
              <img src="/logo.jpg" alt="Logo" className="w-6 h-6 rounded object-cover border border-white/20" />
              <span>Về trang Portal</span>
            </Link>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full font-medium shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Giao diện xem trước</span>
              </div>
              <span className="hidden sm:inline font-bold tracking-wider text-slate-400 uppercase text-[11px]">
                HOLD MY HAND - CO-OP PORTAL
              </span>
              <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                <span className="text-slate-300 font-medium hidden md:inline">
                  {user?.displayName || user?.username}
                </span>
                <button
                  onClick={handleLogout}
                  title="Đăng xuất"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Hero Main Content */}
          <div className="py-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
              Phía sau mỗi cuộc phiêu lưu.
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-2 font-medium max-w-2xl leading-relaxed">
              Quản lý cộng đồng. Kết nối người chơi. Giữ nhịp cuộc hành trình.
            </p>
          </div>

          {/* Bottom Nav Tabs Bar */}
          <nav className="flex items-center gap-2 border-t border-slate-800/80 pt-2 -mb-4 overflow-x-auto scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive =
                item.path === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(item.path)

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap border-b-2',
                    isActive
                      ? 'text-amber-400 border-amber-400 bg-amber-400/10 font-semibold rounded-t-lg'
                      : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/40 rounded-t-lg'
                  )}
                >
                  <Icon className={cn('w-4 h-4', isActive ? 'text-amber-400' : 'text-slate-400')} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}

