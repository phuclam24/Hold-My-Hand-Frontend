import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { ReactNode } from 'react'

interface PageShellProps {
  children: ReactNode
  className?: string
}

/**
 * Wraps dashboard content with framer-motion enter animation
 * keyed by pathname so route changes replay the entrance.
 */
export default function PageShell({ children, className }: PageShellProps) {
  const location = useLocation()
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}