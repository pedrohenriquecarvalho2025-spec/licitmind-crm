/**
 * Tipos do módulo de Editais
 * @module modules/editals/types
 */

import type { OrganizationEntity, UUID } from '../../../types/common'

export type EditalStatus = 
  | 'prospectado'
  | 'em_analise'
  | 'documentacao'
  | 'proposta_enviada'
  | 'em_julgamento'
  | 'homologado'
  | 'perdido'

export type EditalModalidade =
  | 'concorrencia'
  | 'pregao_presencial'
  | 'pregao_eletronico'
  | 'tomada_precos'
  | 'convite'
  | 'dispensa'
  | 'inexigibilidade'
  | 'rdc'

export interface Edital extends OrganizationEntity {
  numero_edital: string
  modalidade: EditalModalidade
  objeto: string
  orgao_contratante: string
  valor_estimado: number | null
  data_abertura: string | null
  data_limite_envio: string | null
  status: EditalStatus
  responsavel_id: UUID | null
  observacoes: string | null
  link_edital: string | null
  
  // Relacionamentos
  responsavel?: {
    full_name: string
  } | null
}

export interface EditalFilters {
  status?: EditalStatus
  modalidade?: EditalModalidade
  responsavel_id?: UUID
  search?: string
}

export interface EditalStats {
  totalValue: number
  activeCount: number
  wonCount: number
  totalCount: number
}

export const STATUS_LABELS: Record<EditalStatus, string> = {
  prospectado: 'Prospectado',
  em_analise: 'Em Análise',
  documentacao: 'Documentação',
  proposta_enviada: 'Proposta Enviada',
  em_julgamento: 'Em Julgamento',
  homologado: 'Homologado',
  perdido: 'Perdido'
}

export const STATUS_COLORS: Record<EditalStatus, string> = {
  prospectado: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300',
  em_analise: 'bg-gradient-to-r from-brand-cyan/20 to-brand-blue/20 text-brand-blue-dark border border-brand-cyan/30',
  documentacao: 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300',
  proposta_enviada: 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300',
  em_julgamento: 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border border-orange-300',
  homologado: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300',
  perdido: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300'
}

export const MODALIDADE_LABELS: Record<EditalModalidade, string> = {
  concorrencia: 'Concorrência',
  pregao_presencial: 'Pregão Presencial',
  pregao_eletronico: 'Pregão Eletrônico',
  tomada_precos: 'Tomada de Preços',
  convite: 'Convite',
  dispensa: 'Dispensa',
  inexigibilidade: 'Inexigibilidade',
  rdc: 'RDC'
}

