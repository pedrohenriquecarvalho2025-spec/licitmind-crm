/**
 * Types para o módulo de Protocolos Administrativos
 */

export interface Protocol {
  id: string
  organization_id: string
  numero_protocolo: string
  tipo: ProtocolType
  assunto: string
  orgao_destino: string
  data_protocolo: string
  prazo_resposta: string | null
  status: ProtocolStatus
  observacoes: string | null
  resposta_recebida: boolean
  data_resposta: string | null
  anexo_url: string | null
  responsavel_id: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export type ProtocolType = 
  | 'solicitacao' 
  | 'recurso' 
  | 'impugnacao' 
  | 'consulta' 
  | 'manifestacao' 
  | 'outros'

export type ProtocolStatus = 
  | 'aguardando_resposta' 
  | 'em_analise' 
  | 'respondido' 
  | 'deferido' 
  | 'indeferido' 
  | 'arquivado'

export interface ProtocolFilters {
  search?: string
  status?: ProtocolStatus | 'all'
  tipo?: ProtocolType | 'all'
  date_from?: string
  date_to?: string
  orgao_destino?: string
}

export interface ProtocolCreateData {
  numero_protocolo: string
  tipo: ProtocolType
  assunto: string
  orgao_destino: string
  data_protocolo: string
  prazo_resposta?: string | null
  status?: ProtocolStatus
  observacoes?: string | null
  resposta_recebida?: boolean
  data_resposta?: string | null
  responsavel_id?: string | null
}

export const PROTOCOL_TYPE_LABELS: Record<ProtocolType, string> = {
  solicitacao: 'Solicitação',
  recurso: 'Recurso',
  impugnacao: 'Impugnação',
  consulta: 'Consulta',
  manifestacao: 'Manifestação',
  outros: 'Outros'
}

export const PROTOCOL_STATUS_LABELS: Record<ProtocolStatus, string> = {
  aguardando_resposta: 'Aguardando Resposta',
  em_analise: 'Em Análise',
  respondido: 'Respondido',
  deferido: 'Deferido',
  indeferido: 'Indeferido',
  arquivado: 'Arquivado'
}

export const PROTOCOL_STATUS_COLORS: Record<ProtocolStatus, { bg: string; text: string; border: string }> = {
  aguardando_resposta: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
  em_analise: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
  respondido: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
  deferido: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
  indeferido: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
  arquivado: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' }
}

