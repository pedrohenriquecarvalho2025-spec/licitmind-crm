/**
 * Serviço de acesso a dados de Pipeline
 * @module modules/pipeline/services/pipeline.service
 */

import { supabase } from '../../../lib/supabase'
import type { Pipeline, PipelineStage, PipelineFilters } from '../types'
import { logger } from '../../../core/utils'

export class PipelineService {
  private pipelinesTable = 'pipelines'
  private stagesTable = 'pipeline_stages'

  async listPipelines(organizationId: string, filters?: PipelineFilters) {
    try {
      let query = supabase
        .from(this.pipelinesTable)
        .select('*')
        .eq('organization_id', organizationId)

      if (filters?.is_default !== undefined) {
        query = query.eq('is_default', filters.is_default)
      }

      if (filters?.search) {
        query = query.ilike('nome', `%${filters.search}%`)
      }

      query = query.order('is_default', { ascending: false }).order('created_at', { ascending: true })

      const { data, error } = await query

      if (error) throw error
      return { data: data as Pipeline[], error: null }
    } catch (error) {
      logger.error('Error listing pipelines:', error)
      return { data: null, error }
    }
  }

  async getPipelineById(id: string) {
    try {
      const { data, error } = await supabase
        .from(this.pipelinesTable)
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return { data: data as Pipeline, error: null }
    } catch (error) {
      logger.error('Error getting pipeline:', error)
      return { data: null, error }
    }
  }

  async getStagesByPipeline(pipelineId: string) {
    try {
      const { data, error } = await supabase
        .from(this.stagesTable)
        .select('*')
        .eq('pipeline_id', pipelineId)
        .order('order_index')

      if (error) throw error
      return { data: data as PipelineStage[], error: null }
    } catch (error) {
      logger.error('Error getting stages:', error)
      return { data: null, error }
    }
  }

  async createPipeline(pipeline: Omit<Pipeline, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from(this.pipelinesTable)
        .insert(pipeline)
        .select()
        .single()

      if (error) throw error
      return { data: data as Pipeline, error: null }
    } catch (error) {
      logger.error('Error creating pipeline:', error)
      return { data: null, error }
    }
  }

  async updatePipeline(id: string, updates: Partial<Pipeline>) {
    try {
      const { data, error } = await supabase
        .from(this.pipelinesTable)
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return { data: data as Pipeline, error: null }
    } catch (error) {
      logger.error('Error updating pipeline:', error)
      return { data: null, error }
    }
  }

  async deletePipeline(id: string) {
    try {
      const { error } = await supabase
        .from(this.pipelinesTable)
        .delete()
        .eq('id', id)

      if (error) throw error
      return { data: true, error: null }
    } catch (error) {
      logger.error('Error deleting pipeline:', error)
      return { data: null, error }
    }
  }

  async createStage(stage: Omit<PipelineStage, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from(this.stagesTable)
        .insert(stage)
        .select()
        .single()

      if (error) throw error
      return { data: data as PipelineStage, error: null }
    } catch (error) {
      logger.error('Error creating stage:', error)
      return { data: null, error }
    }
  }

  async updateStage(id: string, updates: Partial<PipelineStage>) {
    try {
      const { data, error } = await supabase
        .from(this.stagesTable)
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return { data: data as PipelineStage, error: null }
    } catch (error) {
      logger.error('Error updating stage:', error)
      return { data: null, error }
    }
  }

  async deleteStage(id: string) {
    try {
      const { error } = await supabase
        .from(this.stagesTable)
        .delete()
        .eq('id', id)

      if (error) throw error
      return { data: true, error: null }
    } catch (error) {
      logger.error('Error deleting stage:', error)
      return { data: null, error }
    }
  }
}

export const pipelineService = new PipelineService()

