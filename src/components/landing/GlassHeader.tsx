import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Gamepad2 } from 'lucide-react'

interface GlassHeaderProps {
  onMenu: () => void
  authed: boolean
  onJoin: () => void
  onLogin: () => void
}

export default function GlassHeader({ onMenu, authed, onJoin, onLogin }: GlassHeaderProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/55 backdrop-blur-2xl shadow-[0_8px_32px_-12px_rgba(0,0,0,0.6)] border-b border-white/5'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent'
      }`}
    >
      <div className="w-full px-8 md:px-12 lg:px-16 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <motion.img
            src="/logo.jpg"
            alt="Hold My Hand Logo"
            whileHover={{ rotate: -8, scale: 1.08 }}
            transition={{ type: 'spring', stiffness: 240, damping: 14 }}
            className="h-10 sm:h-12 w-auto object-contain rounded-lg shadow-md"
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

        <div className="flex items-center gap-6">
          <span className="hidden md:inline-block text-xs font-bold tracking-[0.2em] text-amber-300/80 uppercase animate-pulse">
            BETTER, TOGETHER.
          </span>

          {authed ? (
            <motion.button
              onClick={onJoin}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-amber-400 text-slate-950 text-xs font-bold rounded-lg shadow-[0_0_24px_rgba(243,178,46,0.45)] hover:shadow-[0_0_36px_rgba(255,197,41,0.7)] transition-all"
            >
              <Gamepad2 className="w-4 h-4" />
              VÀO SẢNH CHƠI
            </motion.button>
          ) : (
            <button
              onClick={onLogin}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-all"
            >
              ĐĂNG NHẬP
            </button>
          )}

          <motion.button
            onClick={onMenu}
            whileHover={{ rotate: 90 }}
            transition={{ type: 'spring', stiffness: 240, damping: 16 }}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white"
            aria-label="Toggle Menu"
          >
            <span className="block w-4 h-px bg-white" />
          </motion.button>
        </div>
      </div>
    </motion.header>
  )
}