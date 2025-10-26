/**
 * Grid de estatísticas de editais
 * Componente de domínio específico (Organismo)
 * LOC: ~40 linhas
 */

import React from 'react'
import { DollarSign, TrendingUp, Trophy, FileText } from 'lucide-react'
import { MetricCard } from '../../../components/ui/molecules/MetricCard'
import { formatCurrency } from '../../../core/utils'
import type { EditalStats } from '../types'

interface EditalStatsGridProps {
  stats: EditalStats
  loading?: boolean
}

export const EditalStatsGrid = React.memo(function EditalStatsGrid({ stats, loading }: EditalStatsGridProps) {
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
        title="Editais Ativos"
        value={stats.activeCount}
        icon={TrendingUp}
        iconColor="text-brand-cyan"
      />
      
      <MetricCard
        title="Homologados"
        value={stats.wonCount}
        icon={Trophy}
        iconColor="text-yellow-600"
      />
      
      <MetricCard
        title="Total Editais"
        value={stats.totalCount}
        icon={FileText}
        iconColor="text-brand-blue"
      />
    </div>
  )
})

