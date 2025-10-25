/**
 * Hook para acessar informações da organização atual
 * @module hooks/useOrganization
 */

import { useAuth } from './useAuth'

export function useOrganization() {
  const { profile } = useAuth()
  
  const organizationId = profile?.organization_id || null
  const hasOrganization = !!organizationId

  return {
    organizationId,
    hasOrganization
  }
}

