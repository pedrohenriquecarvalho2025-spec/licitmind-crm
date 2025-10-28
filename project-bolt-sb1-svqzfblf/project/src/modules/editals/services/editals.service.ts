/**
 * Serviço de acesso a dados de Editais
 * @module modules/editals/services/editals.service
 */

import { supabase } from '../../../lib/supabase'
import type { Edital, EditalFilters } from '../types'
import { logger } from '../../../core/utils'
import { storageService } from '../../../core/services/storage.service'
import { auditService } from '../../../core/services/audit.service'

export class EditalsService {
  private tableName = 'editals'

  async list(organizationId: string, filters?: EditalFilters) {
    try {
      let query = supabase
        .from(this.tableName)
        .select(`
          *,
          responsavel:responsavel_id (
            full_name
          )
        `)
        .eq('organization_id', organizationId)

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      if (filters?.modalidade) {
        query = query.eq('modalidade', filters.modalidade)
      }

      if (filters?.responsavel_id) {
        query = query.eq('responsavel_id', filters.responsavel_id)
      }

      if (filters?.search) {
        query = query.or(`numero_edital.ilike.%${filters.search}%,objeto.ilike.%${filters.search}%,orgao_contratante.ilike.%${filters.search}%`)
      }

      query = query.order('created_at', { ascending: false })

      const { data, error } = await query

      if (error) throw error
      return { data: data as Edital[], error: null }
    } catch (error) {
      logger.error('Error listing editals:', error)
      return { data: null, error }
    }
  }

  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select(`
          *,
          responsavel:responsavel_id (
            full_name
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return { data: data as Edital, error: null }
    } catch (error) {
      logger.error('Error getting edital:', error)
      return { data: null, error }
    }
  }

  async create(
    edital: Omit<Edital, 'id' | 'created_at' | 'updated_at'>,
    file?: File | null
  ) {
    try {
      let arquivo_url = null
      let arquivo_nome = null

      // Upload do arquivo se fornecido
      if (file) {
        const uploadResult = await storageService.uploadFile(
          file,
          'editals',
          'documentos',
          edital.organization_id
        )

        if (uploadResult) {
          arquivo_url = uploadResult.url
          arquivo_nome = uploadResult.fileName
        }
      }

      const { data, error } = await supabase
        .from(this.tableName)
        .insert({
          ...edital,
          arquivo_url,
          arquivo_nome,
        })
        .select()
        .single()

      if (error) throw error

      // Registrar no audit log
      const createdEdital = data as Edital
      await auditService.logCreate(
        edital.created_by,
        edital.organization_id,
        'edital',
        createdEdital.id,
        createdEdital.numero_edital
      )

      return { data: createdEdital, error: null }
    } catch (error) {
      logger.error('Error creating edital:', error)
      return { data: null, error }
    }
  }

  async update(
    id: string,
    updates: Partial<Edital>,
    file?: File | null,
    userId?: string
  ) {
    try {
      let updateData = { ...updates }

      // Upload do novo arquivo se fornecido
      if (file && updates.organization_id) {
        const uploadResult = await storageService.uploadFile(
          file,
          'editals',
          'documentos',
          updates.organization_id
        )

        if (uploadResult) {
          updateData = {
            ...updateData,
            arquivo_url: uploadResult.url,
            arquivo_nome: uploadResult.fileName,
          }
        }
      }

      const { data, error } = await supabase
        .from(this.tableName)
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Registrar no audit log
      const updatedEdital = data as Edital
      if (userId && updatedEdital.organization_id) {
        await auditService.logUpdate(
          userId,
          updatedEdital.organization_id,
          'edital',
          updatedEdital.id,
          updatedEdital.numero_edital,
          updates
        )
      }

      return { data: updatedEdital, error: null }
    } catch (error) {
      logger.error('Error updating edital:', error)
      return { data: null, error }
    }
  }

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id)

      if (error) throw error
      return { data: true, error: null }
    } catch (error) {
      logger.error('Error deleting edital:', error)
      return { data: null, error }
    }
  }
}

export const editalsService = new EditalsService()

