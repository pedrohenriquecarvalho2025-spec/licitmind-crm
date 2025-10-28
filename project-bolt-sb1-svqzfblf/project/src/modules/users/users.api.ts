/**
 * Interface Contratual do Módulo de Usuários
 */

import { usersService } from './services/users.service'
import type { UserProfile, UserFilters } from './types'

export interface UserInviteData {
  email: string
  full_name: string
  role: UserProfile['role']
  organization_id: string
}

export interface UsersAPI {
  listUsers: (organizationId: string, filters?: UserFilters) => Promise<UserProfile[]>
  getUser: (id: string) => Promise<UserProfile | null>
  createUser: (data: UserInviteData) => Promise<UserProfile | null>
  updateUser: (id: string, updates: Partial<UserProfile>) => Promise<UserProfile | null>
  deleteUser: (id: string) => Promise<boolean>
  inviteUser: (data: UserInviteData) => Promise<{ success: boolean; message: string }>
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

  async createUser(data: UserInviteData) {
    const { data: user } = await usersService.create(data)
    return user
  }

  async updateUser(id: string, updates: Partial<UserProfile>) {
    const { data } = await usersService.update(id, updates)
    return data
  }

  async deleteUser(id: string) {
    const { data } = await usersService.delete(id)
    return data || false
  }

  async inviteUser(data: UserInviteData) {
    const { success, message } = await usersService.invite(data)
    return { success, message }
  }
}

export const usersAPI: UsersAPI = new UsersAPIImpl()

