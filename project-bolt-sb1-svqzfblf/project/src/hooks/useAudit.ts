/**
 * Hook para facilitar o uso do sistema de auditoria
 */

import { useAuth } from './useAuth'
import { useOrganization } from './useOrganization'
import { auditService, type AuditEntityType } from '../core/services/audit.service'

export function useAudit() {
  const { user } = useAuth()
  const { organizationId } = useOrganization()

  const logCreate = async (
    entityType: AuditEntityType,
    entityId: string,
    entityName: string,
    metadata?: Record<string, any>
  ) => {
    if (!user || !organizationId) return false

    return auditService.logCreate(
      user.id,
      organizationId,
      entityType,
      entityId,
      entityName,
      metadata
    )
  }

  const logUpdate = async (
    entityType: AuditEntityType,
    entityId: string,
    entityName: string,
    changes?: Record<string, any>
  ) => {
    if (!user || !organizationId) return false

    return auditService.logUpdate(
      user.id,
      organizationId,
      entityType,
      entityId,
      entityName,
      changes
    )
  }

  const logDelete = async (
    entityType: AuditEntityType,
    entityId: string,
    entityName: string
  ) => {
    if (!user || !organizationId) return false

    return auditService.logDelete(
      user.id,
      organizationId,
      entityType,
      entityId,
      entityName
    )
  }

  return {
    logCreate,
    logUpdate,
    logDelete,
  }
}

