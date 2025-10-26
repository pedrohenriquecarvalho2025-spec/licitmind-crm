/**
 * Grid de estatísticas de fornecedores
 * Componente de domínio específico (Organismo)
 * LOC: ~40 linhas
 */

import React from 'react'
import { Building2, TrendingUp, CheckCircle, XCircle } from 'lucide-react'
import { MetricCard } from '../../../components/ui/molecules/MetricCard'

interface SupplierStatsGridProps {
  totalCount: number
  activeCount: number
  inactiveCount: number
  loading?: boolean
}

export const SupplierStatsGrid = React.memo(function SupplierStatsGrid({ 
  totalCount, 
  activeCount, 
  inactiveCount,
  loading 
}: SupplierStatsGridProps) {
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
        title="Total Fornecedores"
        value={totalCount}
        icon={Building2}
        iconColor="text-brand-blue"
      />
      
      <MetricCard
        title="Ativos"
        value={activeCount}
        icon={CheckCircle}
        iconColor="text-green-600"
      />
      
      <MetricCard
        title="Inativos"
        value={inactiveCount}
        icon={XCircle}
        iconColor="text-red-600"
      />
      
      <MetricCard
        title="Taxa de Ativação"
        value={totalCount > 0 ? `${Math.round((activeCount / totalCount) * 100)}%` : '0%'}
        icon={TrendingUp}
        iconColor="text-brand-cyan"
      />
    </div>
  )
})

