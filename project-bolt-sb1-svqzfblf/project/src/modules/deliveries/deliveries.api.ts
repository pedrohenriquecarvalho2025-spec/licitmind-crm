/**
 * API pública para operações de Entregas
 */

import { deliveriesService } from './services/deliveries.service'
import type { Delivery, DeliveryFilters, DeliveryCreateData } from './types'

export interface DeliveriesAPI {
  listDeliveries(organizationId: string, filters?: DeliveryFilters): Promise<Delivery[]>
  getDelivery(id: string): Promise<Delivery | null>
  createDelivery(data: DeliveryCreateData, organizationId: string, userId: string): Promise<Delivery>
  updateDelivery(id: string, data: Partial<DeliveryCreateData>, userId: string): Promise<Delivery>
  deleteDelivery(id: string, userId: string): Promise<void>
  getDeliveriesByContract(contractId: string): Promise<Delivery[]>
  markAsDelivered(id: string, dataEntrega: string, userId: string): Promise<Delivery>
}

class DeliveriesAPIImpl implements DeliveriesAPI {
  async listDeliveries(organizationId: string, filters?: DeliveryFilters): Promise<Delivery[]> {
    return deliveriesService.list(organizationId, filters)
  }

  async getDelivery(id: string): Promise<Delivery | null> {
    return deliveriesService.getById(id)
  }

  async createDelivery(data: DeliveryCreateData, organizationId: string, userId: string): Promise<Delivery> {
    return deliveriesService.create(data, organizationId, userId)
  }

  async updateDelivery(id: string, data: Partial<DeliveryCreateData>, userId: string): Promise<Delivery> {
    return deliveriesService.update(id, data, userId)
  }

  async deleteDelivery(id: string, userId: string): Promise<void> {
    return deliveriesService.delete(id, userId)
  }

  async getDeliveriesByContract(contractId: string): Promise<Delivery[]> {
    return deliveriesService.getByContract(contractId)
  }

  async markAsDelivered(id: string, dataEntrega: string, userId: string): Promise<Delivery> {
    return deliveriesService.markAsDelivered(id, dataEntrega, userId)
  }
}

export const deliveriesAPI: DeliveriesAPI = new DeliveriesAPIImpl()

