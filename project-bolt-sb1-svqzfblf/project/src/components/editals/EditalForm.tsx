import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/atoms/Button'
import { Input } from '../ui/atoms/Input'
import { Select } from '../ui/molecules/Select'
import { ModalBase as Modal } from '../ui/molecules/ModalBase'
import { Upload, AlertCircle } from 'lucide-react'
import type { Database } from '../../lib/database.types'

type Edital = Database['public']['Tables']['editals']['Row']
type EditalInsert = Database['public']['Tables']['editals']['Insert']

interface EditalFormProps {
  isOpen: boolean
  onClose: () => void
  edital?: Edital | null
  onSubmit: () => void
}

const modalidadeOptions = [
  { value: 'concorrencia', label: 'Concorrência' },
  { value: 'pregao_presencial', label: 'Pregão Presencial' },
  { value: 'pregao_eletronico', label: 'Pregão Eletrônico' },
  { value: 'tomada_precos', label: 'Tomada de Preços' },
  { value: 'convite', label: 'Convite' },
  { value: 'dispensa', label: 'Dispensa de Licitação' },
  { value: 'inexigibilidade', label: 'Inexigibilidade' },
  { value: 'rdc', label: 'RDC' },
]

const statusOptions = [
  { value: 'prospectado', label: 'Prospectado' },
  { value: 'em_analise', label: 'Em Análise' },
  { value: 'documentacao', label: 'Documentação' },
  { value: 'proposta_enviada', label: 'Proposta Enviada' },
  { value: 'em_julgamento', label: 'Em Julgamento' },
  { value: 'homologado', label: 'Homologado' },
  { value: 'perdido', label: 'Perdido' },
]

