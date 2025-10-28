/**
 * Service para operações de Cotações
 */

import { supabase } from '../../../lib/supabase'
import { auditService } from '../../../core/services/audit.service'
import { logger } from '../../../core/utils/logger'
import type { Quotation, QuotationInsert, QuotationUpdate, QuotationFilters, QuotationCreateData } from '../types'

export class QuotationsService {
  private readonly tableName = 'quotations'

  /**
   * Lista cotações com filtros
   */
  async list(organizationId: string, filters?: QuotationFilters): Promise<Quotation[]> {
    try {
      let query = supabase
        .from(this.tableName)
        .select('*')
        .eq('organization_id', organizationId)
        .order('data_solicitacao', { ascending: false })

      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status)
      }

      if (filters?.edital_id) {
        query = query.eq('edital_id', filters.edital_id)
      }

      if (filters?.date_from) {
        query = query.gte('data_solicitacao', filters.date_from)
      }

      if (filters?.date_to) {
        query = query.lte('data_solicitacao', filters.date_to)
      }

      if (filters?.search) {
        query = query.or(`numero_cotacao.ilike.%${filters.search}%,descricao.ilike.%${filters.search}%`)
      }

      const { data, error } = await query

      if (error) throw error

      return data || []
    } catch (error) {
      logger.error('Error listing quotations', { error, organizationId, filters })
      throw error
    }
  }

  /**
   * Busca cotação por ID
   */
  async getById(id: string): Promise<Quotation | null> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      return data
    } catch (error) {
      logger.error('Error getting quotation', { error, id })
      throw error
    }
  }

  /**
   * Cria nova cotação
   */
  async create(data: QuotationCreateData, organizationId: string, userId: string): Promise<Quotation> {
    try {
      const insertData: QuotationInsert = {
        organization_id: organizationId,
        numero_cotacao: data.numero_cotacao,
        edital_id: data.edital_id,
        descricao: data.descricao,
        data_solicitacao: data.data_solicitacao,
        data_limite_resposta: data.data_limite_resposta,
        status: data.status || 'pendente',
        observacoes: data.observacoes,
        created_by: userId
      }

      const { data: quotation, error } = await supabase
        .from(this.tableName)
        .insert(insertData)
        .select()
        .single()

      if (error) throw error

      // Registra auditoria
      await auditService.logCreate('quotations', quotation.id, userId, quotation)

      logger.info('Quotation created', { quotationId: quotation.id, numero: quotation.numero_cotacao })

      return quotation
    } catch (error) {
      logger.error('Error creating quotation', { error, data })
      throw error
    }
  }

  /**
   * Atualiza cotação
   */
  async update(id: string, data: Partial<QuotationCreateData>, userId: string): Promise<Quotation> {
    try {
      const existing = await this.getById(id)
      if (!existing) throw new Error('Quotation not found')

      const updateData: QuotationUpdate = {
        numero_cotacao: data.numero_cotacao,
        edital_id: data.edital_id,
        descricao: data.descricao,
        data_solicitacao: data.data_solicitacao,
        data_limite_resposta: data.data_limite_resposta,
        status: data.status,
        observacoes: data.observacoes,
        updated_at: new Date().toISOString()
      }

      const { data: quotation, error } = await supabase
        .from(this.tableName)
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Registra auditoria
      await auditService.logUpdate('quotations', id, userId, existing, quotation)

      logger.info('Quotation updated', { quotationId: id })

      return quotation
    } catch (error) {
      logger.error('Error updating quotation', { error, id, data })
      throw error
    }
  }

  /**
   * Deleta cotação
   */
  async delete(id: string, userId: string): Promise<void> {
    try {
      const existing = await this.getById(id)
      if (!existing) throw new Error('Quotation not found')

      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id)

      if (error) throw error

      // Registra auditoria
      await auditService.logDelete('quotations', id, userId, existing)

      logger.info('Quotation deleted', { quotationId: id })
    } catch (error) {
      logger.error('Error deleting quotation', { error, id })
      throw error
    }
  }

  /**
   * Busca cotações por edital
   */
  async getByEdital(editalId: string): Promise<Quotation[]> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('edital_id', editalId)
        .order('data_solicitacao', { ascending: false })

      if (error) throw error

      return data || []
    } catch (error) {
      logger.error('Error getting quotations by edital', { error, editalId })
      throw error
    }
  }

  /**
   * Atualiza status da cotação
   */
  async updateStatus(id: string, status: QuotationCreateData['status'], userId: string): Promise<Quotation> {
    try {
      const existing = await this.getById(id)
      if (!existing) throw new Error('Quotation not found')

      const { data, error } = await supabase
        .from(this.tableName)
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Registra auditoria
      await auditService.logUpdate('quotations', id, userId, existing, data)

      logger.info('Quotation status updated', { quotationId: id, status })

      return data
    } catch (error) {
      logger.error('Error updating quotation status', { error, id, status })
      throw error
    }
  }
}

export const quotationsService = new QuotationsService()

