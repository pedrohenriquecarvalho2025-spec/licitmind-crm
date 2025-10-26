/**
 * Interface Contratual do Módulo de Editais
 * Define como outros módulos podem interagir com o domínio de Editais
 * 
 * IMPORTANTE: Esta é a ÚNICA forma permitida de outros módulos acessarem
 * dados e funcionalidades de Editais. Acesso direto aos serviços é PROIBIDO.
 * 
 * @module modules/editals/editals.api
 */

import { editalsService } from './services/editals.service'
import type { Edital, EditalFilters, EditalStats } from './types'

export interface EditalsAPI {
  // Queries
  listEditals: (organizationId: string, filters?: EditalFilters) => Promise<Edital[]>
  getEdital: (id: string) => Promise<Edital | null>
  getEditalStats: (organizationId: string) => Promise<EditalStats>
  
  // Mutations
  createEdital: (edital: Omit<Edital, 'id' | 'created_at' | 'updated_at'>) => Promise<Edital | null>
  updateEdital: (id: string, updates: Partial<Edital>) => Promise<Edital | null>
  deleteEdital: (id: string) => Promise<boolean>
  
  // Business Logic
  isExpiringSoon: (edital: Edital, daysThreshold?: number) => boolean
  calculateDaysUntilDeadline: (edital: Edital) => number
}

class EditalsAPIImpl implements EditalsAPI {
  async listEditals(organizationId: string, filters?: EditalFilters) {
    const { data } = await editalsService.list(organizationId, filters)
    return data || []
  }

  async getEdital(id: string) {
    const { data } = await editalsService.getById(id)
    return data
  }

  async getEditalStats(organizationId: string): Promise<EditalStats> {
    const { data: editals } = await editalsService.list(organizationId)
    
    if (!editals) {
      return { totalValue: 0, activeCount: 0, wonCount: 0, totalCount: 0 }
    }

    const totalValue = editals.reduce((sum, e) => sum + (e.valor_estimado || 0), 0)
    const activeCount = editals.filter(e => 
      ['prospectado', 'em_analise', 'documentacao', 'proposta_enviada', 'em_julgamento'].includes(e.status)
    ).length
    const wonCount = editals.filter(e => e.status === 'homologado').length

    return {
      totalValue,
      activeCount,
      wonCount,
      totalCount: editals.length
    }
  }

  async createEdital(edital: Omit<Edital, 'id' | 'created_at' | 'updated_at'>) {
    const { data } = await editalsService.create(edital)
    return data
  }

  async updateEdital(id: string, updates: Partial<Edital>) {
    const { data } = await editalsService.update(id, updates)
    return data
  }

  async deleteEdital(id: string) {
    const { data } = await editalsService.delete(id)
    return data || false
  }

  calculateDaysUntilDeadline(edital: Edital): number {
    if (!edital.data_limite_envio) return Infinity
    
    const today = new Date()
    const deadline = new Date(edital.data_limite_envio)
    const diffTime = deadline.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  isExpiringSoon(edital: Edital, daysThreshold: number = 7): boolean {
    const days = this.calculateDaysUntilDeadline(edital)
    return days > 0 && days <= daysThreshold
  }
}

// Instância singleton da API pública
export const editalsAPI: EditalsAPI = new EditalsAPIImpl()

