import React, { ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'
import type { ButtonVariant, ButtonSize } from '../../../types/ui'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  children: React.ReactNode
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-blue-dark hover:from-brand-cyan hover:via-brand-blue hover:to-brand-blue shadow-lg shadow-brand-cyan/30 hover:shadow-brand-cyan/50 text-white',
  secondary: 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-300',
  danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/30',
  ghost: 'text-neutral-700 hover:bg-brand-cyan/10 hover:text-brand-blue',
  success: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg shadow-green-500/30'
}

const sizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base'
}

export const Button = React.memo(function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-cyan disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  )
})

