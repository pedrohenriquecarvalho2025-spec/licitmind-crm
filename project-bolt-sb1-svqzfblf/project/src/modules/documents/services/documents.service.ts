/**
 * Service para operações de Documentos
 */

import { supabase } from '../../../lib/supabase'
import { storageService } from '../../../core/services/storage.service'
import { auditService } from '../../../core/services/audit.service'
import { logger } from '../../../core/utils/logger'
import type { Document, DocumentInsert, DocumentUpdate, DocumentFilters, DocumentUploadData } from '../types'

export class DocumentsService {
  private readonly tableName = 'documents'
  private readonly bucketName = 'documents'

  /**
   * Lista documentos com filtros
   */
  async list(organizationId: string, filters?: DocumentFilters): Promise<Document[]> {
    try {
      let query = supabase
        .from(this.tableName)
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false })

      if (filters?.type && filters.type !== 'all') {
        query = query.eq('type', filters.type)
      }

      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status)
      }

      if (filters?.category) {
        query = query.eq('category', filters.category)
      }

      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`)
      }

      const { data, error } = await query

      if (error) throw error

      // Atualiza status dos documentos
      await this.updateDocumentStatuses(organizationId)

      return data || []
    } catch (error) {
      logger.error('Error listing documents', { error, organizationId, filters })
      throw error
    }
  }

  /**
   * Busca documento por ID
   */
  async getById(id: string): Promise<Document | null> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      return data
    } catch (error) {
      logger.error('Error getting document', { error, id })
      throw error
    }
  }

  /**
   * Cria novo documento com upload de arquivo
   */
  async create(data: DocumentUploadData, organizationId: string, userId: string): Promise<Document> {
    try {
      // Upload do arquivo
      const uploadResult = await storageService.uploadFile(
        this.bucketName,
        data.file,
        `${organizationId}/${Date.now()}_${data.file.name}`
      )

      // Calcula status inicial
      const status = this.calculateStatus(data.expiry_date)

      // Insere registro no banco
      const insertData: DocumentInsert = {
        organization_id: organizationId,
        name: data.name,
        type: data.type,
        category: data.category,
        file_url: uploadResult.publicUrl,
        file_path: uploadResult.path,
        expiry_date: data.expiry_date || null,
        status,
        size: data.file.size,
        mime_type: data.file.type,
        uploaded_by: userId
      }

      const { data: document, error } = await supabase
        .from(this.tableName)
        .insert(insertData)
        .select()
        .single()

      if (error) throw error

      // Registra auditoria
      await auditService.logCreate('documents', document.id, userId, document)

      logger.info('Document created', { documentId: document.id, name: document.name })

      return document
    } catch (error) {
      logger.error('Error creating document', { error, data })
      throw error
    }
  }

  /**
   * Atualiza documento (metadados e arquivo opcional)
   */
  async update(
    id: string,
    data: Partial<DocumentUploadData>,
    userId: string
  ): Promise<Document> {
    try {
      const existing = await this.getById(id)
      if (!existing) throw new Error('Document not found')

      let fileUrl = existing.file_url
      let filePath = existing.file_path
      let size = existing.size
      let mimeType = existing.mime_type

      // Se houver novo arquivo, faz upload
      if (data.file) {
        const uploadResult = await storageService.uploadFile(
          this.bucketName,
          data.file,
          `${existing.organization_id}/${Date.now()}_${data.file.name}`
        )

        fileUrl = uploadResult.publicUrl
        filePath = uploadResult.path
        size = data.file.size
        mimeType = data.file.type

        // Remove arquivo antigo
        await storageService.deleteFile(this.bucketName, existing.file_path)
      }

      // Calcula novo status se houver mudança na data de expiração
      const status = data.expiry_date !== undefined
        ? this.calculateStatus(data.expiry_date)
        : existing.status

      const updateData: DocumentUpdate = {
        name: data.name,
        type: data.type,
        category: data.category,
        file_url: fileUrl,
        file_path: filePath,
        expiry_date: data.expiry_date,
        status,
        size,
        mime_type: mimeType,
        updated_at: new Date().toISOString()
      }

      const { data: document, error } = await supabase
        .from(this.tableName)
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Registra auditoria
      await auditService.logUpdate('documents', id, userId, existing, document)

      logger.info('Document updated', { documentId: id })

      return document
    } catch (error) {
      logger.error('Error updating document', { error, id, data })
      throw error
    }
  }

  /**
   * Deleta documento
   */
  async delete(id: string, userId: string): Promise<void> {
    try {
      const existing = await this.getById(id)
      if (!existing) throw new Error('Document not found')

      // Remove arquivo do storage
      await storageService.deleteFile(this.bucketName, existing.file_path)

      // Remove registro do banco
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id)

      if (error) throw error

      // Registra auditoria
      await auditService.logDelete('documents', id, userId, existing)

      logger.info('Document deleted', { documentId: id })
    } catch (error) {
      logger.error('Error deleting document', { error, id })
      throw error
    }
  }

  /**
   * Atualiza status de todos os documentos de uma organização
   */
  private async updateDocumentStatuses(organizationId: string): Promise<void> {
    try {
      // Utiliza RPC function do Supabase se existir
      const { error } = await supabase.rpc('update_document_status', {
        org_id: organizationId
      })

      if (error) {
        // Fallback: atualiza manualmente
        logger.warn('RPC update_document_status not available, using fallback')
        await this.updateDocumentStatusesFallback(organizationId)
      }
    } catch (error) {
      logger.error('Error updating document statuses', { error, organizationId })
    }
  }

  /**
   * Fallback para atualização de status (caso RPC não exista)
   */
  private async updateDocumentStatusesFallback(organizationId: string): Promise<void> {
    const { data: documents } = await supabase
      .from(this.tableName)
      .select('id, expiry_date')
      .eq('organization_id', organizationId)
      .not('expiry_date', 'is', null)

    if (!documents) return

    const updates = documents.map(doc => {
      const status = this.calculateStatus(doc.expiry_date!)
      return supabase
        .from(this.tableName)
        .update({ status })
        .eq('id', doc.id)
    })

    await Promise.all(updates)
  }

  /**
   * Calcula status baseado na data de expiração
   */
  private calculateStatus(expiryDate: string | null | undefined): 'valid' | 'expiring' | 'expired' {
    if (!expiryDate) return 'valid'

    const now = new Date()
    const expiry = new Date(expiryDate)
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilExpiry < 0) return 'expired'
    if (daysUntilExpiry <= 30) return 'expiring'
    return 'valid'
  }

  /**
   * Busca documentos expirando em X dias
   */
  async getExpiringSoon(organizationId: string, days: number = 30): Promise<Document[]> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('organization_id', organizationId)
        .in('status', ['expiring', 'expired'])
        .not('expiry_date', 'is', null)
        .order('expiry_date', { ascending: true })

      if (error) throw error

      return data || []
    } catch (error) {
      logger.error('Error getting expiring documents', { error, organizationId, days })
      throw error
    }
  }
}

export const documentsService = new DocumentsService()

