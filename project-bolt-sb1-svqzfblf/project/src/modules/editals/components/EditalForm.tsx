/**
 * Formulário completo de Edital com tabela de itens e upload
 */

import React, { useState } from 'react'
import {
  X,
  Upload,
  FileText,
  Plus,
  Trash2,
  AlertCircle,
  DollarSign,
  Package,
} from 'lucide-react'
import { Button } from '../../../components/ui/atoms/Button'
import { Input } from '../../../components/ui/atoms/Input'
import { Select } from '../../../components/ui/atoms/Select'
import type { Edital } from '../types'

interface EditalItem {
  id: string
  descricao: string
  quantidade: number
  unidade: string
  valor_unitario: number
  valor_total: number
}

interface EditalFormProps {
  edital?: Edital | null
  onSubmit: (data: EditalFormData) => Promise<void>
  onCancel: () => void
}

export interface EditalFormData {
  numero_edital: string
  orgao_entidade: string
  objeto: string
  modalidade: string
  data_publicacao: string
  data_entrega_propostas: string
  valor_estimado: number | null
  status: string
  responsavel_id: string | null
  observacoes: string
  arquivo?: File | null
  itens: EditalItem[]
}

export function EditalForm({ edital, onSubmit, onCancel }: EditalFormProps) {
  const [formData, setFormData] = useState<EditalFormData>({
    numero_edital: edital?.numero_edital || '',
    orgao_entidade: edital?.orgao_entidade || '',
    objeto: edital?.objeto || '',
    modalidade: edital?.modalidade || 'pregao_eletronico',
    data_publicacao: edital?.data_publicacao || '',
    data_entrega_propostas: edital?.data_entrega_propostas || '',
    valor_estimado: edital?.valor_estimado || null,
    status: edital?.status || 'prospectado',
    responsavel_id: edital?.responsavel_id || null,
    observacoes: edital?.observacoes || '',
    arquivo: null,
    itens: [],
  })

  const [items, setItems] = useState<EditalItem[]>([])
  const [currentItem, setCurrentItem] = useState<Partial<EditalItem>>({
    descricao: '',
    quantidade: 1,
    unidade: 'UN',
    valor_unitario: 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const modalidadeOptions = [
    { value: 'pregao_eletronico', label: 'Pregão Eletrônico' },
    { value: 'pregao_presencial', label: 'Pregão Presencial' },
    { value: 'concorrencia', label: 'Concorrência' },
    { value: 'tomada_precos', label: 'Tomada de Preços' },
    { value: 'convite', label: 'Convite' },
    { value: 'dispensa', label: 'Dispensa' },
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await onSubmit({
        ...formData,
        arquivo: uploadedFile,
        itens: items,
      })
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar edital')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof EditalFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tamanho (máx 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Arquivo muito grande. Tamanho máximo: 10MB')
        return
      }

      // Validar tipo
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(file.type)) {
        setError('Tipo de arquivo não permitido. Use PDF ou DOC/DOCX')
        return
      }

      setUploadedFile(file)
      setError('')
    }
  }

  const handleAddItem = () => {
    if (!currentItem.descricao || !currentItem.quantidade || !currentItem.valor_unitario) {
      setError('Preencha todos os campos do item')
      return
    }

    const newItem: EditalItem = {
      id: crypto.randomUUID(),
      descricao: currentItem.descricao!,
      quantidade: currentItem.quantidade!,
      unidade: currentItem.unidade || 'UN',
      valor_unitario: currentItem.valor_unitario!,
      valor_total: currentItem.quantidade! * currentItem.valor_unitario!,
    }

    setItems([...items, newItem])
    setCurrentItem({
      descricao: '',
      quantidade: 1,
      unidade: 'UN',
      valor_unitario: 0,
    })
    setError('')
  }

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.valor_total, 0)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              {edital ? 'Editar Edital' : 'Novo Edital'}
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Preencha as informações do edital
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Informações Básicas</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Número do Edital"
                value={formData.numero_edital}
                onChange={(e) => handleChange('numero_edital', e.target.value)}
                placeholder="Ex: 001/2024"
                required
              />

              <Select
                label="Modalidade"
                value={formData.modalidade}
                onChange={(e) => handleChange('modalidade', e.target.value)}
                options={modalidadeOptions}
              />

              <div className="md:col-span-2">
                <Input
                  label="Órgão/Entidade"
                  value={formData.orgao_entidade}
                  onChange={(e) => handleChange('orgao_entidade', e.target.value)}
                  placeholder="Ex: Prefeitura Municipal"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Objeto
                </label>
                <textarea
                  value={formData.objeto}
                  onChange={(e) => handleChange('objeto', e.target.value)}
                  placeholder="Descreva o objeto da licitação..."
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-neutral-900 dark:text-white"
                />
              </div>

              <Input
                type="date"
                label="Data de Publicação"
                value={formData.data_publicacao}
                onChange={(e) => handleChange('data_publicacao', e.target.value)}
              />

              <Input
                type="datetime-local"
                label="Data de Entrega de Propostas"
                value={formData.data_entrega_propostas}
                onChange={(e) => handleChange('data_entrega_propostas', e.target.value)}
              />

              <Input
                type="number"
                label="Valor Estimado (R$)"
                value={formData.valor_estimado || ''}
                onChange={(e) =>
                  handleChange('valor_estimado', e.target.value ? parseFloat(e.target.value) : null)
                }
                placeholder="0,00"
                step="0.01"
              />

              <Select
                label="Status"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                options={statusOptions}
              />
            </div>
          </div>

          {/* Upload de Arquivo */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center space-x-2">
              <Upload className="w-5 h-5" />
              <span>Anexar Edital</span>
            </h3>

            <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
              <input
                type="file"
                id="file-upload"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <Upload className="w-12 h-12 text-neutral-400" />
                <div>
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {uploadedFile ? uploadedFile.name : 'Clique para fazer upload'}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    PDF, DOC ou DOCX (máx. 10MB)
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Tabela de Itens */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center space-x-2">
              <Package className="w-5 h-5" />
              <span>Itens do Edital</span>
            </h3>

            {/* Adicionar Item */}
            <div className="bg-neutral-50 dark:bg-neutral-900/50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-5">
                  <Input
                    placeholder="Descrição do item"
                    value={currentItem.descricao || ''}
                    onChange={(e) =>
                      setCurrentItem({ ...currentItem, descricao: e.target.value })
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    placeholder="Qtd"
                    value={currentItem.quantidade || ''}
                    onChange={(e) =>
                      setCurrentItem({ ...currentItem, quantidade: parseInt(e.target.value) })
                    }
                    min="1"
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    placeholder="Unid."
                    value={currentItem.unidade || ''}
                    onChange={(e) =>
                      setCurrentItem({ ...currentItem, unidade: e.target.value })
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    placeholder="Vlr. Unit."
                    value={currentItem.valor_unitario || ''}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        valor_unitario: parseFloat(e.target.value),
                      })
                    }
                    step="0.01"
                  />
                </div>
                <div className="col-span-1">
                  <Button type="button" onClick={handleAddItem} className="w-full">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Lista de Itens */}
            {items.length > 0 && (
              <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-neutral-50 dark:bg-neutral-900/50">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                        Descrição
                      </th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                        Qtd
                      </th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                        Unid.
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                        Vlr. Unit.
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                        Vlr. Total
                      </th>
                      <th className="w-16"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                        <td className="py-3 px-4 text-sm text-neutral-900 dark:text-white">
                          {item.descricao}
                        </td>
                        <td className="py-3 px-4 text-sm text-center text-neutral-600 dark:text-neutral-400">
                          {item.quantidade}
                        </td>
                        <td className="py-3 px-4 text-sm text-center text-neutral-600 dark:text-neutral-400">
                          {item.unidade}
                        </td>
                        <td className="py-3 px-4 text-sm text-right text-neutral-600 dark:text-neutral-400">
                          R$ {item.valor_unitario.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-sm text-right font-semibold text-neutral-900 dark:text-white">
                          R$ {item.valor_total.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-600 hover:text-red-700 dark:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-neutral-100 dark:bg-neutral-900">
                    <tr>
                      <td
                        colSpan={4}
                        className="py-3 px-4 text-right font-bold text-neutral-900 dark:text-white"
                      >
                        Total:
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-primary-600 dark:text-primary-400 text-lg">
                        R$ {calculateTotal().toFixed(2)}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Observações
            </label>
            <textarea
              value={formData.observacoes}
              onChange={(e) => handleChange('observacoes', e.target.value)}
              placeholder="Adicione observações ou anotações sobre o edital..."
              rows={4}
              className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-neutral-900 dark:text-white"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" loading={loading}>
              {edital ? 'Salvar Alterações' : 'Criar Edital'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

