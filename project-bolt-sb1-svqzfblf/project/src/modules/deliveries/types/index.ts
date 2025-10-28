/**
 * Types para o módulo de Gestão de Entregas (AFs/Empenhos)
 */

export interface Delivery {
  id: string
  organization_id: string
  contract_id: string | null
  numero_af: string
  numero_empenho: string | null
  descricao: string
  valor: number
  data_emissao: string
  data_entrega_prevista: string
  data_entrega_realizada: string | null
  status: DeliveryStatus
  tipo: DeliveryType
  observacoes: string | null
  responsavel_id: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export type DeliveryStatus = 
  | 'pendente' 
  | 'em_andamento' 
  | 'parcialmente_entregue' 
  | 'entregue' 
  | 'atrasado' 
  | 'cancelado'

export type DeliveryType = 
  | 'af' 
  | 'empenho' 
  | 'nota_empenho'

export interface DeliveryFilters {
  search?: string
  status?: DeliveryStatus | 'all'
  tipo?: DeliveryType | 'all'
  contract_id?: string
  date_from?: string
  date_to?: string
}

export interface DeliveryCreateData {
  numero_af: string
  numero_empenho?: string | null
  contract_id?: string | null
  descricao: string
  valor: number
  data_emissao: string
  data_entrega_prevista: string
  data_entrega_realizada?: string | null
  status?: DeliveryStatus
  tipo: DeliveryType
  observacoes?: string | null
  responsavel_id?: string | null
}

export interface DeliveryStats {
  total: number
  pendente: number
  em_andamento: number
  entregue: number
  atrasado: number
  totalValue: number
  deliveredValue: number
}

export const DELIVERY_STATUS_LABELS: Record<DeliveryStatus, string> = {
  pendente: 'Pendente',
  em_andamento: 'Em Andamento',
  parcialmente_entregue: 'Parcialmente Entregue',
  entregue: 'Entregue',
  atrasado: 'Atrasado',
  cancelado: 'Cancelado'
}

export const DELIVERY_TYPE_LABELS: Record<DeliveryType, string> = {
  af: 'Autorização de Fornecimento',
  empenho: 'Empenho',
  nota_empenho: 'Nota de Empenho'
}

export const DELIVERY_STATUS_COLORS: Record<DeliveryStatus, { bg: string; text: string; border: string }> = {
  pendente: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
  em_andamento: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
  parcialmente_entregue: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
  entregue: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
  atrasado: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
  cancelado: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' }
}

