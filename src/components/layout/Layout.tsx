import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores'
import { LayoutGrid, Users, Gamepad2, FileText, Mountain } from 'lucide-react'
import Sidebar from './Sidebar'
import CosmicBackground from './CosmicBackground'
import PageShell from './PageShell'

export default function Layout() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const navItems = [
    { path: '/admin', label: 'Tổng quan', icon: LayoutGrid, exact: true },
    { path: '/admin/accounts', label: 'Người chơi', icon: Users },
    { path: '/admin/rooms', label: 'Phòng co-op', icon: Gamepad2 },
    { path: '/admin/audit-logs', label: 'Nhật ký hệ thống', icon: FileText },
  ]

  return (
    <div className="relative flex min-h-screen text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <CosmicBackground />

      {/* Mobile top bar */}
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
            brand={{ title: 'Hold My Hand', subtitle: 'Admin Console' }}
            brandIcon={Mountain}
            navItems={navItems}
            user={user}
            onLogout={handleLogout}
            onNavigate={() => setMobileOpen(false)}
            bottomNote="Phía sau mỗi cuộc phiêu lưu — admin giữ nhịp hành trình."
          />
        </div>

        <main className="relative min-w-0 flex-1 overflow-hidden">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 py-8">
            <PageShell>
              <Outlet />
            </PageShell>
          </div>
        </main>
      </div>
    </div>
  )
}
