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
  Mountain,
} from 'lucide-react'
import { useState } from 'react'

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
    <div className="min-h-screen bg-[#070a0f] text-slate-100 lg:flex">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Đóng menu"
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[220px] shrink-0 flex-col border-r border-white/[0.08] bg-[#080b10] px-4 transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex min-h-[80px] items-center gap-3 border-b border-white/[0.08] px-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#1a2028] text-sm font-bold text-slate-100">
            {(user?.displayName || user?.username || 'P').charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-white">
              {user?.displayName || user?.username || 'Player'}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Người chơi đồng hành
            </p>
          </div>
          <button
            type="button"
            aria-label="Đóng menu"
            className="text-slate-500 hover:text-white lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6" aria-label="Điều hướng người chơi">
          <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
            Không gian của bạn
          </p>
          <div className="space-y-1">
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
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex min-h-10 items-center gap-3 border px-3 text-xs font-semibold transition-colors ${
                    isActive
                      ? 'border-white/10 bg-[#15191f] text-yellow-300'
                      : 'border-transparent text-slate-400 hover:bg-white/[0.04] hover:text-white'
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-yellow-300' : 'text-slate-500'}`} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <span className="h-1 w-1 rounded-full bg-yellow-300" />}
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="mt-auto border-t border-white/[0.08] pt-5">
          <div className="px-3 pb-5">
            <Mountain className="mb-4 h-5 w-5 text-slate-400" />
            <p className="text-[10px] leading-relaxed text-slate-500">Một người bạn.</p>
            <p className="text-[10px] leading-relaxed text-slate-500">Một hành trình.</p>
            <p className="mt-1 text-[10px] font-semibold text-slate-300">Cùng nhau đi xa hơn.</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex min-h-12 w-full items-center gap-3 border-t border-white/[0.08] px-3 text-xs font-medium text-slate-400 transition-colors hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </button>
        </div>
      </aside>

      <div className="relative min-h-screen min-w-0 flex-1 overflow-hidden bg-[#080b10]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: "url('/banner_cosmic.jpg')" }}
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#080b10]/35 via-[#080b10]/55 to-[#080b10]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#080b10]/50 via-transparent to-[#080b10]/35" />

        <header className="relative z-20 flex h-16 items-center justify-between border-b border-white/[0.08] bg-[#080b10]/70 px-5 backdrop-blur-md lg:hidden">
          <Link to="/portal" className="flex items-center gap-2.5" onClick={() => setSidebarOpen(false)}>
            <Mountain className="h-6 w-6 text-yellow-300" />
            <span className="text-xs font-bold tracking-wide text-white">HOLD MY HAND</span>
          </Link>
          <button
            type="button"
            aria-label="Mở menu"
            className="flex h-9 w-9 items-center justify-center border border-white/10 text-slate-300 hover:text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </button>
        </header>

        <main className="relative z-10 mx-auto min-h-screen w-full max-w-[1200px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
