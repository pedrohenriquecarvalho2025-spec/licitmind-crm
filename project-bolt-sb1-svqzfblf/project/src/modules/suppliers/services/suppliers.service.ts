/**
 * Serviço de acesso a dados de Fornecedores
 * @module modules/suppliers/services/suppliers.service
 */

import { supabase } from '../../../lib/supabase'
import type { Supplier, SupplierFilters } from '../types'
import { logger } from '../../../core/utils'

export class SuppliersService {
  private tableName = 'suppliers'

  async list(organizationId: string, filters?: SupplierFilters) {
    try {
      let query = supabase
        .from(this.tableName)
        .select('*')
        .eq('organization_id', organizationId)

      if (filters?.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active)
      }

      if (filters?.estado) {
        query = query.eq('estado', filters.estado)
      }

      if (filters?.search) {
        query = query.or(`razao_social.ilike.%${filters.search}%,cnpj.ilike.%${filters.search}%,nome_fantasia.ilike.%${filters.search}%`)
      }

      query = query.order('razao_social')

      const { data, error } = await query

      if (error) throw error
      return { data: data as Supplier[], error: null }
    } catch (error) {
      logger.error('Error listing suppliers:', error)
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
      return { data: data as Supplier, error: null }
    } catch (error) {
      logger.error('Error getting supplier:', error)
      return { data: null, error }
    }
  }

  async create(supplier: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .insert(supplier)
        .select()
        .single()

      if (error) throw error
      return { data: data as Supplier, error: null }
    } catch (error) {
      logger.error('Error creating supplier:', error)
      return { data: null, error }
    }
  }

  async update(id: string, updates: Partial<Supplier>) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return { data: data as Supplier, error: null }
    } catch (error) {
      logger.error('Error updating supplier:', error)
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
      logger.error('Error deleting supplier:', error)
      return { data: null, error }
    }
  }
}

export const suppliersService = new SuppliersService()

