/**
 * Interface Contratual do Módulo de Pipeline
 * @module modules/pipeline/pipeline.api
 */

import { pipelineService } from './services/pipeline.service'
import type { Pipeline, PipelineStage, PipelineWithStages, PipelineFilters } from './types'

export interface PipelineAPI {
  // Pipeline Queries
  listPipelines: (organizationId: string, filters?: PipelineFilters) => Promise<Pipeline[]>
  getPipeline: (id: string) => Promise<Pipeline | null>
  getPipelineWithStages: (id: string) => Promise<PipelineWithStages | null>
  
  // Pipeline Mutations
  createPipeline: (pipeline: Omit<Pipeline, 'id' | 'created_at' | 'updated_at'>) => Promise<Pipeline | null>
  updatePipeline: (id: string, updates: Partial<Pipeline>) => Promise<Pipeline | null>
  deletePipeline: (id: string) => Promise<boolean>
  
  // Stage Queries
  getStages: (pipelineId: string) => Promise<PipelineStage[]>
  
  // Stage Mutations
  createStage: (stage: Omit<PipelineStage, 'id' | 'created_at' | 'updated_at'>) => Promise<PipelineStage | null>
  updateStage: (id: string, updates: Partial<PipelineStage>) => Promise<PipelineStage | null>
  deleteStage: (id: string) => Promise<boolean>
}

class PipelineAPIImpl implements PipelineAPI {
  async listPipelines(organizationId: string, filters?: PipelineFilters) {
    const { data } = await pipelineService.listPipelines(organizationId, filters)
    return data || []
  }

  async getPipeline(id: string) {
    const { data } = await pipelineService.getPipelineById(id)
    return data
  }

  async getPipelineWithStages(id: string): Promise<PipelineWithStages | null> {
    const { data: pipeline } = await pipelineService.getPipelineById(id)
    if (!pipeline) return null

    const { data: stages } = await pipelineService.getStagesByPipeline(id)
    
    return {
      ...pipeline,
      stages: stages || []
    }
  }

  async createPipeline(pipeline: Omit<Pipeline, 'id' | 'created_at' | 'updated_at'>) {
    const { data } = await pipelineService.createPipeline(pipeline)
    return data
  }

  async updatePipeline(id: string, updates: Partial<Pipeline>) {
    const { data } = await pipelineService.updatePipeline(id, updates)
    return data
  }

  async deletePipeline(id: string) {
    const { data } = await pipelineService.deletePipeline(id)
    return data || false
  }

  async getStages(pipelineId: string) {
    const { data } = await pipelineService.getStagesByPipeline(pipelineId)
    return data || []
  }

  async createStage(stage: Omit<PipelineStage, 'id' | 'created_at' | 'updated_at'>) {
    const { data } = await pipelineService.createStage(stage)
    return data
  }

  async updateStage(id: string, updates: Partial<PipelineStage>) {
    const { data } = await pipelineService.updateStage(id, updates)
    return data
  }

  async deleteStage(id: string) {
    const { data } = await pipelineService.deleteStage(id)
    return data || false
  }
}

export const pipelineAPI: PipelineAPI = new PipelineAPIImpl()

