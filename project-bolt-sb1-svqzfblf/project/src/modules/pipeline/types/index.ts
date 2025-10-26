/**
 * Tipos do módulo de Pipeline
 * @module modules/pipeline/types
 */

import type { OrganizationEntity, UUID } from '../../../types/common'

export interface Pipeline extends OrganizationEntity {
  nome: string
  descricao: string | null
  is_default: boolean
}

export interface PipelineStage extends OrganizationEntity {
  pipeline_id: UUID
  nome: string
  cor: string
  order_index: number
}

export interface PipelineWithStages extends Pipeline {
  stages: PipelineStage[]
}

export interface PipelineFilters {
  is_default?: boolean
  search?: string
}

