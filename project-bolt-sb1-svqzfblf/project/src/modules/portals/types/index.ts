/**
 * Types para o módulo de Portais de Licitação
 */

import type { Database } from '../../../lib/database.types'

export type BiddingPortal = Database['public']['Tables']['bidding_portals']['Row']
export type BiddingPortalInsert = Database['public']['Tables']['bidding_portals']['Insert']
export type BiddingPortalUpdate = Database['public']['Tables']['bidding_portals']['Update']

export type PortalType = 'federal' | 'estadual' | 'municipal' | 'privado' | 'outros'
export type PortalStatus = 'ativo' | 'vencido' | 'pendente_renovacao' | 'inativo'

export interface PortalFilters {
  search?: string
  tipo?: PortalType | 'all'
  status?: PortalStatus | 'all'
}

export interface PortalCreateData {
  nome_portal: string
  url?: string | null
  tipo?: PortalType | null
  usuario?: string | null
  senha_encrypted?: string | null
  email_acesso?: string | null
  certificado_digital?: boolean
  data_cadastro?: string | null
  data_ultima_atualizacao?: string | null
  data_validade_acesso?: string | null
  status?: PortalStatus
  observacoes?: string | null
  responsavel_id?: string | null
  alerta_vencimento_dias?: number
}

export const PORTAL_TYPE_LABELS: Record<PortalType, string> = {
  federal: 'Federal',
  estadual: 'Estadual',
  municipal: 'Municipal',
  privado: 'Privado',
  outros: 'Outros'
}

export const PORTAL_STATUS_LABELS: Record<PortalStatus, string> = {
  ativo: 'Ativo',
  vencido: 'Vencido',
  pendente_renovacao: 'Pendente Renovação',
  inativo: 'Inativo'
}

