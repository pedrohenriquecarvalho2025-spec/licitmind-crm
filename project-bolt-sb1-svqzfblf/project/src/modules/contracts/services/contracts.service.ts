/**
 * Serviço de acesso a dados de Contratos
 * @module modules/contracts/services/contracts.service
 */

import { supabase } from '../../../lib/supabase'
import type { Contract, ContractFilters } from '../types'
import { logger } from '../../../core/utils'

export class ContractsService {
  private tableName = 'contracts'

  async list(organizationId: string, filters?: ContractFilters) {
    try {
      let query = supabase
        .from(this.tableName)
        .select('*')
        .eq('organization_id', organizationId)

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      if (filters?.tipo_contrato) {
        query = query.eq('tipo_contrato', filters.tipo_contrato)
      }

      if (filters?.search) {
        query = query.or(`numero_contrato.ilike.%${filters.search}%,objeto.ilike.%${filters.search}%,contratante.ilike.%${filters.search}%`)
      }

      query = query.order('data_assinatura', { ascending: false })

      const { data, error } = await query

      if (error) throw error
      return { data: data as Contract[], error: null }
    } catch (error) {
      logger.error('Error listing contracts:', error)
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
      return { data: data as Contract, error: null }
    } catch (error) {
      logger.error('Error getting contract:', error)
      return { data: null, error }
    }
  }

  async create(contract: Omit<Contract, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .insert(contract)
        .select()
        .single()

      if (error) throw error
      return { data: data as Contract, error: null }
    } catch (error) {
      logger.error('Error creating contract:', error)
      return { data: null, error }
    }
  }

  async update(id: string, updates: Partial<Contract>) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return { data: data as Contract, error: null }
    } catch (error) {
      logger.error('Error updating contract:', error)
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
      logger.error('Error deleting contract:', error)
      return { data: null, error }
    }
  }
}

export const contractsService = new ContractsService()

