/**
 * Serviço de acesso a dados de Usuários
 */

import { supabase } from '../../../lib/supabase'
import type { UserProfile, UserFilters } from '../types'
import { logger } from '../../../core/utils'

export class UsersService {
  private tableName = 'user_profiles'

  async list(organizationId: string, filters?: UserFilters) {
    try {
      let query = supabase
        .from(this.tableName)
        .select('*')
        .eq('organization_id', organizationId)

      if (filters?.role) {
        query = query.eq('role', filters.role)
      }

      if (filters?.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active)
      }

      if (filters?.search) {
        query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
      }

      query = query.order('full_name')

      const { data, error } = await query

      if (error) throw error
      return { data: data as UserProfile[], error: null }
    } catch (error) {
      logger.error('Error listing users:', error)
      return { data: null, error }
    }
  }

  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return { data: data as UserProfile, error: null }
    } catch (error) {
      logger.error('Error getting user:', error)
      return { data: null, error }
    }
  }

  async update(id: string, updates: Partial<UserProfile>) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return { data: data as UserProfile, error: null }
    } catch (error) {
      logger.error('Error updating user:', error)
      return { data: null, error }
    }
  }

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id)

      if (error) throw error
      return { data: true, error: null }
    } catch (error) {
      logger.error('Error deleting user:', error)
      return { data: null, error }
    }
  }
}

export const usersService = new UsersService()

