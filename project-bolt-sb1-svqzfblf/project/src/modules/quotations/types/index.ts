/**
 * Types para o módulo de Cotações
 */

import type { Database } from '../../../lib/database.types'

export type Quotation = Database['public']['Tables']['quotations']['Row']
export type QuotationInsert = Database['public']['Tables']['quotations']['Insert']
export type QuotationUpdate = Database['public']['Tables']['quotations']['Update']

export type QuotationStatus = 'pendente' | 'em_andamento' | 'recebida' | 'aprovada' | 'rejeitada' | 'cancelada'

export interface QuotationFilters {
  search?: string
  status?: QuotationStatus | 'all'
  edital_id?: string
  date_from?: string
  date_to?: string
}

export interface QuotationCreateData {
  numero_cotacao: string
  edital_id?: string | null
  descricao?: string | null
  data_solicitacao: string
  data_limite_resposta?: string | null
  status?: QuotationStatus
  observacoes?: string | null
}

export const QUOTATION_STATUS_LABELS: Record<QuotationStatus, string> = {
  pendente: 'Pendente',
  em_andamento: 'Em Andamento',
  recebida: 'Recebida',
  aprovada: 'Aprovada',
  rejeitada: 'Rejeitada',
  cancelada: 'Cancelada'
}

export const QUOTATION_STATUS_COLORS: Record<QuotationStatus, string> = {
  pendente: 'yellow',
  em_andamento: 'blue',
  recebida: 'purple',
  aprovada: 'green',
  rejeitada: 'red',
  cancelada: 'gray'
}

