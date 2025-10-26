import React from 'react'
import { Brain, Zap, AlertTriangle, CheckCircle, TrendingUp, Video as LucideIcon } from 'lucide-react'

interface InsightCardProps {
  type: string
  message: string
  priority: 'high' | 'medium' | 'low'
}

export function InsightCard({ type, message, priority }: InsightCardProps) {
  const getInsightConfig = () => {
    switch (type) {
      case 'opportunity':
        return {
          icon: Zap,
          bgGradient: 'from-brand-tech-green/20 to-emerald-500/10',
          iconBg: 'bg-gradient-to-br from-brand-tech-green to-emerald-600',
          borderColor: 'border-brand-tech-green/30',
          glowColor: 'shadow-brand-tech-green/20'
        }
      case 'warning':
        return {
          icon: AlertTriangle,
          bgGradient: 'from-yellow-500/20 to-amber-500/10',
          iconBg: 'bg-gradient-to-br from-yellow-500 to-amber-600',
          borderColor: 'border-yellow-500/30',
          glowColor: 'shadow-yellow-500/20'
        }
      case 'performance':
        return {
          icon: TrendingUp,
          bgGradient: 'from-primary-500/20 to-brand-cyan/10',
          iconBg: 'bg-gradient-to-br from-primary-500 to-brand-cyan',
          borderColor: 'border-primary-500/30',
          glowColor: 'shadow-primary-500/20'
        }
      default:
        return {
          icon: Brain,
          bgGradient: 'from-neutral-500/20 to-neutral-400/10',
          iconBg: 'bg-gradient-to-br from-neutral-500 to-neutral-600',
          borderColor: 'border-neutral-500/30',
          glowColor: 'shadow-neutral-500/20'
        }
    }
  }

  const config = getInsightConfig()
  const Icon = config.icon

  const priorityBadge = () => {
    const badges = {
      high: 'bg-red-100 text-red-700 border-red-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      low: 'bg-green-100 text-green-700 border-green-200'
    }
    return badges[priority]
  }

  return (
    <div className={`relative group overflow-hidden rounded-2xl border ${config.borderColor} bg-gradient-to-br ${config.bgGradient} dark:bg-gradient-to-br dark:${config.bgGradient} backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${config.glowColor}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 dark:from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative p-6">
        <div className="flex items-start space-x-4">
          <div className={`relative flex-shrink-0 w-14 h-14 ${config.iconBg} rounded-xl flex items-center justify-center shadow-lg ${config.glowColor}`}>
            <Icon className="w-7 h-7 text-white" />
            <div className={`absolute inset-0 ${config.iconBg} rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity`} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${priorityBadge()}`}>
                {priority === 'high' ? 'Alta' : priority === 'medium' ? 'Média' : 'Baixa'}
              </span>
            </div>
            <p className="text-neutral-900 dark:text-neutral-200 font-semibold leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full -mr-16 -mt-16 blur-2xl" />
      </div>
    </div>
  )
}
