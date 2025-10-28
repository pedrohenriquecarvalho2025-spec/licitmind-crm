/**
 * Configuração de permissões por módulo/view
 */

export type UserRole = 'admin' | 'gestor' | 'analista' | 'cliente' | 'client_viewer'

export type ViewId =
  | 'dashboard'
  | 'pipeline'
  | 'editals'
  | 'users'
  | 'settings'
  | 'reports'
  | 'calendar'
  | 'documents'
  | 'suppliers'
  | 'quotations'
  | 'portals'
  | 'contracts'

/**
 * Define qual é o role mínimo necessário para acessar cada view
 * Hierarquia: admin > gestor > analista > cliente > client_viewer
 */
export const VIEW_PERMISSIONS: Record<ViewId, UserRole> = {
  // Todos podem acessar
  dashboard: 'client_viewer',
  
  // Operacionais - Analista ou superior
  editals: 'analista',
  pipeline: 'analista',
  calendar: 'analista',
  documents: 'analista',
  suppliers: 'analista',
  quotations: 'analista',
  portals: 'analista',
  contracts: 'analista',
  
  // Gestão - Gestor ou superior
  reports: 'gestor',
  
  // Administrativos - Apenas Admin
  users: 'admin',
  settings: 'admin',
}

/**
 * Hierarquia de permissões
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  admin: 5,
  gestor: 4,
  analista: 3,
  cliente: 2,
  client_viewer: 1,
}

/**
 * Verifica se o usuário tem permissão para acessar uma view
 */
export function hasViewPermission(userRole: UserRole, viewId: ViewId): boolean {
  const requiredRole = VIEW_PERMISSIONS[viewId]
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
}

/**
 * Filtra views baseado no role do usuário
 */
export function getAccessibleViews(userRole: UserRole): ViewId[] {
  return Object.keys(VIEW_PERMISSIONS).filter((viewId) =>
    hasViewPermission(userRole, viewId as ViewId)
  ) as ViewId[]
}

