/**
 * API pública para operações de Portais de Licitação
 */

import { portalsService } from './services/portals.service'
import type { BiddingPortal, PortalFilters, PortalCreateData } from './types'

export interface PortalsAPI {
  listPortals(organizationId: string, filters?: PortalFilters): Promise<BiddingPortal[]>
  getPortal(id: string): Promise<BiddingPortal | null>
  createPortal(data: PortalCreateData, organizationId: string, userId: string): Promise<BiddingPortal>
  updatePortal(id: string, data: Partial<PortalCreateData>, userId: string): Promise<BiddingPortal>
  deletePortal(id: string, userId: string): Promise<void>
  getExpiringSoon(organizationId: string, days?: number): Promise<BiddingPortal[]>
}

class PortalsAPIImpl implements PortalsAPI {
  async listPortals(organizationId: string, filters?: PortalFilters): Promise<BiddingPortal[]> {
    return portalsService.list(organizationId, filters)
  }

  async getPortal(id: string): Promise<BiddingPortal | null> {
    return portalsService.getById(id)
  }

  async createPortal(data: PortalCreateData, organizationId: string, userId: string): Promise<BiddingPortal> {
    return portalsService.create(data, organizationId, userId)
  }

  async updatePortal(id: string, data: Partial<PortalCreateData>, userId: string): Promise<BiddingPortal> {
    return portalsService.update(id, data, userId)
  }

  async deletePortal(id: string, userId: string): Promise<void> {
    return portalsService.delete(id, userId)
  }

  async getExpiringSoon(organizationId: string, days: number = 30): Promise<BiddingPortal[]> {
    return portalsService.getExpiringSoon(organizationId, days)
  }
}

export const portalsAPI: PortalsAPI = new PortalsAPIImpl()

