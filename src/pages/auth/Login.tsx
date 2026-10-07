import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores'
import { notify } from '@/lib/toast'
import { ArrowLeft, X, Heart } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const { login, isLoading, error, clearError } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showDemoMenu, setShowDemoMenu] = useState(false)

  // Floating Particles Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Animated Floating Ember Particles
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // Particle pool
    const numParticles = 45
    const particles: Array<{
      x: number
      y: number
      size: number
      speedY: number
      speedX: number
      opacity: number
      pulseSpeed: number
    }> = []

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.5 + 1,
        speedY: Math.random() * 0.6 + 0.2,
        speedX: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.7 + 0.3,
        pulseSpeed: Math.random() * 0.02 + 0.005,
      })
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      particles.forEach((p) => {
        p.y -= p.speedY
        p.x += p.speedX
        p.opacity += Math.sin(Date.now() * p.pulseSpeed) * 0.01

        if (p.y < -10) {
          p.y = height + 10
          p.x = Math.random() * width
        }
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(245, 158, 11, ${Math.max(0.1, Math.min(0.9, p.opacity))})`
        ctx.shadowBlur = 8
        ctx.shadowColor = '#f59e0b'
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

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
      notify.error(err.response?.data?.message || 'Tên đăng nhập hoặc mật khẩu không chính xác', 'Đăng nhập thất bại')
    }
  }

  const handleDemoSelect = async (username: string, pass: string) => {
    setEmail(username)
    setPassword(pass)
    try {
      const user = await login({ username, password: pass })
      notify.success(`Đăng nhập demo thành công với ${username}!`, 'Thành công')
      if (user.role === 'Admin') navigate('/admin')
      else if (user.role === 'Moderator') navigate('/moderator')
      else navigate('/portal/lobby')
    } catch (err: any) {
      notify.error('Lỗi đăng nhập demo', 'Lỗi')
    }
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[#06080e] text-slate-100 font-sans selection:bg-yellow-400 selection:text-slate-950 flex flex-col justify-between">
      {/* Background Gothic Castle Artwork & Animated Zoom */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-45 animate-pulse"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000&auto=format&fit=crop)',
            animationDuration: '14s',
          }}
        />
        {/* Dark Vignette & Mood Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#06080e] via-[#06080e]/50 to-[#06080e]/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06080e]/95 via-transparent to-[#06080e]/95" />

        {/* Pulsing Warm Torch Glow Blobs */}
        <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-amber-500/15 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-orange-600/10 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Floating Animated Ember Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-20 w-full px-8 md:px-12 lg:px-16 py-6 flex items-center justify-between">
        {/* Top-Left Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-yellow-400 flex items-center justify-center text-slate-950 shadow-lg shadow-yellow-400/20 group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 fill-slate-950" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-white leading-none">
              HOLD MY HAND
            </span>
            <span className="text-[9px] tracking-widest text-slate-400 font-bold uppercase mt-0.5">
              GAME PORTAL CO-OP
            </span>
          </div>
        </Link>

        {/* Top-Right Navigation Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Trang chủ
        </Link>
      </header>

      {/* Main Content Split View matching screenshot */}
      <main className="relative z-20 w-full px-8 md:px-12 lg:px-16 py-8 flex-1 flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Side Showcase Text */}
        <div className="max-w-xl space-y-6">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-3">
            <span className="h-0.5 w-6 bg-yellow-400 rounded-full" />
            <span className="text-[11px] font-bold text-yellow-400 tracking-[0.2em] uppercase font-sans">
              BETTER, TOGETHER.
            </span>
          </div>

          {/* Main Huge Title */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[96px] font-black text-white tracking-tight leading-[1.04] font-sans antialiased">
            HOLD
            <br />
            MY HAND<span className="text-yellow-400 font-black">.</span>
          </h1>

          {/* Yellow Accent Line */}
          <div className="h-1 w-16 bg-yellow-400 rounded-full" />

          {/* Subtitle */}
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal max-w-md">
            Một người bạn. Một cuộc phiêu lưu.
            <br />
            Vô vàn thế giới đang chờ bạn.
          </p>
        </div>

        {/* Right Side Glassmorphic Floating Entry Point Box */}
        <div className="w-full max-w-[420px] bg-black/75 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl relative">
          {/* Header inside Entry Box */}
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-yellow-400 uppercase tracking-widest block">
                PORTAL ACCESS
              </span>
              <span className="font-mono text-[10px] text-slate-500 block mt-1">
                22 : HMH-092-01
              </span>
            </div>
            <button
              onClick={() => navigate('/')}
              className="w-8 h-8 rounded-md border border-white/10 bg-white/5 hover:bg-white/15 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Title inside Box */}
          <h2 className="text-4xl md:text-[44px] font-black text-white tracking-tight mt-8 mb-8 leading-none font-sans">
            ENTRY
            <br />
            POINT
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-lg text-xs font-medium text-center">
                {error}
              </div>
            )}

            {/* Field 1: Username / Email */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                TÊN ĐĂNG NHẬP / EMAIL
              </label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="USER_LOGIN_TOKEN"
                className="w-full px-4 py-3.5 bg-[#0b0e17]/90 border border-slate-800 rounded-lg text-sm text-white placeholder:text-slate-600 font-mono focus:border-yellow-400/80 focus:outline-none transition-colors"
              />
            </div>

            {/* Field 2: Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  KHÓA BẢO MẬT
                </label>
              </div>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 bg-[#0b0e17]/90 border border-slate-800 rounded-lg text-sm text-white placeholder:text-slate-600 font-mono focus:border-yellow-400/80 focus:outline-none transition-colors pr-16"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-xs font-bold text-slate-400 hover:text-white tracking-wider"
                >
                  {showPassword ? 'ẨN' : 'HIỆN'}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-white hover:bg-slate-100 text-slate-950 font-black text-sm tracking-wider uppercase rounded-lg shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? 'ĐANG XÁC NHẬN...' : 'XÁC NHẬN TRUY CẬP'}
            </button>
          </form>

          {/* Bottom Actions inside Box */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/10 text-xs">
            <Link
              to="/register"
              className="font-bold text-slate-400 hover:text-white uppercase tracking-wider transition-colors"
            >
              TẠO TÀI KHOẢN
            </Link>

            <button
              type="button"
              onClick={() => setShowDemoMenu(!showDemoMenu)}
              className="font-bold text-slate-400 hover:text-yellow-400 uppercase tracking-wider transition-colors"
            >
              TẢI KHỎAN DEMO
            </button>
          </div>

          {/* Demo Account Selection Menu */}
          {showDemoMenu && (
            <div className="mt-4 p-4 bg-slate-950 border border-yellow-400/30 rounded-xl animate-fadeIn space-y-2">
              <p className="text-[11px] font-bold text-yellow-400 uppercase tracking-wider text-center">
                Chọn nhanh tài khoản Demo 1-Click:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoSelect('player1', 'Player@123')}
                  className="px-3 py-2 bg-white/5 hover:bg-yellow-400 hover:text-slate-950 text-xs font-bold rounded-lg border border-white/10 transition-all text-slate-200"
                >
                  player1
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoSelect('player2', 'Player@123')}
                  className="px-3 py-2 bg-white/5 hover:bg-yellow-400 hover:text-slate-950 text-xs font-bold rounded-lg border border-white/10 transition-all text-slate-200"
                >
                  player2
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoSelect('admin', 'Admin@123')}
                  className="px-3 py-2 bg-white/5 hover:bg-yellow-400 hover:text-slate-950 text-xs font-bold rounded-lg border border-white/10 transition-all text-slate-200"
                >
                  admin
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoSelect('moderator', 'Mod@123')}
                  className="px-3 py-2 bg-white/5 hover:bg-yellow-400 hover:text-slate-950 text-xs font-bold rounded-lg border border-white/10 transition-all text-slate-200"
                >
                  moderator
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Status Bar */}
      <footer className="relative z-20 w-full px-8 md:px-12 lg:px-16 py-6 border-t border-white/5 text-[11px] font-bold text-slate-500 uppercase tracking-widest flex flex-col sm:flex-row items-center justify-between gap-4">
        <span>HOLD MY HAND · GAME PORTAL CO-OP</span>
        <span>HAI NGƯỜI. MỘT HÀNH TRÌNH.</span>
      </footer>
    </div>
  )
}