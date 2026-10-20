import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import VanillaTilt from 'vanilla-tilt'
import { useAuthStore } from '@/stores'
import {
  Gamepad2,
  ArrowRight,
  X,
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogOut,
  Users,
  Tv,
  Zap,
  Sparkles,
} from 'lucide-react'
import { notify } from '@/lib/toast'
import ParticleCanvas from '@/components/landing/ParticleCanvas'
import GlassHeader from '@/components/landing/GlassHeader'
import Mounted from '@/components/landing/Mounted'

// ──────────────────────────────────────────────────────────────────────────
// Homepage hero banner
// ──────────────────────────────────────────────────────────────────────────
const HERO_BANNER = {
  tagline: 'KHÔNG CHỈ LÀ MỘT TRÒ CHƠI',
  titleLine1: 'Một thế giới.',
  titleLine2: 'Hai người bạn.',
  description:
    'Cùng nhau khám phá những miền đất kỳ diệu, nơi mỗi thử thách đều vui hơn khi có một người bạn bên cạnh.',
  bgImage: '/banner_castle.jpg',
}

const GAME_WORLDS = [
  {
    id: '01',
    title: 'Lều đồ chơi diệu kỳ',
    tag: 'PHIÊU LƯU · TƯỞNG TƯỢNG',
    image: '/banner_castle.jpg',
    description:
      'Một vương quốc nhỏ được dựng nên từ chăn gối, khối gỗ và trí tưởng tượng của hai người bạn.',
    accent: 'toybox',
  },
  {
    id: '02',
    title: 'Vũ trụ kỳ diệu',
    tag: 'PHIÊU LƯU · KHÁM PHÁ',
    image: '/banner_cosmic.jpg',
    description:
      'Bước vào vũ trụ đa sắc nơi mỗi hành tinh là một câu đố chờ hai bạn giải mã.',
    accent: 'cosmic',
  },
  {
    id: '03',
    title: 'Khu vườn bí mật',
    tag: 'PHIÊU LƯU · THIÊN NHIÊN',
    image: '/world-secret-garden.png',
    description:
      'Khu vườn cổ tích ẩn giấu những sinh vật phát sáng giữa rừng cây xanh thẳm.',
    accent: 'garden',
  },
]

const COOP_FEATURES = [
  {
    icon: Tv,
    title: 'Màn Hình Kép Động (Split-Screen)',
    description:
      'Góc nhìn đôi thời gian thực cho phép hai người chơi quan sát từng bước di chuyển và phối hợp hành động tức thì.',
    animClass: 'animate-tv-flicker',
  },
  {
    icon: Zap,
    title: 'Cơ Chế Dây Tơ Duyên (Tethering)',
    description:
      'Liên kết 2 nhân vật bằng sợi dây năng lượng để đu qua vực sâu, truyền năng lượng và thực hiện các pha tung người ngoạn mục.',
    animClass: 'animate-bolt',
  },
  {
    icon: Gamepad2,
    title: 'Minigame Đội Đối Kháng',
    description:
      'Hơn 20 trò chơi phụ vui nhộn ẩn giấu khắp bản đồ giúp giải trí và ganh đua điểm số dí dỏm cùng bạn chơi.',
    animClass: '',
  },
  {
    icon: Users,
    title: "Friend's Pass Độc Quyền",
    description:
      'Chỉ cần 1 người tạo phòng, người còn lại có thể tham gia hoàn toàn miễn phí thông qua mã mời sảnh trực tuyến.',
    animClass: 'animate-friend',
  },
]

const ACCENT_GRADIENT: Record<string, string> = {
  toybox: 'from-orange-500 via-amber-500 to-rose-500',
  cosmic: 'from-indigo-500 via-purple-600 to-fuchsia-600',
  garden: 'from-emerald-500 via-teal-600 to-cyan-700',
}

