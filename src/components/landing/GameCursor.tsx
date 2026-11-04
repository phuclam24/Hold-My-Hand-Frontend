import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface GameCursorProps {
  enabled?: boolean
}

/**
 * Crosshair "nhắm mục tiêu" đồng hành với con trỏ chuột native.
 * - Vòng tròn + 4 nét ngắm chéo, pha amber glow.
 * - Co lại / bung rộng theo trạng thái hover của phần tử bên dưới.
 * - Tự ẩn trên thiết bị cảm ứng (pointer: coarse) và màn hình nhỏ.
 */
export default function GameCursor({ enabled = true }: GameCursorProps) {
  const [active, setActive] = useState(false)
  const [isCoarse, setIsCoarse] = useState(false)
  const [pressed, setPressed] = useState(false)

  const mx = useMotionValue(-100)
  const my = useMotionValue(-100)
  const sx = useSpring(mx, { stiffness: 320, damping: 30, mass: 0.5 })
  const sy = useSpring(my, { stiffness: 320, damping: 30, mass: 0.5 })

  useEffect(() => {
    if (!enabled) return
    const coarse =
      window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768
    setIsCoarse(coarse)
    if (coarse) return

    let rafId = 0
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        mx.set(e.clientX)
        my.set(e.clientY)
        setActive(true)
      })
    }
    const leave = () => setActive(false)
    const down = () => setPressed(true)
    const up = () => setPressed(false)

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerleave', leave, { passive: true })
    window.addEventListener('pointerdown', down, { passive: true })
    window.addEventListener('pointerup', up, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerleave', leave)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      cancelAnimationFrame(rafId)
    }
  }, [enabled, mx, my])

  if (isCoarse || !enabled) return null

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[100]"
      style={{
        x: sx,
        y: sy,
        translateX: '-50%',
        translateY: '-50%',
        opacity: active ? 1 : 0,
        transition: 'opacity 0.25s ease',
      }}
    >
      {/* Glow mềm phía sau */}
      <div className="absolute -inset-3 rounded-full bg-amber-400/10 blur-xl" />

      {/* Vòng tròn ngoài */}
      <motion.div
        animate={{ scale: pressed ? 0.78 : 1, rotate: pressed ? 45 : 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 20 }}
        className="relative h-8 w-8 rounded-full border border-amber-300/80 shadow-[0_0_14px_rgba(243,178,46,0.75)]"
      >
        {/* 4 nét ngắm chéo */}
        <span className="absolute left-1/2 top-1/2 h-px w-14 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-amber-200/70 to-transparent" />
        <span className="absolute left-1/2 top-1/2 h-14 w-px -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-amber-200/70 to-transparent" />
        {/* Chấm giữa */}
        <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-200 shadow-[0_0_8px_rgba(255,197,41,1)]" />
      </motion.div>
    </motion.div>
  )
}
