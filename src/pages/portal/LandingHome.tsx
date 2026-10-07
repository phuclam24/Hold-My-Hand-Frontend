import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores'
import {
  Gamepad2,
  Play,
  Pause,
  ChevronLeft,
  ArrowDown,
  ArrowRight,
  Menu,
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
} from 'lucide-react'
import { notify } from '@/lib/toast'

// Hero Banner Slides Data matching exact text and images from reference screenshots
const HERO_SLIDES = [
  {
    id: '01',
    navLabel: 'Vũ trụ',
    tagline: 'KHÔNG CHỈ LÀ MỘT TRÒ CHƠI',
    titleLine1: 'Hai người.',
    titleLine2: 'Vô vàn thế giới.',
    description:
      'Một người bạn. Một cuộc phiêu lưu. Cùng bước vào những thế giới nơi trí tưởng tượng không có giới hạn.',
    bgImage:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000&auto=format&fit=crop',
  },
  {
    id: '02',
    navLabel: 'Khu vườn',
    tagline: 'KHÔNG CHỈ LÀ MỘT TRÒ CHƠI',
    titleLine1: 'Nhỏ bé.',
    titleLine2: 'Kỳ diệu.',
    description:
      'Đi qua những chiếc lá khổng lồ, tìm thấy những điều kỳ diệu trong những điều nhỏ bé. Hành trình đẹp hơn khi có nhau.',
    bgImage:
      'https://images.unsplash.com/photo-1511497584788-876761c119ef?q=80&w=2000&auto=format&fit=crop',
  },
  {
    id: '03',
    navLabel: 'Tuyết trắng',
    tagline: 'KHÔNG CHỈ LÀ MỘT TRÒ CHƠI',
    titleLine1: 'Cùng nhau.',
    titleLine2: 'Đi xa hơn.',
    description:
      'Giữa những mái nhà phủ tuyết và ánh đèn ấm áp, một câu chuyện mới đang chờ hai bạn viết tiếp.',
    bgImage:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2000&auto=format&fit=crop',
  },
]

// 3 World Cards matching Section 2 screenshot
const GAME_WORLDS = [
  {
    id: '01',
    title: 'Vũ trụ kỳ diệu',
    tag: 'PHIÊU LƯU · KHÁM PHÁ',
    image:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: '02',
    title: 'Khu vườn bí mật',
    tag: 'PHIÊU LƯU · THIÊN NHIÊN',
    image:
      'https://images.unsplash.com/photo-1511497584788-876761c119ef?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: '03',
    title: 'Thị trấn tuyết',
    tag: 'PHIÊU LƯU · KỲ ẢO',
    image:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1000&auto=format&fit=crop',
  },
]

// Features Data
const COOP_FEATURES = [
  {
    icon: Tv,
    title: 'Màn Hình Kép Động (Split-Screen)',
    description:
      'Góc nhìn đôi thời gian thực cho phép hai người chơi quan sát từng bước di chuyển và phối hợp hành động tức thì.',
  },
  {
    icon: Zap,
    title: 'Cơ Chế Dây Tơ Duyên (Tethering)',
    description:
      'Liên kết 2 nhân vật bằng sợi dây năng lượng để đu qua vực sâu, truyền năng lượng và thực hiện các pha tung người ngoạn mục.',
  },
  {
    icon: Gamepad2,
    title: 'Minigame Đội Đối Kháng',
    description:
      'Hơn 20 trò chơi phụ vui nhộn ẩn giấu khắp bản đồ giúp giải trí và ganh đua điểm số dí dỏm cùng bạn chơi.',
  },
  {
    icon: Users,
    title: "Friend's Pass Độc Quyền",
    description:
      'Chỉ cần 1 người tạo phòng, người còn lại có thể tham gia hoàn toàn miễn phí thông qua mã mời sảnh trực tuyến.',
  },
]

