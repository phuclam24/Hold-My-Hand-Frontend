import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/stores'
import { notify } from '@/lib/toast'
import { ArrowLeft, X, Eye, EyeOff, LogIn, Loader2 } from 'lucide-react'
import ParticleCanvas from '@/components/landing/ParticleCanvas'

export default function Login() {
  const navigate = useNavigate()
  const { login, isLoading, error, clearError } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    try {
      const user = await login({ username: email, password })
      notify.success(`Chào mừng ${user.displayName || user.username}!`, 'Đăng nhập thành công')
      if (user.role === 'Admin') navigate('/admin')
      else if (user.role === 'Moderator') navigate('/moderator')
      else navigate('/portal/lobby')
    } catch (err: any) {
      const message =
        err.response?.status === 401
          ? 'Tên đăng nhập hoặc mật khẩu không chính xác'
          : err.response?.data?.message || 'Đăng nhập thất bại'
      notify.error(message, 'Đăng nhập thất bại')
    }
  }

  const fieldClass = (key: string) =>
    `flex items-center gap-3 rounded-xl border bg-[#0b0e17]/90 px-4 transition-all duration-300 ${
      focused === key
        ? 'border-amber-400/80 shadow-[0_0_24px_-6px_rgba(243,178,46,0.55)]'
        : 'border-slate-800 hover:border-slate-700'
    }`

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden bg-[#06080e] text-slate-100 font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* ─── Background ─── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src="/banner_castle.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06080e] via-[#06080e]/60 to-[#06080e]/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06080e]/95 via-[#06080e]/25 to-[#06080e]/95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(6,8,14,0.85)_100%)]" />

        {/* Pulsing warm torch glows */}
        <div className="absolute top-1/2 left-1/4 h-72 w-72 rounded-full bg-amber-500/15 blur-[120px] animate-pulse" />
        <div className="absolute top-1/3 right-1/3 h-96 w-96 rounded-full bg-orange-600/10 blur-[140px] animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Particle canvas */}
        <div className="absolute inset-0 opacity-70">
          <ParticleCanvas snowCount={50} embersCount={16} />
        </div>
      </div>

      {/* ─── Header ─── */}
      <header className="relative z-20 flex w-full items-center justify-between px-6 py-6 sm:px-8 md:px-12 lg:px-16">
        <Link to="/" className="group flex items-center gap-3">
          <img
            src="/logo.jpg"
            alt="Hold My Hand"
            className="h-10 w-10 rounded-lg object-cover shadow-lg shadow-amber-500/20 transition-transform group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="text-lg font-black leading-none tracking-tight text-white">
              HOLD MY HAND
            </span>
            <span className="mt-0.5 text-[9px] font-bold uppercase tracking-widest text-slate-400">
              GAME PORTAL CO-OP
            </span>
          </div>
        </Link>

        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-white/25 hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Trang chủ
        </Link>
      </header>

      {/* ─── Main ─── */}
      <main className="relative z-20 flex w-full flex-1 flex-col items-center justify-center px-6 py-10 md:flex-row md:gap-16 md:px-12 lg:px-16">
        {/* Left showcase */}
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl space-y-6"
        >
          <div className="inline-flex items-center gap-3">
            <span className="h-0.5 w-6 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(255,197,41,0.8)]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400">
              BETTER, TOGETHER.
            </span>
          </div>

          <h1 className="text-5xl font-black leading-[1.04] tracking-tight text-white antialiased sm:text-6xl md:text-7xl lg:text-[86px]">
            HOLD
            <br />
            MY HAND<span className="text-amber-400">.</span>
          </h1>

          <div className="h-1 w-16 rounded-full bg-amber-400" />

          <p className="max-w-md text-base leading-relaxed text-slate-300 sm:text-lg">
            Một người bạn. Một cuộc phiêu lưu.
            <br />
            Vô vàn thế giới đang chờ bạn.
          </p>

          {/* Feature chips */}
          <div className="flex flex-wrap gap-2 pt-2">
            {['Split-Screen', 'Tethering', 'Minigame', "Friend's Pass"].map((f) => (
              <span
                key={f}
                className="inline-flex min-h-8 items-center rounded-full border border-white/15 bg-white/[0.04] px-3 font-mono text-[11px] text-slate-300"
              >
                {f}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Right form card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-10 w-full max-w-[420px] rounded-2xl border border-white/10 bg-black/70 p-8 shadow-2xl backdrop-blur-2xl md:mt-0 md:p-10"
        >
          {/* Card header */}
          <div className="flex items-start justify-between">
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-widest text-amber-400">
                PORTAL ACCESS
              </span>
              <span className="mt-1 block font-mono text-[10px] text-slate-500">
                22 : HMH-092-01
              </span>
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/5 text-slate-400 transition-colors hover:bg-white/15 hover:text-white"
              aria-label="Đóng"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <h2 className="mb-8 mt-8 font-sans text-4xl font-black leading-none tracking-tight text-white md:text-[44px]">
            ENTRY
            <br />
            POINT
          </h2>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-center text-xs font-medium text-rose-300"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                TÊN ĐĂNG NHẬP / EMAIL
              </label>
              <div className={fieldClass('email')}>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  placeholder="USER_LOGIN_TOKEN"
                  autoComplete="username"
                  className="w-full bg-transparent py-3.5 font-mono text-sm text-white placeholder:text-slate-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                KHÓA BẢO MẬT
              </label>
              <div className={fieldClass('password')}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-transparent py-3.5 font-mono text-sm text-white placeholder:text-slate-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  className="text-slate-400 transition-colors hover:text-amber-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-400 py-4 text-sm font-black uppercase tracking-wider text-slate-950 shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.01] hover:bg-amber-300 hover:shadow-amber-500/35 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  ĐANG XÁC NHẬN...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  XÁC NHẬN TRUY CẬP
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-6 text-xs">
            <Link
              to="/register"
              className="font-bold uppercase tracking-wider text-slate-400 transition-colors hover:text-amber-300"
            >
              TẠO TÀI KHOẢN
            </Link>
            <span className="text-slate-600">HOẶC</span>
            <Link
              to="/"
              className="font-bold uppercase tracking-wider text-slate-400 transition-colors hover:text-amber-300"
            >
              THAM QUAN TRANG CHỦ
            </Link>
          </div>
        </motion.div>
      </main>

      {/* ─── Footer ─── */}
      <footer className="relative z-20 flex w-full flex-col items-center justify-between gap-4 border-t border-white/5 px-6 py-6 text-[11px] font-bold uppercase tracking-widest text-slate-500 sm:flex-row sm:px-8 md:px-12 lg:px-16">
        <span>HOLD MY HAND · GAME PORTAL CO-OP</span>
        <span className="text-slate-600">HAI NGƯỜI. MỘT HÀNH TRÌNH.</span>
      </footer>
    </div>
  )
}
