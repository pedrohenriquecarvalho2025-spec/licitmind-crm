/**
 * Constantes globais da aplicação
 * @module core/config/constants
 */

export const APP_NAME = 'LicitMind'
export const APP_VERSION = '2.0.0'

export const DATE_FORMAT = 'dd/MM/yyyy'
export const DATETIME_FORMAT = 'dd/MM/yyyy HH:mm'
export const TIME_FORMAT = 'HH:mm'

export const CURRENCY = 'BRL'
export const LOCALE = 'pt-BR'

export const ITEMS_PER_PAGE = 20
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export const ROLE_HIERARCHY = {
  admin: 4,
  gestor: 3,
  analista: 2,
  cliente: 1,
  client_viewer: 0
} as const

export const STATUS_COLORS = {
  prospectado: 'default',
  em_analise: 'info',
  documentacao: 'warning',
  proposta_enviada: 'primary',
  em_julgamento: 'warning',
  homologado: 'success',
  perdido: 'danger'
} as const

