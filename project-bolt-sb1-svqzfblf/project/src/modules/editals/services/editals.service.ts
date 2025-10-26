/**
 * Serviço de acesso a dados de Editais
 * @module modules/editals/services/editals.service
 */

import { supabase } from '../../../lib/supabase'
import type { Edital, EditalFilters } from '../types'
import { logger } from '../../../core/utils'

export class EditalsService {
  private tableName = 'editals'

  async list(organizationId: string, filters?: EditalFilters) {
    try {
      let query = supabase
        .from(this.tableName)
        .select(`
          *,
          responsavel:responsavel_id (
            full_name
          )
        `)
        .eq('organization_id', organizationId)

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      if (filters?.modalidade) {
        query = query.eq('modalidade', filters.modalidade)
      }

      if (filters?.responsavel_id) {
        query = query.eq('responsavel_id', filters.responsavel_id)
      }

      if (filters?.search) {
        query = query.or(`numero_edital.ilike.%${filters.search}%,objeto.ilike.%${filters.search}%,orgao_contratante.ilike.%${filters.search}%`)
      }

      query = query.order('created_at', { ascending: false })

      const { data, error } = await query

      if (error) throw error
      return { data: data as Edital[], error: null }
    } catch (error) {
      logger.error('Error listing editals:', error)
      return { data: null, error }
    }
  }

  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select(`
          *,
          responsavel:responsavel_id (
            full_name
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return { data: data as Edital, error: null }
    } catch (error) {
      logger.error('Error getting edital:', error)
      return { data: null, error }
    }
  }

  async create(edital: Omit<Edital, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .insert(edital)
        .select()
        .single()

      if (error) throw error
      return { data: data as Edital, error: null }
    } catch (error) {
      logger.error('Error creating edital:', error)
      return { data: null, error }
    }
  }

  async update(id: string, updates: Partial<Edital>) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return { data: data as Edital, error: null }
    } catch (error) {
      logger.error('Error updating edital:', error)
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
      logger.error('Error deleting edital:', error)
      return { data: null, error }
    }
  }
}

export const editalsService = new EditalsService()

