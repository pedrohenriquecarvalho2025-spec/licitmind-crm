/**
 * Types para Cláusulas de Multa de Contratos
 */

export interface ContractPenalty {
  id: string
  contract_id: string
  tipo: 'atraso' | 'inadimplencia' | 'qualidade' | 'rescisao' | 'outros'
  descricao: string
  percentual_multa: number | null
  valor_fixo_multa: number | null
  prazo_dias: number | null
  observacoes: string | null
  created_at: string
  updated_at: string
}

export interface ContractPenaltyInsert {
  contract_id: string
  tipo: ContractPenalty['tipo']
  descricao: string
  percentual_multa?: number | null
  valor_fixo_multa?: number | null
  prazo_dias?: number | null
  observacoes?: string | null
}

export type PenaltyType = ContractPenalty['tipo']

export const PENALTY_TYPE_LABELS: Record<PenaltyType, string> = {
  atraso: 'Atraso na Entrega',
  inadimplencia: 'Inadimplência',
  qualidade: 'Qualidade Inadequada',
  rescisao: 'Rescisão Antecipada',
  outros: 'Outros'
}

export interface PenaltyAlert {
  contract_id: string
  contract_numero: string
  penalty_type: PenaltyType
  days_overdue: number
  estimated_penalty: number
  status: 'warning' | 'danger'
}

