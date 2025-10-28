/**
 * View principal de Gestão de Entregas (AFs/Empenhos)
 */

import React, { useState, useEffect, useMemo } from 'react'
import { Plus, Package, Search, CheckCircle } from 'lucide-react'
import { Button } from '../../../components/ui/atoms/Button'
import { Input } from '../../../components/ui/atoms/Input'
import { ModalBase as Modal } from '../../../components/ui/molecules/ModalBase'
import { Select } from '../../../components/ui/molecules/Select'
import { Spinner } from '../../../components/ui/atoms/Spinner'
import { DeliveryForm, type DeliveryFormData } from '../components/DeliveryForm'
import { deliveriesAPI } from '../deliveries.api'
import { useAuth } from '../../../hooks/useAuth'
import { useOrganization } from '../../../hooks/useOrganization'
import type { Delivery, DeliveryStatus, DELIVERY_STATUS_LABELS, DELIVERY_STATUS_COLORS } from '../types'

export function DeliveriesView() {
  const { profile } = useAuth()
  const { organizationId } = useOrganization()
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [showForm, setShowForm] = useState(false)
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null)

  useEffect(() => {
    loadDeliveries()
  }, [organizationId, filterStatus])

  const loadDeliveries = async () => {
    if (!organizationId) return

    try {
      setLoading(true)
      const data = await deliveriesAPI.listDeliveries(organizationId, {
        status: filterStatus !== 'all' ? filterStatus as DeliveryStatus : undefined
      })
      setDeliveries(data)
    } catch (error) {
      console.error('Error loading deliveries:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDelivery = () => {
    setSelectedDelivery(null)
    setShowForm(true)
  }

  const handleEditDelivery = (delivery: Delivery) => {
    setSelectedDelivery(delivery)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setSelectedDelivery(null)
  }

  const handleSubmitForm = async (data: DeliveryFormData) => {
    if (!organizationId || !profile) return

    try {
      if (selectedDelivery) {
        await deliveriesAPI.updateDelivery(selectedDelivery.id, data, profile.id)
      } else {
        await deliveriesAPI.createDelivery(data, organizationId, profile.id)
      }

      await loadDeliveries()
      handleCloseForm()
    } catch (error) {
      console.error('Error submitting delivery:', error)
      throw error
    }
  }

  const handleMarkAsDelivered = async (id: string) => {
    if (!profile) return
    if (!confirm('Marcar esta entrega como realizada?')) return

    try {
      await deliveriesAPI.markAsDelivered(id, new Date().toISOString().split('T')[0], profile.id)
      await loadDeliveries()
    } catch (error) {
      console.error('Error marking as delivered:', error)
    }
  }

  const handleDeleteDelivery = async (id: string) => {
    if (!profile) return
    if (!confirm('Tem certeza que deseja excluir esta entrega?')) return

    try {
      await deliveriesAPI.deleteDelivery(id, profile.id)
      await loadDeliveries()
    } catch (error) {
      console.error('Error deleting delivery:', error)
    }
  }

  const getStatusClasses = (status: DeliveryStatus) => {
    const colors = DELIVERY_STATUS_COLORS[status]
    return `${colors.bg} ${colors.text} ${colors.border}`
  }

  const getStatusLabel = (status: DeliveryStatus) => {
    return DELIVERY_STATUS_LABELS[status] || status
  }

  const filteredDeliveries = useMemo(() => {
    return deliveries.filter(d => {
      const searchLower = searchTerm.toLowerCase()
      return (
        d.numero_af.toLowerCase().includes(searchLower) ||
        d.numero_empenho?.toLowerCase().includes(searchLower) ||
        d.descricao.toLowerCase().includes(searchLower)
      )
    })
  }, [deliveries, searchTerm])

  const stats = useMemo(() => {
    return {
      total: deliveries.length,
      pendente: deliveries.filter(d => d.status === 'pendente').length,
      em_andamento: deliveries.filter(d => d.status === 'em_andamento').length,
      entregue: deliveries.filter(d => d.status === 'entregue').length,
      atrasado: deliveries.filter(d => d.status === 'atrasado').length,
      totalValue: deliveries.reduce((sum, d) => sum + d.valor, 0),
      deliveredValue: deliveries.filter(d => d.status === 'entregue').reduce((sum, d) => sum + d.valor, 0)
    }
  }, [deliveries])

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
            <h1 className="text-3xl font-bold text-neutral-800">Gestão de Entregas</h1>
            <p className="text-neutral-600 mt-1">AFs, Empenhos e Notas de Empenho</p>
          </div>
          <Button onClick={handleCreateDelivery} variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Nova Entrega
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
            <div className="text-2xl font-bold text-green-800">{stats.entregue}</div>
            <div className="text-sm text-green-700">Entregues</div>
          </div>
          <div className="bg-red-50 rounded-2xl shadow-brand p-6 border border-red-200">
            <div className="text-2xl font-bold text-red-800">{stats.atrasado}</div>
            <div className="text-sm text-red-700">Atrasados</div>
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
              { value: 'parcialmente_entregue', label: 'Parcialmente Entregue' },
              { value: 'entregue', label: 'Entregue' },
              { value: 'atrasado', label: 'Atrasado' },
              { value: 'cancelado', label: 'Cancelado' }
            ]}
          />
        </div>
      </div>

      {/* Lista de Entregas */}
      {filteredDeliveries.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-brand border border-neutral-200 p-12 text-center">
          <Package className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-neutral-800 mb-2">Nenhuma entrega encontrada</h3>
          <p className="text-neutral-600 mb-4">
            {searchTerm ? 'Tente ajustar os filtros de busca' : 'Comece criando sua primeira entrega'}
          </p>
          {!searchTerm && (
            <Button onClick={handleCreateDelivery} variant="primary">
              <Plus className="w-4 h-4 mr-2" />
              Nova Entrega
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredDeliveries.map(delivery => (
            <div
              key={delivery.id}
              className="bg-white rounded-2xl shadow-brand border border-neutral-200 p-6 hover:shadow-brand-lg transition-all cursor-pointer"
              onClick={() => handleEditDelivery(delivery)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Package className="w-5 h-5 text-primary-500" />
                    <h3 className="font-bold text-neutral-800">{delivery.numero_af}</h3>
                    {delivery.numero_empenho && (
                      <span className="text-sm text-neutral-600">• {delivery.numero_empenho}</span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusClasses(delivery.status)}`}>
                      {getStatusLabel(delivery.status)}
                    </span>
                  </div>
                  <p className="text-neutral-600 mb-2">{delivery.descricao}</p>
                  <div className="flex items-center space-x-4 text-sm text-neutral-500">
                    <span>
                      Valor: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(delivery.valor)}
                    </span>
                    <span>
                      Prevista: {new Date(delivery.data_entrega_prevista).toLocaleDateString('pt-BR')}
                    </span>
                    {delivery.data_entrega_realizada && (
                      <span className="text-green-600">
                        Entregue: {new Date(delivery.data_entrega_realizada).toLocaleDateString('pt-BR')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  {delivery.status !== 'entregue' && delivery.status !== 'cancelado' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMarkAsDelivered(delivery.id)
                      }}
                      className="text-green-600 hover:bg-green-50"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Marcar como Entregue
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteDelivery(delivery.id)
                    }}
                    className="text-red-600 hover:bg-red-50"
                  >
                    Excluir
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Formulário */}
      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={selectedDelivery ? 'Editar Entrega' : 'Nova Entrega'}
        size="xl"
      >
        <DeliveryForm
          delivery={selectedDelivery}
          onSubmit={handleSubmitForm}
          onCancel={handleCloseForm}
        />
      </Modal>
    </div>
  )
}

