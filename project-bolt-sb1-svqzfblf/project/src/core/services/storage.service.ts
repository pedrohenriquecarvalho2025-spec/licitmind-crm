/**
 * Serviço de Upload de Arquivos para Supabase Storage
 */

import { supabase } from '../../lib/supabase'
import { logger } from '../utils/logger'

export interface UploadResult {
  url: string
  path: string
  fileName: string
}

class StorageService {
  /**
   * Faz upload de um arquivo para o Supabase Storage
   */
  async uploadFile(
    file: File,
    bucket: string,
    folder: string,
    organizationId: string
  ): Promise<UploadResult | null> {
    try {
      // Gerar nome único para o arquivo
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const fileExtension = file.name.split('.').pop()
      const fileName = `${timestamp}-${randomString}.${fileExtension}`
      const filePath = `${organizationId}/${folder}/${fileName}`

      // Upload do arquivo
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) {
        logger.error('Error uploading file:', error)
        throw error
      }

      // Obter URL pública
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(data.path)

      return {
        url: publicUrl,
        path: data.path,
        fileName: file.name,
      }
    } catch (error) {
      logger.error('Exception in file upload:', error)
      return null
    }
  }

  /**
   * Remove um arquivo do Supabase Storage
   */
  async deleteFile(bucket: string, path: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage.from(bucket).remove([path])

      if (error) {
        logger.error('Error deleting file:', error)
        return false
      }

      return true
    } catch (error) {
      logger.error('Exception in file deletion:', error)
      return false
    }
  }

  /**
   * Faz upload de múltiplos arquivos
   */
  async uploadMultipleFiles(
    files: File[],
    bucket: string,
    folder: string,
    organizationId: string
  ): Promise<UploadResult[]> {
    const results: UploadResult[] = []

    for (const file of files) {
      const result = await this.uploadFile(file, bucket, folder, organizationId)
      if (result) {
        results.push(result)
      }
    }

    return results
  }

  /**
   * Obter URL de download temporária (assinada)
   */
  async getSignedUrl(bucket: string, path: string, expiresIn: number = 3600): Promise<string | null> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn)

      if (error) {
        logger.error('Error creating signed URL:', error)
        return null
      }

      return data.signedUrl
    } catch (error) {
      logger.error('Exception in signed URL creation:', error)
      return null
    }
  }
}

export const storageService = new StorageService()

