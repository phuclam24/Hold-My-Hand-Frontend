import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import VanillaTilt from 'vanilla-tilt'
import { useAuthStore } from '@/stores'
import {
  Gamepad2,
  Play,
  Pause,
  ChevronLeft,
  ArrowDown,
  ArrowRight,
  X,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Heart,
  LogOut,
  Users,
  Tv,
  Zap,
  Sparkles,
} from 'lucide-react'
import { notify } from '@/lib/toast'
import ParticleCanvas from '@/components/landing/ParticleCanvas'
import GameCursor from '@/components/landing/GameCursor'
import GlassHeader from '@/components/landing/GlassHeader'
import Mounted from '@/components/landing/Mounted'

// ──────────────────────────────────────────────────────────────────────────
// Hero Slides — Vietnamese copy kept exactly as in reference imagery
// ──────────────────────────────────────────────────────────────────────────
const HERO_SLIDES = [
  {
    id: '01',
    navLabel: 'Vũ trụ',
    tagline: 'KHÔNG CHỈ LÀ MỘT TRÒ CHƠI',
    titleLine1: 'Hai người.',
    titleLine2: 'Vô vàn thế giới.',
    description:
      'Một người bạn. Một cuộc phiêu lưu. Cùng bước vào những thế giới nơi trí tưởng tượng không có giới hạn.',
    bgImage: '/banner_cosmic.jpg',
    accent: 'cosmic',
  },
  {
    id: '02',
    navLabel: 'Khu vườn',
    tagline: 'KHÔNG CHỈ LÀ MỘT TRÒ CHƠI',
    titleLine1: 'Nhỏ bé.',
    titleLine2: 'Kỳ diệu.',
    description:
      'Đi qua những chiếc lá khổng lồ, tìm thấy những điều kỳ diệu trong những điều nhỏ bé. Hành trình đẹp hơn khi có nhau.',
    bgImage: '/world-secret-garden.png',
    accent: 'garden',
  },
  {
    id: '03',
    navLabel: 'Tuyết trắng',
    tagline: 'KHÔNG CHỈ LÀ MỘT TRÒ CHƠI',
    titleLine1: 'Cùng nhau.',
    titleLine2: 'Đi xa hơn.',
    description:
      'Giữa những mái nhà phủ tuyết và ánh đèn ấm áp, một câu chuyện mới đang chờ hai bạn viết tiếp.',
    bgImage: '/hero-mountain-night.jpg',
    accent: 'snow',
  },
]

