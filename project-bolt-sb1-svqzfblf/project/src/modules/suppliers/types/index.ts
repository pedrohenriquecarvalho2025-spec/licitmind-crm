/**
 * Tipos do domínio de Fornecedores
 * @module modules/suppliers/types
 */

import type { OrganizationEntity } from '../../../types/common'

export interface Supplier extends OrganizationEntity {
  cnpj: string
  razao_social: string
  nome_fantasia?: string | null
  email?: string | null
  telefone?: string | null
  endereco?: string | null
  cidade?: string | null
  estado?: string | null
  cep?: string | null
  is_active: boolean
  observacoes?: string | null
}

export interface SupplierFilters {
  is_active?: boolean
  estado?: string
  search?: string
}

