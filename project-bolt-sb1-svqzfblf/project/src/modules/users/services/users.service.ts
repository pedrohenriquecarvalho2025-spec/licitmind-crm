/**
 * Serviço de acesso a dados de Usuários
 */

import { supabase } from '../../../lib/supabase'
import type { UserProfile, UserFilters } from '../types'
import { logger } from '../../../core/utils'
import { auditService } from '../../../core/services/audit.service'

export interface UserCreateData {
  email: string
  full_name: string
  role: UserProfile['role']
  organization_id: string
}

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

  async create(userData: UserCreateData) {
    try {
      // Para simplificar, vamos criar um profile direto
      // Em produção, isso deveria criar um usuário no auth primeiro
      const tempUserId = crypto.randomUUID()
      
      const { data, error } = await supabase
        .from(this.tableName)
        .insert({
          id: tempUserId,
          ...userData,
          is_active: true,
        })
        .select()
        .single()

      if (error) throw error

      // Registrar no audit log
      const profile = data as UserProfile
      await auditService.logCreate(
        tempUserId, // Em produção, usar o ID do usuário que está criando
        userData.organization_id,
        'user',
        profile.id,
        profile.full_name
      )

      return { data: profile, error: null }
    } catch (error) {
      logger.error('Error creating user:', error)
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

      // Registrar no audit log
      const profile = data as UserProfile
      if (profile.organization_id) {
        await auditService.logUpdate(
          id, // Em produção, usar o ID do usuário que está atualizando
          profile.organization_id,
          'user',
          profile.id,
          profile.full_name,
          updates
        )
      }

      return { data: profile, error: null }
    } catch (error) {
      logger.error('Error updating user:', error)
      return { data: null, error }
    }
  }

  async delete(id: string) {
    try {
      // Buscar dados do usuário antes de deletar para o audit log
      const { data: userData } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single()

      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id)

      if (error) throw error

      // Registrar no audit log
      if (userData) {
        const profile = userData as UserProfile
        if (profile.organization_id) {
          await auditService.logDelete(
            id, // Em produção, usar o ID do usuário que está deletando
            profile.organization_id,
            'user',
            profile.id,
            profile.full_name
          )
        }
      }

      return { data: true, error: null }
    } catch (error) {
      logger.error('Error deleting user:', error)
      return { data: null, error }
    }
  }

  async invite(inviteData: UserCreateData) {
    try {
      // Criar usuário através do Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.inviteUserByEmail(
        inviteData.email,
        {
          data: {
            full_name: inviteData.full_name,
            role: inviteData.role,
            organization_id: inviteData.organization_id,
          },
        }
      )

      if (authError) {
        // Se admin API não disponível, criar direto
        logger.warn('Admin API not available, creating user directly')
        const createResult = await this.create(inviteData)
        if (createResult.error) throw createResult.error
        
        return {
          success: true,
          message: 'Usuário criado com sucesso. Email de convite seria enviado em produção.',
        }
      }

      return {
        success: true,
        message: 'Convite enviado com sucesso!',
      }
    } catch (error) {
      logger.error('Error inviting user:', error)
      return {
        success: false,
        message: 'Erro ao enviar convite',
      }
    }
  }
}

export const usersService = new UsersService()

