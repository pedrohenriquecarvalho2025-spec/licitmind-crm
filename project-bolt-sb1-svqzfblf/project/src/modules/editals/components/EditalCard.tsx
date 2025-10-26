/**
 * Card de exibição de edital
 * Componente de domínio específico (Organismo)
 * LOC: ~60 linhas
 */

import React from 'react'
import { FileText, Calendar, DollarSign, Building } from 'lucide-react'
import { Badge } from '../../../components/ui/atoms/Badge'
import { Text } from '../../../components/ui/atoms/Text'
import { formatCurrency, formatDate } from '../../../core/utils'
import type { Edital } from '../types'
import { STATUS_COLORS, STATUS_LABELS, MODALIDADE_LABELS } from '../types'

interface EditalCardProps {
  edital: Edital
  onClick?: () => void
}

export const EditalCard = React.memo(function EditalCard({ edital, onClick }: EditalCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 hover:shadow-lg transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <Text weight="bold" className="mb-1">{edital.numero_edital}</Text>
            <Text variant="caption" color="muted">{MODALIDADE_LABELS[edital.modalidade]}</Text>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${STATUS_COLORS[edital.status]}`}>
          {STATUS_LABELS[edital.status]}
        </span>
      </div>

      <Text variant="caption" color="muted" className="mb-4 line-clamp-2">
        {edital.objeto}
      </Text>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center space-x-2">
          <Building className="w-4 h-4 text-neutral-600" />
          <Text variant="small" weight="medium" className="truncate">
            {edital.orgao_contratante}
          </Text>
        </div>
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4 text-green-600" />
          <Text variant="small" weight="semibold">
            {formatCurrency(edital.valor_estimado)}
          </Text>
        </div>
      </div>

      {edital.data_limite_envio && (
        <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
          <Calendar className="w-4 h-4 text-orange-600" />
          <Text variant="small">
            Prazo: {formatDate(edital.data_limite_envio)}
          </Text>
        </div>
      )}
    </div>
  )
})

