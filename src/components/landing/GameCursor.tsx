import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface GameCursorProps {
  enabled?: boolean
}

/**
 * Subtle game-style cursor: an amber ring + crosshair dot that follows the pointer.
 * Falls back to native on touch / small viewports.
 */
export default function GameCursor({ enabled = true }: GameCursorProps) {
  const [active, setActive] = useState(false)
  const [isCoarse, setIsCoarse] = useState(false)

  const mx = useMotionValue(-100)
  const my = useMotionValue(-100)
  const sx = useSpring(mx, { stiffness: 280, damping: 28, mass: 0.6 })
  const sy = useSpring(my, { stiffness: 280, damping: 28, mass: 0.6 })

  useEffect(() => {
    if (!enabled) return
    const coarse = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768
    setIsCoarse(coarse)
    if (coarse) return

    let rafId = 0
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        mx.set(e.clientX)
        my.set(e.clientY)
        if (!active) setActive(true)
      })
    }
    const leave = () => setActive(false)
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerleave', leave, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerleave', leave)
      cancelAnimationFrame(rafId)
    }
  }, [enabled, mx, my, active])

  if (isCoarse || !enabled) return null

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[100] mix-blend-screen"
      style={{
        x: sx,
        y: sy,
        translateX: '-50%',
        translateY: '-50%',
        opacity: active ? 1 : 0,
        transition: 'opacity 0.2s',
      }}
    >
      <div className="relative">
        <div className="w-8 h-8 rounded-full border border-amber-400/70 shadow-[0_0_12px_rgba(243,178,46,0.7)]" />
        <div className="absolute top-1/2 left-1/2 w-1 h-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300 shadow-[0_0_6px_rgba(255,197,41,1)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-px bg-amber-300/30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-px bg-amber-300/30" />
      </div>
    </motion.div>
  )
}