import React, { useState } from 'react'
import { ModalBase as Modal } from '../ui/molecules/ModalBase'
import { Button } from '../ui/atoms/Button'
import { FileText, Calendar, DollarSign, Building, User, Clock, CreditCard as Edit, ExternalLink, MessageSquare, History } from 'lucide-react'
import type { Database } from '../../lib/database.types'

type Edital = Database['public']['Tables']['editals']['Row'] & {
  responsavel: { full_name: string } | null
}

interface EditalDetailsModalProps {
  edital: Edital | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (edital: Edital) => void
}

const modalidadeLabels = {
  concorrencia: 'Concorrência',
  pregao_presencial: 'Pregão Presencial',
  pregao_eletronico: 'Pregão Eletrônico',
  tomada_precos: 'Tomada de Preços',
  convite: 'Convite',
  dispensa: 'Dispensa',
  inexigibilidade: 'Inexigibilidade',
  rdc: 'RDC',
}

const statusLabels = {
  prospectado: 'Prospectado',
  em_analise: 'Em Análise',
  documentacao: 'Documentação',
  proposta_enviada: 'Proposta Enviada',
  em_julgamento: 'Em Julgamento',
  homologado: 'Homologado',
  perdido: 'Perdido',
}

export function EditalDetailsModal({ edital, isOpen, onClose, onEdit }: EditalDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'history'>('details')

  if (!edital) return null

  const formatCurrency = (value: number | null) => {
    if (!value) return 'Não informado'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatDate = (date: string | null) => {
    if (!date) return 'Não definido'
    return new Date(date).toLocaleDateString('pt-BR')
  }

  const formatDateTime = (date: string | null) => {
    if (!date) return 'Não definido'
    return new Date(date).toLocaleString('pt-BR')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalhes do Edital" size="xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-lg p-6 border border-sky-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-sky-500 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{edital.numero_edital}</h3>
                <p className="text-sm text-gray-600">{modalidadeLabels[edital.modalidade]}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              {onEdit && (
                <Button size="sm" variant="secondary" onClick={() => onEdit(edital)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              )}
              <Button size="sm" variant="ghost">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-sky-300">
            <span className="text-sm font-medium text-sky-700">
              {statusLabels[edital.status]}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-6">
            {(['details', 'comments', 'history'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-sky-500 text-sky-600 font-medium'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'details' && 'Detalhes'}
                {tab === 'comments' && 'Comentários'}
                {tab === 'history' && 'Histórico'}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            {/* Informações Principais */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Building className="w-4 h-4 inline mr-2" />
                  Órgão/Entidade
                </label>
                <p className="text-gray-900">{edital.orgao_entidade}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <User className="w-4 h-4 inline mr-2" />
                  Responsável
                </label>
                <p className="text-gray-900">
                  {edital.responsavel?.full_name || 'Não atribuído'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Data de Publicação
                </label>
                <p className="text-gray-900">{formatDate(edital.data_publicacao)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Entrega de Propostas
                </label>
                <p className="text-gray-900">{formatDateTime(edital.data_entrega_propostas)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Valor Estimado
                </label>
                <p className="text-gray-900 text-lg font-semibold">
                  {formatCurrency(edital.valor_estimado)}
                </p>
              </div>
            </div>

            {/* Objeto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objeto da Licitação
              </label>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-900">{edital.objeto}</p>
              </div>
            </div>

            {/* Observações */}
            {edital.observacoes && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações
                </label>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-900">{edital.observacoes}</p>
                </div>
              </div>
            )}

            {/* Arquivo */}
            {edital.arquivo_nome && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Arquivo Anexado
                </label>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{edital.arquivo_nome}</span>
                  </div>
                  <Button size="sm" variant="ghost">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Abrir
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="space-y-4">
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum comentário ainda</p>
              <Button className="mt-4" size="sm">
                Adicionar Comentário
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <History className="w-4 h-4 text-sky-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 font-medium">Edital criado</p>
                  <p className="text-xs text-gray-500">{formatDateTime(edital.created_at)}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <History className="w-4 h-4 text-sky-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 font-medium">Última atualização</p>
                  <p className="text-xs text-gray-500">{formatDateTime(edital.updated_at)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
