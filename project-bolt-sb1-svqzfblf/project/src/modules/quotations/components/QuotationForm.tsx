/**
 * Formulário para criação e edição de Cotações
 */

import React, { useState, useEffect } from 'react'
import { FileText, Calendar, Loader } from 'lucide-react'
import { Button } from '../../../components/ui/atoms/Button'
import { Input } from '../../../components/ui/atoms/Input'
import { Select } from '../../../components/ui/molecules/Select'
import { editalsAPI } from '../../editals/editals.api'
import { useOrganization } from '../../../hooks/useOrganization'
import type { Quotation, QuotationStatus, QUOTATION_STATUS_LABELS } from '../types'
import type { Edital } from '../../editals/types'

interface QuotationFormProps {
  quotation?: Quotation | null
  onSubmit: (data: QuotationFormData) => Promise<void>
  onCancel: () => void
}

export interface QuotationFormData {
  numero_cotacao: string
  edital_id?: string | null
  descricao?: string
  data_solicitacao: string
  data_limite_resposta?: string
  status: QuotationStatus
  observacoes?: string
}

const statusOptions = [
  { value: 'pendente', label: 'Pendente' },
  { value: 'em_andamento', label: 'Em Andamento' },
  { value: 'recebida', label: 'Recebida' },
  { value: 'aprovada', label: 'Aprovada' },
  { value: 'rejeitada', label: 'Rejeitada' },
  { value: 'cancelada', label: 'Cancelada' }
]

export function QuotationForm({ quotation, onSubmit, onCancel }: QuotationFormProps) {
  const { organizationId } = useOrganization()
  const [formData, setFormData] = useState<QuotationFormData>({
    numero_cotacao: quotation?.numero_cotacao || '',
    edital_id: quotation?.edital_id || null,
    descricao: quotation?.descricao || '',
    data_solicitacao: quotation?.data_solicitacao 
      ? new Date(quotation.data_solicitacao).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    data_limite_resposta: quotation?.data_limite_resposta
      ? new Date(quotation.data_limite_resposta).toISOString().split('T')[0]
      : '',
    status: quotation?.status || 'pendente',
    observacoes: quotation?.observacoes || ''
  })

  const [editals, setEditals] = useState<Edital[]>([])
  const [loadingEditals, setLoadingEditals] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadEditals()
  }, [organizationId])

  const loadEditals = async () => {
    if (!organizationId) return

    try {
      setLoadingEditals(true)
      const data = await editalsAPI.listEditals(organizationId)
      setEditals(data)
    } catch (error) {
      console.error('Error loading editals:', error)
    } finally {
      setLoadingEditals(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setSubmitting(true)
      await onSubmit(formData)
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (field: keyof QuotationFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const editalOptions = editals.map(e => ({
    value: e.id,
    label: `${e.numero_edital} - ${e.objeto}`
  }))

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Dados Principais */}
      <div className="bg-white rounded-2xl p-6 border border-neutral-200">
        <h3 className="font-bold text-neutral-800 mb-4 flex items-center space-x-2">
          <FileText className="w-5 h-5 text-primary-500" />
          <span>Dados da Cotação</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Número da Cotação *
            </label>
            <Input
              value={formData.numero_cotacao}
              onChange={(e) => handleChange('numero_cotacao', e.target.value)}
              placeholder="COT-2024-001"
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Status *
            </label>
            <Select
              value={formData.status}
              onChange={(value) => handleChange('status', value)}
              options={statusOptions}
              className="w-full"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Edital Relacionado
            </label>
            {loadingEditals ? (
              <div className="flex items-center space-x-2 text-neutral-500">
                <Loader className="w-4 h-4 animate-spin" />
                <span>Carregando editais...</span>
              </div>
            ) : (
              <Select
                value={formData.edital_id || ''}
                onChange={(value) => handleChange('edital_id', value || null)}
                options={[
                  { value: '', label: 'Nenhum' },
                  ...editalOptions
                ]}
                className="w-full"
              />
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Descrição
            </label>
            <Input
              value={formData.descricao || ''}
              onChange={(e) => handleChange('descricao', e.target.value)}
              placeholder="Descrição resumida da cotação"
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Datas */}
      <div className="bg-white rounded-2xl p-6 border border-neutral-200">
        <h3 className="font-bold text-neutral-800 mb-4 flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-primary-500" />
          <span>Prazos</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Data de Solicitação *
            </label>
            <Input
              type="date"
              value={formData.data_solicitacao}
              onChange={(e) => handleChange('data_solicitacao', e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Data Limite de Resposta
            </label>
            <Input
              type="date"
              value={formData.data_limite_resposta || ''}
              onChange={(e) => handleChange('data_limite_resposta', e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Observações */}
      <div className="bg-white rounded-2xl p-6 border border-neutral-200">
        <h3 className="font-bold text-neutral-800 mb-4">Observações</h3>
        
        <textarea
          value={formData.observacoes || ''}
          onChange={(e) => handleChange('observacoes', e.target.value)}
          placeholder="Observações adicionais sobre a cotação"
          rows={4}
          className="w-full px-4 py-2 rounded-xl border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors resize-none"
        />
      </div>

      {/* Ações */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={submitting}
          className="flex items-center space-x-2"
        >
          {submitting ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              <span>Salvando...</span>
            </>
          ) : (
            <span>{quotation ? 'Atualizar' : 'Criar'} Cotação</span>
          )}
        </Button>
      </div>
    </form>
  )
}

