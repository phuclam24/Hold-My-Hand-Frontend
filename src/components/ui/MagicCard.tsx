import { useState, useRef, HTMLAttributes } from 'react'

type GlowColor = 'amber' | 'cyan' | 'rose' | 'emerald' | 'indigo'

interface MagicCardProps extends HTMLAttributes<HTMLDivElement> {
  glowColor?: GlowColor
  intensity?: number
  interactive?: boolean
}

const glowMap: Record<GlowColor, string> = {
  amber: 'rgba(251,191,36,0.30)',
  cyan: 'rgba(34,211,238,0.30)',
  rose: 'rgba(244,63,94,0.30)',
  emerald: 'rgba(16,185,129,0.30)',
  indigo: 'rgba(99,102,241,0.30)',
}

export default function MagicCard({
  children,
  className = '',
  glowColor = 'amber',
  intensity = 3,
  interactive = true,
  ...rest
}: MagicCardProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hover, setHover] = useState(false)

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const x = ((e.clientY - r.top) / r.height - 0.5) * intensity
    const y = ((e.clientX - r.left) / r.width - 0.5) * -intensity
    setTilt({ x, y })
  }
  const onLeave = () => {
    if (!interactive) return
    setTilt({ x: 0, y: 0 })
    setHover(false)
  }
  const onEnter = () => interactive && setHover(true)

  const glow = glowMap[glowColor] || glowMap.amber

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        transform: interactive
          ? `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
          : undefined,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.3s ease-out, box-shadow 0.3s ease, border-color 0.3s ease',
        boxShadow: hover
          ? `0 18px 40px -22px ${glow}, 0 0 0 1px rgba(255,255,255,0.06)`
          : '0 0 0 1px rgba(255,255,255,0.05)',
      }}
      className={`relative rounded-2xl border border-white/[0.07] bg-gradient-to-br from-[#111622]/95 via-[#0f1421]/90 to-[#0c111c]/95 backdrop-blur-sm p-5 ${className}`}
      {...rest}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          opacity: hover ? 0.55 : 0,
          transition: 'opacity 0.3s',
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 40%, transparent 60%, rgba(251,191,36,0.03) 100%)',
        }}
      />
      <div className="relative" style={{ transform: 'translateZ(8px)' }}>
        {children}
      </div>
    </div>
  )
}