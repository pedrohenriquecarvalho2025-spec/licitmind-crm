/**
 * Card de exibição de fornecedor
 * Componente de domínio específico (Organismo)
 * LOC: ~60 linhas
 */

import React from 'react'
import { Building2, Phone, Mail, MapPin } from 'lucide-react'
import { Badge } from '../../../components/ui/atoms/Badge'
import { Text } from '../../../components/ui/atoms/Text'
import { formatCNPJ } from '../../../core/utils/formatters'
import type { Supplier } from '../types'

interface SupplierCardProps {
  supplier: Supplier
  onClick?: () => void
}

export const SupplierCard = React.memo(function SupplierCard({ supplier, onClick }: SupplierCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 hover:shadow-lg transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg">
            <Building2 className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <Text weight="bold" className="mb-1">{supplier.razao_social}</Text>
            <Text variant="caption" color="muted">{formatCNPJ(supplier.cnpj)}</Text>
          </div>
        </div>
        <Badge variant={supplier.is_active ? 'success' : 'default'}>
          {supplier.is_active ? 'Ativo' : 'Inativo'}
        </Badge>
      </div>

      {supplier.nome_fantasia && (
        <Text variant="caption" color="muted" className="mb-4">
          {supplier.nome_fantasia}
        </Text>
      )}

      <div className="grid grid-cols-1 gap-2">
        {supplier.email && (
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-brand-cyan" />
            <Text variant="small" className="truncate">
              {supplier.email}
            </Text>
          </div>
        )}
        
        {supplier.telefone && (
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-green-600" />
            <Text variant="small">
              {supplier.telefone}
            </Text>
          </div>
        )}
        
        {supplier.cidade && supplier.estado && (
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-orange-600" />
            <Text variant="small">
              {supplier.cidade}/{supplier.estado}
            </Text>
          </div>
        )}
      </div>
    </div>
  )
})

