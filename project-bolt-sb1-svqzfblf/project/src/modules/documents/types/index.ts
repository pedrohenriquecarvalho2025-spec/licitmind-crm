/**
 * Types para o módulo de Documentos
 */

import type { Database } from '../../../lib/database.types'

export type Document = Database['public']['Tables']['documents']['Row']
export type DocumentInsert = Database['public']['Tables']['documents']['Insert']
export type DocumentUpdate = Database['public']['Tables']['documents']['Update']

export type DocumentType = 'atestado' | 'crea_cau' | 'certidao' | 'licenca' | 'outros'
export type DocumentStatus = 'valid' | 'expiring' | 'expired'

export interface DocumentFilters {
  search?: string
  type?: DocumentType | 'all'
  status?: DocumentStatus | 'all'
  category?: string
}

export interface DocumentUploadData {
  name: string
  type: DocumentType
  category: string
  expiry_date?: string | null
  file: File
}

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  atestado: 'Atestado de Qualificação Técnica',
  crea_cau: 'CREA / CAU',
  certidao: 'Certidões',
  licenca: 'Licenças',
  outros: 'Outros'
}

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  valid: 'Válido',
  expiring: 'Próximo ao Vencimento',
  expired: 'Vencido'
}

