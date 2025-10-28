/**
 * Serviço de Auditoria - Registra atividades do sistema
 */

import { supabase } from '../../lib/supabase'
import { logger } from '../utils/logger'

export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'view'
  | 'export'
  | 'import'
  | 'login'
  | 'logout'
  | 'invite'
  | 'approve'
  | 'reject'

export type AuditEntityType =
  | 'edital'
  | 'contract'
  | 'supplier'
  | 'quotation'
  | 'document'
  | 'user'
  | 'portal'
  | 'task'
  | 'notification'
  | 'report'
  | 'setting'

export interface AuditLogData {
  user_id: string
  organization_id: string
  action: AuditAction
  entity_type: AuditEntityType
  entity_id: string
  description: string
  metadata?: Record<string, any>
  ip_address?: string
}

class AuditService {
  private tableName = 'activity_logs'

  /**
   * Registra uma atividade no log de auditoria
   */
  async log(data: AuditLogData): Promise<boolean> {
    try {
      const { error } = await supabase.from(this.tableName).insert({
        user_id: data.user_id,
        organization_id: data.organization_id,
        action: data.action,
        entity_type: data.entity_type,
        entity_id: data.entity_id,
        description: data.description,
        metadata: data.metadata || {},
        ip_address: data.ip_address || null,
        created_at: new Date().toISOString(),
      })

      if (error) {
        logger.error('Error logging audit activity:', error)
        return false
      }

      logger.info('Audit log created:', {
        action: data.action,
        entity_type: data.entity_type,
        entity_id: data.entity_id,
      })

      return true
    } catch (error) {
      logger.error('Exception in audit log:', error)
      return false
    }
  }

  /**
   * Registra criação de entidade
   */
  async logCreate(
    userId: string,
    organizationId: string,
    entityType: AuditEntityType,
    entityId: string,
    entityName: string,
    metadata?: Record<string, any>
  ): Promise<boolean> {
    return this.log({
      user_id: userId,
      organization_id: organizationId,
      action: 'create',
      entity_type: entityType,
      entity_id: entityId,
      description: `Criou ${this.getEntityLabel(entityType)}: ${entityName}`,
      metadata,
    })
  }

  /**
   * Registra atualização de entidade
   */
  async logUpdate(
    userId: string,
    organizationId: string,
    entityType: AuditEntityType,
    entityId: string,
    entityName: string,
    changes?: Record<string, any>
  ): Promise<boolean> {
    return this.log({
      user_id: userId,
      organization_id: organizationId,
      action: 'update',
      entity_type: entityType,
      entity_id: entityId,
      description: `Atualizou ${this.getEntityLabel(entityType)}: ${entityName}`,
      metadata: { changes },
    })
  }

  /**
   * Registra exclusão de entidade
   */
  async logDelete(
    userId: string,
    organizationId: string,
    entityType: AuditEntityType,
    entityId: string,
    entityName: string
  ): Promise<boolean> {
    return this.log({
      user_id: userId,
      organization_id: organizationId,
      action: 'delete',
      entity_type: entityType,
      entity_id: entityId,
      description: `Removeu ${this.getEntityLabel(entityType)}: ${entityName}`,
    })
  }

  /**
   * Busca logs de auditoria
   */
  async getLogs(
    organizationId: string,
    filters?: {
      userId?: string
      entityType?: AuditEntityType
      entityId?: string
      action?: AuditAction
      startDate?: string
      endDate?: string
      limit?: number
    }
  ) {
    try {
      let query = supabase
        .from(this.tableName)
        .select('*, user:user_profiles(full_name, email)')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false })

      if (filters?.userId) {
        query = query.eq('user_id', filters.userId)
      }

      if (filters?.entityType) {
        query = query.eq('entity_type', filters.entityType)
      }

      if (filters?.entityId) {
        query = query.eq('entity_id', filters.entityId)
      }

      if (filters?.action) {
        query = query.eq('action', filters.action)
      }

      if (filters?.startDate) {
        query = query.gte('created_at', filters.startDate)
      }

      if (filters?.endDate) {
        query = query.lte('created_at', filters.endDate)
      }

      if (filters?.limit) {
        query = query.limit(filters.limit)
      }

      const { data, error } = await query

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      logger.error('Error fetching audit logs:', error)
      return { data: null, error }
    }
  }

  /**
   * Obtém label legível para o tipo de entidade
   */
  private getEntityLabel(entityType: AuditEntityType): string {
    const labels: Record<AuditEntityType, string> = {
      edital: 'edital',
      contract: 'contrato',
      supplier: 'fornecedor',
      quotation: 'cotação',
      document: 'documento',
      user: 'usuário',
      portal: 'portal',
      task: 'tarefa',
      notification: 'notificação',
      report: 'relatório',
      setting: 'configuração',
    }

    return labels[entityType] || entityType
  }
}

export const auditService = new AuditService()

