/**
 * Grid de estatísticas de contratos
 * Componente de domínio específico (Organismo)
 * LOC: ~40 linhas
 */

import React from 'react'
import { DollarSign, TrendingUp, AlertCircle, FileSignature } from 'lucide-react'
import { MetricCard } from '../../../components/ui/molecules/MetricCard'
import { formatCurrency } from '../../../core/utils'
import type { ContractStats } from '../types'

interface ContractStatsGridProps {
  stats: ContractStats
  loading?: boolean
}

export const ContractStatsGrid = React.memo(function ContractStatsGrid({ stats, loading }: ContractStatsGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-neutral-200 dark:bg-neutral-700 rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <MetricCard
        title="Valor Total"
        value={formatCurrency(stats.totalValue)}
        icon={DollarSign}
        iconColor="text-green-600"
      />
      
      <MetricCard
        title="Contratos Ativos"
        value={stats.activeCount}
        icon={TrendingUp}
        iconColor="text-brand-cyan"
      />
      
      <MetricCard
        title="Vencendo em 90 dias"
        value={stats.expiringCount}
        icon={AlertCircle}
        iconColor="text-yellow-600"
      />
      
      <MetricCard
        title="Total Contratos"
        value={stats.totalCount}
        icon={FileSignature}
        iconColor="text-brand-blue"
      />
    </div>
  )
})

