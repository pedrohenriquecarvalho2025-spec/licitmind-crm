/**
 * Interface Contratual do Módulo de Usuários
 */

import { usersService } from './services/users.service'
import type { UserProfile, UserFilters } from './types'

export interface UsersAPI {
  listUsers: (organizationId: string, filters?: UserFilters) => Promise<UserProfile[]>
  getUser: (id: string) => Promise<UserProfile | null>
  updateUser: (id: string, updates: Partial<UserProfile>) => Promise<UserProfile | null>
  deleteUser: (id: string) => Promise<boolean>
}

class UsersAPIImpl implements UsersAPI {
  async listUsers(organizationId: string, filters?: UserFilters) {
    const { data } = await usersService.list(organizationId, filters)
    return data || []
  }

  async getUser(id: string) {
    const { data } = await usersService.getById(id)
    return data
  }

  async updateUser(id: string, updates: Partial<UserProfile>) {
    const { data } = await usersService.update(id, updates)
    return data
  }

  async deleteUser(id: string) {
    const { data } = await usersService.delete(id)
    return data || false
  }
}

export const usersAPI: UsersAPI = new UsersAPIImpl()

