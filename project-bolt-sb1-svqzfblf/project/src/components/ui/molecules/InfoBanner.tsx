import { Info, X, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react'

interface InfoBannerProps {
  type?: 'info' | 'warning' | 'success' | 'tip'
  title?: string
  message: string
  onClose?: () => void
  className?: string
}

export function InfoBanner({ 
  type = 'info', 
  title, 
  message, 
  onClose,
  className = '' 
}: InfoBannerProps) {
  const configs = {
    info: {
      icon: Info,
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      border: 'border-blue-200 dark:border-blue-800',
      iconBg: 'bg-blue-100 dark:bg-blue-900',
      iconColor: 'text-brand-blue',
      textColor: 'text-blue-900 dark:text-blue-100',
      titleColor: 'text-blue-900 dark:text-blue-50'
    },
    warning: {
      icon: AlertTriangle,
      bg: 'bg-orange-50 dark:bg-orange-950/30',
      border: 'border-orange-200 dark:border-orange-800',
      iconBg: 'bg-orange-100 dark:bg-orange-900',
      iconColor: 'text-brand-tech-orange',
      textColor: 'text-orange-900 dark:text-orange-100',
      titleColor: 'text-orange-900 dark:text-orange-50'
    },
    success: {
      icon: CheckCircle,
      bg: 'bg-green-50 dark:bg-green-950/30',
      border: 'border-green-200 dark:border-green-800',
      iconBg: 'bg-green-100 dark:bg-green-900',
      iconColor: 'text-brand-tech-green',
      textColor: 'text-green-900 dark:text-green-100',
      titleColor: 'text-green-900 dark:text-green-50'
    },
    tip: {
      icon: Lightbulb,
      bg: 'bg-purple-50 dark:bg-purple-950/30',
      border: 'border-purple-200 dark:border-purple-800',
      iconBg: 'bg-purple-100 dark:bg-purple-900',
      iconColor: 'text-brand-tech-purple',
      textColor: 'text-purple-900 dark:text-purple-100',
      titleColor: 'text-purple-900 dark:text-purple-50'
    }
  }

  const config = configs[type]
  const Icon = config.icon

  return (
    <div className={`relative ${config.bg} ${config.border} border rounded-2xl p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className={`flex-shrink-0 w-10 h-10 ${config.iconBg} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${config.iconColor}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={`text-sm font-bold ${config.titleColor} mb-1`}>
              {title}
            </h4>
          )}
          <p className={`text-sm ${config.textColor} leading-relaxed`}>
            {message}
          </p>
        </div>

        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className={`flex-shrink-0 ${config.textColor} hover:opacity-70 transition-opacity`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
