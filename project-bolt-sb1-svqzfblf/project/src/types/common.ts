/**
 * Tipos comuns compartilhados em toda a aplicação
 * @module types/common
 */

export type UUID = string

export type Timestamp = string

export interface BaseEntity {
  id: UUID
  created_at: Timestamp
  updated_at: Timestamp
}

export interface OrganizationEntity extends BaseEntity {
  organization_id: UUID
}

export type Status = 
  | 'prospectado'
  | 'em_analise'
  | 'documentacao'
  | 'proposta_enviada'
  | 'em_julgamento'
  | 'homologado'
  | 'perdido'

export type UserRole = 
  | 'admin'
  | 'gestor'
  | 'analista'
  | 'cliente'
  | 'client_viewer'

export interface PaginationParams {
  page: number
  pageSize: number
}

export interface SortParams {
  field: string
  direction: 'asc' | 'desc'
}

export interface FilterParams {
  [key: string]: any
}

export interface DataTableParams {
  pagination?: PaginationParams
  sort?: SortParams
  filters?: FilterParams
}

