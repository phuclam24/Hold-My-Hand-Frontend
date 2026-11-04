import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/stores'
import { notify } from '@/lib/toast'
import { Mail, Lock, User, UserPlus, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react'
import ParticleCanvas from '@/components/landing/ParticleCanvas'

export default function Register() {
  const navigate = useNavigate()
  const { register, isLoading } = useAuthStore()

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
  })
  const [focus, setFocus] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (form.password !== form.confirmPassword) {
      notify.error('Mật khẩu xác nhận không khớp')
      return
    }
    if (form.password.length < 6) {
      notify.error('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    try {
      await register({
        username: form.username,
        email: form.email,
        password: form.password,
        displayName: form.displayName,
      })
      notify.success('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.', 'Chào mừng')
      navigate('/login', { state: { registered: true } })
    } catch (err: any) {
      notify.error(err.response?.data?.message || 'Đăng ký thất bại', 'Vui lòng thử lại')
    }
  }

  const fieldClass = (key: string) =>
    `flex items-center gap-3 rounded-xl border bg-[#0b0e17]/90 px-4 transition-all duration-300 ${
      focus === key
        ? 'border-amber-400/80 shadow-[0_0_24px_-6px_rgba(243,178,46,0.55)]'
        : 'border-slate-800 hover:border-slate-700'
    }`

  const inputClass =
    'w-full bg-transparent py-3.5 font-mono text-sm text-white placeholder:text-slate-600 focus:outline-none'

  const renderInput = (
    key: keyof typeof form,
    icon: React.ReactNode,
    type: string,
    placeholder: string,
    autoComplete: string,
  ) => (
    <div className={fieldClass(key)}>
      <span
        className={`shrink-0 transition-colors ${
          focus === key ? 'text-amber-400' : 'text-slate-500'
        }`}
      >
        {icon}
      </span>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        onFocus={() => setFocus(key)}
        onBlur={() => setFocus(null)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={inputClass}
      />
    </div>
  )

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#06080e] text-slate-100 font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* ─── Background ─── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src="/world-secret-garden.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06080e] via-[#06080e]/70 to-[#06080e]/92" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(6,8,14,0.88)_100%)]" />

        <div className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-emerald-500/10 blur-[120px] animate-pulse" />
        <div className="absolute -right-24 bottom-1/4 h-80 w-80 rounded-full bg-amber-500/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

        <div className="absolute inset-0 opacity-60">
          <ParticleCanvas snowCount={40} embersCount={14} />
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
      <main className="relative z-20 flex w-full flex-1 items-center justify-center px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[480px]"
        >
          <div className="mb-6 text-center">
            <div className="mb-3 inline-flex items-center justify-center gap-3">
              <img
                src="/logo.jpg"
                alt="Hold My Hand"
                className="h-12 w-12 rounded-xl object-cover shadow-lg shadow-amber-500/25"
              />
              <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-pink-400 bg-clip-text text-2xl font-black text-transparent">
                Hold My Hand
              </span>
            </div>
            <h1 className="text-3xl font-black text-white">TẠO TÀI KHOẢN</h1>
            <p className="mt-1 text-sm text-slate-400">
              Bắt đầu hành trình cùng người bạn đồng hành ngay hôm nay
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-7 shadow-2xl backdrop-blur-2xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  TÊN HIỂN THỊ
                </label>
                {renderInput(
                  'displayName',
                  <User className="h-5 w-5" />,
                  'text',
                  'Tên hiển thị trong game',
                  'nickname',
                )}
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  USERNAME
                </label>
                {renderInput(
                  'username',
                  <User className="h-5 w-5" />,
                  'text',
                  'username',
                  'username',
                )}
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  EMAIL
                </label>
                {renderInput(
                  'email',
                  <Mail className="h-5 w-5" />,
                  'email',
                  'email@example.com',
                  'email',
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    MẬT KHẨU
                  </label>
                  <div className={fieldClass('password')}>
                    <span
                      className={`shrink-0 transition-colors ${
                        focus === 'password' ? 'text-amber-400' : 'text-slate-500'
                      }`}
                    >
                      <Lock className="h-5 w-5" />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      onFocus={() => setFocus('password')}
                      onBlur={() => setFocus(null)}
                      placeholder="Tối thiểu 6 ký tự"
                      autoComplete="new-password"
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                      className="shrink-0 text-slate-500 transition-colors hover:text-amber-300"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    XÁC NHẬN
                  </label>
                  <div className={fieldClass('confirmPassword')}>
                    <span
                      className={`shrink-0 transition-colors ${
                        focus === 'confirmPassword' ? 'text-amber-400' : 'text-slate-500'
                      }`}
                    >
                      <Lock className="h-5 w-5" />
                    </span>
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      onFocus={() => setFocus('confirmPassword')}
                      onBlur={() => setFocus(null)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      aria-label={showConfirm ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                      className="shrink-0 text-slate-500 transition-colors hover:text-amber-300"
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 py-3.5 font-bold text-white shadow-lg shadow-orange-500/30 transition-all hover:scale-[1.02] hover:shadow-orange-500/50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ĐANG TẠO...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5" />
                    TẠO TÀI KHOẢN
                  </>
                )}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-slate-400">
              Đã có tài khoản?{' '}
              <Link
                to="/login"
                className="font-bold text-amber-400 transition-colors hover:text-amber-300"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </motion.div>
      </main>

      {/* ─── Footer ─── */}
      <footer className="relative z-20 flex w-full items-center justify-center gap-4 border-t border-white/5 px-6 py-6 text-[11px] font-bold uppercase tracking-widest text-slate-600 sm:px-8 md:px-12 lg:px-16">
        <span>HOLD MY HAND · GAME PORTAL CO-OP</span>
        <span className="hidden sm:inline">|</span>
        <span className="hidden sm:inline">HAI NGƯỜI. MỘT HÀNH TRÌNH.</span>
      </footer>
    </div>
  )
}
