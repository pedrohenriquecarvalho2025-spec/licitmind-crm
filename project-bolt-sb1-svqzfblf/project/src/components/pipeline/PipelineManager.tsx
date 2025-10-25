import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/atoms/Button'
import { Input } from '../ui/atoms/Input'
import { ModalBase as Modal } from '../ui/molecules/ModalBase'
import { Spinner as LoadingSpinner } from '../ui/atoms/Spinner'
import { PipelineView } from './PipelineView'
import { PipelineForm } from './PipelineForm'
import { StageForm } from './StageForm'
import { Plus, Settings, Kanban, CreditCard as Edit, Trash2, Star, StarOff } from 'lucide-react'
import type { Database } from '../../lib/database.types'

type Pipeline = Database['public']['Tables']['pipelines']['Row']
type PipelineStage = Database['public']['Tables']['pipeline_stages']['Row']

export function PipelineManager() {
  const { profile, hasPermission } = useAuth()
  const [pipelines, setPipelines] = useState<Pipeline[]>([])
  const [currentPipeline, setCurrentPipeline] = useState<Pipeline | null>(null)
  const [stages, setStages] = useState<PipelineStage[]>([])
  const [loading, setLoading] = useState(true)
  const [showPipelineForm, setShowPipelineForm] = useState(false)
  const [showStageForm, setShowStageForm] = useState(false)
  const [selectedPipeline, setSelectedPipeline] = useState<Pipeline | null>(null)
  const [selectedStage, setSelectedStage] = useState<PipelineStage | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban')

  useEffect(() => {
    loadPipelines()
  }, [profile])

  useEffect(() => {
    if (currentPipeline) {
      loadStages(currentPipeline.id)
    }
  }, [currentPipeline])

  const loadPipelines = async () => {
    if (!profile?.organization_id) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('pipelines')
        .select('*')
        .eq('organization_id', profile.organization_id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: true })

      if (error) throw error
      
      setPipelines(data || [])
      
      // Selecionar pipeline padrão ou primeiro disponível
      const defaultPipeline = data?.find(p => p.is_default) || data?.[0]
      if (defaultPipeline) {
        setCurrentPipeline(defaultPipeline)
      }
    } catch (error) {
      console.error('Error loading pipelines:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStages = async (pipelineId: string) => {
    try {
      const { data, error } = await supabase
        .from('pipeline_stages')
        .select('*')
        .eq('pipeline_id', pipelineId)
        .order('order_index')

      if (error) throw error
      setStages(data || [])
    } catch (error) {
      console.error('Error loading stages:', error)
    }
  }

  const handleSetDefault = async (pipeline: Pipeline) => {
    try {
      // Remover default de todos os pipelines
      await supabase
        .from('pipelines')
        .update({ is_default: false })
        .eq('organization_id', profile?.organization_id)

      // Definir novo pipeline padrão
      const { error } = await supabase
        .from('pipelines')
        .update({ is_default: true })
        .eq('id', pipeline.id)

      if (error) throw error
      loadPipelines()
    } catch (error) {
      console.error('Error setting default pipeline:', error)
    }
  }

  const handleDeletePipeline = async (pipeline: Pipeline) => {
    if (!confirm(`Tem certeza que deseja excluir o pipeline "${pipeline.name}"?`)) return

    try {
      const { error } = await supabase
        .from('pipelines')
        .delete()
        .eq('id', pipeline.id)

      if (error) throw error
      loadPipelines()
    } catch (error) {
      console.error('Error deleting pipeline:', error)
    }
  }

  const handleDeleteStage = async (stage: PipelineStage) => {
    if (!confirm(`Tem certeza que deseja excluir o estágio "${stage.name}"?`)) return

    try {
      const { error } = await supabase
        .from('pipeline_stages')
        .delete()
        .eq('id', stage.id)

      if (error) throw error
      loadStages(currentPipeline!.id)
    } catch (error) {
      console.error('Error deleting stage:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (viewMode === 'kanban' && currentPipeline) {
    return (
      <div className="h-full flex flex-col">
        {/* Pipeline Selector */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <select
                value={currentPipeline.id}
                onChange={(e) => {
                  const pipeline = pipelines.find(p => p.id === e.target.value)
                  setCurrentPipeline(pipeline || null)
                }}
                className="border border-gray-300 rounded-md px-3 py-2"
              >
                {pipelines.map(pipeline => (
                  <option key={pipeline.id} value={pipeline.id}>
                    {pipeline.name} {pipeline.is_default ? '(Padrão)' : ''}
                  </option>
                ))}
              </select>
              
              {hasPermission('gestor') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Gerenciar Pipelines
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Pipeline View */}
        <div className="flex-1">
          <PipelineView 
            pipeline={currentPipeline} 
            stages={stages}
            onStageUpdate={() => loadStages(currentPipeline.id)}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gerenciar Pipelines</h2>
          <p className="text-gray-600">Configure pipelines personalizados para diferentes tipos de licitação</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="secondary"
            onClick={() => setViewMode('kanban')}
          >
            <Kanban className="w-4 h-4 mr-2" />
            Ver Pipeline
          </Button>
          {hasPermission('gestor') && (
            <Button onClick={() => setShowPipelineForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Pipeline
            </Button>
          )}
        </div>
      </div>

      {/* Pipelines List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pipelines.map(pipeline => (
          <div key={pipeline.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                  <Kanban className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                    <span>{pipeline.name}</span>
                    {pipeline.is_default && (
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    )}
                  </h3>
                  <p className="text-sm text-gray-600">{pipeline.description}</p>
                </div>
              </div>
              
              {hasPermission('gestor') && (
                <div className="flex space-x-2">
                  {!pipeline.is_default && (
                    <button
                      onClick={() => handleSetDefault(pipeline)}
                      className="text-gray-400 hover:text-yellow-500"
                      title="Definir como padrão"
                    >
                      <StarOff className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedPipeline(pipeline)
                      setShowPipelineForm(true)
                    }}
                    className="text-gray-400 hover:text-sky-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  {!pipeline.is_default && (
                    <button
                      onClick={() => handleDeletePipeline(pipeline)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Stages */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700">Estágios</h4>
                {hasPermission('gestor') && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setCurrentPipeline(pipeline)
                      setSelectedStage(null)
                      setShowStageForm(true)
                    }}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Adicionar
                  </Button>
                )}
              </div>
              
              <div className="space-y-2">
                {stages.filter(s => s.pipeline_id === pipeline.id).map(stage => (
                  <div key={stage.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${stage.color.split(' ')[0].replace('bg-', 'bg-').replace('-50', '-400')}`} />
                      <span className="text-sm text-gray-900">{stage.name}</span>
                    </div>
                    {hasPermission('gestor') && (
                      <div className="flex space-x-1">
                        <button
                          onClick={() => {
                            setCurrentPipeline(pipeline)
                            setSelectedStage(stage)
                            setShowStageForm(true)
                          }}
                          className="text-gray-400 hover:text-sky-600"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteStage(stage)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Forms */}
      <PipelineForm
        isOpen={showPipelineForm}
        onClose={() => {
          setShowPipelineForm(false)
          setSelectedPipeline(null)
        }}
        pipeline={selectedPipeline}
        onSubmit={() => {
          loadPipelines()
          setShowPipelineForm(false)
          setSelectedPipeline(null)
        }}
      />

      <StageForm
        isOpen={showStageForm}
        onClose={() => {
          setShowStageForm(false)
          setSelectedStage(null)
        }}
        pipeline={currentPipeline}
        stage={selectedStage}
        onSubmit={() => {
          if (currentPipeline) {
            loadStages(currentPipeline.id)
          }
          setShowStageForm(false)
          setSelectedStage(null)
        }}
      />
    </div>
  )
}