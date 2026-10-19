import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores'
import {
  LayoutGrid,
  Users,
  BookOpen,
  ScrollText,
  Shield,
  Mountain,
} from 'lucide-react'
import { charactersApi, chaptersApi, questsApi } from '@/api'
import Sidebar from './Sidebar'
import CosmicBackground from './CosmicBackground'
import PageShell from './PageShell'

export default function ModeratorLayout() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const [stats, setStats] = useState({
    characters: 0,
    chapters: 0,
    quests: 0,
  })
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [chars, chaps] = await Promise.all([
          charactersApi.getAll().catch(() => []),
          chaptersApi.getAll().catch(() => []),
        ])
        let qCount = 0
        for (const ch of chaps) {
          const qList = await questsApi.getByChapter(ch.id).catch(() => [])
          qCount += qList.length
        }
        setStats({
          characters: chars.length,
          chapters: chaps.length,
          quests: qCount,
        })
      } catch (e) {
        console.error(e)
      }
    }
    loadStats()
  }, [])

  const navItems = [
    {
      path: '/moderator',
      label: 'Tổng quan',
      icon: LayoutGrid,
      exact: true,
    },
    {
      path: '/moderator/characters',
      label: 'Character Stats',
      icon: Users,
      count: stats.characters,
    },
    {
      path: '/moderator/chapters',
      label: 'Chapters',
      icon: BookOpen,
      count: stats.chapters,
    },
    {
      path: '/moderator/quests',
      label: 'Quests',
      icon: ScrollText,
      count: stats.quests,
    },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="relative flex min-h-screen text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <CosmicBackground />

      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-amber-500/15 bg-[#0a0805]/80 px-4 backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-2">
          <Mountain className="h-5 w-5 text-amber-300" />
          <span className="text-xs font-extrabold tracking-wide text-white">
            MODERATOR
          </span>
          <Shield className="h-3.5 w-3.5 text-amber-300" />
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
            brand={{ title: 'Hold My Hand', subtitle: 'Moderator Portal' }}
            brandIcon={Shield}
            navItems={navItems}
            user={user}
            onLogout={handleLogout}
            onNavigate={() => setMobileOpen(false)}
            bottomNote="Mỗi nhân vật, mỗi chương, mỗi nhiệm vụ — tạo nên thế giới."
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
