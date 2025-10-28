/**
 * Formulário para criação e edição de Protocolos Administrativos
 */

import React, { useState } from 'react'
import { FileText, Calendar, User, Loader } from 'lucide-react'
import { Button } from '../../../components/ui/atoms/Button'
import { Input } from '../../../components/ui/atoms/Input'
import { Select } from '../../../components/ui/molecules/Select'
import type { Protocol, ProtocolStatus, ProtocolType } from '../types'

interface ProtocolFormProps {
  protocol?: Protocol | null
  onSubmit: (data: ProtocolFormData) => Promise<void>
  onCancel: () => void
}

export interface ProtocolFormData {
  numero_protocol: string
  tipo: ProtocolType
  assunto: string
  orgao_destinatario: string
  data_protocolo: string
  data_resposta_esperada?: string
  status: ProtocolStatus
  descricao: string
  observacoes?: string
}

const tipoOptions = [
  { value: 'recurso', label: 'Recurso Administrativo' },
  { value: 'impugnacao', label: 'Impugnação' },
  { value: 'consulta', label: 'Consulta' },
  { value: 'solicitacao', label: 'Solicitação' },
  { value: 'pedido_esclarecimento', label: 'Pedido de Esclarecimento' },
  { value: 'manifestacao', label: 'Manifestação' },
  { value: 'outros', label: 'Outros' }
]

const statusOptions = [
  { value: 'aguardando_resposta', label: 'Aguardando Resposta' },
  { value: 'em_analise', label: 'Em Análise' },
  { value: 'deferido', label: 'Deferido' },
  { value: 'indeferido', label: 'Indeferido' },
  { value: 'parcialmente_deferido', label: 'Parcialmente Deferido' },
  { value: 'arquivado', label: 'Arquivado' }
]

export function ProtocolForm({ protocol, onSubmit, onCancel }: ProtocolFormProps) {
  const [formData, setFormData] = useState<ProtocolFormData>({
    numero_protocol: protocol?.numero_protocol || '',
    tipo: protocol?.tipo || 'recurso',
    assunto: protocol?.assunto || '',
    orgao_destinatario: protocol?.orgao_destinatario || '',
    data_protocolo: protocol?.data_protocolo
      ? new Date(protocol.data_protocolo).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    data_resposta_esperada: protocol?.data_resposta_esperada
      ? new Date(protocol.data_resposta_esperada).toISOString().split('T')[0]
      : '',
    status: protocol?.status || 'aguardando_resposta',
    descricao: protocol?.descricao || '',
    observacoes: protocol?.observacoes || ''
  })

  const [submitting, setSubmitting] = useState(false)

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

  const handleChange = (field: keyof ProtocolFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Dados do Protocolo */}
      <div className="bg-white rounded-2xl p-6 border border-neutral-200">
        <h3 className="font-bold text-neutral-800 mb-4 flex items-center space-x-2">
          <FileText className="w-5 h-5 text-primary-500" />
          <span>Dados do Protocolo</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Número do Protocolo *
            </label>
            <Input
              value={formData.numero_protocol}
              onChange={(e) => handleChange('numero_protocol', e.target.value)}
              placeholder="PROT-2024-001"
              required
              className="w-full"
            />
          </div>

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

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Assunto *
            </label>
            <Input
              value={formData.assunto}
              onChange={(e) => handleChange('assunto', e.target.value)}
              placeholder="Assunto do protocolo"
              required
              className="w-full"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Órgão Destinatário *
            </label>
            <Input
              value={formData.orgao_destinatario}
              onChange={(e) => handleChange('orgao_destinatario', e.target.value)}
              placeholder="Nome do órgão público"
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
        </div>
      </div>

      {/* Prazos */}
      <div className="bg-white rounded-2xl p-6 border border-neutral-200">
        <h3 className="font-bold text-neutral-800 mb-4 flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-primary-500" />
          <span>Prazos</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Data do Protocolo *
            </label>
            <Input
              type="date"
              value={formData.data_protocolo}
              onChange={(e) => handleChange('data_protocolo', e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Data de Resposta Esperada
            </label>
            <Input
              type="date"
              value={formData.data_resposta_esperada || ''}
              onChange={(e) => handleChange('data_resposta_esperada', e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Descrição */}
      <div className="bg-white rounded-2xl p-6 border border-neutral-200">
        <h3 className="font-bold text-neutral-800 mb-4">Descrição *</h3>
        
        <textarea
          value={formData.descricao}
          onChange={(e) => handleChange('descricao', e.target.value)}
          placeholder="Descrição detalhada do protocolo, contexto e argumentos"
          required
          rows={5}
          className="w-full px-4 py-2 rounded-xl border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors resize-none"
        />
      </div>

      {/* Observações */}
      <div className="bg-white rounded-2xl p-6 border border-neutral-200">
        <h3 className="font-bold text-neutral-800 mb-4">Observações</h3>
        
        <textarea
          value={formData.observacoes || ''}
          onChange={(e) => handleChange('observacoes', e.target.value)}
          placeholder="Observações adicionais, acompanhamento, atualizações"
          rows={3}
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
            <span>{protocol ? 'Atualizar' : 'Criar'} Protocolo</span>
          )}
        </Button>
      </div>
    </form>
  )
}

