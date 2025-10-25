import React from 'react'

interface TextProps {
  variant?: 'body' | 'caption' | 'small' | 'tiny'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  color?: 'default' | 'muted' | 'error' | 'success'
  children: React.ReactNode
  className?: string
}

const variants: Record<string, string> = {
  body: 'text-base',
  caption: 'text-sm',
  small: 'text-xs',
  tiny: 'text-[10px]'
}

const weights: Record<string, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold'
}

const colors: Record<string, string> = {
  default: 'text-neutral-900 dark:text-neutral-100',
  muted: 'text-neutral-600 dark:text-neutral-400',
  error: 'text-red-600 dark:text-red-400',
  success: 'text-green-600 dark:text-green-400'
}

export function Text({ variant = 'body', weight = 'normal', color = 'default', children, className = '' }: TextProps) {
  return (
    <p className={`${variants[variant]} ${weights[weight]} ${colors[color]} ${className}`}>
      {children}
    </p>
  )
}