export default function LandingHome() {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout, login, isLoading } = useAuthStore()

  // Slider State
  const [currentSlide, setCurrentSlide] = useState(2) // Default to slide 3 as in image 1
  const [isPaused, setIsPaused] = useState(false)

  // Drawer / Menu State
  const [menuOpen, setMenuOpen] = useState(false)

  // Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Auto slide timer
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [isPaused])

  const slide = HERO_SLIDES[currentSlide]

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
  }

  const scrollToWorlds = () => {
    const el = document.getElementById('worlds')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const handleJoinClick = () => {
    if (isAuthenticated) {
      navigate('/portal/lobby')
    } else {
      navigate('/login')
    }
  }

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (authMode === 'login') {
      try {
        const loggedUser = await login({ username, password })
        notify.success(`Chào mừng ${loggedUser.displayName || loggedUser.username}!`, 'Đăng nhập thành công')
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
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 font-sans selection:bg-yellow-400 selection:text-slate-950 overflow-x-hidden">
      {/* Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <div className="w-full px-8 md:px-12 lg:px-16 h-20 flex items-center justify-between">
          {/* Logo Mark using logo.jpg */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/logo.jpg"
              alt="Hold My Hand Logo"
              className="h-10 sm:h-12 w-auto object-contain rounded-lg shadow-md group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white leading-none">
                HOLD MY HAND
              </span>
              <span className="text-[9px] tracking-widest text-slate-400 font-bold uppercase mt-0.5">
                GAME PORTAL CO-OP
              </span>
            </div>
          </Link>

          {/* Right Header Navigation & Actions */}
          <div className="flex items-center gap-6">
            <span className="hidden md:inline-block text-xs font-bold tracking-widest text-slate-300 uppercase">
              BETTER, TOGETHER.
            </span>

            {isAuthenticated && user ? (
              <button
                onClick={handleJoinClick}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 text-slate-950 text-xs font-bold rounded-lg hover:bg-yellow-300 transition-all shadow-md"
              >
                <Gamepad2 className="w-4 h-4" />
                VÀO SẢNH CHƠI
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-all cursor-pointer"
              >
                ĐĂNG NHẬP
              </button>
            )}

            {/* Hamburger Menu Toggle Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors"
              aria-label="Toggle Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Drawer Navigation */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex flex-col justify-between p-8 md:p-12 animate-fadeIn">
          <div className="flex items-center justify-between w-full px-8 md:px-12 lg:px-16">
            <div className="flex items-center gap-3">
              <img
                src="/logo.jpg"
                alt="Hold My Hand Logo"
                className="h-10 w-auto object-contain rounded-lg"
              />
              <span className="text-2xl font-black text-white">Hold My Hand</span>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              className="w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="w-full px-8 md:px-12 lg:px-16 space-y-6 text-3xl md:text-5xl font-black">
            <div>
              <a
                href="#hero"
                onClick={() => setMenuOpen(false)}
                className="hover:text-yellow-400 transition-colors"
              >
                Trang chủ
              </a>
            </div>
            <div>
              <a
                href="#worlds"
                onClick={() => setMenuOpen(false)}
                className="hover:text-yellow-400 transition-colors"
              >
                Thế giới Game
              </a>
            </div>
            <div>
              <a
                href="#features"
                onClick={() => setMenuOpen(false)}
                className="hover:text-yellow-400 transition-colors"
              >
                Tính năng Co-Op
              </a>
            </div>
          </nav>

          <div className="w-full px-8 md:px-12 lg:px-16 flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-slate-300">
                  Chào mừng, {user.displayName || user.username}
                </span>
                <button
                  onClick={() => {
                    logout()
                    setMenuOpen(false)
                  }}
                  className="px-4 py-2 bg-rose-500/20 text-rose-300 rounded-lg text-sm font-bold hover:bg-rose-500/30 transition-colors flex items-center gap-2"
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
                  className="px-6 py-3 bg-yellow-400 text-slate-950 font-bold rounded-xl text-sm"
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
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10">
        {/* HERO BANNER SECTION (Replicating Image 1 exactly) */}
        <section id="hero" className="relative h-screen w-full flex flex-col justify-between overflow-hidden">
          {/* Background Image with Smooth Slide Fade Transition */}
          <div className="absolute inset-0 z-0">
            {HERO_SLIDES.map((s, idx) => (
              <div
                key={s.id}
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                  currentSlide === idx ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
                }`}
                style={{
                  backgroundImage: `url(${s.bgImage})`,
                  transition: 'opacity 1s ease-in-out, transform 10s ease-out',
                }}
              />
            ))}
            {/* Dark Atmospheric Gradient Overlays for readable text */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d14] via-[#0a0d14]/40 to-black/60" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0d14]/80 via-transparent to-transparent" />
          </div>

          {/* Center Hero Text Area */}
          <div className="relative z-10 w-full px-8 md:px-12 lg:px-16 pt-32 flex-1 flex flex-col justify-center">
            <div className="max-w-2xl space-y-6">
              {/* Tagline Badge with Yellow Line indicator */}
              <div className="inline-flex items-center gap-3">
                <span className="h-0.5 w-6 bg-yellow-400 rounded-full" />
                <span className="text-[11px] sm:text-xs font-bold tracking-[0.18em] text-white uppercase font-sans">
                  {slide.tagline}
                </span>
              </div>

              {/* Title */}
              <div key={slide.id} className="space-y-1 animate-fadeIn">
                <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[104px] font-[700] text-white tracking-[-0.02em] leading-[1.06] font-sans antialiased">
                  {slide.titleLine1}
                  <br />
                  {slide.titleLine2}
                </h1>
              </div>

              {/* Subtitle */}
              <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed font-normal pt-2 font-sans antialiased">
                {slide.description}
              </p>
            </div>
          </div>

          {/* Bottom Bar: Slide Tab Navigation (Left) & Controls (Right) */}
          <div className="relative z-10 w-full px-8 md:px-12 lg:px-16 pb-12 flex items-center justify-between gap-6">
            {/* Left: Slide Selector Tabs matching format "01 —— 02 —— 03 —— Tuyết trắng" */}
            <div className="flex items-center gap-4 text-xs font-bold tracking-wider">
              {HERO_SLIDES.map((item, idx) => {
                const isActive = currentSlide === idx
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentSlide(idx)}
                    className={`flex items-center gap-2 transition-all cursor-pointer ${
                      isActive ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <span className="font-mono text-xs">{item.id}</span>
                    <span
                      className={`h-0.5 rounded-full transition-all ${
                        isActive ? 'w-10 bg-yellow-400' : 'w-6 bg-slate-700'
                      }`}
                    />
                    {isActive && (
                      <span className="text-white font-bold text-xs">{item.navLabel}</span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Right: Slide Controls matching "03 / 03  ←  ||  ↓" */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-slate-400 font-semibold mr-3">
                0{currentSlide + 1} / 0{HERO_SLIDES.length}
              </span>

              {/* Prev Button */}
              <button
                onClick={handlePrevSlide}
                aria-label="Previous slide"
                className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Play / Pause Toggle Button */}
              <button
                onClick={() => setIsPaused(!isPaused)}
                aria-label={isPaused ? 'Play' : 'Pause'}
                className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
              >
                {isPaused ? (
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                ) : (
                  <Pause className="w-4 h-4 fill-white" />
                )}
              </button>

              {/* Scroll Down Arrow Button */}
              <button
                onClick={scrollToWorlds}
                aria-label="Scroll down"
                className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 2: CHỌN CUỘC PHIÊU LƯU CỦA BẠN (Replicating Image 2 exactly) */}
        <section id="worlds" className="py-24 w-full px-8 md:px-12 lg:px-16">
          {/* Header Layout */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-3 mb-2">
                <span className="h-0.5 w-6 bg-yellow-400 rounded-full" />
                <span className="text-[11px] sm:text-xs font-bold tracking-[0.2em] text-slate-300 uppercase font-sans">
                  CHỌN CUỘC PHIÊU LƯU CỦA BẠN
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-[-0.02em] font-sans">
                Những thế giới đang chờ.
              </h2>
            </div>
            <p className="text-slate-400 text-xs md:text-sm font-medium tracking-wide">
              Hai người chơi. Một hành trình đáng nhớ.
            </p>
          </div>

          {/* 3 World Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {GAME_WORLDS.map((world) => (
              <div
                key={world.id}
                onClick={handleJoinClick}
                className="group cursor-pointer flex flex-col space-y-4"
              >
                {/* Image Container with Floating Yellow Arrow Button */}
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900 border border-white/10 group-hover:border-yellow-400/50 transition-all duration-300">
                  <img
                    src={world.image}
                    alt={world.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Dark subtle gradient bottom overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Floating Yellow Circular Arrow Button on bottom right corner of image */}
                  <div className="absolute bottom-4 right-4 w-11 h-11 rounded-full bg-yellow-400 flex items-center justify-center text-slate-950 shadow-lg group-hover:scale-110 group-hover:bg-yellow-300 transition-all duration-300">
                    <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                  </div>
                </div>

                {/* Text Content below image */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                      {world.title}
                    </h3>
                    <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mt-1">
                      {world.tag}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-slate-500 font-semibold pt-1">
                    {world.id}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer tagline at bottom right of section matching image 2 */}
          <div className="mt-16 pt-8 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
            <span>© 2026 Hold My Hand Portal</span>
            <span className="font-medium tracking-wide">Made for two. Remembered forever</span>
          </div>
        </section>

        {/* SECTION 3: TÍNH NĂNG CO-OP NỔI BẬT */}
        <section id="features" className="py-24 bg-slate-950/60 border-t border-white/10">
          <div className="w-full px-8 md:px-12 lg:px-16">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <span className="px-4 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs font-bold uppercase tracking-widest inline-block">
                CƠ CHẾ PHỐI HỢP ĐỘC QUYỀN
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-white">
                Thiết kế dành riêng cho 2 người chơi
              </h2>
              <p className="text-slate-400 text-sm md:text-base">
                Không thể chơi đơn lẻ — mọi câu đố và thử thách đều đòi hỏi sự thấu hiểu và phối hợp ăn ý từ cả hai phía.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {COOP_FEATURES.map((feat, idx) => {
                const Icon = feat.icon
                return (
                  <div
                    key={idx}
                    className="p-8 rounded-2xl bg-slate-900/40 border border-white/10 hover:border-yellow-400/30 transition-all hover:-translate-y-1 space-y-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{feat.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#06080e] border-t border-white/10 text-slate-400 py-12 text-xs">
        <div className="w-full px-8 md:px-12 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="Hold My Hand Logo"
              className="h-8 w-auto object-contain rounded-lg"
            />
            <span className="text-sm font-black text-white tracking-widest uppercase">
              HOLD MY HAND PORTAL
            </span>
          </div>

          <p className="text-slate-500 text-xs">
            © 2026 Hold My Hand Game Portal. Inspired by It Takes Two & Hazelight.
          </p>
        </div>
      </footer>

      {/* AUTH MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 mb-1">
                <Heart className="w-6 h-6 text-yellow-400" />
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
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Mật khẩu
                </label>
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
                className="w-full py-3.5 bg-yellow-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-yellow-400/20 hover:bg-yellow-300 transition-all disabled:opacity-50"
              >
                {isLoading ? 'Đang xử lý...' : authMode === 'login' ? 'ĐĂNG NHẬP' : 'TIẾP TỤC ĐĂNG KÝ'}
              </button>
            </form>

            <div className="text-center pt-2 text-xs text-slate-400 space-y-3">
              <div>
                {authMode === 'login' ? (
                  <span>
                    Chưa có tài khoản?{' '}
                    <button
                      onClick={() => {
                        setShowAuthModal(false)
                        navigate('/register')
                      }}
                      className="font-bold text-yellow-400 hover:underline"
                    >
                      Đăng ký tại đây
                    </button>
                  </span>
                ) : (
                  <span>
                    Đã có tài khoản?{' '}
                    <button
                      onClick={() => setAuthMode('login')}
                      className="font-bold text-yellow-400 hover:underline"
                    >
                      Đăng nhập
                    </button>
                  </span>
                )}
              </div>

              {/* Demo accounts selector */}
              {authMode === 'login' && (
                <div className="pt-3 border-t border-slate-800">
                  <p className="text-[11px] font-semibold text-slate-400 mb-2">
                    Chọn nhanh tài khoản demo:
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        setUsername('player1')
                        setPassword('Player@123')
                      }}
                      className="text-xs px-2.5 py-1 bg-slate-950 border border-slate-700 rounded-lg text-slate-300 hover:border-yellow-400 hover:text-yellow-400 transition-all"
                    >
                      player1
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUsername('player2')
                        setPassword('Player@123')
                      }}
                      className="text-xs px-2.5 py-1 bg-slate-950 border border-slate-700 rounded-lg text-slate-300 hover:border-yellow-400 hover:text-yellow-400 transition-all"
                    >
                      player2
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUsername('admin')
                        setPassword('Admin@123')
                      }}
                      className="text-xs px-2.5 py-1 bg-slate-950 border border-slate-700 rounded-lg text-slate-300 hover:border-yellow-400 hover:text-yellow-400 transition-all"
                    >
                      admin
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUsername('moderator')
                        setPassword('Mod@123')
                      }}
                      className="text-xs px-2.5 py-1 bg-slate-950 border border-slate-700 rounded-lg text-slate-300 hover:border-yellow-400 hover:text-yellow-400 transition-all"
                    >
                      moderator
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
