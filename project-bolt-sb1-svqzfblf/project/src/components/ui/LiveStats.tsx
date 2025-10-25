import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface LiveStatsProps {
  label: string
  value: string | number
  subtitle?: string
  trend?: {
    value: number
    direction: 'up' | 'down' | 'neutral'
  }
  color?: 'blue' | 'green' | 'purple' | 'orange'
}

export function LiveStats({ label, value, subtitle, trend, color = 'blue' }: LiveStatsProps) {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-brand-blue',
      gradient: 'from-brand-blue to-brand-cyan'
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-950/30',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-brand-tech-green',
      gradient: 'from-brand-tech-green to-emerald-400'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-950/30',
      border: 'border-purple-200 dark:border-purple-800',
      text: 'text-brand-tech-purple',
      gradient: 'from-brand-tech-purple to-purple-500'
    },
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-950/30',
      border: 'border-orange-200 dark:border-orange-800',
      text: 'text-brand-tech-orange',
      gradient: 'from-brand-tech-orange to-orange-500'
    }
  }

  const config = colorClasses[color]

  const getTrendIcon = () => {
    if (!trend) return null
    
    switch (trend.direction) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />
      case 'neutral':
        return <Minus className="w-4 h-4 text-neutral-500" />
    }
  }

  const getTrendColor = () => {
    if (!trend) return ''
    
    switch (trend.direction) {
      case 'up':
        return 'text-green-600 dark:text-green-400'
      case 'down':
        return 'text-red-600 dark:text-red-400'
      case 'neutral':
        return 'text-neutral-600 dark:text-neutral-400'
    }
  }

  return (
    <div className={`relative ${config.bg} ${config.border} border-2 rounded-2xl p-6 overflow-hidden group hover:shadow-xl transition-all duration-300`}>
      {/* Animated Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      
      {/* Content */}
      <div className="relative">
        <p className="text-sm font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-2">
          {label}
        </p>
        
        <div className="flex items-baseline space-x-2 mb-2">
          <h3 className={`text-5xl font-black ${config.text} tracking-tight`}>
            {value}
          </h3>
          
          {trend && (
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full bg-white dark:bg-neutral-900 ${getTrendColor()} font-bold text-sm`}>
              {getTrendIcon()}
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        
        {subtitle && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">
            {subtitle}
          </p>
        )}
      </div>

      {/* Pulse Animation */}
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br ${config.gradient} rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity`} />
    </div>
  )
}
