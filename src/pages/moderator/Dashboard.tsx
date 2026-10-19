import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Users, BookOpen, ScrollText, ArrowRight, Search } from 'lucide-react'
import { charactersApi, chaptersApi, questsApi } from '@/api'
import { MagicCard } from '@/components/ui'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
}
const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export default function ModDashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState({
    totalCharacters: 0,
    totalChapters: 0,
    totalQuests: 0,
  })

  useEffect(() => {
    const loadStats = async () => {
      try {
        const characters = await charactersApi.getAll().catch(() => [])
        const chapters = await chaptersApi.getAll().catch(() => [])
        let totalQuests = 0
        for (const ch of chapters) {
          const quests = await questsApi.getByChapter(ch.id).catch(() => [])
          totalQuests += quests.length
        }
        setStats({
          totalCharacters: characters.length,
          totalChapters: chapters.length,
          totalQuests,
        })
      } catch (error) {
        console.error('Failed to load stats:', error)
      }
    }
    loadStats()
  }, [])

  const categories = [
    {
      index: '/01',
      title: 'Character Stats',
      subtitle: 'Chỉ số và thuộc tính nhân vật',
      actionText: 'Quản lý nhân vật',
      link: '/moderator/characters',
      icon: Users,
      highlight: false,
      valueKey: 'totalCharacters' as const,
      glow: 'amber' as const,
    },
    {
      index: '/02',
      title: 'Chapters',
      subtitle: 'Các chương trong hành trình',
      actionText: 'Quản lý chapters',
      link: '/moderator/chapters',
      icon: BookOpen,
      highlight: true,
      valueKey: 'totalChapters' as const,
      glow: 'amber' as const,
    },
    {
      index: '/03',
      title: 'Quests',
      subtitle: 'Nhiệm vụ và mục tiêu khám phá',
      actionText: 'Quản lý quests',
      link: '/moderator/quests',
      icon: ScrollText,
      highlight: false,
      valueKey: 'totalQuests' as const,
      glow: 'amber' as const,
    },
  ]

  const filteredCategories = categories.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants} className="space-y-1.5">
        <div className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase font-mono">
          WORKSPACE / OVERVIEW
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight bg-gradient-to-r from-white via-amber-100 to-white bg-clip-text">
              Tổng quan game
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Quản lý nội dung. Chăm chút từng hành trình.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Tìm kiếm nội dung..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0d101a] border border-white/10 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400/40 transition-colors"
            />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((cat, idx) => {
          const Icon = cat.icon
          return (
            <motion.div
              key={cat.index}
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.02 }}
            >
              <Link to={cat.link} className="block">
                <MagicCard
                  glowColor="amber"
                  intensity={3}
                  className="relative p-5 flex items-center justify-between overflow-hidden"
                >
                  <motion.div
                    className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 blur-2xl opacity-20"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 5 + idx * 0.4, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <div className="space-y-2 relative">
                    <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold">
                      <motion.div
                        whileHover={{ rotate: -12, scale: 1.15 }}
                        transition={{ type: 'spring', stiffness: 220 }}
                      >
                        <Icon className="w-3.5 h-3.5 text-amber-400" />
                      </motion.div>
                      <span>{cat.title}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <motion.span
                        key={stats[cat.valueKey]}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl font-extrabold text-white tracking-tight"
                      >
                        {stats[cat.valueKey]}
                      </motion.span>
                      <span className="text-[11px] text-slate-500 font-normal">nội dung</span>
                    </div>
                  </div>
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.3 }}
                  >
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                  </motion.div>
                </MagicCard>
              </Link>
            </motion.div>
          )
        })}
      </div>

      <motion.div variants={itemVariants} className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white tracking-tight">Quản lý nội dung</h3>
          <span className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase font-mono">
            03 DANH MỤC
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredCategories.map((cat) => {
            const Icon = cat.icon
            return (
              <motion.div
                key={cat.index}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <MagicCard
                  glowColor={cat.highlight ? 'amber' : 'indigo'}
                  intensity={3}
                  className="p-5 flex flex-col justify-between min-h-[190px]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <motion.div
                        whileHover={{ rotate: -10, scale: 1.18 }}
                        transition={{ type: 'spring', stiffness: 220 }}
                        className={`w-9 h-9 rounded-xl border flex items-center justify-center ${
                          cat.highlight
                            ? 'bg-yellow-400/10 border-yellow-400/30 text-yellow-400 shadow-[0_0_18px_rgba(250,204,21,0.4)]'
                            : 'bg-white/5 border-white/10 text-slate-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </motion.div>
                      <span className="text-xs font-mono font-medium text-slate-500">
                        {cat.index}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white tracking-tight">{cat.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{cat.subtitle}</p>
                  </div>

                  <div className="pt-5">
                    <Link
                      to={cat.link}
                      className={`inline-flex items-center gap-1.5 text-xs font-bold transition-all ${
                        cat.highlight
                          ? 'text-yellow-400 hover:text-yellow-300'
                          : 'text-slate-400 hover:text-yellow-400'
                      }`}
                    >
                      <span>{cat.actionText}</span>
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </motion.span>
                    </Link>
                  </div>
                </MagicCard>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </motion.div>
  )
}