// ──────────────────────────────────────────────────────────────────────────
// Hero Slide Background
// ──────────────────────────────────────────────────────────────────────────
function HeroBackground({ image }: { image: string }) {
  return (
    <div className="absolute inset-0">
      <img
        src={image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#080a0e]/90 via-[#080a0e]/20 to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#080a0e]/75 via-[#080a0e]/20 to-transparent" />
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────
// World Card with vanilla-tilt 3D + framer-motion entrance
// ──────────────────────────────────────────────────────────────────────────
function WorldCard({
  world,
  index,
  onJoin,
}: {
  world: (typeof GAME_WORLDS)[number]
  index: number
  onJoin: () => void
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const tiltRef = useRef<HTMLDivElement | null>(null)
  const [hover, setHover] = useState(false)

  useEffect(() => {
    const el = tiltRef.current
    if (!el) return
    VanillaTilt.init(el, {
      max: 12,
      speed: 600,
      scale: 1.04,
      glare: true,
      'max-glare': 0.18,
      perspective: 1100,
      transition: true,
    })
    return () => {
      // @ts-expect-error - vanilla-tilt attaches destroy on element
      el.vanillaTilt?.destroy?.()
    }
  }, [])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      onClick={onJoin}
      data-tilt
      className="group relative cursor-pointer"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div
        ref={tiltRef}
        className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900 border border-white/10 transition-all duration-300"
        style={{
          boxShadow: hover
            ? '0 0 0 1px rgba(243,178,46,0.6), 0 22px 60px -18px rgba(243,178,46,0.55)'
            : '0 0 0 1px rgba(255,255,255,0.06)',
        }}
      >
        <motion.img
          src={world.image}
          alt={world.title}
          className="w-full h-full object-cover"
          animate={{ scale: hover ? 1.1 : 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
        <div
          className={`absolute inset-0 bg-gradient-to-t ${
            ACCENT_GRADIENT[world.accent]
          } mix-blend-overlay transition-opacity duration-500 ${
            hover ? 'opacity-35' : 'opacity-0'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

        {/* Animated border runner */}
        <div
          className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500 ${
            hover ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute inset-[-1px] rounded-2xl p-px">
            <div className="absolute inset-0 animate-border-run rounded-2xl" />
          </div>
          <div className="absolute inset-0 rounded-2xl ring-1 ring-amber-400/40 animate-card-glow" />
        </div>

        {/* Inner mist reveal */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            hover ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute -bottom-12 left-0 right-0 h-32 bg-gradient-to-t from-white/15 to-transparent blur-2xl" />
          <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_12px_rgba(255,197,41,0.9)] animate-friend" />
          <div className="absolute bottom-16 left-6 w-1.5 h-1.5 rounded-full bg-amber-200 shadow-[0_0_8px_rgba(255,197,41,0.7)] animate-friend animation-delay-2000" />
        </div>

        {/* CTA Arrow */}
        <motion.div
          className="absolute bottom-4 right-4 w-11 h-11 rounded-full bg-amber-400 flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(243,178,46,0.55)]"
          animate={{
            rotate: hover ? 360 : 0,
            scale: hover ? 1.12 : 1,
            boxShadow: hover
              ? '0 0 36px rgba(243,178,46,0.95)'
              : '0 0 20px rgba(243,178,46,0.55)',
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </motion.div>

        {/* Index tag */}
        <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-amber-300 font-bold tracking-wider">
          /{world.id}
        </div>
      </div>

      <div className="mt-5 flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
            {world.title}
          </h3>
          <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mt-1">
            {world.tag}
          </p>
          <p className="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed line-clamp-2">
            {world.description}
          </p>
        </div>
        <span className="font-mono text-xs text-slate-500 font-semibold pt-1">
          {world.id} / 03
        </span>
      </div>
    </motion.div>
  )
}

// ──────────────────────────────────────────────────────────────────────────
// Feature Card with hover lift + animated border
// ──────────────────────────────────────────────────────────────────────────
function FeatureCard({
  feat,
  index,
}: {
  feat: (typeof COOP_FEATURES)[number]
  index: number
}) {
  const Icon = feat.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -10, scale: 1.03 }}
      className="group relative p-8 rounded-2xl bg-[#0f1320]/80 border border-white/10 overflow-hidden cursor-default"
    >
      {/* Animated border */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-[-1px] rounded-2xl p-px bg-gradient-to-r from-amber-400/0 via-amber-400/90 to-amber-400/0 animate-border-run" />
      </div>
      <div className="absolute inset-[1px] rounded-2xl bg-[#0f1320]/95 z-0" />

      <div className="relative z-10 space-y-4">
        <motion.div
          whileHover={{ scale: 1.18, rotate: -8 }}
          className={`w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-500/5 border border-amber-400/30 flex items-center justify-center text-amber-300 ${
            feat.animClass || ''
          }`}
        >
          <Icon className="w-7 h-7" />
        </motion.div>
        <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
          {feat.title}
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">{feat.description}</p>
      </div>

      <div className="absolute top-3 right-3 font-mono text-[10px] text-amber-300/50 tracking-widest">
        0{index + 1}
      </div>
    </motion.div>
  )
}

// ──────────────────────────────────────────────────────────────────────────
// Main Landing
// ──────────────────────────────────────────────────────────────────────────
export default function LandingHome() {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout, login, isLoading } = useAuthStore()

  const [menuOpen, setMenuOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleJoinClick = () => {
    if (isAuthenticated) navigate('/portal/lobby')
    else navigate('/login')
  }

  const scrollToWorlds = () => {
    document.getElementById('worlds')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (authMode === 'login') {
      try {
        const loggedUser = await login({ username, password })
        notify.success(
          `Chào mừng ${loggedUser.displayName || loggedUser.username}!`,
          'Đăng nhập thành công',
        )
        setShowAuthModal(false)
        if (loggedUser.role === 'Admin') navigate('/admin')
        else if (loggedUser.role === 'Moderator') navigate('/moderator')
        else navigate('/portal/lobby')
      } catch (err: any) {
        notify.error('Tài khoản hoặc mật khẩu không chính xác!', 'Đăng nhập thất bại')
      }
    } else {
      setShowAuthModal(false)
      navigate('/register')
    }
  }

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-[#0B0E14] font-sans text-slate-100 selection:bg-amber-400 selection:text-slate-950"
    >
      {/* Layer 1: Full-screen game banner */}
      <GlassHeader
        onMenu={() => setMenuOpen(!menuOpen)}
        authed={isAuthenticated}
        onLogin={() => navigate('/login')}
      />

      {/* Drawer */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-40 bg-[#06080e]/95 backdrop-blur-2xl flex flex-col justify-between p-8 md:p-12"
        >
          <div className="flex items-center justify-between w-full px-8 md:px-12 lg:px-16">
            <div className="flex items-center gap-3">
              <img src="/logo.jpg" alt="Logo" className="h-10 w-auto object-contain rounded-lg" />
              <span className="text-2xl font-black text-white">Hold My Hand</span>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              className="w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="w-full px-8 md:px-12 lg:px-16 space-y-6 text-3xl md:text-5xl font-black">
            {['Trang chủ', 'Thế giới Game', 'Tính năng Co-Op'].map((label, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
              >
                <a
                  href={['#hero', '#worlds', '#features'][i]}
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-amber-400 transition-colors inline-block"
                >
                  {label}
                </a>
              </motion.div>
            ))}
          </nav>
          <div className="w-full px-8 md:px-12 lg:px-16 flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-300">
                  Chào mừng, {user.displayName || user.username}
                </span>
                <button
                  onClick={() => {
                    logout()
                    setMenuOpen(false)
                  }}
                  className="px-4 py-2 bg-rose-500/20 text-rose-300 rounded-lg text-sm font-bold flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Đăng xuất
                </button>
              </div>
            ) : (
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setMenuOpen(false)
                    navigate('/login')
                  }}
                  className="px-6 py-3 bg-amber-400 text-slate-950 font-bold rounded-xl text-sm"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false)
                    navigate('/register')
                  }}
                  className="px-6 py-3 bg-white/10 text-white font-bold rounded-xl text-sm border border-white/20"
                >
                  Đăng ký
                </button>
              </div>
            )}
            <p className="text-xs text-slate-500">Made for two. Remembered forever.</p>
          </div>
        </motion.div>
      )}

      {/* Main */}
      <main className="relative z-10">
        {/* ─────────── HERO ─────────── */}
        <section id="hero" className="relative flex h-[100svh] min-h-[700px] w-full flex-col justify-between overflow-hidden">
          {/* Background layers */}
          <div className="absolute inset-0 z-0">
            <HeroBackground image={HERO_BANNER.bgImage} />
          </div>

          {/* Hero text */}
          <div className="relative z-10 flex w-full flex-1 flex-col justify-center px-6 pb-12 pt-28 sm:px-10 md:px-12 lg:px-16">
            <div className="max-w-3xl space-y-6">
              <Mounted delay={0.1}>
                <div className="inline-flex items-center gap-3">
                  <motion.span
                    animate={{ width: ['0%', '100%', '24px'] }}
                    transition={{ duration: 1.4, delay: 0.2 }}
                    className="h-0.5 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(255,197,41,0.8)]"
                  />
                  <span className="text-[11px] sm:text-xs font-bold tracking-[0.22em] text-amber-300 uppercase">
                    {HERO_BANNER.tagline}
                  </span>
                </div>
              </Mounted>

              <motion.h1
                initial={{ opacity: 0, y: 36, letterSpacing: '0' }}
                animate={{ opacity: 1, y: 0, letterSpacing: '0' }}
                transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl font-[700] leading-[1.05] text-white sm:text-6xl md:text-7xl lg:text-8xl"
                style={{ textShadow: '0 4px 36px rgba(0,0,0,0.55)' }}
              >
                {HERO_BANNER.titleLine1}
                <br />
                <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                  {HERO_BANNER.titleLine2}
                </span>
              </motion.h1>

              <Mounted delay={0.6}>
                <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed">
                  {HERO_BANNER.description}
                </p>
              </Mounted>

              <Mounted delay={0.8}>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={scrollToWorlds}
                    className="inline-flex items-center gap-2 px-5 py-3.5 bg-white/5 border border-white/15 text-white text-sm font-bold rounded-xl backdrop-blur-sm hover:bg-white/10"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    Khám phá thế giới
                  </motion.button>
                </div>
              </Mounted>
            </div>
          </div>

          {/* Game information */}
          <Mounted delay={1.0}>
            <div className="relative z-10 flex w-full flex-col gap-5 border-t border-white/20 bg-black/35 px-6 py-5 backdrop-blur-sm sm:px-10 md:flex-row md:items-end md:gap-12 md:px-12 lg:px-16">
              <div className="min-w-0">
                <h2 className="mb-3 text-xs font-medium text-slate-300">Genre</h2>
                <div className="flex flex-wrap gap-2">
                  {['Action Adventure', 'Platformer'].map((genre) => (
                    <span key={genre} className="inline-flex min-h-10 items-center rounded-full border border-white/20 px-4 font-mono text-xs text-slate-200 sm:text-sm">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
              <div className="min-w-0">
                <h2 className="mb-3 text-xs font-medium text-slate-300">Platforms</h2>
                <div className="flex flex-wrap gap-2">
                  {['PC'].map((platform) => (
                    <span key={platform} className="inline-flex min-h-10 items-center rounded-full border border-white/20 px-4 font-mono text-xs text-slate-200 sm:text-sm">
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Mounted>
        </section>

        {/* ─────────── WORLDS ─────────── */}
        <section id="worlds" className="relative py-28 w-full px-8 md:px-12 lg:px-16 overflow-hidden">
          {/* Decorative mist behind cards */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0B0E14] to-transparent pointer-events-none" />
          <div className="absolute left-[-20%] right-[-20%] top-1/3 h-64 bg-amber-500/[0.04] blur-3xl pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4 relative z-10"
          >
            <div>
              <div className="inline-flex items-center gap-3 mb-3">
                <motion.span
                  animate={{ width: ['0%', '100%', '24px'] }}
                  transition={{ duration: 1.4 }}
                  className="h-0.5 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(255,197,41,0.8)]"
                />
                <span className="text-[11px] sm:text-xs font-bold tracking-[0.22em] text-amber-300 uppercase">
                  CHỌN CUỘC PHIÊU LƯU CỦA BẠN
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-[-0.02em]">
                Những thế giới đang chờ.
              </h2>
              <p className="text-slate-400 text-xs md:text-sm mt-3 max-w-xl">
                Hai người chơi. Một hành trình đáng nhớ. Ba thế giới để khám phá cùng nhau.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-mono">03 / 03</span>
              <span className="text-slate-600">|</span>
              <span>WORLDS</span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {GAME_WORLDS.map((world, i) => (
              <WorldCard key={world.id} world={world} index={i} onJoin={handleJoinClick} />
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-white/5 flex items-center justify-between text-xs text-slate-500 relative z-10">
            <span>© 2026 Hold My Hand Portal</span>
            <span className="font-medium tracking-wide">Made for two. Remembered forever</span>
          </div>
        </section>

        {/* ─────────── CO-OP FEATURES ─────────── */}
        <section id="features" className="relative py-28 bg-[#06080e]/80 border-t border-white/10 overflow-hidden">
          {/* Subtle particles continuing */}
          <div className="absolute inset-0 pointer-events-none opacity-60">
            <ParticleCanvas snowCount={28} embersCount={10} />
          </div>

          <div className="relative z-10 w-full px-8 md:px-12 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto mb-16 space-y-5"
            >
              <motion.span
                initial={{ scale: 0.85, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-[0.2em] inline-block shadow-[0_0_24px_rgba(243,178,46,0.2)]"
              >
                CƠ CHẾ PHỐI HỢP ĐỘC QUYỀN
              </motion.span>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-[-0.02em]">
                <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                  Thiết kế dành riêng cho 2 người chơi
                </span>
              </h2>
              <p className="text-slate-400 text-sm md:text-base">
                Không thể chơi đơn lẻ — mọi câu đố và thử thách đều đòi hỏi sự thấu hiểu và phối hợp ăn ý từ cả hai phía.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {COOP_FEATURES.map((feat, idx) => (
                <FeatureCard key={feat.title} feat={feat} index={idx} />
              ))}
            </div>
          </div>
        </section>

        <section className="relative isolate overflow-hidden border-t border-white/10 bg-[#090a0c]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_76%_52%,rgba(110,120,90,0.16),transparent_42%)]" />
          <div className="relative mx-auto grid min-h-[680px] max-w-[1200px] grid-cols-1 items-center gap-4 px-6 py-16 sm:px-10 md:px-12 lg:min-h-[100svh] lg:grid-cols-[0.9fr_1.1fr] lg:px-12 lg:py-16">
            <motion.div
              initial={{ opacity: 0, x: -28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 max-w-[500px] py-8 font-['Outfit'] lg:py-14"
            >
              <h2 className="text-7xl font-light leading-none text-[#f0ede8] sm:text-8xl">
                Dad
              </h2>
              <p className="mt-10 max-w-[500px] text-base leading-8 text-[#d4d0ca] sm:text-lg sm:leading-9">
                A stubborn, big-hearted carpenter who traded weekend projects for long shifts and unpaid bills. Now, shrunk into a world of his own making, he&apos;s learning that the best thing he ever built was his family.
              </p>

              <div className="mt-12">
                <h3 className="mb-3 text-xs font-medium text-slate-400">Personality</h3>
                <div className="flex flex-wrap gap-2">
                  {['Protective', 'Hardworking', 'Warm-hearted'].map((trait) => (
                    <span
                      key={trait}
                      className="inline-flex min-h-8 items-center rounded-full border border-white/20 px-3 font-mono text-[11px] text-[#e3dfd8]"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto flex w-full max-w-[660px] items-center justify-center lg:absolute lg:inset-y-0 lg:right-0 lg:w-[56%]"
            >
              <img
                src="/dadPose-Photoroom.png"
                alt="Dad, nhân vật người cha"
                className="h-auto max-h-[760px] w-full object-contain object-center"
              />
            </motion.div>
          </div>
        </section>

        <section className="relative isolate overflow-hidden border-t border-white/10 bg-[#090a0c]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_28%_52%,rgba(110,120,90,0.16),transparent_42%)]" />
          <div className="relative mx-auto grid min-h-[680px] max-w-[1440px] grid-cols-1 items-center gap-4 px-6 py-16 sm:px-10 md:px-12 lg:grid-cols-[1.1fr_0.9fr] lg:px-16 lg:py-20">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto flex w-full max-w-[620px] items-center justify-center lg:static"
            >
              <img
                src="/childPose-Photoroom.png"
                alt="Son, nhân vật cậu bé"
                className="h-auto max-h-[680px] w-full object-contain object-center"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 max-w-xl py-8 font-['Outfit'] lg:py-14"
            >
              <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.24em] text-amber-300/75">
                NHÂN VẬT · 02
              </p>
              <h2 className="text-6xl font-light leading-none text-[#f0ede8] sm:text-7xl md:text-8xl">
                Son
              </h2>
              <p className="mt-8 max-w-lg text-sm leading-7 text-[#d4d0ca] sm:text-base sm:leading-8">
                A cheerful boy who never goes anywhere without his headphones and a bright smile. For Son, every day is a brand-new song — he bounces along in his green sneakers, listens to the world around him, and turns little moments into happy melodies.
              </p>

              <div className="mt-10">
                <h3 className="mb-3 text-[11px] font-medium text-slate-400">Personality</h3>
                <div className="flex flex-wrap gap-2">
                  {['Cheerful', 'Music lover', 'Energetic'].map((trait) => (
                    <span
                      key={trait}
                      className="inline-flex min-h-8 items-center rounded-full border border-white/20 px-3 font-mono text-[11px] text-[#e3dfd8]"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─────────── FOOTER ─────────── */}
        <footer className="relative bg-[#06080e] border-t border-white/10 text-slate-400 py-12 text-xs overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
          <div className="w-full px-8 md:px-12 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-3">
              <img src="/logo.jpg" alt="Logo" className="h-8 w-auto object-contain rounded-lg" />
              <span className="text-sm font-black text-white tracking-widest uppercase">
                HOLD MY HAND PORTAL
              </span>
            </div>
            <p className="text-slate-500 text-xs">
              © 2026 Hold My Hand Game Portal. Inspired by It Takes Two & Hazelight.
            </p>
          </div>
        </footer>
      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6"
          >
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 mb-1">
                <img src="/logo.jpg" alt="Hold My Hand" className="h-9 w-9 rounded-lg object-cover" />
                <span className="font-black text-xl text-white">Hold My Hand</span>
              </div>
              <h3 className="text-2xl font-bold text-white">
                {authMode === 'login' ? 'Đăng Nhập Portal' : 'Tạo Tài Khoản Mới'}
              </h3>
              <p className="text-xs text-slate-400">
                {authMode === 'login'
                  ? 'Đăng nhập để vào sảnh ghép đội và tiếp tục hành trình'
                  : 'Tham gia thế giới game portal co-op ngay hôm nay'}
              </p>
            </div>
            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Tên đăng nhập / Email
                </label>
                <div className="relative flex items-center bg-slate-950 border border-slate-800 rounded-xl">
                  <Mail className="w-4 h-4 ml-3 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nhập username..."
                    className="w-full px-3 py-3 bg-transparent text-white text-sm placeholder-slate-600 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Mật khẩu</label>
                <div className="relative flex items-center bg-slate-950 border border-slate-800 rounded-xl">
                  <Lock className="w-4 h-4 ml-3 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-3 bg-transparent text-white text-sm placeholder-slate-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="mr-3 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-400/20 hover:bg-amber-300 transition-all disabled:opacity-50"
              >
                {isLoading ? 'Đang xử lý...' : authMode === 'login' ? 'ĐĂNG NHẬP' : 'TIẾP TỤC ĐĂNG KÝ'}
              </button>
            </form>
            <div className="text-center pt-2 text-xs text-slate-400">
              {authMode === 'login' ? (
                <span>
                  Chưa có tài khoản?{' '}
                  <button
                    onClick={() => {
                      setShowAuthModal(false)
                      navigate('/register')
                    }}
                    className="font-bold text-amber-400 hover:underline"
                  >
                    Đăng ký tại đây
                  </button>
                </span>
              ) : (
                <span>
                  Đã có tài khoản?{' '}
                  <button
                    onClick={() => setAuthMode('login')}
                    className="font-bold text-amber-400 hover:underline"
                  >
                    Đăng nhập
                  </button>
                </span>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}