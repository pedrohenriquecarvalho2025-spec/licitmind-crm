/**
 * Service para operações de Entregas (AFs/Empenhos)
 */

import { supabase } from '../../../lib/supabase'
import { auditService } from '../../../core/services/audit.service'
import { logger } from '../../../core/utils/logger'
import type { Delivery, DeliveryFilters, DeliveryCreateData, DeliveryStatus } from '../types'

// Mock interface até criar tabela no Supabase
interface DeliveryInsert {
  id?: string
  organization_id: string
  contract_id?: string | null
  numero_af: string
  numero_empenho?: string | null
  descricao: string
  valor: number
  data_emissao: string
  data_entrega_prevista: string
  data_entrega_realizada?: string | null
  status?: DeliveryStatus
  tipo: string
  observacoes?: string | null
  responsavel_id?: string | null
  created_by: string
  created_at?: string
  updated_at?: string
}

export class DeliveriesService {
  private readonly tableName = 'deliveries'

  /**
   * Lista entregas com filtros
   */
  async list(organizationId: string, filters?: DeliveryFilters): Promise<Delivery[]> {
    try {
      let query = supabase
        .from(this.tableName)
        .select('*')
        .eq('organization_id', organizationId)
        .order('data_emissao', { ascending: false })

      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status)
      }

      if (filters?.tipo && filters.tipo !== 'all') {
        query = query.eq('tipo', filters.tipo)
      }

      if (filters?.contract_id) {
        query = query.eq('contract_id', filters.contract_id)
      }

      if (filters?.date_from) {
        query = query.gte('data_emissao', filters.date_from)
      }

      if (filters?.date_to) {
        query = query.lte('data_emissao', filters.date_to)
      }

      if (filters?.search) {
        query = query.or(`numero_af.ilike.%${filters.search}%,numero_empenho.ilike.%${filters.search}%,descricao.ilike.%${filters.search}%`)
      }

      const { data, error } = await query

      if (error) throw error

      // Atualiza status de entregas atrasadas
      await this.updateOverdueDeliveries(organizationId)

