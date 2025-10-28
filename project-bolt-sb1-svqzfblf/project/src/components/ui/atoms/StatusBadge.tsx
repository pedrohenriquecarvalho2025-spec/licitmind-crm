interface StatusBadgeProps {
  status: 'active' | 'pending' | 'completed' | 'cancelled' | 'draft' | 'approved' | 'rejected'
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

export function StatusBadge({ status, label, size = 'md' }: StatusBadgeProps) {
  const statusConfig = {
    active: {
      label: label || 'Ativo',
      bg: 'bg-green-100 dark:bg-green-950/50',
      text: 'text-green-700 dark:text-green-400',
      border: 'border-green-300 dark:border-green-700',
      dot: 'bg-green-500'
    },
    pending: {
      label: label || 'Pendente',
      bg: 'bg-yellow-100 dark:bg-yellow-950/50',
      text: 'text-yellow-700 dark:text-yellow-400',
      border: 'border-yellow-300 dark:border-yellow-700',
      dot: 'bg-yellow-500'
    },
    completed: {
      label: label || 'Concluído',
      bg: 'bg-blue-100 dark:bg-blue-950/50',
      text: 'text-blue-700 dark:text-blue-400',
      border: 'border-blue-300 dark:border-blue-700',
      dot: 'bg-blue-500'
    },
    cancelled: {
      label: label || 'Cancelado',
      bg: 'bg-red-100 dark:bg-red-950/50',
      text: 'text-red-700 dark:text-red-400',
      border: 'border-red-300 dark:border-red-700',
      dot: 'bg-red-500'
    },
    draft: {
      label: label || 'Rascunho',
      bg: 'bg-neutral-100 dark:bg-neutral-800',
      text: 'text-neutral-700 dark:text-neutral-400',
      border: 'border-neutral-300 dark:border-neutral-700',
      dot: 'bg-neutral-500'
    },
    approved: {
      label: label || 'Aprovado',
      bg: 'bg-emerald-100 dark:bg-emerald-950/50',
      text: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-300 dark:border-emerald-700',
      dot: 'bg-emerald-500'
    },
    rejected: {
      label: label || 'Rejeitado',
      bg: 'bg-rose-100 dark:bg-rose-950/50',
      text: 'text-rose-700 dark:text-rose-400',
      border: 'border-rose-300 dark:border-rose-700',
      dot: 'bg-rose-500'
    }
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  }

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5'
  }

  const config = statusConfig[status]

  return (
    <span className={`inline-flex items-center space-x-1.5 ${sizeClasses[size]} ${config.bg} ${config.text} ${config.border} border rounded-full font-semibold`}>
      <span className={`${dotSizes[size]} ${config.dot} rounded-full animate-pulse`} />
      <span>{config.label}</span>
    </span>
  )
}
