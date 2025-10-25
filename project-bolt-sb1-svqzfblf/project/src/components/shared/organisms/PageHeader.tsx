import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { Title } from '../../ui/atoms/Title'
import { Text } from '../../ui/atoms/Text'
import { Button } from '../../ui/atoms/Button'

interface PageHeaderProps {
  title: string
  description?: string
  onBack?: () => void
  actions?: React.ReactNode
  breadcrumbs?: Array<{ label: string; onClick?: () => void }>
}

export function PageHeader({
  title,
  description,
  onBack,
  actions,
  breadcrumbs
}: PageHeaderProps) {
  return (
    <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-6 py-4">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="flex items-center space-x-2 mb-3">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <Text variant="small" color="muted">/</Text>
              )}
              {crumb.onClick ? (
                <button
                  onClick={crumb.onClick}
                  className="text-sm text-brand-blue hover:text-brand-cyan transition-colors"
                >
                  {crumb.label}
                </button>
              ) : (
                <Text variant="small" color="muted">{crumb.label}</Text>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            </button>
          )}
          
          <div>
            <Title level={2}>{title}</Title>
            {description && (
              <Text variant="caption" color="muted" className="mt-1">
                {description}
              </Text>
            )}
          </div>
        </div>
        
        {actions && (
          <div className="flex items-center space-x-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}

