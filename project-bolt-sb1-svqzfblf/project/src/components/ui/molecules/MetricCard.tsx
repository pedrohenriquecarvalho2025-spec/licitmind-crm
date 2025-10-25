import React from 'react'
import { LucideIcon } from 'lucide-react'
import { Title } from '../atoms/Title'
import { Text } from '../atoms/Text'
import { Icon } from '../atoms/Icon'

interface MetricCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  iconColor?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function MetricCard({
  title,
  value,
  icon,
  iconColor = 'text-brand-cyan',
  trend,
  className = ''
}: MetricCardProps) {
  return (
    <div className={`bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <Text variant="caption" color="muted" weight="medium">
          {title}
        </Text>
        <div className={`p-2 bg-gradient-to-br ${iconColor} bg-opacity-10 rounded-lg`}>
          <Icon icon={icon} size={20} className={iconColor} />
        </div>
      </div>
      
      <Title level={3} className="mb-1">
        {value}
      </Title>
      
      {trend && (
        <Text variant="small" color={trend.isPositive ? 'success' : 'error'}>
          {trend.isPositive ? '+' : ''}{trend.value}%
        </Text>
      )}
    </div>
  )
}

