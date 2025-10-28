/**
 * API pública para operações de Documentos
 */

import { documentsService } from './services/documents.service'
import type { Document, DocumentFilters, DocumentUploadData } from './types'

export interface DocumentsAPI {
  listDocuments(organizationId: string, filters?: DocumentFilters): Promise<Document[]>
  getDocument(id: string): Promise<Document | null>
  uploadDocument(data: DocumentUploadData, organizationId: string, userId: string): Promise<Document>
  updateDocument(id: string, data: Partial<DocumentUploadData>, userId: string): Promise<Document>
  deleteDocument(id: string, userId: string): Promise<void>
  getExpiringSoon(organizationId: string, days?: number): Promise<Document[]>
}

class DocumentsAPIImpl implements DocumentsAPI {
  async listDocuments(organizationId: string, filters?: DocumentFilters): Promise<Document[]> {
    return documentsService.list(organizationId, filters)
  }

  async getDocument(id: string): Promise<Document | null> {
    return documentsService.getById(id)
  }

  async uploadDocument(data: DocumentUploadData, organizationId: string, userId: string): Promise<Document> {
    return documentsService.create(data, organizationId, userId)
  }

  async updateDocument(id: string, data: Partial<DocumentUploadData>, userId: string): Promise<Document> {
    return documentsService.update(id, data, userId)
  }

  async deleteDocument(id: string, userId: string): Promise<void> {
    return documentsService.delete(id, userId)
  }

  async getExpiringSoon(organizationId: string, days: number = 30): Promise<Document[]> {
    return documentsService.getExpiringSoon(organizationId, days)
  }
}

export const documentsAPI: DocumentsAPI = new DocumentsAPIImpl()

