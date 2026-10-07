import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores'
import { useNotificationStore } from '@/stores'
import { notify } from '@/lib/toast'
import {
  registerGoogleAuth,
  renderGoogleButton,
  showOneTap,
  cancelOneTap,
  completeGoogleLogin,
} from '@/lib/googleAuth'
import { Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isLoading, error, clearError } = useAuthStore()
  const { addNotification } = useNotificationStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)

  // Ref cho container chứa nút Google Sign-In chính hãng.
  const googleBtnRef = useRef<HTMLDivElement | null>(null)
  const [googleError, setGoogleError] = useState<string | null>(null)

  // Hiển thị thông báo nếu vừa đăng ký
  useEffect(() => {
    if (location.state?.registered) {
      notify.success('Đăng ký thành công! Hãy đăng nhập để tiếp tục.', 'Chào mừng')
    }
  }, [location.state])

  // Mount: đăng ký GIS + render nút + bật One Tap.
  useEffect(() => {
    let cancelled = false

    const setup = async () => {
      try {
        // Đăng ký callback nhận idToken từ Google.
        await registerGoogleAuth(async (idToken) => {
          try {
            await completeGoogleLogin(idToken, navigate)
          } catch (err: any) {
            notify.error(
              err.response?.data?.message || 'Google login thất bại',
              'Lỗi',
            )
          }
        })

        if (cancelled) return

        // Render nút "Continue with Google" chuẩn vào container.
        if (googleBtnRef.current) {
          await renderGoogleButton(googleBtnRef.current, {
            width: googleBtnRef.current.clientWidth || 320,
            theme: 'outline',
            size: 'large',
            text: 'continue_with',
            shape: 'rectangular',
          })
        }

        if (cancelled) return

        // Bật One Tap — Google sẽ tự trượt bảng chọn tài khoản ở góc trên phải.
        await showOneTap()
      } catch (err: any) {
        // Thiếu VITE_GOOGLE_CLIENT_ID hoặc domain chưa đăng ký → vẫn cho đăng nhập thường.
        if (!cancelled) {
          setGoogleError(err?.message || 'Google Sign-In chưa sẵn sàng.')
        }
      }
    }

    setup()
    return () => {
      cancelled = true
      cancelOneTap()
    }
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    try {
      const user = await login({ username: email, password })
      notify.success(`Chào mừng ${user.displayName || user.username}!`, 'Đăng nhập thành công')
      if (user.role === 'Admin') navigate('/admin')
      else if (user.role === 'Moderator') navigate('/moderator')
      else navigate('/portal')
    } catch (err: any) {
      notify.error(err.response?.data?.message || 'Sai email hoặc mật khẩu', 'Đăng nhập thất bại')
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#0a0e1a]">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at top left, rgba(99, 102, 241, 0.25) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(249, 115, 22, 0.15) 0%, transparent 50%), radial-gradient(ellipse at center, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
        }}
      />

      {/* Stars / sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-amber-200 animate-pulse"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.7 + 0.3,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              boxShadow: '0 0 6px rgba(252, 211, 77, 0.6)',
            }}
          />
        ))}
      </div>

      {/* Decorative orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: '1s' }}
      />

      {/* Main card */}
      <div className="relative z-10 w-full max-w-md mx-4 px-4">
        {/* Logo + brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-7 h-7 text-amber-400" />
            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-amber-300 via-orange-400 to-pink-400 bg-clip-text text-transparent">
              Hold My Hand
            </span>
            <Sparkles className="w-7 h-7 text-amber-400" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            Welcome Back
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Continue your journey with{' '}
            <span className="text-amber-300 font-medium">Dad & Child</span>
          </p>
        </div>

        {/* Form card */}
        <div
          className="bg-slate-900/60 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl"
          style={{
            boxShadow:
              '0 0 40px rgba(99, 102, 241, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Email
              </label>
              <div
                className={`relative flex items-center bg-slate-950/60 border-2 rounded-2xl transition-all ${
                  emailFocused
                    ? 'border-amber-400 shadow-lg shadow-amber-400/10'
                    : 'border-slate-800'
                }`}
              >
                <Mail
                  className={`w-5 h-5 ml-4 transition-colors ${
                    emailFocused ? 'text-amber-400' : 'text-slate-500'
                  }`}
                />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  placeholder="username or email"
                  autoComplete="username"
                  className="flex-1 px-4 py-3.5 bg-transparent text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-300">Password</label>
                <a
                  href="#"
                  className="text-xs text-amber-400 hover:text-amber-300 font-medium"
                >
                  Forgot?
                </a>
              </div>
              <div
                className={`relative flex items-center bg-slate-950/60 border-2 rounded-2xl transition-all ${
                  passwordFocused
                    ? 'border-amber-400 shadow-lg shadow-amber-400/10'
                    : 'border-slate-800'
                }`}
              >
                <Lock
                  className={`w-5 h-5 ml-4 transition-colors ${
                    passwordFocused ? 'text-amber-400' : 'text-slate-500'
                  }`}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="flex-1 px-4 py-3.5 bg-transparent text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="mr-3 p-1.5 text-slate-400 hover:text-amber-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-amber-400 focus:ring-amber-400"
              />
              <label htmlFor="remember" className="text-sm text-slate-300 cursor-pointer">
                Remember me
              </label>
            </div>

            {/* Sign in button */}
            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/40 hover:shadow-orange-500/60 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
            <span className="text-xs text-slate-500 uppercase tracking-wider">or continue with</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
          </div>

          {/* Google Sign-In button chính hãng — render bởi GIS */}
          <div
            ref={googleBtnRef}
            className="w-full flex items-center justify-center min-h-[48px]"
          />

          {/* Hint nếu Client ID chưa cấu hình */}
          {googleError && (
            <p className="mt-2 text-xs text-slate-500 text-center">{googleError}</p>
          )}

          {/* Sign up link */}
          <p className="text-center text-sm text-slate-400 mt-6">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Footer hint */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500 mb-2">Demo accounts</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              type="button"
              onClick={() => {
                setEmail('admin')
                setPassword('Admin@123')
              }}
              className="text-xs px-3 py-1 bg-slate-900/50 border border-slate-700 rounded-full text-slate-300 hover:border-amber-400/40 hover:text-amber-300 transition-all"
            >
              admin
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('moderator')
                setPassword('Mod@123')
              }}
              className="text-xs px-3 py-1 bg-slate-900/50 border border-slate-700 rounded-full text-slate-300 hover:border-amber-400/40 hover:text-amber-300 transition-all"
            >
              moderator
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('player1')
                setPassword('Player@123')
              }}
              className="text-xs px-3 py-1 bg-slate-900/50 border border-slate-700 rounded-full text-slate-300 hover:border-amber-400/40 hover:text-amber-300 transition-all"
            >
              player1
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('player2')
                setPassword('Player@123')
              }}
              className="text-xs px-3 py-1 bg-slate-900/50 border border-slate-700 rounded-full text-slate-300 hover:border-amber-400/40 hover:text-amber-300 transition-all"
            >
              player2
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}