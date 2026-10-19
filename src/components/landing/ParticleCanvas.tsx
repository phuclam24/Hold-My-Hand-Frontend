import { useEffect, useRef } from 'react'

interface ParticleCanvasProps {
  snowCount?: number
  embersCount?: number
  fogCount?: number
  className?: string
}

/**
 * High-performance HTML5 Canvas particle system:
 * - Soft falling snow with size & opacity variation
 * - Tiny glowing embers floating upward
 * - Slow-moving fog layers (CSS-driven overlay preferred for fog)
 */
export default function ParticleCanvas({
  snowCount = 110,
  embersCount = 28,
  className = '',
}: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let width = 0
    let height = 0

    type Flake = { x: number; y: number; r: number; s: number; o: number; drift: number }
    type Ember = { x: number; y: number; r: number; vy: number; vx: number; o: number; tw: number }
    type Shooter = { x: number; y: number; vx: number; vy: number; life: number; max: number; hue: number }

    let flakes: Flake[] = []
    let embers: Ember[] = []
    let shooter: Shooter | null = null
    let nextShoot = 1800 + Math.random() * 4500

    const resize = () => {
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const spawnFlakes = () => {
      flakes = Array.from({ length: snowCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.6 + Math.random() * 2.4,
        s: 0.2 + Math.random() * 0.9,
        o: 0.4 + Math.random() * 0.6,
        drift: (Math.random() - 0.5) * 0.3,
      }))
    }

    const spawnEmbers = () => {
      embers = Array.from({ length: embersCount }, () => ({
        x: Math.random() * width,
        y: height + Math.random() * height * 0.4,
        r: 0.6 + Math.random() * 1.4,
        vy: 0.2 + Math.random() * 0.5,
        vx: (Math.random() - 0.5) * 0.2,
        o: 0.5 + Math.random() * 0.5,
        tw: Math.random() * Math.PI * 2,
      }))
    }

    resize()
    spawnFlakes()
    spawnEmbers()

    const onWin = () => {
      resize()
      spawnFlakes()
      spawnEmbers()
    }
    window.addEventListener('resize', onWin, { passive: true })

    let last = performance.now()
    const tick = (t: number) => {
      const dt = Math.min(40, t - last)
      last = t

      // Trail fade (creates soft streak)
      ctx.fillStyle = 'rgba(11, 14, 20, 0.18)'
      ctx.fillRect(0, 0, width, height)

      // Snow
      for (const f of flakes) {
        f.y += f.s * (dt * 0.05)
        f.x += f.drift * (dt * 0.05)
        if (f.y > height + 4) {
          f.y = -4
          f.x = Math.random() * width
        }
        if (f.x < -4) f.x = width + 4
        if (f.x > width + 4) f.x = -4

        ctx.beginPath()
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(232, 240, 255, ${f.o})`
        ctx.fill()
      }

      // Embers (rising)
      for (const e of embers) {
        e.y -= e.vy * (dt * 0.05)
        e.x += e.vx * (dt * 0.05)
        e.tw += 0.05 * (dt * 0.05)
        const twinkle = 0.6 + Math.sin(e.tw) * 0.4
        if (e.y < -8) {
          e.y = height + Math.random() * height * 0.3
          e.x = Math.random() * width
        }
        ctx.beginPath()
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 197, 41, ${e.o * twinkle})`
        ctx.shadowBlur = 8
        ctx.shadowColor = 'rgba(255, 197, 41, 0.9)'
        ctx.shadowBlur = 0
      }

      // Shooting stars
      nextShoot -= dt
      if (!shooter && nextShoot <= 0) {
        shooter = {
          x: Math.random() * width * 0.6,
          y: Math.random() * height * 0.35,
          vx: 7 + Math.random() * 4,
          vy: 3 + Math.random() * 1.6,
          life: 0,
          max: 60,
          hue: Math.random() > 0.5 ? 195 : 42,
        }
        nextShoot = 4500 + Math.random() * 7000
      }
      if (shooter) {
        shooter.x += shooter.vx * (dt * 0.05)
        shooter.y += shooter.vy * (dt * 0.05)
        shooter.life += 1
        const alpha = 1 - shooter.life / shooter.max
        const grd = ctx.createLinearGradient(
          shooter.x,
          shooter.y,
          shooter.x - shooter.vx * 16,
          shooter.y - shooter.vy * 16,
        )
        grd.addColorStop(0, `hsla(${shooter.hue}, 95%, 75%, ${alpha})`)
        grd.addColorStop(1, `hsla(${shooter.hue}, 95%, 75%, 0)`)
        ctx.strokeStyle = grd
        ctx.lineWidth = 1.6
        ctx.beginPath()
        ctx.moveTo(shooter.x, shooter.y)
        ctx.lineTo(shooter.x - shooter.vx * 16, shooter.y - shooter.vy * 16)
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
  }, [snowCount, embersCount])

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}
      aria-hidden="true"
    />
  )
}