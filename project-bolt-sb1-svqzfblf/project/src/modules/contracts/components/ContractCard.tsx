/**
 * Card de exibição de contrato
 * Componente de domínio específico (Organismo)
 * LOC: ~50 linhas (dentro do limite de 200 para organismos)
 */

import React from 'react'
import { FileSignature, Calendar, DollarSign } from 'lucide-react'
import { Badge } from '../../../components/ui/atoms/Badge'
import { Text } from '../../../components/ui/atoms/Text'
import { formatCurrency, formatDate } from '../../../core/utils'
import type { Contract, ContractStatus } from '../types'

interface ContractCardProps {
  contract: Contract
  onClick?: () => void
}

const statusVariants: Record<ContractStatus, any> = {
  em_elaboracao: 'default',
  ativo: 'success',
  suspenso: 'warning',
  encerrado: 'info',
  rescindido: 'danger'
}

const statusLabels: Record<ContractStatus, string> = {
  em_elaboracao: 'Em Elaboração',
  ativo: 'Ativo',
  suspenso: 'Suspenso',
  encerrado: 'Encerrado',
  rescindido: 'Rescindido'
}

export const ContractCard = React.memo(function ContractCard({ contract, onClick }: ContractCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 hover:shadow-lg transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-lg">
            <FileSignature className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <Text weight="bold" className="mb-1">{contract.numero_contrato}</Text>
            <Text variant="caption" color="muted">{contract.contratante}</Text>
          </div>
        </div>
        <Badge variant={statusVariants[contract.status]}>
          {statusLabels[contract.status]}
        </Badge>
      </div>

      <Text variant="caption" color="muted" className="mb-4 line-clamp-2">
        {contract.objeto}
      </Text>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4 text-green-600" />
          <Text variant="small" weight="semibold">
            {formatCurrency(contract.valor_total)}
          </Text>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-orange-600" />
          <Text variant="small" weight="medium">
            {formatDate(contract.data_fim_vigencia)}
          </Text>
        </div>
      </div>
    </div>
  )
})

