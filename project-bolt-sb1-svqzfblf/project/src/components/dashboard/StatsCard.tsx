import React from 'react'
import { Video as LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  color: 'blue' | 'green' | 'yellow' | 'red'
}

export function StatsCard({ title, value, subtitle, icon: Icon, trend, color }: StatsCardProps) {
  const colorClasses = {
    blue: 'from-brand-cyan to-primary-500',
    green: 'from-brand-tech-green to-green-400',
    yellow: 'from-yellow-400 to-orange-400',
    red: 'from-red-400 to-red-500'
  }

  const bgGradients = {
    blue: 'from-neutral-800/5 via-brand-cyan/5 to-primary-500/10',
    green: 'from-neutral-800/5 via-brand-tech-green/5 to-green-400/10',
    yellow: 'from-neutral-800/5 via-yellow-400/5 to-orange-400/10',
    red: 'from-neutral-800/5 via-red-400/5 to-red-500/10'
  }

  const glowColors = {
    blue: 'shadow-brand-cyan/20',
    green: 'shadow-brand-tech-green/20',
    yellow: 'shadow-yellow-400/20',
    red: 'shadow-red-400/20'
  }

  const getMiniChartData = () => {
    return Array.from({ length: 12 }, () => Math.random() * 100)
  }

  const chartData = getMiniChartData()
  const maxValue = Math.max(...chartData)

  return (
    <div className={`group relative bg-white dark:bg-gradient-to-br dark:${bgGradients[color]} backdrop-blur-sm rounded-2xl border border-neutral-200 dark:border-white/50 shadow-lg hover:shadow-2xl ${glowColors[color]} transition-all duration-300 hover:scale-[1.02] overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-r from-brand-cyan/5 dark:from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`relative w-16 h-16 bg-gradient-to-br ${colorClasses[color]} rounded-2xl flex items-center justify-center shadow-xl ${glowColors[color]}`}>
            <Icon className="w-8 h-8 text-white" />
            <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity`} />
          </div>
          {trend && (
            <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${
              trend.isPositive
                ? 'text-brand-tech-green bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200'
                : 'text-red-500 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200'
            } shadow-sm`}>
              {trend.isPositive ? '↗' : '↘'} {trend.isPositive ? '+' : ''}{trend.value}%
            </div>
          )}
        </div>

        <div className="mb-4">
          <p className="text-xs font-bold text-neutral-600 dark:text-neutral-500 uppercase tracking-wider mb-2">{title}</p>
          <p className="text-4xl font-bold text-neutral-900 dark:text-white mb-1 tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-sm text-neutral-700 dark:text-neutral-400 font-semibold">{subtitle}</p>
          )}
        </div>

        <div className="flex items-end space-x-1 h-12">
          {chartData.map((value, index) => (
            <div
              key={index}
              className={`flex-1 bg-gradient-to-t ${colorClasses[color]} rounded-t-sm transition-all duration-300 hover:opacity-80`}
              style={{ height: `${(value / maxValue) * 100}%` }}
            />
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full -mr-16 -mb-16 blur-2xl" />
    </div>
  )
}