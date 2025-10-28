/**
 * API pública para operações de Cotações
 */

import { quotationsService } from './services/quotations.service'
import type { Quotation, QuotationFilters, QuotationCreateData } from './types'

export interface QuotationsAPI {
  listQuotations(organizationId: string, filters?: QuotationFilters): Promise<Quotation[]>
  getQuotation(id: string): Promise<Quotation | null>
  createQuotation(data: QuotationCreateData, organizationId: string, userId: string): Promise<Quotation>
  updateQuotation(id: string, data: Partial<QuotationCreateData>, userId: string): Promise<Quotation>
  deleteQuotation(id: string, userId: string): Promise<void>
  getQuotationsByEdital(editalId: string): Promise<Quotation[]>
  updateQuotationStatus(id: string, status: QuotationCreateData['status'], userId: string): Promise<Quotation>
}

class QuotationsAPIImpl implements QuotationsAPI {
  async listQuotations(organizationId: string, filters?: QuotationFilters): Promise<Quotation[]> {
    return quotationsService.list(organizationId, filters)
  }

  async getQuotation(id: string): Promise<Quotation | null> {
    return quotationsService.getById(id)
  }

  async createQuotation(data: QuotationCreateData, organizationId: string, userId: string): Promise<Quotation> {
    return quotationsService.create(data, organizationId, userId)
  }

  async updateQuotation(id: string, data: Partial<QuotationCreateData>, userId: string): Promise<Quotation> {
    return quotationsService.update(id, data, userId)
  }

  async deleteQuotation(id: string, userId: string): Promise<void> {
    return quotationsService.delete(id, userId)
  }

  async getQuotationsByEdital(editalId: string): Promise<Quotation[]> {
    return quotationsService.getByEdital(editalId)
  }

  async updateQuotationStatus(id: string, status: QuotationCreateData['status'], userId: string): Promise<Quotation> {
    return quotationsService.updateStatus(id, status!, userId)
  }
}

export const quotationsAPI: QuotationsAPI = new QuotationsAPIImpl()

