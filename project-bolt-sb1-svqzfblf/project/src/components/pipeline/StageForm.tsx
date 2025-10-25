import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Button } from '../ui/atoms/Button'
import { Input } from '../ui/atoms/Input'
import { Select } from '../ui/molecules/Select'
import { ModalBase as Modal } from '../ui/molecules/ModalBase'
import { AlertCircle } from 'lucide-react'
import type { Database } from '../../lib/database.types'

type Pipeline = Database['public']['Tables']['pipelines']['Row']
type PipelineStage = Database['public']['Tables']['pipeline_stages']['Row']
type PipelineStageInsert = Database['public']['Tables']['pipeline_stages']['Insert']

interface StageFormProps {
  isOpen: boolean
  onClose: () => void
  pipeline: Pipeline | null
  stage?: PipelineStage | null
  onSubmit: () => void
}

const colorOptions = [
  { value: 'bg-gray-50 border-gray-200', label: 'Cinza' },
  { value: 'bg-blue-50 border-blue-200', label: 'Azul' },
  { value: 'bg-green-50 border-green-200', label: 'Verde' },
  { value: 'bg-yellow-50 border-yellow-200', label: 'Amarelo' },
  { value: 'bg-red-50 border-red-200', label: 'Vermelho' },
  { value: 'bg-purple-50 border-purple-200', label: 'Roxo' },
  { value: 'bg-orange-50 border-orange-200', label: 'Laranja' },
  { value: 'bg-pink-50 border-pink-200', label: 'Rosa' },
  { value: 'bg-indigo-50 border-indigo-200', label: 'Índigo' },
  { value: 'bg-teal-50 border-teal-200', label: 'Verde-azulado' },
  { value: 'bg-cyan-50 border-cyan-200', label: 'Ciano' },
  { value: 'bg-lime-50 border-lime-200', label: 'Lima' },
  { value: 'bg-emerald-50 border-emerald-200', label: 'Esmeralda' },
]

export function StageForm({ isOpen, onClose, pipeline, stage, onSubmit }: StageFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [maxOrder, setMaxOrder] = useState(0)
  
  const [formData, setFormData] = useState({
    name: '',
    color: 'bg-gray-50 border-gray-200',
    order_index: 1,
  })

  useEffect(() => {
    if (isOpen && pipeline) {
      loadMaxOrder()
      
      if (stage) {
        setFormData({
          name: stage.name,
          color: stage.color,
          order_index: stage.order_index,
        })
      } else {
        setFormData({
          name: '',
          color: 'bg-gray-50 border-gray-200',
          order_index: maxOrder + 1,
        })
      }
    }
  }, [isOpen, pipeline, stage, maxOrder])

  const loadMaxOrder = async () => {
    if (!pipeline) return

    try {
      const { data, error } = await supabase
        .from('pipeline_stages')
        .select('order_index')
        .eq('pipeline_id', pipeline.id)
        .order('order_index', { ascending: false })
        .limit(1)

      if (error) throw error
      
      const max = data?.[0]?.order_index || 0
      setMaxOrder(max)
      
      if (!stage) {
        setFormData(prev => ({ ...prev, order_index: max + 1 }))
      }
    } catch (error) {
      console.error('Error loading max order:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pipeline) return

    setLoading(true)
    setError('')

    try {
      const stageData: PipelineStageInsert = {
        pipeline_id: pipeline.id,
        name: formData.name,
        color: formData.color,
        order_index: formData.order_index,
      }

      if (stage) {
        const { error } = await supabase
          .from('pipeline_stages')
          .update(stageData)
          .eq('id', stage.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('pipeline_stages')
          .insert([stageData])

        if (error) throw error
      }

      onSubmit()
      onClose()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'order_index' ? parseInt(value) : value
    }))
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={stage ? 'Editar Estágio' : 'Novo Estágio'}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Nome do Estágio"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Ex: Em Análise, Documentação"
        />

        <Select
          label="Cor"
          name="color"
          value={formData.color}
          onChange={handleChange}
          options={colorOptions}
        />

        <Input
          label="Ordem"
          name="order_index"
          type="number"
          min="1"
          value={formData.order_index}
          onChange={handleChange}
          required
        />

        {/* Preview */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Preview:</p>
          <div className={`p-3 rounded-lg border-2 border-dashed ${formData.color}`}>
            <div className="bg-white p-3 rounded shadow-sm">
              <h4 className="font-medium text-gray-900">{formData.name || 'Nome do Estágio'}</h4>
              <p className="text-sm text-gray-500 mt-1">Exemplo de card neste estágio</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={loading}
          >
            {stage ? 'Atualizar' : 'Criar Estágio'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}