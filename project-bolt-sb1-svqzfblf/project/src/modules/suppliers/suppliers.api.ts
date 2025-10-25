/**
 * Interface Contratual do Módulo de Fornecedores
 * Define como outros módulos podem interagir com o domínio de Fornecedores
 * 
 * @module modules/suppliers/suppliers.api
 */

import { suppliersService } from './services/suppliers.service'
import type { Supplier, SupplierFilters } from './types'

export interface SuppliersAPI {
  listSuppliers: (organizationId: string, filters?: SupplierFilters) => Promise<Supplier[]>
  getSupplier: (id: string) => Promise<Supplier | null>
  createSupplier: (supplier: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>) => Promise<Supplier | null>
  updateSupplier: (id: string, updates: Partial<Supplier>) => Promise<Supplier | null>
  deleteSupplier: (id: string) => Promise<boolean>
}

class SuppliersAPIImpl implements SuppliersAPI {
  async listSuppliers(organizationId: string, filters?: SupplierFilters) {
    const { data } = await suppliersService.list(organizationId, filters)
    return data || []
  }

  async getSupplier(id: string) {
    const { data } = await suppliersService.getById(id)
    return data
  }

  async createSupplier(supplier: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>) {
    const { data } = await suppliersService.create(supplier)
    return data
  }

  async updateSupplier(id: string, updates: Partial<Supplier>) {
    const { data } = await suppliersService.update(id, updates)
    return data
  }

  async deleteSupplier(id: string) {
    const { data } = await suppliersService.delete(id)
    return data || false
  }
}

export const suppliersAPI: SuppliersAPI = new SuppliersAPIImpl()

