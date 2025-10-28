/**
 * Formulário para criação e edição de Contratos
 * Inclui seção de Cláusulas de Multa
 */

import React, { useState, useEffect } from 'react'
import { FileText, Calendar, DollarSign, AlertTriangle, Plus, X, Upload } from 'lucide-react'
import { Button } from '../../../components/ui/atoms/Button'
import { Input } from '../../../components/ui/atoms/Input'
import { Select } from '../../../components/ui/molecules/Select'
import { editalsAPI } from '../../editals/editals.api'
import { useOrganization } from '../../../hooks/useOrganization'
import type { Contract, ContractStatus } from '../types'
import type { ContractPenalty, PenaltyType, PENALTY_TYPE_LABELS } from '../types/penalties'
import type { Edital } from '../../editals/types'

interface ContractFormProps {
  contract?: Contract | null
  penalties?: ContractPenalty[]
  onSubmit: (data: ContractFormData) => Promise<void>
  onCancel: () => void
}

export interface ContractFormData {
  numero_contrato: string
  edital_id?: string | null
  objeto: string
  contratante: string
  valor_total: number
  data_assinatura: string
  data_inicio_vigencia: string
  data_fim_vigencia: string
  prazo_execucao_dias?: number
  status: ContractStatus
  tipo_contrato?: string
  modalidade_pagamento?: string
  garantia_contratual?: number
  tipo_garantia?: string
  observacoes?: string
  arquivo?: File
  penalties: ContractPenaltyFormData[]
}

export interface ContractPenaltyFormData {
  id?: string
  tipo: PenaltyType
  descricao: string
  percentual_multa?: number
  valor_fixo_multa?: number
  prazo_dias?: number
  observacoes?: string
}

const statusOptions = [
  { value: 'em_elaboracao', label: 'Em Elaboração' },
  { value: 'ativo', label: 'Ativo' },
  { value: 'suspenso', label: 'Suspenso' },
  { value: 'encerrado', label: 'Encerrado' },
  { value: 'rescindido', label: 'Rescindido' }
]

const tipoContratoOptions = [
  { value: 'fornecimento', label: 'Fornecimento' },
  { value: 'servico', label: 'Prestação de Serviços' },
  { value: 'obra', label: 'Obra' },
  { value: 'concessao', label: 'Concessão' },
  { value: 'outros', label: 'Outros' }
]

const tipoGarantiaOptions = [
  { value: 'nenhuma', label: 'Nenhuma' },
  { value: 'caucao', label: 'Caução' },
  { value: 'seguro_garantia', label: 'Seguro Garantia' },
  { value: 'fianca_bancaria', label: 'Fiança Bancária' }
]

const penaltyTypeOptions = [
  { value: 'atraso', label: 'Atraso na Entrega' },
  { value: 'inadimplencia', label: 'Inadimplência' },
  { value: 'qualidade', label: 'Qualidade Inadequada' },
  { value: 'rescisao', label: 'Rescisão Antecipada' },
  { value: 'outros', label: 'Outros' }
]

