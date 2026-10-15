import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/utils'

export interface SnapBarItem {
  path: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string | number | null
  exact?: boolean
}

interface SnapBarProps {
  /** Logo + brand (always visible) */
  brand: ReactNode

  /** User card expanded (hiển thị khi sidebar mở) */
  userCard?: ReactNode

  /** User card compact (chỉ avatar, hiển thị khi sidebar thu gọn) */
  userCardCompact?: ReactNode

  /** Nav items */
  items: SnapBarItem[]

  /** Footer (logout, etc.) */
  footer?: ReactNode

  /** Collapsed state */
  collapsed: boolean
  onToggleCollapsed: () => void

  /** Optional extra header area */
  extraHeader?: ReactNode

  /** Theme variants: admin / moderator / portal */
  theme?: 'admin' | 'moderator' | 'portal'

  className?: string
}

/**
 * SnapBar — vertical icon sidebar với khả năng thụt ra / thụt vào.
 *
 * Mặc định:
 *   - collapsed = chỉ hiển thị icon (w-16)
 *   - expanded = hiển thị icon + label (w-64)
 *
 * Click icon thì toggle. Khi collapsed, click vào nav item vẫn mở rộng sidebar.
 */
export default function SnapBar({
  brand,
  userCard,
  userCardCompact,
  items,
  footer,
  collapsed,
  onToggleCollapsed,
  extraHeader,
  theme = 'admin',
  className,
}: SnapBarProps) {
  const location = useLocation()

  const themeStyles = {
    admin: {
      base: 'bg-[#0a0d14] border-slate-800/80',
      brandText: 'text-white',
      navActive: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      navInactive: 'text-slate-400 hover:text-white hover:bg-white/5',
      icon: 'text-slate-400',
      iconActive: 'text-amber-400',
      toggle: 'text-slate-400 hover:text-amber-400 hover:bg-amber-500/10',
      toggleIcon: 'text-amber-400',
      badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    },
    moderator: {
      base: 'bg-[#0b0e17] border-white/10',
      brandText: 'text-white',
      navActive: 'bg-yellow-400/15 text-yellow-400 border-yellow-400/30',
      navInactive: 'text-slate-400 hover:text-white hover:bg-white/5',
      icon: 'text-slate-400',
      iconActive: 'text-yellow-400',
      toggle: 'text-slate-400 hover:text-yellow-400 hover:bg-yellow-400/10',
      toggleIcon: 'text-yellow-400',
      badge: 'bg-yellow-400/15 text-yellow-400 border-yellow-400/30',
    },
    portal: {
      base: 'bg-white/5 border-white/10',
      brandText: 'text-white',
      navActive: 'bg-gradient-to-r from-pink-500/20 to-purple-600/20 text-white border-pink-500/30',
      navInactive: 'text-purple-200 hover:bg-white/5 hover:text-white',
      icon: 'text-purple-200',
      iconActive: 'text-pink-300',
      toggle: 'text-purple-200 hover:bg-white/10 hover:text-white',
      toggleIcon: 'text-white',
      badge: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    },
  }

  const t = themeStyles[theme]

  return (
    <aside
      className={cn(
        'flex flex-col h-screen flex-shrink-0 border-r backdrop-blur-xl transition-[width] duration-300 ease-in-out',
        t.base,
        collapsed ? 'w-[68px]' : 'w-64',
        className
      )}
    >
      {/* Brand + Toggle */}
      <div
        className={cn(
          'flex items-center border-b h-16 flex-shrink-0',
          collapsed ? 'justify-center px-2' : 'justify-between px-4',
          'border-white/10'
        )}
      >
        {!collapsed && (
          <div className="flex-1 min-w-0 overflow-hidden">{brand}</div>
        )}
        {collapsed && (
          <div className="flex-shrink-0">{brand}</div>
        )}
        <button
          onClick={onToggleCollapsed}
          title={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
          className={cn(
            'flex-shrink-0 p-1.5 rounded-lg transition-colors',
            t.toggle
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Extra header (counts, badges) */}
      {extraHeader && !collapsed && (
        <div className="px-3 py-3 border-b border-white/10 flex-shrink-0">
          {extraHeader}
        </div>
      )}

      {/* User card */}
      {userCard && !collapsed && (
        <div className="px-3 py-4 border-b border-white/10 flex-shrink-0">
          {userCard}
        </div>
      )}
      {userCardCompact && collapsed && (
        <div className="px-2 py-3 border-b border-white/10 flex-shrink-0 flex justify-center">
          {userCardCompact}
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = item.exact
            ? location.pathname === item.path
            : location.pathname === item.path ||
              location.pathname.startsWith(item.path + '/')

          return (
            <Link
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : undefined}
              className={cn(
                'relative flex items-center gap-3 rounded-lg text-sm transition-all border border-transparent',
                collapsed ? 'justify-center h-12 px-0' : 'px-3 py-2.5',
                isActive ? t.navActive : t.navInactive
              )}
            >
              <Icon
                className={cn(
                  'w-5 h-5 flex-shrink-0',
                  isActive ? t.iconActive : t.icon
                )}
              />
              {!collapsed && (
                <>
                  <span className="font-medium truncate flex-1">{item.label}</span>
                  {item.badge !== undefined && item.badge !== null && (
                    <span
                      className={cn(
                        'font-mono text-[10px] px-1.5 py-0.5 rounded border',
                        t.badge
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {/* Collapsed badge dot */}
              {collapsed && item.badge !== undefined && item.badge !== null && (
                <span
                  className={cn(
                    'absolute top-1.5 right-1.5 w-2 h-2 rounded-full',
                    isActive ? 'bg-current' : 'bg-amber-400'
                  )}
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      {footer && (
        <div
          className={cn(
            'border-t border-white/10 flex-shrink-0',
            collapsed ? 'p-2' : 'p-3'
          )}
        >
          {footer}
        </div>
      )}
    </aside>
  )
}