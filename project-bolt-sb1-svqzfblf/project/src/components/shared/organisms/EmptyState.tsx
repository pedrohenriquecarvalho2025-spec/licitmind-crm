import React from 'react'
import { LucideIcon } from 'lucide-react'
import { Title } from '../../ui/atoms/Title'
import { Text } from '../../ui/atoms/Text'
import { Button } from '../../ui/atoms/Button'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="inline-flex p-4 bg-gradient-to-br from-brand-cyan/10 to-brand-blue/10 rounded-2xl mb-6">
        <Icon className="w-16 h-16 text-brand-blue" />
      </div>
      
      <Title level={3} className="mb-2">
        {title}
      </Title>
      
      <Text variant="body" color="muted" className="mb-8 max-w-md">
        {description}
      </Text>
      
      {actionLabel && onAction && (
        <Button onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

