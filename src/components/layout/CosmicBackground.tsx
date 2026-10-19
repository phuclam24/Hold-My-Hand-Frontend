import { useEffect, useRef } from 'react'

interface CosmicBackgroundProps {
  density?: 'low' | 'medium' | 'high'
  showFog?: boolean
  className?: string
}

/**
 * Lightweight canvas-based cosmic backdrop tuned for dashboard backgrounds:
 * - Twinkling stars (parallax subtle)
 * - Occasional shooting stars (sparse)
 * - Optional rising embers + slow fog (CSS)
 */
export default function CosmicBackground({
  density = 'medium',
  showFog = true,
  className = '',
}: CosmicBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)

  const countMap = { low: 50, medium: 110, high: 180 }
  const starCount = countMap[density]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let width = 0
    let height = 0

    type Star = { x: number; y: number; r: number; o: number; tw: number; speed: number }
    type Shooter = { x: number; y: number; vx: number; vy: number; life: number; max: number }
    type Ember = { x: number; y: number; r: number; vy: number; vx: number; o: number; tw: number }

    let stars: Star[] = []
    let embers: Ember[] = []
    let shooter: Shooter | null = null
    let nextShoot = 4000 + Math.random() * 6000

    const resize = () => {
      // Fallback to window inner size so the canvas always has dimensions
      width = canvas.clientWidth || window.innerWidth
      height = canvas.clientHeight || window.innerHeight
      const w = Math.max(1, width)
      const h = Math.max(1, height)
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const spawn = () => {
      stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.3 + Math.random() * 1.3,
        o: 0.2 + Math.random() * 0.6,
        tw: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 1.2,
      }))
      embers = Array.from({ length: 14 }, () => ({
        x: Math.random() * width,
        y: height + Math.random() * height * 0.2,
        r: 0.5 + Math.random() * 1.1,
        vy: 0.15 + Math.random() * 0.4,
        vx: (Math.random() - 0.5) * 0.15,
        o: 0.4 + Math.random() * 0.4,
        tw: Math.random() * Math.PI * 2,
      }))
    }

    resize()
    spawn()

    const onWin = () => {
      resize()
      spawn()
    }
    window.addEventListener('resize', onWin, { passive: true })

    let last = performance.now()
    const tick = (t: number) => {
      const dt = Math.min(40, t - last)
      last = t

      // Slight trail
      ctx.fillStyle = 'rgba(11, 14, 20, 0.22)'
      ctx.fillRect(0, 0, width, height)

      // Stars
      for (const s of stars) {
        s.tw += 0.04 * (dt * 0.05)
        const twinkle = 0.4 + Math.sin(s.tw) * 0.6
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r * (0.8 + twinkle * 0.5), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(232, 240, 255, ${s.o * twinkle})`
        ctx.fill()
      }

      // Embers
      for (const e of embers) {
        e.y -= e.vy * (dt * 0.05)
        e.x += e.vx * (dt * 0.05)
        e.tw += 0.05 * (dt * 0.05)
        const twinkle = 0.5 + Math.sin(e.tw) * 0.5
        if (e.y < -8) {
          e.y = height + Math.random() * height * 0.2
          e.x = Math.random() * width
        }
        ctx.beginPath()
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(243, 178, 46, ${e.o * twinkle})`
        ctx.fill()
      }

      // Shooting stars
      nextShoot -= dt
      if (!shooter && nextShoot <= 0) {
        shooter = {
          x: Math.random() * width * 0.6,
          y: Math.random() * height * 0.4,
          vx: 5 + Math.random() * 3,
          vy: 2.5 + Math.random() * 1.5,
          life: 0,
          max: 50,
        }
        nextShoot = 6000 + Math.random() * 8000
      }
      if (shooter) {
        shooter.x += shooter.vx * (dt * 0.05)
        shooter.y += shooter.vy * (dt * 0.05)
        shooter.life += 1
        const alpha = 1 - shooter.life / shooter.max
        const grd = ctx.createLinearGradient(
          shooter.x,
          shooter.y,
          shooter.x - shooter.vx * 14,
          shooter.y - shooter.vy * 14,
        )
        grd.addColorStop(0, `rgba(255, 255, 255, ${alpha})`)
        grd.addColorStop(1, `rgba(255, 255, 255, 0)`)
        ctx.strokeStyle = grd
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.moveTo(shooter.x, shooter.y)
        ctx.lineTo(shooter.x - shooter.vx * 14, shooter.y - shooter.vy * 14)
        ctx.stroke()
        if (shooter.life >= shooter.max) shooter = null
      }

      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('resize', onWin)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [starCount])

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${className}`}
      style={{
        ['--cb-w' as any]: `${typeof window !== 'undefined' ? window.innerWidth : 1280}px`,
        ['--cb-h' as any]: `${typeof window !== 'undefined' ? window.innerHeight : 720}px`,
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ width: '100vw', height: '100vh' }}
      />
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(243,178,46,0.05),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(11,14,20,0.7)_100%)]" />
      {/* Fog layer */}
      {showFog && (
        <>
          <div className="absolute -bottom-12 left-[-10%] right-[-10%] h-40 bg-amber-500/[0.06] blur-3xl animate-fog rounded-full" />
          <div className="absolute -bottom-16 left-[20%] right-[10%] h-32 bg-indigo-400/[0.05] blur-3xl animate-fog rounded-full animation-delay-2000" />
          <div className="absolute top-1/3 left-[-15%] right-[-15%] h-32 bg-purple-500/[0.04] blur-3xl animate-fog rounded-full animation-delay-4000" />
        </>
      )}
    </div>
  )
}