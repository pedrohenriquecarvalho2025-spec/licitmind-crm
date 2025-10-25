import React from 'react'
import type { BadgeVariant } from '../../../types/ui'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-neutral-100 text-neutral-800 border-neutral-300',
  primary: 'bg-brand-cyan/20 text-brand-blue-dark border-brand-cyan/30',
  success: 'bg-green-100 text-green-800 border-green-300',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  danger: 'bg-red-100 text-red-800 border-red-300',
  info: 'bg-blue-100 text-blue-800 border-blue-300'
}

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

