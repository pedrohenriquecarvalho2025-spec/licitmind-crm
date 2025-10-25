/**
 * Tipos do domínio de Contratos
 * @module modules/contracts/types
 */

import type { OrganizationEntity } from '../../../types/common'

export interface Contract extends OrganizationEntity {
  numero_contrato: string
  objeto: string
  contratante: string
  contratante_cnpj?: string
  valor_total: number
  data_assinatura: string
  data_inicio_vigencia: string
  data_fim_vigencia: string
  status: ContractStatus
  tipo_contrato?: ContractType
  edital_id?: string
  observacoes?: string
  documento_url?: string
}

export type ContractStatus = 
  | 'em_elaboracao'
  | 'ativo'
  | 'suspenso'
  | 'encerrado'
  | 'rescindido'

export type ContractType = 
  | 'fornecimento'
  | 'prestacao_servicos'
  | 'obra'
  | 'concessao'
  | 'permissao'

export interface ContractFilters {
  status?: ContractStatus
  tipo_contrato?: ContractType
  data_inicio?: string
  data_fim?: string
  search?: string
}

export interface ContractStats {
  totalValue: number
  activeCount: number
  expiringCount: number
  totalCount: number
}

