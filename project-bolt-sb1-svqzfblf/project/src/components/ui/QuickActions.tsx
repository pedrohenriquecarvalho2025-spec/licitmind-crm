import { LucideIcon } from 'lucide-react'

interface QuickAction {
  icon: LucideIcon
  label: string
  description: string
  onClick: () => void
  color?: 'blue' | 'green' | 'purple' | 'orange'
  badge?: string
}

interface QuickActionsProps {
  title?: string
  actions: QuickAction[]
}

export function QuickActions({ title = 'Ações Rápidas', actions }: QuickActionsProps) {
  const getColorClasses = (color: string = 'blue') => {
    const colors = {
      blue: {
        bg: 'from-brand-cyan to-brand-blue',
        hover: 'hover:shadow-brand-cyan/30',
        badge: 'bg-brand-cyan'
      },
      green: {
        bg: 'from-brand-tech-green to-emerald-500',
        hover: 'hover:shadow-brand-tech-green/30',
        badge: 'bg-brand-tech-green'
      },
      purple: {
        bg: 'from-brand-tech-purple to-purple-600',
        hover: 'hover:shadow-brand-tech-purple/30',
        badge: 'bg-brand-tech-purple'
      },
      orange: {
        bg: 'from-brand-tech-orange to-orange-600',
        hover: 'hover:shadow-brand-tech-orange/30',
        badge: 'bg-brand-tech-orange'
      }
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div>
      {title && (
        <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">
          {title}
        </h3>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon
          const colors = getColorClasses(action.color)
          
          return (
            <button
              key={index}
              onClick={action.onClick}
              className={`relative group bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 rounded-2xl p-6 hover:border-transparent hover:shadow-2xl ${colors.hover} transition-all duration-300 hover:scale-105 text-left overflow-hidden`}
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-12 h-12 bg-gradient-to-br ${colors.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                {/* Text */}
                <h4 className="font-bold text-neutral-900 dark:text-white group-hover:text-white mb-1 transition-colors">
                  {action.label}
                </h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-white/90 transition-colors">
                  {action.description}
                </p>
                
                {/* Badge */}
                {action.badge && (
                  <div className={`absolute top-4 right-4 px-2 py-1 ${colors.badge} text-white text-xs font-bold rounded-full`}>
                    {action.badge}
                  </div>
                )}
              </div>

              {/* Decorative Circle */}
              <div className={`absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br ${colors.bg} rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity`} />
            </button>
          )
        })}
      </div>
    </div>
  )
}
