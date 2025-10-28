/**
 * View principal de Cotações com CRUD completo
 */

import React, { useState, useEffect } from 'react'
import { Plus, FileText, Search } from 'lucide-react'
import { Button } from '../../../components/ui/atoms/Button'
import { Input } from '../../../components/ui/atoms/Input'
import { ModalBase as Modal } from '../../../components/ui/molecules/ModalBase'
import { Select } from '../../../components/ui/molecules/Select'
import { Spinner } from '../../../components/ui/atoms/Spinner'
import { QuotationForm, type QuotationFormData } from '../components/QuotationForm'
import { quotationsAPI } from '../quotations.api'
import { useAuth } from '../../../hooks/useAuth'
import { useOrganization } from '../../../hooks/useOrganization'
import type { Quotation, QuotationStatus, QUOTATION_STATUS_LABELS, QUOTATION_STATUS_COLORS } from '../types'

export function QuotationsView() {
  const { profile } = useAuth()
  const { organizationId } = useOrganization()
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [showForm, setShowForm] = useState(false)
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null)

  useEffect(() => {
    loadQuotations()
  }, [organizationId, filterStatus])

  const loadQuotations = async () => {
    if (!organizationId) return

    try {
      setLoading(true)
      const data = await quotationsAPI.listQuotations(organizationId, {
        status: filterStatus !== 'all' ? filterStatus as QuotationStatus : undefined
      })
      setQuotations(data)
    } catch (error) {
      console.error('Error loading quotations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateQuotation = () => {
    setSelectedQuotation(null)
    setShowForm(true)
  }

  const handleEditQuotation = (quotation: Quotation) => {
    setSelectedQuotation(quotation)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setSelectedQuotation(null)
  }

  const handleSubmitForm = async (data: QuotationFormData) => {
    if (!organizationId || !profile) return

    try {
      if (selectedQuotation) {
        await quotationsAPI.updateQuotation(selectedQuotation.id, data, profile.id)
      } else {
        await quotationsAPI.createQuotation(data, organizationId, profile.id)
      }

      await loadQuotations()
      handleCloseForm()
    } catch (error) {
      console.error('Error submitting quotation:', error)
      throw error
    }
  }

  const handleDeleteQuotation = async (id: string) => {
    if (!profile) return
    if (!confirm('Tem certeza que deseja excluir esta cotação?')) return

    try {
      await quotationsAPI.deleteQuotation(id, profile.id)
      await loadQuotations()
    } catch (error) {
      console.error('Error deleting quotation:', error)
    }
  }

  const getStatusColor = (status: QuotationStatus) => {
    const colorMap: Record<QuotationStatus, string> = {
      pendente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      em_andamento: 'bg-blue-100 text-blue-800 border-blue-200',
      recebida: 'bg-purple-100 text-purple-800 border-purple-200',
      aprovada: 'bg-green-100 text-green-800 border-green-200',
      rejeitada: 'bg-red-100 text-red-800 border-red-200',
      cancelada: 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return colorMap[status] || 'bg-neutral-100 text-neutral-800 border-neutral-200'
  }

  const getStatusLabel = (status: QuotationStatus) => {
    const labels: Record<QuotationStatus, string> = {
      pendente: 'Pendente',
      em_andamento: 'Em Andamento',
      recebida: 'Recebida',
      aprovada: 'Aprovada',
      rejeitada: 'Rejeitada',
      cancelada: 'Cancelada'
    }
    return labels[status] || status
  }

  const filteredQuotations = quotations.filter(q => {
    const searchLower = searchTerm.toLowerCase()
    return (
      q.numero_cotacao.toLowerCase().includes(searchLower) ||
      q.descricao?.toLowerCase().includes(searchLower)
    )
  })

  const stats = {
    total: quotations.length,
    pendente: quotations.filter(q => q.status === 'pendente').length,
    em_andamento: quotations.filter(q => q.status === 'em_andamento').length,
    aprovada: quotations.filter(q => q.status === 'aprovada').length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-800">Cotações</h1>
            <p className="text-neutral-600 mt-1">Gerenciamento de cotações de preços</p>
          </div>
          <Button onClick={handleCreateQuotation} variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Nova Cotação
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow-brand p-6 border border-neutral-200">
            <div className="text-2xl font-bold text-neutral-800">{stats.total}</div>
            <div className="text-sm text-neutral-600">Total</div>
          </div>
          <div className="bg-yellow-50 rounded-2xl shadow-brand p-6 border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-800">{stats.pendente}</div>
            <div className="text-sm text-yellow-700">Pendentes</div>
          </div>
          <div className="bg-blue-50 rounded-2xl shadow-brand p-6 border border-blue-200">
            <div className="text-2xl font-bold text-blue-800">{stats.em_andamento}</div>
            <div className="text-sm text-blue-700">Em Andamento</div>
          </div>
          <div className="bg-green-50 rounded-2xl shadow-brand p-6 border border-green-200">
            <div className="text-2xl font-bold text-green-800">{stats.aprovada}</div>
            <div className="text-sm text-green-700">Aprovadas</div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl shadow-brand border border-neutral-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por número ou descrição..."
              className="pl-10"
            />
          </div>
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            options={[
              { value: 'all', label: 'Todos os Status' },
              { value: 'pendente', label: 'Pendente' },
              { value: 'em_andamento', label: 'Em Andamento' },
              { value: 'recebida', label: 'Recebida' },
              { value: 'aprovada', label: 'Aprovada' },
              { value: 'rejeitada', label: 'Rejeitada' },
              { value: 'cancelada', label: 'Cancelada' }
            ]}
          />
        </div>
      </div>

      {/* Lista de Cotações */}
      {filteredQuotations.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-brand border border-neutral-200 p-12 text-center">
          <FileText className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-neutral-800 mb-2">Nenhuma cotação encontrada</h3>
          <p className="text-neutral-600 mb-4">
            {searchTerm ? 'Tente ajustar os filtros de busca' : 'Comece criando sua primeira cotação'}
          </p>
          {!searchTerm && (
            <Button onClick={handleCreateQuotation} variant="primary">
              <Plus className="w-4 h-4 mr-2" />
              Nova Cotação
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredQuotations.map(quotation => (
            <div
              key={quotation.id}
              className="bg-white rounded-2xl shadow-brand border border-neutral-200 p-6 hover:shadow-brand-lg transition-all cursor-pointer"
              onClick={() => handleEditQuotation(quotation)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <FileText className="w-5 h-5 text-primary-500" />
                    <h3 className="font-bold text-neutral-800">{quotation.numero_cotacao}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(quotation.status)}`}>
                      {getStatusLabel(quotation.status)}
                    </span>
                  </div>
                  {quotation.descricao && (
                    <p className="text-neutral-600 mb-2">{quotation.descricao}</p>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-neutral-500">
                    <span>Solicitação: {new Date(quotation.data_solicitacao).toLocaleDateString('pt-BR')}</span>
                    {quotation.data_limite_resposta && (
                      <span>Limite: {new Date(quotation.data_limite_resposta).toLocaleDateString('pt-BR')}</span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteQuotation(quotation.id)
                  }}
                  className="text-red-600 hover:bg-red-50"
                >
                  Excluir
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Formulário */}
      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={selectedQuotation ? 'Editar Cotação' : 'Nova Cotação'}
        size="xl"
      >
        <QuotationForm
          quotation={selectedQuotation}
          onSubmit={handleSubmitForm}
          onCancel={handleCloseForm}
        />
      </Modal>
    </div>
  )
}

