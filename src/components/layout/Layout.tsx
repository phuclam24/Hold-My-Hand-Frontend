import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores'
import {
  LayoutDashboard,
  Users,
  FileText,
  Shield,
  Gamepad2,
  BookOpen,
  ScrollText,
  LogOut,
  Menu,
  X,
  Activity,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/utils'

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const adminMenuItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/accounts', label: 'Quản lý User', icon: Users },
    { path: '/admin/rooms', label: 'Active Rooms', icon: Activity },
    { path: '/admin/audit-logs', label: 'System Logs', icon: FileText },
  ]

  const moderatorMenuItems = [
    { path: '/moderator', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/moderator/characters', label: 'Character Stats', icon: Gamepad2 },
    { path: '/moderator/chapters', label: 'Chapters', icon: BookOpen },
    { path: '/moderator/quests', label: 'Quests', icon: ScrollText },
  ]

  const menuItems = user?.role === 'Admin' ? adminMenuItems : moderatorMenuItems

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - white theme */}
      <aside
        className={cn(
          'fixed lg:sticky lg:top-0 inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform lg:transform-none flex flex-col h-screen',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200 flex-shrink-0">
          <Link to={user?.role === 'Admin' ? '/admin' : '/moderator'} className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900">Hold My Hand</span>
          </Link>
          <button
            className="lg:hidden text-slate-500 hover:text-slate-700"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {user?.role === 'Admin' ? 'Admin Panel' : 'Moderator Panel'}
          </p>
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User info */}
        <div className="px-3 py-4 border-t border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-3 px-3 py-2.5 bg-slate-50 rounded-lg">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
              {user?.displayName?.charAt(0).toUpperCase() ||
                user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {user?.displayName || user?.username}
              </p>
              <p className="text-xs text-slate-500">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full mt-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-red-600 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-slate-400 hover:text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative hidden md:block">
              <input
                type="search"
                placeholder="Tìm kiếm..."
                className="w-72 pl-4 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-white">{user?.displayName || user?.username}</p>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.displayName?.charAt(0).toUpperCase() ||
                user?.username?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
