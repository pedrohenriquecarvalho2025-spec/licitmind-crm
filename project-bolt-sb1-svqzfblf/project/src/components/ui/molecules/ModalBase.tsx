import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { Title } from '../atoms/Title'
import type { ModalSize } from '../../../types/ui'

interface ModalBaseProps {
  isOpen: boolean
  onClose: () => void
  title: string
  size?: ModalSize
  children: React.ReactNode
  footer?: React.ReactNode
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
  full: 'max-w-full m-4'
}

export function ModalBase({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
  footer
}: ModalBaseProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col animate-slide-up`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
          <Title level={3}>{title}</Title>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>
        
        {footer && (
          <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-700 flex items-center justify-end space-x-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