export function EditalForm({ isOpen, onClose, edital, onSubmit }: EditalFormProps) {
  const { profile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [users, setUsers] = useState<Array<{ id: string; full_name: string }>>([])
  
  const [formData, setFormData] = useState({
    numero_edital: '',
    orgao_entidade: '',
    cnpj_orgao: '',
    objeto: '',
    descritivo_item: '',
    quantitativo: '',
    necessita_visita_tecnica: false,
    modalidade: 'pregao_eletronico' as const,
    data_publicacao: '',
    data_entrega_propostas: '',
    valor_estimado: '',
    status: 'prospectado' as const,
    responsavel_id: '',
    observacoes: '',
  })

  useEffect(() => {
    if (isOpen) {
      loadUsers()
      
      if (edital) {
        setFormData({
          numero_edital: edital.numero_edital,
          orgao_entidade: edital.orgao_entidade,
          cnpj_orgao: edital.cnpj_orgao || '',
          objeto: edital.objeto,
          descritivo_item: edital.descritivo_item || '',
          quantitativo: edital.quantitativo?.toString() || '',
          necessita_visita_tecnica: edital.necessita_visita_tecnica || false,
          modalidade: edital.modalidade,
          data_publicacao: edital.data_publicacao || '',
          data_entrega_propostas: edital.data_entrega_propostas ? 
            new Date(edital.data_entrega_propostas).toISOString().slice(0, 16) : '',
          valor_estimado: edital.valor_estimado?.toString() || '',
          status: edital.status,
          responsavel_id: edital.responsavel_id || '',
          observacoes: edital.observacoes || '',
        })
      } else {
        setFormData({
          numero_edital: '',
          orgao_entidade: '',
          cnpj_orgao: '',
          objeto: '',
          descritivo_item: '',
          quantitativo: '',
          necessita_visita_tecnica: false,
          modalidade: 'pregao_eletronico',
          data_publicacao: '',
          data_entrega_propostas: '',
          valor_estimado: '',
          status: 'prospectado',
          responsavel_id: '',
          observacoes: '',
        })
      }
    }
  }, [isOpen, edital])

  const loadUsers = async () => {
    if (!profile?.organization_id) return

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, full_name')
        .eq('organization_id', profile.organization_id)
        .eq('is_active', true)
        .in('role', ['admin', 'gestor', 'analista'])
        .order('full_name')

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error loading users:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile?.organization_id) return

    setLoading(true)
    setError('')

    try {
      const editalData: EditalInsert = {
        organization_id: profile.organization_id,
        numero_edital: formData.numero_edital,
        orgao_entidade: formData.orgao_entidade,
        cnpj_orgao: formData.cnpj_orgao || null,
        objeto: formData.objeto,
        descritivo_item: formData.descritivo_item || null,
        quantitativo: formData.quantitativo ? parseInt(formData.quantitativo) : null,
        necessita_visita_tecnica: formData.necessita_visita_tecnica,
        modalidade: formData.modalidade,
        data_publicacao: formData.data_publicacao || null,
        data_entrega_propostas: formData.data_entrega_propostas || null,
        valor_estimado: formData.valor_estimado ? parseFloat(formData.valor_estimado) : null,
        status: formData.status,
        responsavel_id: formData.responsavel_id || null,
        observacoes: formData.observacoes || null,
        created_by: profile.id,
      }

      if (edital) {
        const { error } = await supabase
          .from('editals')
          .update(editalData)
          .eq('id', edital.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('editals')
          .insert([editalData])

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const userOptions = [
    { value: '', label: 'Selecione um responsável' },
    ...users.map(user => ({ value: user.id, label: user.full_name }))
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={edital ? 'Editar Edital' : 'Novo Edital'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Número do Edital"
            name="numero_edital"
            value={formData.numero_edital}
            onChange={handleChange}
            required
            placeholder="Ex: 001/2024"
          />

          <Input
            label="Órgão/Entidade"
            name="orgao_entidade"
            value={formData.orgao_entidade}
            onChange={handleChange}
            required
            placeholder="Nome do órgão"
          />
        </div>

        <Input
          label="CNPJ do Órgão"
          name="cnpj_orgao"
          value={formData.cnpj_orgao || ''}
          onChange={handleChange}
          placeholder="00.000.000/0001-00"
        />

        <Input
          label="Objeto"
          name="objeto"
          value={formData.objeto}
          onChange={handleChange}
          required
          placeholder="Descrição do objeto da licitação"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Descritivo do Item"
            name="descritivo_item"
            value={formData.descritivo_item || ''}
            onChange={handleChange}
            placeholder="Descrição detalhada do item"
          />

          <Input
            label="Quantitativo"
            name="quantitativo"
            type="number"
            value={formData.quantitativo || ''}
            onChange={handleChange}
            placeholder="Quantidade"
          />
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="necessita_visita_tecnica"
            name="necessita_visita_tecnica"
            checked={formData.necessita_visita_tecnica || false}
            onChange={handleChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
          />
          <label htmlFor="necessita_visita_tecnica" className="text-sm font-medium text-neutral-700">
            Necessita visita técnica?
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Modalidade"
            name="modalidade"
            value={formData.modalidade}
            onChange={handleChange}
            options={modalidadeOptions}
          />

          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={statusOptions}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Data de Publicação"
            name="data_publicacao"
            type="date"
            value={formData.data_publicacao}
            onChange={handleChange}
          />

          <Input
            label="Data de Entrega das Propostas"
            name="data_entrega_propostas"
            type="datetime-local"
            value={formData.data_entrega_propostas}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Valor Estimado"
            name="valor_estimado"
            type="number"
            step="0.01"
            value={formData.valor_estimado}
            onChange={handleChange}
            placeholder="0,00"
          />

          <Select
            label="Responsável"
            name="responsavel_id"
            value={formData.responsavel_id}
            onChange={handleChange}
            options={userOptions}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observações
          </label>
          <textarea
            name="observacoes"
            value={formData.observacoes}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            placeholder="Observações adicionais..."
          />
        </div>

        {/* Upload de arquivo - Implementar depois */}
        <div className="border-2 border-dashed border-brand-cyan/30 rounded-xl p-6 text-center bg-gradient-to-br from-brand-cyan/5 to-primary-500/5 hover:from-brand-cyan/10 hover:to-primary-500/10 transition-all duration-200">
          <div className="w-12 h-12 bg-gradient-to-br from-brand-cyan to-primary-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Upload className="w-6 h-6 text-white" />
          </div>
          <h4 className="font-semibold text-neutral-800 mb-2">Upload do Edital</h4>
          <p className="text-sm text-gray-600">
            Arraste o arquivo PDF ou clique para selecionar
          </p>
          <p className="text-xs text-neutral-500 mt-2">
            OCR inteligente extrairá informações automaticamente
          </p>
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
            {edital ? 'Atualizar' : 'Cadastrar'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}