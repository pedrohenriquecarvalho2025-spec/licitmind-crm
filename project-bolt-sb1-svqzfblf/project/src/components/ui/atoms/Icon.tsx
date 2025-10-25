import React from 'react'
import { LucideIcon } from 'lucide-react'

interface IconProps {
  icon: LucideIcon
  size?: number
  className?: string
}

export function Icon({ icon: IconComponent, size = 20, className = '' }: IconProps) {
  return <IconComponent size={size} className={className} />
}

