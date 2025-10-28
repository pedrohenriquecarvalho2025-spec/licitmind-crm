/**
 * Formulário para criação e edição de Entregas (AFs/Empenhos)
 */

import React, { useState, useEffect } from 'react'
import { Package, Calendar, DollarSign, FileText, Loader } from 'lucide-react'
import { Button } from '../../../components/ui/atoms/Button'
import { Input } from '../../../components/ui/atoms/Input'
import { Select } from '../../../components/ui/molecules/Select'
import { contractsAPI } from '../../contracts/contracts.api'
import { useOrganization } from '../../../hooks/useOrganization'
import { useAuth } from '../../../hooks/useAuth'
import type { Delivery, DeliveryStatus, DeliveryType } from '../types'
import type { Contract } from '../../contracts/types'

interface DeliveryFormProps {
  delivery?: Delivery | null
  onSubmit: (data: DeliveryFormData) => Promise<void>
  onCancel: () => void
}

export interface DeliveryFormData {
  numero_af: string
  numero_empenho?: string
  contract_id?: string | null
  descricao: string
  valor: number
  data_emissao: string
  data_entrega_prevista: string
  data_entrega_realizada?: string
  status: DeliveryStatus
  tipo: DeliveryType
  observacoes?: string
  responsavel_id?: string
}

const statusOptions = [
  { value: 'pendente', label: 'Pendente' },
  { value: 'em_andamento', label: 'Em Andamento' },
  { value: 'parcialmente_entregue', label: 'Parcialmente Entregue' },
  { value: 'entregue', label: 'Entregue' },
  { value: 'atrasado', label: 'Atrasado' },
  { value: 'cancelado', label: 'Cancelado' }
]

const tipoOptions = [
  { value: 'af', label: 'Autorização de Fornecimento (AF)' },
  { value: 'empenho', label: 'Empenho' },
  { value: 'nota_empenho', label: 'Nota de Empenho' }
]

export function DeliveryForm({ delivery, onSubmit, onCancel }: DeliveryFormProps) {
  const { organizationId } = useOrganization()
  const { profile } = useAuth()
  const [formData, setFormData] = useState<DeliveryFormData>({
    numero_af: delivery?.numero_af || '',
    numero_empenho: delivery?.numero_empenho || '',
    contract_id: delivery?.contract_id || null,
    descricao: delivery?.descricao || '',
    valor: delivery?.valor || 0,
    data_emissao: delivery?.data_emissao
      ? new Date(delivery.data_emissao).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    data_entrega_prevista: delivery?.data_entrega_prevista
      ? new Date(delivery.data_entrega_prevista).toISOString().split('T')[0]
      : '',
    data_entrega_realizada: delivery?.data_entrega_realizada
      ? new Date(delivery.data_entrega_realizada).toISOString().split('T')[0]
      : '',
    status: delivery?.status || 'pendente',
    tipo: delivery?.tipo || 'af',
    observacoes: delivery?.observacoes || '',
    responsavel_id: delivery?.responsavel_id || profile?.id
  })

  const [contracts, setContracts] = useState<Contract[]>([])
  const [loadingContracts, setLoadingContracts] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadContracts()
  }, [organizationId])

  const loadContracts = async () => {
    if (!organizationId) return

    try {
      setLoadingContracts(true)
      const data = await contractsAPI.listContracts(organizationId)
      setContracts(data.filter(c => c.status === 'ativo'))
    } catch (error) {
      console.error('Error loading contracts:', error)
    } finally {
      setLoadingContracts(false)
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

  const handleChange = (field: keyof DeliveryFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const contractOptions = contracts.map(c => ({
    value: c.id,
    label: `${c.numero_contrato} - ${c.objeto}`
  }))

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Dados da AF/Empenho */}
      <div className="bg-white rounded-2xl p-6 border border-neutral-200">
        <h3 className="font-bold text-neutral-800 mb-4 flex items-center space-x-2">
          <Package className="w-5 h-5 text-primary-500" />
          <span>Dados da Entrega</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Tipo *
            </label>
            <Select
              value={formData.tipo}
              onChange={(value) => handleChange('tipo', value)}
              options={tipoOptions}
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

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Número da AF *
            </label>
            <Input
              value={formData.numero_af}
              onChange={(e) => handleChange('numero_af', e.target.value)}
              placeholder="AF-2024-001"
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Número do Empenho
            </label>
            <Input
              value={formData.numero_empenho || ''}
              onChange={(e) => handleChange('numero_empenho', e.target.value)}
              placeholder="EMPENHO-2024-001"
              className="w-full"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Contrato Relacionado
            </label>
            {loadingContracts ? (
              <div className="flex items-center space-x-2 text-neutral-500">
                <Loader className="w-4 h-4 animate-spin" />
                <span>Carregando contratos...</span>
              </div>
            ) : (
              <Select
                value={formData.contract_id || ''}
                onChange={(value) => handleChange('contract_id', value || null)}
                options={[
                  { value: '', label: 'Nenhum' },
                  ...contractOptions
                ]}
                className="w-full"
              />
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Descrição *
            </label>
            <textarea
              value={formData.descricao}
              onChange={(e) => handleChange('descricao', e.target.value)}
              placeholder="Descrição detalhada da entrega"
              required
              rows={3}
              className="w-full px-4 py-2 rounded-xl border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors resize-none"
            />
          </div>
        </div>
      </div>

      {/* Valores */}
      <div className="bg-white rounded-2xl p-6 border border-neutral-200">
        <h3 className="font-bold text-neutral-800 mb-4 flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-primary-500" />
          <span>Valor</span>
        </h3>
        
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Valor (R$) *
            </label>
            <Input
              type="number"
              step="0.01"
              value={formData.valor}
              onChange={(e) => handleChange('valor', parseFloat(e.target.value))}
              placeholder="0.00"
              required
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Prazos */}
      <div className="bg-white rounded-2xl p-6 border border-neutral-200">
        <h3 className="font-bold text-neutral-800 mb-4 flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-primary-500" />
          <span>Prazos</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Data de Emissão *
            </label>
            <Input
              type="date"
              value={formData.data_emissao}
              onChange={(e) => handleChange('data_emissao', e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Data Prevista de Entrega *
            </label>
            <Input
              type="date"
              value={formData.data_entrega_prevista}
              onChange={(e) => handleChange('data_entrega_prevista', e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Data Real de Entrega
            </label>
            <Input
              type="date"
              value={formData.data_entrega_realizada || ''}
              onChange={(e) => handleChange('data_entrega_realizada', e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Observações */}
      <div className="bg-white rounded-2xl p-6 border border-neutral-200">
        <h3 className="font-bold text-neutral-800 mb-4 flex items-center space-x-2">
          <FileText className="w-5 h-5 text-primary-500" />
          <span>Observações</span>
        </h3>
        
        <textarea
          value={formData.observacoes || ''}
          onChange={(e) => handleChange('observacoes', e.target.value)}
          placeholder="Observações adicionais sobre a entrega"
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
            <span>{delivery ? 'Atualizar' : 'Criar'} Entrega</span>
          )}
        </Button>
      </div>
    </form>
  )
}

