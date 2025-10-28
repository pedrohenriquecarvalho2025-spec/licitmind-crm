import React from 'react'

interface LogoProps {
  className?: string
  variant?: 'image' | 'svg'
}

export function Logo({ className = 'w-8 h-8', variant = 'image' }: LogoProps) {
  // Usar a imagem real da logo
  if (variant === 'image') {
    return (
      <img 
        src="/assets/logo.png" 
        alt="LicitMind Logo" 
        className={className}
      />
    )
  }

  // SVG placeholder neutro
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="100" height="100" rx="20" fill="currentColor" opacity="0.1" />
      <text 
        x="50" 
        y="60" 
        fontSize="48" 
        fontWeight="bold" 
        textAnchor="middle" 
        fill="currentColor"
      >
        LM
      </text>
    </svg>
  )
}
