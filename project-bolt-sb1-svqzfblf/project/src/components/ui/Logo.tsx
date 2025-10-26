import React from 'react'

interface LogoProps {
  className?: string
  variant?: 'image' | 'svg'
}

export function Logo({ className = 'w-8 h-8', variant = 'image' }: LogoProps) {
  // Usar a imagem real da logo se disponível
  if (variant === 'image') {
    return (
      <img 
        src="/assets/logo.png.png" 
        alt="LicitMind Logo" 
        className={className}
        onError={(e) => {
          // Fallback para SVG se a imagem não carregar
          e.currentTarget.style.display = 'none';
        }}
      />
    )
  }

  // SVG fallback (Manta Ray com cérebro)
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Manta Ray Body */}
      <path
        d="M50 20 Q30 35, 20 50 Q25 65, 35 70 L50 75 L65 70 Q75 65, 80 50 Q70 35, 50 20Z"
        fill="currentColor"
        opacity="0.2"
      />
      
      {/* Brain/Circuit Design */}
      <circle cx="50" cy="50" r="15" fill="white" opacity="0.9" />
      
      {/* Circuit paths */}
      <path
        d="M45 45 L50 40 L55 45"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M45 55 L50 60 L55 55"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Nodes */}
      <circle cx="45" cy="45" r="2" fill="currentColor" />
      <circle cx="50" cy="40" r="2" fill="currentColor" />
      <circle cx="55" cy="45" r="2" fill="currentColor" />
      <circle cx="45" cy="55" r="2" fill="currentColor" />
      <circle cx="50" cy="60" r="2" fill="currentColor" />
      <circle cx="55" cy="55" r="2" fill="currentColor" />
      <circle cx="50" cy="50" r="3" fill="currentColor" />
    </svg>
  )
}
