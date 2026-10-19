import { Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores'
import {
  Home,
  User,
  History,
  Gamepad2,
  Mountain,
} from 'lucide-react'
import { useState } from 'react'
import Sidebar from './Sidebar'
import CosmicBackground from './CosmicBackground'
import PageShell from './PageShell'

export default function PortalLayout() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
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

  return (
    <div className="relative flex min-h-screen text-slate-100 font-sans">
      <CosmicBackground />

      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-amber-500/15 bg-[#0a0805]/80 px-4 backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-2">
          <Mountain className="h-5 w-5 text-amber-300" />
          <span className="text-xs font-extrabold tracking-wide text-white">
            HOLD MY HAND
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-200"
        >
          {mobileOpen ? 'Đóng' : 'Menu'}
        </button>
      </header>

      <div className="relative z-10 flex w-full min-h-screen">
        {mobileOpen && (
          <button
            type="button"
            aria-label="Đóng menu"
            className="fixed inset-0 z-30 bg-black/70 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        <div
          className={`fixed inset-y-0 left-0 z-40 transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Sidebar
            brand={{ title: 'Hold My Hand', subtitle: 'Co-op Portal' }}
            brandIcon={Mountain}
            navItems={menuItems}
            user={user}
            onLogout={handleLogout}
            onNavigate={() => setMobileOpen(false)}
            bottomNote="Một người bạn. Một hành trình. Cùng nhau đi xa hơn."
          />
        </div>

        <main className="relative min-w-0 flex-1 overflow-hidden">
          <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-8 lg:px-10 py-8 sm:py-10">
            <PageShell>
              <Outlet />
            </PageShell>
          </div>
        </main>
      </div>
    </div>
  )
}
