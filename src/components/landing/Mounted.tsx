import { motion } from 'framer-motion'

interface MountedProps {
  children: React.ReactNode
  delay?: number
  y?: number
  className?: string
}

export default function Mounted({ children, delay = 0, y = 28, className }: MountedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}