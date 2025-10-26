/**
 * Tipos do módulo de Usuários
 */

import type { OrganizationEntity, UUID } from '../../../types/common'

export type UserRole = 'admin' | 'gestor' | 'analista' | 'cliente' | 'client_viewer'

export interface UserProfile extends OrganizationEntity {
  user_id: UUID
  full_name: string
  email: string
  role: UserRole
  is_active: boolean
  avatar_url: string | null
}

export interface UserFilters {
  role?: UserRole
  is_active?: boolean
  search?: string
}

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador',
  gestor: 'Gestor',
  analista: 'Analista',
  cliente: 'Cliente',
  client_viewer: 'Visualizador'
}

