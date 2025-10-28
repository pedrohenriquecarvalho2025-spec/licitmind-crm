/**
 * Service para operações de Portais de Licitação
 */

import { supabase } from '../../../lib/supabase'
import { auditService } from '../../../core/services/audit.service'
import { logger } from '../../../core/utils/logger'
import type { BiddingPortal, BiddingPortalInsert, BiddingPortalUpdate, PortalFilters, PortalCreateData } from '../types'

export class PortalsService {
  private readonly tableName = 'bidding_portals'

  /**
   * Lista portais com filtros
   */
  async list(organizationId: string, filters?: PortalFilters): Promise<BiddingPortal[]> {
    try {
      let query = supabase
        .from(this.tableName)
        .select('*')
        .eq('organization_id', organizationId)
        .order('nome_portal')

      if (filters?.tipo && filters.tipo !== 'all') {
        query = query.eq('tipo', filters.tipo)
      }

      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status)
      }

      if (filters?.search) {
        query = query.ilike('nome_portal', `%${filters.search}%`)
      }

      const { data, error } = await query

      if (error) throw error

      // Atualiza status dos portais
      await this.updatePortalStatuses(organizationId)

      return data || []
    } catch (error) {
      logger.error('Error listing portals', { error, organizationId, filters })
      throw error
    }
  }

  /**
   * Busca portal por ID
   */
  async getById(id: string): Promise<BiddingPortal | null> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      return data
    } catch (error) {
      logger.error('Error getting portal', { error, id })
      throw error
    }
  }

  /**
   * Cria novo portal
   */
  async create(data: PortalCreateData, organizationId: string, userId: string): Promise<BiddingPortal> {
    try {
      // Calcula status inicial
      const status = this.calculateStatus(data.data_validade_acesso)

      const insertData: BiddingPortalInsert = {
        organization_id: organizationId,
        nome_portal: data.nome_portal,
        url: data.url,
        tipo: data.tipo,
        usuario: data.usuario,
        senha_encrypted: data.senha_encrypted,
        email_acesso: data.email_acesso,
        certificado_digital: data.certificado_digital ?? false,
        data_cadastro: data.data_cadastro || new Date().toISOString(),
        data_ultima_atualizacao: data.data_ultima_atualizacao,
        data_validade_acesso: data.data_validade_acesso,
        status: status,
        observacoes: data.observacoes,
        responsavel_id: data.responsavel_id,
        alerta_vencimento_dias: data.alerta_vencimento_dias ?? 30,
        created_by: userId
      }

      const { data: portal, error } = await supabase
        .from(this.tableName)
        .insert(insertData)
        .select()
        .single()

      if (error) throw error

      // Registra auditoria
      await auditService.logCreate('bidding_portals', portal.id, userId, portal)

      logger.info('Portal created', { portalId: portal.id, nome: portal.nome_portal })

      return portal
    } catch (error) {
      logger.error('Error creating portal', { error, data })
      throw error
    }
  }

  /**
   * Atualiza portal
   */
  async update(id: string, data: Partial<PortalCreateData>, userId: string): Promise<BiddingPortal> {
    try {
      const existing = await this.getById(id)
      if (!existing) throw new Error('Portal not found')

      // Calcula novo status se houver mudança na data de validade
      const status = data.data_validade_acesso !== undefined
        ? this.calculateStatus(data.data_validade_acesso)
        : existing.status

      const updateData: BiddingPortalUpdate = {
        nome_portal: data.nome_portal,
        url: data.url,
        tipo: data.tipo,
        usuario: data.usuario,
        senha_encrypted: data.senha_encrypted,
        email_acesso: data.email_acesso,
        certificado_digital: data.certificado_digital,
        data_cadastro: data.data_cadastro,
        data_ultima_atualizacao: new Date().toISOString(),
        data_validade_acesso: data.data_validade_acesso,
        status,
        observacoes: data.observacoes,
        responsavel_id: data.responsavel_id,
        alerta_vencimento_dias: data.alerta_vencimento_dias,
        updated_at: new Date().toISOString()
      }

      const { data: portal, error } = await supabase
        .from(this.tableName)
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Registra auditoria
      await auditService.logUpdate('bidding_portals', id, userId, existing, portal)

      logger.info('Portal updated', { portalId: id })

      return portal
    } catch (error) {
      logger.error('Error updating portal', { error, id, data })
      throw error
    }
  }

  /**
   * Deleta portal
   */
  async delete(id: string, userId: string): Promise<void> {
    try {
      const existing = await this.getById(id)
      if (!existing) throw new Error('Portal not found')

      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id)

      if (error) throw error

      // Registra auditoria
      await auditService.logDelete('bidding_portals', id, userId, existing)

      logger.info('Portal deleted', { portalId: id })
    } catch (error) {
      logger.error('Error deleting portal', { error, id })
      throw error
    }
  }

  /**
   * Atualiza status de todos os portais de uma organização
   */
  private async updatePortalStatuses(organizationId: string): Promise<void> {
    try {
      const { data: portals } = await supabase
        .from(this.tableName)
        .select('id, data_validade_acesso, alerta_vencimento_dias')
        .eq('organization_id', organizationId)
        .not('data_validade_acesso', 'is', null)

      if (!portals) return

      const updates = portals.map(portal => {
        const status = this.calculateStatus(portal.data_validade_acesso!, portal.alerta_vencimento_dias)
        return supabase
          .from(this.tableName)
          .update({ status })
          .eq('id', portal.id)
      })

      await Promise.all(updates)
    } catch (error) {
      logger.error('Error updating portal statuses', { error, organizationId })
    }
  }

  /**
   * Calcula status baseado na data de validade
   */
  private calculateStatus(
    validadeAcesso: string | null | undefined,
    alertaDias: number = 30
  ): 'ativo' | 'vencido' | 'pendente_renovacao' | 'inativo' {
    if (!validadeAcesso) return 'inativo'

    const now = new Date()
    const validade = new Date(validadeAcesso)
    const daysUntilExpiry = Math.ceil((validade.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilExpiry < 0) return 'vencido'
    if (daysUntilExpiry <= alertaDias) return 'pendente_renovacao'
    return 'ativo'
  }

  /**
   * Busca portais expirando em breve
   */
  async getExpiringSoon(organizationId: string, days: number = 30): Promise<BiddingPortal[]> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('organization_id', organizationId)
        .in('status', ['pendente_renovacao', 'vencido'])
        .not('data_validade_acesso', 'is', null)
        .order('data_validade_acesso', { ascending: true })

      if (error) throw error

      return data || []
    } catch (error) {
      logger.error('Error getting expiring portals', { error, organizationId, days })
      throw error
    }
  }
}

export const portalsService = new PortalsService()

