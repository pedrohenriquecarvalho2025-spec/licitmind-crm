import React from 'react'
import { Loader2 } from 'lucide-react'
import type { SpinnerSize } from '../../../types/ui'

interface SpinnerProps {
  size?: SpinnerSize
  className?: string
}

const sizes: Record<SpinnerSize, number> = {
  xs: 12,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48
}

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  return (
    <Loader2
      size={sizes[size]}
      className={`animate-spin text-brand-cyan ${className}`}
    />
  )
}

