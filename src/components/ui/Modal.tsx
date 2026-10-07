import { Fragment, ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Modal({ isOpen, onClose, title, children, size = 'md', className }: ModalProps) {
  if (!isOpen) return null

  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <Fragment>
          <div
            className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
            onClick={onClose}
          />
          <div
            className={cn(
              'inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full',
              sizeStyles[size],
              className
            )}
          >
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className="px-6 py-4">{children}</div>
          </div>
        </Fragment>
      </div>
    </div>
  )
}
