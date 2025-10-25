import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/atoms/Button'
import { Input } from '../ui/atoms/Input'
import { ModalBase as Modal } from '../ui/molecules/ModalBase'
import { AlertCircle } from 'lucide-react'
import type { Database } from '../../lib/database.types'

type Pipeline = Database['public']['Tables']['pipelines']['Row']
type PipelineInsert = Database['public']['Tables']['pipelines']['Insert']

interface PipelineFormProps {
  isOpen: boolean
  onClose: () => void
  pipeline?: Pipeline | null
  onSubmit: () => void
}

export function PipelineForm({ isOpen, onClose, pipeline, onSubmit }: PipelineFormProps) {
  const { profile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_default: false,
  })

  useEffect(() => {
    if (isOpen) {
      if (pipeline) {
        setFormData({
          name: pipeline.name,
          description: pipeline.description || '',
          is_default: pipeline.is_default,
        })
      } else {
        setFormData({
          name: '',
          description: '',
          is_default: false,
        })
      }
    }
  }, [isOpen, pipeline])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile?.organization_id) return

    setLoading(true)
    setError('')

    try {
      const pipelineData: PipelineInsert = {
        organization_id: profile.organization_id,
        name: formData.name,
        description: formData.description || null,
        is_default: formData.is_default,
        created_by: profile.id,
      }

      if (pipeline) {
        const { error } = await supabase
          .from('pipelines')
          .update(pipelineData)
          .eq('id', pipeline.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('pipelines')
          .insert([pipelineData])

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={pipeline ? 'Editar Pipeline' : 'Novo Pipeline'}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Nome do Pipeline"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Ex: Pipeline Obras, Pipeline TI"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            placeholder="Descreva o propósito deste pipeline..."
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_default"
            name="is_default"
            checked={formData.is_default}
            onChange={handleChange}
            className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
          />
          <label htmlFor="is_default" className="ml-2 block text-sm text-gray-900">
            Definir como pipeline padrão
          </label>
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
            {pipeline ? 'Atualizar' : 'Criar Pipeline'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}