/**
 * View principal do módulo de Pipeline
 * LOC: ~80 linhas
 */

import React, { useState, useEffect, useCallback } from 'react'
import { Plus } from 'lucide-react'
import { PageHeader } from '../../../components/shared/organisms/PageHeader'
import { Button } from '../../../components/ui/atoms/Button'
import { Spinner } from '../../../components/ui/atoms/Spinner'
import { useOrganization } from '../../../hooks'
import { pipelineAPI } from '../pipeline.api'
import type { Pipeline } from '../types'

export function PipelineView() {
  const { organizationId } = useOrganization()
  const [pipelines, setPipelines] = useState<Pipeline[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [organizationId])

  const loadData = async () => {
    if (!organizationId) return

    try {
      setLoading(true)
      const data = await pipelineAPI.listPipelines(organizationId)
      setPipelines(data)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePipeline = useCallback(() => {
    // TODO: Abrir modal de criação
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <PageHeader
        title="Pipeline"
        description="Gestão visual do funil de licitações"
        actions={
          <Button onClick={handleCreatePipeline}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Pipeline
          </Button>
        }
      />

      <div className="p-6">
        {/* TODO: Implementar visualização Kanban */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-8 text-center">
          <p className="text-neutral-600 dark:text-neutral-400">
            Pipeline Kanban - Em desenvolvimento
          </p>
          <p className="text-sm text-neutral-500 mt-2">
            {pipelines.length} pipeline(s) encontrado(s)
          </p>
        </div>
      </div>
    </div>
  )
}

