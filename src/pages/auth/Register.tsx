import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores'
import { notify } from '@/lib/toast'
import { Mail, Lock, User, Sparkles, UserPlus } from 'lucide-react'

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

  const inputClass = (key: string, icon: React.ReactNode) => {
    const focused = focus === key
    return (
      <div
        className={`relative flex items-center bg-slate-950/60 border-2 rounded-2xl transition-all ${
          focused ? 'border-amber-400 shadow-lg shadow-amber-400/10' : 'border-slate-800'
        }`}
      >
        <div
          className={`ml-4 transition-colors ${
            focused ? 'text-amber-400' : 'text-slate-500'
          }`}
        >
          {icon}
        </div>
        <input
          type={
            key === 'password' || key === 'confirmPassword' ? 'password' :
            key === 'email' ? 'email' : 'text'
          }
          value={(form as any)[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          onFocus={() => setFocus(key)}
          onBlur={() => setFocus(null)}
          placeholder={
            key === 'displayName' ? 'Tên hiển thị trong game' :
            key === 'username' ? 'username' :
            key === 'email' ? 'email@example.com' :
            key === 'password' ? 'Mật khẩu (tối thiểu 6 ký tự)' :
            'Xác nhận mật khẩu'
          }
          autoComplete={
            key === 'password' || key === 'confirmPassword' ? 'new-password' :
            key === 'email' ? 'email' : 'off'
          }
          className="flex-1 px-4 py-3.5 bg-transparent text-white placeholder-slate-500 focus:outline-none"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#0a0e1a] py-8">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at top left, rgba(99, 102, 241, 0.25) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(249, 115, 22, 0.15) 0%, transparent 50%)',
        }}
      />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
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
              boxShadow: '0 0 6px rgba(252, 211, 77, 0.6)',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md mx-4 px-4">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <span className="text-xl font-black bg-gradient-to-r from-amber-300 via-orange-400 to-pink-400 bg-clip-text text-transparent">
              Hold My Hand
            </span>
            <Sparkles className="w-6 h-6 text-amber-400" />
          </div>
          <h1 className="text-3xl font-black text-white">Create Account</h1>
          <p className="text-slate-400 text-sm mt-1">Start your journey today</p>
        </div>

        <div
          className="bg-slate-900/60 backdrop-blur-2xl rounded-3xl p-7 border border-white/10 shadow-2xl"
          style={{ boxShadow: '0 0 40px rgba(99, 102, 241, 0.15)' }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Display Name
              </label>
              {inputClass('displayName', <User className="w-5 h-5" />)}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Username
              </label>
              {inputClass('username', <User className="w-5 h-5" />)}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Email
              </label>
              {inputClass('email', <Mail className="w-5 h-5" />)}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Password
                </label>
                {inputClass('password', <Lock className="w-5 h-5" />)}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Confirm
                </label>
                {inputClass('confirmPassword', <Lock className="w-5 h-5" />)}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/40 hover:shadow-orange-500/60 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
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
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Sign up
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-5">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