const GAME_WORLDS = [
  {
    id: '01',
    title: 'Vũ trụ kỳ diệu',
    tag: 'PHIÊU LƯU · KHÁM PHÁ',
    image: '/banner_cosmic.jpg',
    description:
      'Bước vào vũ trụ đa sắc nơi mỗi hành tinh là một câu đố chờ hai bạn giải mã.',
    accent: 'cosmic',
  },
  {
    id: '02',
    title: 'Khu vườn bí mật',
    tag: 'PHIÊU LƯU · THIÊN NHIÊN',
    image: '/world-secret-garden.png',
    description:
      'Khu vườn cổ tích ẩn giấu những sinh vật phát sáng giữa rừng cây xanh thẳm.',
    accent: 'garden',
  },
  {
    id: '03',
    title: 'Thị trấn tuyết',
    tag: 'PHIÊU LƯU · KỲ ẢO',
    image: '/hero-mountain-night.jpg',
    description:
      'Thị trấn tuyết giữa đêm đông, nơi hành trình mới bắt đầu dưới ánh đèn vàng ấm.',
    accent: 'snow',
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
  cosmic: 'from-indigo-500 via-purple-600 to-fuchsia-600',
  garden: 'from-emerald-500 via-teal-600 to-cyan-700',
  snow: 'from-amber-400 via-orange-500 to-rose-500',
}

// ──────────────────────────────────────────────────────────────────────────
// Hero Slide Background (with parallax + canvas overlay)
// ──────────────────────────────────────────────────────────────────────────
function HeroBackground({
  image,
  active,
  mouseX,
  mouseY,
}: {
  image: string
  active: boolean
  mouseX: ReturnType<typeof useMotionValue<number>>
  mouseY: ReturnType<typeof useMotionValue<number>>
}) {
  const sx = useTransform(mouseX, [-1, 1], [-12, 12])
  const sy = useTransform(mouseY, [-1, 1], [-8, 8])
  const sxInner = useTransform(mouseX, [-1, 1], [-24, 24])
  const syInner = useTransform(mouseY, [-1, 1], [-16, 16])

  return (
    <motion.div
      className={`absolute inset-0 transition-opacity duration-1000 ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ x: sx, y: sy }}
    >
      <motion.img
        src={image}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{ x: sxInner, y: syInner, scale: 1.08 }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/45 to-black/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E14]/85 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(243,178,46,0.06),transparent_55%)]" />
    </motion.div>
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

  const [currentSlide, setCurrentSlide] = useState(2) // Default = slide 03 (Tuyết trắng) as in reference
  const [isPaused, setIsPaused] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Hero mouse parallax (normalized -1..1)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const sx = useSpring(mouseX, { stiffness: 60, damping: 18 })
  const sy = useSpring(mouseY, { stiffness: 60, damping: 18 })

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = (e.clientY / window.innerHeight) * 2 - 1
      mouseX.set(x)
      mouseY.set(y)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [mouseX, mouseY])

  // Auto slide
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
    }, 6500)
    return () => clearInterval(timer)
  }, [isPaused])

  const slide = HERO_SLIDES[currentSlide]

  const handlePrevSlide = () =>
    setCurrentSlide((p) => (p - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)

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
      className="min-h-screen bg-[#0B0E14] text-slate-100 font-sans selection:bg-amber-400 selection:text-slate-950 overflow-x-hidden cursor-game"
    >
      <GameCursor enabled={true} />

      {/* Layer 1: Hero with parallax + canvas particles */}
      <GlassHeader
        onMenu={() => setMenuOpen(!menuOpen)}
        authed={isAuthenticated}
        onJoin={handleJoinClick}
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
        <section id="hero" className="relative h-screen w-full flex flex-col justify-between overflow-hidden">
          {/* Background layers */}
          <div className="absolute inset-0 z-0">
            {HERO_SLIDES.map((s, idx) => (
              <HeroBackground
                key={s.id}
                image={s.bgImage}
                active={currentSlide === idx}
                mouseX={sx}
                mouseY={sy}
              />
            ))}
            {/* Particle canvas (snow + embers + shooting stars) */}
            <ParticleCanvas snowCount={90} embersCount={26} />
            {/* Cinematic vignette */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_45%,rgba(11,14,20,0.75)_100%)]" />
          </div>

          {/* Animated bottom fog overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-48 z-[1] pointer-events-none">
            <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/80 to-transparent" />
            <div className="absolute -bottom-8 left-[-10%] right-[-10%] h-32 bg-amber-200/5 blur-3xl animate-fog rounded-full" />
            <div className="absolute -bottom-12 left-[20%] right-[10%] h-24 bg-indigo-300/5 blur-3xl animate-fog rounded-full animation-delay-2000" />
          </div>

          {/* Hero text */}
          <div className="relative z-10 w-full px-8 md:px-12 lg:px-16 pt-32 flex-1 flex flex-col justify-center">
            <div className="max-w-3xl space-y-6">
              <Mounted delay={0.1}>
                <div className="inline-flex items-center gap-3">
                  <motion.span
                    animate={{ width: ['0%', '100%', '24px'] }}
                    transition={{ duration: 1.4, delay: 0.2 }}
                    className="h-0.5 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(255,197,41,0.8)]"
                  />
                  <span className="text-[11px] sm:text-xs font-bold tracking-[0.22em] text-amber-300 uppercase">
                    {slide.tagline}
                  </span>
                </div>
              </Mounted>

              <motion.h1
                key={slide.id}
                initial={{ opacity: 0, y: 50, letterSpacing: '-0.06em' }}
                animate={{ opacity: 1, y: 0, letterSpacing: '-0.02em' }}
                transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="text-6xl sm:text-7xl md:text-8xl lg:text-[120px] font-[700] text-white tracking-[-0.02em] leading-[1.05]"
                style={{ textShadow: '0 4px 36px rgba(0,0,0,0.55)' }}
              >
                {slide.titleLine1}
                <br />
                <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                  {slide.titleLine2}
                </span>
              </motion.h1>

              <Mounted delay={0.6}>
                <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed">
                  {slide.description}
                </p>
              </Mounted>

              <Mounted delay={0.8}>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.93 }}
                    onClick={handleJoinClick}
                    className="relative inline-flex items-center gap-3 px-7 py-3.5 bg-amber-400 text-slate-950 text-sm font-extrabold rounded-xl overflow-hidden shadow-[0_0_24px_rgba(243,178,46,0.45)]"
                  >
                    <span className="absolute inset-0 -z-10">
                      <span className="absolute inset-0 rounded-xl bg-amber-400 animate-radar opacity-70" />
                    </span>
                    <Gamepad2 className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">VÀO SẢNH CHƠI</span>
                  </motion.button>
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

          {/* Bottom controls */}
          <Mounted delay={1.0}>
            <div className="relative z-10 w-full px-8 md:px-12 lg:px-16 pb-12 flex items-center justify-between gap-6">
              <div className="flex items-center gap-4 text-xs font-bold tracking-wider">
                {HERO_SLIDES.map((item, idx) => {
                  const active = currentSlide === idx
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => setCurrentSlide(idx)}
                      whileHover={{ y: -2 }}
                      className={`flex items-center gap-2 transition-all cursor-pointer ${
                        active ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <span className="font-mono text-xs">{item.id}</span>
                      <span className="relative h-0.5 rounded-full overflow-hidden">
                        <motion.span
                          animate={{ width: active ? 44 : 24 }}
                          transition={{ duration: 0.4 }}
                          className={`block h-0.5 rounded-full ${
                            active ? 'bg-amber-400' : 'bg-slate-700'
                          }`}
                        />
                      </span>
                      {active && (
                        <motion.span
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-amber-300 font-bold text-xs whitespace-nowrap"
                        >
                          {item.navLabel}
                        </motion.span>
                      )}
                    </motion.button>
                  )
                })}
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-amber-300/80 font-semibold mr-3 tracking-wider">
                  0{currentSlide + 1} / 0{HERO_SLIDES.length}
                </span>
                {[
                  { icon: ChevronLeft, onClick: handlePrevSlide, label: 'Prev' },
                  {
                    icon: isPaused ? Play : Pause,
                    onClick: () => setIsPaused(!isPaused),
                    label: isPaused ? 'Play' : 'Pause',
                    fill: true,
                  },
                  { icon: ArrowDown, onClick: scrollToWorlds, label: 'Scroll' },
                ].map((btn) => {
                  const I = btn.icon
                  return (
                    <motion.button
                      key={btn.label}
                      onClick={btn.onClick}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.92 }}
                      aria-label={btn.label}
                      className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 flex items-center justify-center text-white"
                    >
                      <I className={`w-4 h-4 ${btn.fill ? 'fill-white' : ''}`} />
                    </motion.button>
                  )
                })}
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
                <Heart className="w-6 h-6 text-amber-400" />
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