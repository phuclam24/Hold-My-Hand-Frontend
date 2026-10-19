import { useState, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'

interface NavItem {
  path: string
  label: string
  icon: LucideIcon
  count?: number | null
  exact?: boolean
}

interface SidebarProps {
  brand?: any
  brandIcon?: LucideIcon
  navItems: NavItem[]
  user?: any
  onLogout?: () => void
  bottomNote?: string
  onNavigate?: () => void
  defaultCollapsed?: boolean
}

export default function Sidebar({
  brand,
  brandIcon: BrandIcon,
  navItems,
  user,
  onLogout,
  bottomNote,
  onNavigate,
  defaultCollapsed = false,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLElement | null>(null)
  const location = useLocation()

  const isActive = (item: NavItem): boolean =>
    item.exact
      ? location.pathname === item.path
      : location.pathname === item.path ||
        (item.path !== '/' && location.pathname.startsWith(item.path))

  const initials = (
    user?.displayName ||
    user?.username ||
    'P'
  )
    .charAt(0)
    .toUpperCase()

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * 4
    const y = ((e.clientX - rect.left) / rect.width - 0.5) * -4
    setTilt({ x, y })
  }
  const handleMouseLeave = () => setTilt({ x: 0, y: 0 })

  return (
    <aside
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.4s ease-out',
      }}
      className={`relative z-40 flex h-screen shrink-0 flex-col self-stretch border-r border-amber-500/15 bg-gradient-to-b from-[#0a0a0a] via-[#0d0a05] to-[#0a0a0a] transition-[width] duration-300 ease-out ${
        collapsed ? 'w-[76px]' : 'w-[260px]'
      }`}
    >
      {/* Cinematic backdrop layer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Animated golden hue pulse */}
        <div className="absolute -top-32 -left-24 w-72 h-72 rounded-full bg-amber-500/20 blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 -right-16 w-64 h-64 rounded-full bg-yellow-500/10 blur-3xl animate-pulse-slower" />
        {/* Radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.10),transparent_55%)]" />
        {/* Moving mist */}
        <div className="absolute -bottom-8 left-0 right-0 h-24 bg-amber-300/[0.04] blur-2xl animate-fog rounded-full" />
        <div className="absolute top-1/3 -left-12 h-20 w-48 bg-purple-500/[0.05] blur-2xl animate-fog rounded-full animation-delay-2000" />
        {/* Star accent sparkles */}
        <div className="absolute top-1/4 right-4 w-1 h-1 rounded-full bg-amber-300 animate-twinkle shadow-[0_0_6px_rgba(255,197,41,0.9)]" />
        <div
          className="absolute top-2/3 left-8 w-0.5 h-0.5 rounded-full bg-amber-200 animate-twinkle shadow-[0_0_4px_rgba(255,197,41,0.7)]"
          style={{ animationDelay: '1.4s' }}
        />
        <div
          className="absolute bottom-1/3 right-12 w-1 h-1 rounded-full bg-amber-400 animate-twinkle shadow-[0_0_5px_rgba(243,178,46,0.8)]"
          style={{ animationDelay: '2.8s' }}
        />
        {/* Animated gold border on the right edge */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-amber-400/40 to-transparent animate-pulse-slow" />
      </div>

      <div className="relative flex h-16 items-center gap-3 border-b border-amber-500/15 px-4">
        <div className="relative shrink-0 group">
          {BrandIcon ? (
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 ring-1 ring-amber-300/30 shadow-[0_0_24px_rgba(251,191,36,0.55)] animate-float">
                <BrandIcon className="h-5 w-5 text-amber-950" />
              </div>
              {/* Radar pulse behind brand icon */}
              <span className="absolute inset-0 rounded-xl border border-amber-400/40 animate-radar pointer-events-none" />
            </div>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 ring-1 ring-amber-300/30 shadow-[0_0_24px_rgba(251,191,36,0.55)] text-amber-950 font-extrabold text-sm">
              {(typeof brand === 'string' ? brand : brand?.title)
                ?.charAt(0)
                ?.toUpperCase() || 'H'}
            </div>
          )}
          <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0a0a0a] shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse" />
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-extrabold tracking-tight text-white">
              {brand?.title || 'Hold My Hand'}
            </p>
            <p className="mt-0.5 truncate text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300/90">
              {brand?.subtitle || 'Co-op Portal'}
            </p>
          </div>
        )}
        <button
          type="button"
          aria-label={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
          onClick={() => setCollapsed((v) => !v)}
          className="absolute -right-3 top-20 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-amber-500/30 bg-[#0d0a05] text-amber-300 shadow-[0_0_8px_rgba(243,178,46,0.4)] hover:bg-amber-500/20 hover:text-amber-200 transition-all hover:scale-110"
        >
          <svg
            className={`h-3 w-3 transition-transform duration-300 ${
              collapsed ? 'rotate-180' : ''
            }`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>

      <nav
        className="relative flex-1 overflow-y-auto px-3 py-5 scrollbar-none"
        aria-label="Điều hướng"
      >
        {!collapsed && (
          <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.25em] text-amber-300/60 flex items-center gap-2">
            <span className="h-px flex-1 bg-gradient-to-r from-amber-500/40 to-transparent" />
            Điều hướng
          </p>
        )}
        <div className="space-y-1">
          {navItems.map((item, idx) => {
            const Icon = item.icon
            const active = isActive(item)
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onNavigate}
                aria-current={active ? 'page' : undefined}
                title={collapsed ? item.label : undefined}
                style={{ animationDelay: `${idx * 60}ms` }}
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-300 animate-fadeIn ${
                  active
                    ? 'bg-gradient-to-r from-amber-500/25 via-yellow-500/15 to-transparent text-white ring-1 ring-amber-400/40 shadow-[0_0_24px_rgba(251,191,36,0.30)]'
                    : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                {active && (
                  <>
                    <span className="absolute -left-3 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-amber-300 to-yellow-200 shadow-[0_0_14px_rgba(251,191,36,1)]" />
                    <span className="absolute inset-0 rounded-xl ring-1 ring-amber-400/30 animate-pulse-slow pointer-events-none" />
                  </>
                )}

                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ${
                    active
                      ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-amber-950 shadow-[0_0_18px_rgba(251,191,36,0.8)]'
                      : 'bg-white/[0.04] text-slate-400 group-hover:bg-white/[0.08] group-hover:text-white group-hover:scale-110'
                  }`}
                >
                  {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
                </span>

                {!collapsed && (
                  <>
                    <span className="flex-1 truncate tracking-wide">
                      {item.label}
                    </span>
                    {item.count != null && (
                      <span
                        className={`font-mono text-[10px] px-1.5 py-0.5 rounded-md transition-colors ${
                          active
                            ? 'bg-amber-500/30 text-amber-100 shadow-[0_0_8px_rgba(243,178,46,0.5)]'
                            : 'bg-white/[0.06] text-slate-300 group-hover:bg-amber-500/10 group-hover:text-amber-200'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </>
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="relative mt-auto border-t border-amber-500/15 p-3">
        {!collapsed ? (
          <div className="group relative mb-2 overflow-hidden rounded-xl border border-amber-500/20 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-3 transition-all hover:border-amber-400/50 hover:shadow-[0_0_18px_rgba(243,178,46,0.18)]">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 text-sm font-extrabold text-amber-950 ring-2 ring-amber-300/30 shadow-[0_0_14px_rgba(251,191,36,0.5)]">
                  {initials}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0a0a0a] animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-white">
                  {user?.displayName || user?.username || 'Player'}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-[10px] text-slate-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Đang trực tuyến
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute -top-12 -right-12 h-24 w-24 rounded-full bg-amber-500/30 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        ) : (
          <div className="mb-2 flex justify-center">
            <div className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-sm font-extrabold text-amber-950 ring-2 ring-amber-300/30 shadow-[0_0_12px_rgba(251,191,36,0.45)]">
                {initials}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0a0a0a] animate-pulse" />
            </div>
          </div>
        )}

        {bottomNote && !collapsed && (
          <p className="mb-2 px-2 text-[10px] leading-relaxed text-slate-500 italic">
            {bottomNote}
          </p>
        )}

        <button
          type="button"
          onClick={onLogout}
          title={collapsed ? 'Đăng xuất' : undefined}
          className={`relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-400 transition-all hover:bg-rose-500/10 hover:text-rose-300 hover:shadow-[0_0_12px_rgba(244,63,94,0.25)] ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          {!collapsed && <span>Đăng xuất</span>}
        </button>
      </div>
    </aside>
  )
}