export function ContractForm({ contract, penalties = [], onSubmit, onCancel }: ContractFormProps) {
  const { organizationId } = useOrganization()
  const [formData, setFormData] = useState<ContractFormData>({
    numero_contrato: contract?.numero_contrato || '',
    edital_id: contract?.edital_id || null,
    objeto: contract?.objeto || '',
    contratante: contract?.contratante || '',
    valor_total: contract?.valor_total || 0,
    data_assinatura: contract?.data_assinatura 
      ? new Date(contract.data_assinatura).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    data_inicio_vigencia: contract?.data_inicio_vigencia
      ? new Date(contract.data_inicio_vigencia).toISOString().split('T')[0]
      : '',
    data_fim_vigencia: contract?.data_fim_vigencia
      ? new Date(contract.data_fim_vigencia).toISOString().split('T')[0]
      : '',
    prazo_execucao_dias: contract?.prazo_execucao_dias || undefined,
    status: contract?.status || 'em_elaboracao',
    tipo_contrato: contract?.tipo_contrato || '',
    modalidade_pagamento: contract?.modalidade_pagamento || '',
    garantia_contratual: contract?.garantia_contratual || undefined,
    tipo_garantia: contract?.tipo_garantia || 'nenhuma',
    observacoes: contract?.observacoes || '',
    penalties: penalties.map(p => ({
      id: p.id,
      tipo: p.tipo,
      descricao: p.descricao,
      percentual_multa: p.percentual_multa || undefined,
      valor_fixo_multa: p.valor_fixo_multa || undefined,
      prazo_dias: p.prazo_dias || undefined,
      observacoes: p.observacoes || ''
    }))
  })

  const [editals, setEditals] = useState<Edital[]>([])
  const [loadingEditals, setLoadingEditals] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [fileName, setFileName] = useState<string>('')

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

  const handleChange = (field: keyof ContractFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      handleChange('arquivo', file)
    }
  }

  // Gerenciamento de Penalties
  const addPenalty = () => {
    setFormData(prev => ({
      ...prev,
      penalties: [
        ...prev.penalties,
        {
          tipo: 'atraso',
          descricao: '',
          percentual_multa: undefined,
          valor_fixo_multa: undefined,
          prazo_dias: undefined,
          observacoes: ''
        }
      ]
    }))
  }

  const removePenalty = (index: number) => {
    setFormData(prev => ({
      ...prev,
      penalties: prev.penalties.filter((_, i) => i !== index)
    }))
  }

  const updatePenalty = (index: number, field: keyof ContractPenaltyFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      penalties: prev.penalties.map((p, i) => 
        i === index ? { ...p, [field]: value } : p
      )
    }))
  }

  const editalOptions = editals.map(e => ({
    value: e.id,
    label: `${e.numero_edital} - ${e.objeto}`
  }))

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto">
      {/* Dados Principais */}
      <div className="bg-white rounded-2xl p-6 border border-neutral-200">
        <h3 className="font-bold text-neutral-800 mb-4 flex items-center space-x-2">
          <FileText className="w-5 h-5 text-primary-500" />
          <span>Dados do Contrato</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Número do Contrato *
            </label>
            <Input
              value={formData.numero_contrato}
              onChange={(e) => handleChange('numero_contrato', e.target.value)}
              placeholder="CONT-2024-001"
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
            <Select
              value={formData.edital_id || ''}
              onChange={(value) => handleChange('edital_id', value || null)}
              options={[
                { value: '', label: 'Nenhum' },
                ...editalOptions
              ]}
              className="w-full"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Objeto do Contrato *
            </label>
            <textarea
              value={formData.objeto}
              onChange={(e) => handleChange('objeto', e.target.value)}
              placeholder="Descrição do objeto do contrato"
              required
              rows={2}
              className="w-full px-4 py-2 rounded-xl border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Contratante *
            </label>
            <Input
              value={formData.contratante}
              onChange={(e) => handleChange('contratante', e.target.value)}
              placeholder="Nome do contratante"
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Tipo de Contrato
            </label>
            <Select
              value={formData.tipo_contrato || ''}
              onChange={(value) => handleChange('tipo_contrato', value)}
              options={tipoContratoOptions}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Valores e Garantias */}
      <div className="bg-white rounded-2xl p-6 border border-neutral-200">
        <h3 className="font-bold text-neutral-800 mb-4 flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-primary-500" />
          <span>Valores e Garantias</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Valor Total (R$) *
            </label>
            <Input
              type="number"
              step="0.01"
              value={formData.valor_total}
              onChange={(e) => handleChange('valor_total', parseFloat(e.target.value))}
              placeholder="0.00"
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Modalidade de Pagamento
            </label>
            <Input
              value={formData.modalidade_pagamento || ''}
              onChange={(e) => handleChange('modalidade_pagamento', e.target.value)}
              placeholder="Ex: Mensal, Quinzenal"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Tipo de Garantia
            </label>
            <Select
              value={formData.tipo_garantia || 'nenhuma'}
              onChange={(value) => handleChange('tipo_garantia', value)}
              options={tipoGarantiaOptions}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Valor da Garantia (%)
            </label>
            <Input
              type="number"
              step="0.01"
              value={formData.garantia_contratual || ''}
              onChange={(e) => handleChange('garantia_contratual', parseFloat(e.target.value))}
              placeholder="5.00"
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Prazos */}
      <div className="bg-white rounded-2xl p-6 border border-neutral-200">
        <h3 className="font-bold text-neutral-800 mb-4 flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-primary-500" />
          <span>Prazos e Vigência</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Data de Assinatura *
            </label>
            <Input
              type="date"
              value={formData.data_assinatura}
              onChange={(e) => handleChange('data_assinatura', e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Início da Vigência *
            </label>
            <Input
              type="date"
              value={formData.data_inicio_vigencia}
              onChange={(e) => handleChange('data_inicio_vigencia', e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Fim da Vigência *
            </label>
            <Input
              type="date"
              value={formData.data_fim_vigencia}
              onChange={(e) => handleChange('data_fim_vigencia', e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Prazo de Execução (dias)
            </label>
            <Input
              type="number"
              value={formData.prazo_execucao_dias || ''}
              onChange={(e) => handleChange('prazo_execucao_dias', parseInt(e.target.value))}
              placeholder="Ex: 365"
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Cláusulas de Multa */}
      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border-2 border-red-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-red-900 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>Cláusulas de Multa</span>
          </h3>
          <Button type="button" variant="ghost" size="sm" onClick={addPenalty}>
            <Plus className="w-4 h-4 mr-1" />
            Adicionar Cláusula
          </Button>
        </div>

        {formData.penalties.length === 0 ? (
          <div className="text-center py-8 text-neutral-600">
            <p>Nenhuma cláusula de multa adicionada.</p>
            <p className="text-sm">Clique em "Adicionar Cláusula" para incluir.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {formData.penalties.map((penalty, index) => (
              <div key={index} className="bg-white rounded-xl p-4 border border-red-200">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-sm font-medium text-neutral-700">Cláusula {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removePenalty(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 mb-1">
                      Tipo de Infração
                    </label>
                    <Select
                      value={penalty.tipo}
                      onChange={(value) => updatePenalty(index, 'tipo', value)}
                      options={penaltyTypeOptions}
                      className="w-full text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-600 mb-1">
                      Prazo (dias)
                    </label>
                    <Input
                      type="number"
                      value={penalty.prazo_dias || ''}
                      onChange={(e) => updatePenalty(index, 'prazo_dias', parseInt(e.target.value) || undefined)}
                      placeholder="Ex: 30"
                      className="w-full text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-600 mb-1">
                      Percentual da Multa (%)
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={penalty.percentual_multa || ''}
                      onChange={(e) => updatePenalty(index, 'percentual_multa', parseFloat(e.target.value) || undefined)}
                      placeholder="Ex: 0.5"
                      className="w-full text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-600 mb-1">
                      Valor Fixo da Multa (R$)
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={penalty.valor_fixo_multa || ''}
                      onChange={(e) => updatePenalty(index, 'valor_fixo_multa', parseFloat(e.target.value) || undefined)}
                      placeholder="Ex: 1000.00"
                      className="w-full text-sm"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-neutral-600 mb-1">
                      Descrição da Cláusula
                    </label>
                    <textarea
                      value={penalty.descricao}
                      onChange={(e) => updatePenalty(index, 'descricao', e.target.value)}
                      placeholder="Descreva a cláusula de multa"
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors resize-none text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload e Observações */}
      <div className="bg-white rounded-2xl p-6 border border-neutral-200">
        <h3 className="font-bold text-neutral-800 mb-4">Documento e Observações</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Arquivo do Contrato (PDF)
            </label>
            <div className="flex items-center space-x-2">
              <label className="flex-1 cursor-pointer">
                <div className="flex items-center space-x-2 px-4 py-2 border-2 border-dashed border-neutral-300 rounded-xl hover:border-primary-500 transition-colors">
                  <Upload className="w-5 h-5 text-neutral-500" />
                  <span className="text-sm text-neutral-600">
                    {fileName || 'Selecionar arquivo...'}
                  </span>
                </div>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Observações
            </label>
            <textarea
              value={formData.observacoes || ''}
              onChange={(e) => handleChange('observacoes', e.target.value)}
              placeholder="Observações adicionais sobre o contrato"
              rows={4}
              className="w-full px-4 py-2 rounded-xl border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors resize-none"
            />
          </div>
        </div>
      </div>

      {/* Ações */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200 sticky bottom-0 bg-white">
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
        >
          {submitting ? 'Salvando...' : contract ? 'Atualizar Contrato' : 'Criar Contrato'}
        </Button>
      </div>
    </form>
  )
}