      return data || []
    } catch (error) {
      logger.error('Error listing deliveries', { error, organizationId, filters })
      // Retorna array vazio em caso de erro (tabela não existe ainda)
      return []
    }
  }

  /**
   * Busca entrega por ID
   */
  async getById(id: string): Promise<Delivery | null> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      return data
    } catch (error) {
      logger.error('Error getting delivery', { error, id })
      return null
    }
  }

  /**
   * Cria nova entrega
   */
  async create(data: DeliveryCreateData, organizationId: string, userId: string): Promise<Delivery> {
    try {
      // Calcula status inicial
      const status = this.calculateStatus(data.data_entrega_prevista, data.data_entrega_realizada)

      const insertData: DeliveryInsert = {
        organization_id: organizationId,
        contract_id: data.contract_id,
        numero_af: data.numero_af,
        numero_empenho: data.numero_empenho,
        descricao: data.descricao,
        valor: data.valor,
        data_emissao: data.data_emissao,
        data_entrega_prevista: data.data_entrega_prevista,
        data_entrega_realizada: data.data_entrega_realizada,
        status,
        tipo: data.tipo,
        observacoes: data.observacoes,
        responsavel_id: data.responsavel_id,
        created_by: userId
      }

      const { data: delivery, error } = await supabase
        .from(this.tableName)
        .insert(insertData)
        .select()
        .single()

      if (error) throw error

      // Registra auditoria
      await auditService.logCreate('deliveries', delivery.id, userId, delivery)

      logger.info('Delivery created', { deliveryId: delivery.id, numero_af: delivery.numero_af })

      return delivery
    } catch (error) {
      logger.error('Error creating delivery', { error, data })
      throw error
    }
  }

  /**
   * Atualiza entrega
   */
  async update(id: string, data: Partial<DeliveryCreateData>, userId: string): Promise<Delivery> {
    try {
      const existing = await this.getById(id)
      if (!existing) throw new Error('Delivery not found')

      // Recalcula status se necessário
      const status = data.data_entrega_prevista !== undefined || data.data_entrega_realizada !== undefined
        ? this.calculateStatus(
            data.data_entrega_prevista || existing.data_entrega_prevista,
            data.data_entrega_realizada !== undefined ? data.data_entrega_realizada : existing.data_entrega_realizada
          )
        : existing.status

      const updateData: Partial<DeliveryInsert> = {
        contract_id: data.contract_id,
        numero_af: data.numero_af,
        numero_empenho: data.numero_empenho,
        descricao: data.descricao,
        valor: data.valor,
        data_emissao: data.data_emissao,
        data_entrega_prevista: data.data_entrega_prevista,
        data_entrega_realizada: data.data_entrega_realizada,
        status,
        tipo: data.tipo,
        observacoes: data.observacoes,
        responsavel_id: data.responsavel_id,
        updated_at: new Date().toISOString()
      }

      const { data: delivery, error } = await supabase
        .from(this.tableName)
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Registra auditoria
      await auditService.logUpdate('deliveries', id, userId, existing, delivery)

      logger.info('Delivery updated', { deliveryId: id })

      return delivery
    } catch (error) {
      logger.error('Error updating delivery', { error, id, data })
      throw error
    }
  }

  /**
   * Deleta entrega
   */
  async delete(id: string, userId: string): Promise<void> {
    try {
      const existing = await this.getById(id)
      if (!existing) throw new Error('Delivery not found')

      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id)

      if (error) throw error

      // Registra auditoria
      await auditService.logDelete('deliveries', id, userId, existing)

      logger.info('Delivery deleted', { deliveryId: id })
    } catch (error) {
      logger.error('Error deleting delivery', { error, id })
      throw error
    }
  }

  /**
   * Calcula status baseado nas datas
   */
  private calculateStatus(
    dataPrevista: string,
    dataRealizada: string | null | undefined
  ): DeliveryStatus {
    if (dataRealizada) {
      return 'entregue'
    }

    const now = new Date()
    const prevista = new Date(dataPrevista)

    if (now > prevista) {
      return 'atrasado'
    }

    // Considera "em_andamento" se estiver a 7 dias ou menos da data prevista
    const daysUntilDelivery = Math.ceil((prevista.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    if (daysUntilDelivery <= 7) {
      return 'em_andamento'
    }

    return 'pendente'
  }

  /**
   * Atualiza status de entregas atrasadas
   */
  private async updateOverdueDeliveries(organizationId: string): Promise<void> {
    try {
      const now = new Date().toISOString().split('T')[0]

      const { error } = await supabase
        .from(this.tableName)
        .update({ status: 'atrasado' })
        .eq('organization_id', organizationId)
        .lt('data_entrega_prevista', now)
        .is('data_entrega_realizada', null)
        .in('status', ['pendente', 'em_andamento'])

      if (error) {
        logger.warn('Error updating overdue deliveries', { error })
      }
    } catch (error) {
      logger.error('Error updating overdue deliveries', { error, organizationId })
    }
  }

  /**
   * Busca entregas por contrato
   */
  async getByContract(contractId: string): Promise<Delivery[]> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('contract_id', contractId)
        .order('data_emissao', { ascending: false })

      if (error) throw error

      return data || []
    } catch (error) {
      logger.error('Error getting deliveries by contract', { error, contractId })
      return []
    }
  }

  /**
   * Marca entrega como realizada
   */
  async markAsDelivered(id: string, dataEntrega: string, userId: string): Promise<Delivery> {
    try {
      const existing = await this.getById(id)
      if (!existing) throw new Error('Delivery not found')

      const { data, error } = await supabase
        .from(this.tableName)
        .update({
          data_entrega_realizada: dataEntrega,
          status: 'entregue',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Registra auditoria
      await auditService.logUpdate('deliveries', id, userId, existing, data)

      logger.info('Delivery marked as delivered', { deliveryId: id })

      return data
    } catch (error) {
      logger.error('Error marking delivery as delivered', { error, id })
      throw error
    }
  }
}

export const deliveriesService = new DeliveriesService()

