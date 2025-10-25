/**
 * Interface Contratual do Módulo de Contratos
 * Define como outros módulos podem interagir com o domínio de Contratos
 * 
 * IMPORTANTE: Esta é a ÚNICA forma permitida de outros módulos acessarem
 * dados e funcionalidades de Contratos. Acesso direto aos serviços ou
 * repositórios é PROIBIDO.
 * 
 * @module modules/contracts/contracts.api
 */

import { contractsService } from './services/contracts.service'
import type { Contract, ContractFilters, ContractStats } from './types'

export interface ContractsAPI {
  // Queries
  listContracts: (organizationId: string, filters?: ContractFilters) => Promise<Contract[]>
  getContract: (id: string) => Promise<Contract | null>
  getContractStats: (organizationId: string) => Promise<ContractStats>
  
  // Mutations
  createContract: (contract: Omit<Contract, 'id' | 'created_at' | 'updated_at'>) => Promise<Contract | null>
  updateContract: (id: string, updates: Partial<Contract>) => Promise<Contract | null>
  deleteContract: (id: string) => Promise<boolean>
  
  // Business Logic
  calculateDaysUntilExpiry: (contract: Contract) => number
  isExpiring: (contract: Contract, daysThreshold?: number) => boolean
}

class ContractsAPIImpl implements ContractsAPI {
  async listContracts(organizationId: string, filters?: ContractFilters) {
    const { data } = await contractsService.list(organizationId, filters)
    return data || []
  }

  async getContract(id: string) {
    const { data } = await contractsService.getById(id)
    return data
  }

  async getContractStats(organizationId: string): Promise<ContractStats> {
    const { data: contracts } = await contractsService.list(organizationId)
    
    if (!contracts) {
      return { totalValue: 0, activeCount: 0, expiringCount: 0, totalCount: 0 }
    }

    const totalValue = contracts.reduce((sum, c) => sum + c.valor_total, 0)
    const activeCount = contracts.filter(c => c.status === 'ativo').length
    const expiringCount = contracts.filter(c => 
      this.isExpiring(c, 90) && c.status === 'ativo'
    ).length

    return {
      totalValue,
      activeCount,
      expiringCount,
      totalCount: contracts.length
    }
  }

  async createContract(contract: Omit<Contract, 'id' | 'created_at' | 'updated_at'>) {
    const { data } = await contractsService.create(contract)
    return data
  }

  async updateContract(id: string, updates: Partial<Contract>) {
    const { data } = await contractsService.update(id, updates)
    return data
  }

  async deleteContract(id: string) {
    const { data } = await contractsService.delete(id)
    return data || false
  }

  calculateDaysUntilExpiry(contract: Contract): number {
    const today = new Date()
    const end = new Date(contract.data_fim_vigencia)
    const diffTime = end.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  isExpiring(contract: Contract, daysThreshold: number = 90): boolean {
    const days = this.calculateDaysUntilExpiry(contract)
    return days > 0 && days <= daysThreshold
  }
}

// Instância singleton da API pública
export const contractsAPI: ContractsAPI = new ContractsAPIImpl()

