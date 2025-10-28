/**
 * View completa de Protocolos Administrativos
 */

import React, { useState, useEffect, useMemo } from 'react'
import { FileText, Plus, Search, Edit, Trash, Clock } from 'lucide-react'
import { Button } from '../../../components/ui/atoms/Button'
import { Input } from '../../../components/ui/atoms/Input'
import { Select } from '../../../components/ui/molecules/Select'
import { ModalBase as Modal } from '../../../components/ui/molecules/ModalBase'
import { Spinner } from '../../../components/ui/atoms/Spinner'
import { ProtocolForm, type ProtocolFormData } from '../components/ProtocolForm'
import { protocolsAPI } from '../protocols.api'
import { useAuth } from '../../../hooks/useAuth'
import { useOrganization } from '../../../hooks/useOrganization'
import type { Protocol, ProtocolStatus, PROTOCOL_STATUS_LABELS, PROTOCOL_STATUS_COLORS } from '../types'

export function ProtocolsView() {
  const { profile } = useAuth()
  const { organizationId } = useOrganization()
  const [protocols, setProtocols] = useState<Protocol[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [showForm, setShowForm] = useState(false)
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null)

  useEffect(() => {
    loadProtocols()
  }, [organizationId, filterStatus])

  const loadProtocols = async () => {
    if (!organizationId) return

    try {
      setLoading(true)
      const data = await protocolsAPI.listProtocols(organizationId, {
        status: filterStatus !== 'all' ? filterStatus as ProtocolStatus : undefined
      })
      setProtocols(data)
    } catch (error) {
      console.error('Error loading protocols:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProtocol = () => {
    setSelectedProtocol(null)
    setShowForm(true)
  }

  const handleEditProtocol = (protocol: Protocol) => {
    setSelectedProtocol(protocol)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setSelectedProtocol(null)
  }

  const handleSubmitForm = async (data: ProtocolFormData) => {
    if (!organizationId || !profile) return

    try {
      if (selectedProtocol) {
        await protocolsAPI.updateProtocol(selectedProtocol.id, data, profile.id)
      } else {
        await protocolsAPI.createProtocol(data, organizationId, profile.id)
      }

      await loadProtocols()
      handleCloseForm()
    } catch (error) {
      console.error('Error submitting protocol:', error)
      throw error
    }
  }

  const handleDeleteProtocol = async (id: string) => {
    if (!profile) return
    if (!confirm('Tem certeza que deseja excluir este protocolo?')) return

    try {
      await protocolsAPI.deleteProtocol(id, profile.id)
      await loadProtocols()
    } catch (error) {
      console.error('Error deleting protocol:', error)
    }
  }

  const getStatusClasses = (status: ProtocolStatus) => {
    const colors = PROTOCOL_STATUS_COLORS[status]
    return `${colors.bg} ${colors.text} ${colors.border}`
  }

  const getStatusLabel = (status: ProtocolStatus) => {
    return PROTOCOL_STATUS_LABELS[status] || status
  }

  const filteredProtocols = useMemo(() => {
    return protocols.filter(p => {
      const searchLower = searchTerm.toLowerCase()
      return (
        p.numero_protocol.toLowerCase().includes(searchLower) ||
        p.assunto.toLowerCase().includes(searchLower) ||
        p.orgao_destinatario.toLowerCase().includes(searchLower)
      )
    })
  }, [protocols, searchTerm])

  const stats = useMemo(() => {
    return {
      total: protocols.length,
      aguardando: protocols.filter(p => p.status === 'aguardando_resposta').length,
      em_analise: protocols.filter(p => p.status === 'em_analise').length,
      deferido: protocols.filter(p => p.status === 'deferido').length,
      indeferido: protocols.filter(p => p.status === 'indeferido').length
    }
  }, [protocols])

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
            <h1 className="text-3xl font-bold text-neutral-800">Protocolos Administrativos</h1>
            <p className="text-neutral-600 mt-1">Gestão de protocolos, recursos e impugnações</p>
          </div>
          <Button onClick={handleCreateProtocol} variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Novo Protocolo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl shadow-brand p-6 border border-neutral-200">
            <div className="text-2xl font-bold text-neutral-800">{stats.total}</div>
            <div className="text-sm text-neutral-600">Total</div>
          </div>
          <div className="bg-yellow-50 rounded-2xl shadow-brand p-6 border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-800">{stats.aguardando}</div>
            <div className="text-sm text-yellow-700">Aguardando</div>
          </div>
          <div className="bg-blue-50 rounded-2xl shadow-brand p-6 border border-blue-200">
            <div className="text-2xl font-bold text-blue-800">{stats.em_analise}</div>
            <div className="text-sm text-blue-700">Em Análise</div>
          </div>
          <div className="bg-green-50 rounded-2xl shadow-brand p-6 border border-green-200">
            <div className="text-2xl font-bold text-green-800">{stats.deferido}</div>
            <div className="text-sm text-green-700">Deferidos</div>
          </div>
          <div className="bg-red-50 rounded-2xl shadow-brand p-6 border border-red-200">
            <div className="text-2xl font-bold text-red-800">{stats.indeferido}</div>
            <div className="text-sm text-red-700">Indeferidos</div>
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
              placeholder="Buscar por número, assunto ou órgão..."
              className="pl-10"
            />
          </div>
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            options={[
              { value: 'all', label: 'Todos os Status' },
              { value: 'aguardando_resposta', label: 'Aguardando Resposta' },
              { value: 'em_analise', label: 'Em Análise' },
              { value: 'deferido', label: 'Deferido' },
              { value: 'indeferido', label: 'Indeferido' },
              { value: 'parcialmente_deferido', label: 'Parcialmente Deferido' },
              { value: 'arquivado', label: 'Arquivado' }
            ]}
          />
        </div>
      </div>

      {/* Lista de Protocolos */}
      {filteredProtocols.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-brand border border-neutral-200 p-12 text-center">
          <FileText className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-neutral-800 mb-2">
            {searchTerm ? 'Nenhum protocolo encontrado' : 'Nenhum protocolo cadastrado'}
          </h3>
          <p className="text-neutral-600 mb-4">
            {searchTerm ? 'Tente ajustar os filtros de busca' : 'Comece criando seu primeiro protocolo administrativo'}
          </p>
          {!searchTerm && (
            <Button onClick={handleCreateProtocol} variant="primary">
              <Plus className="w-4 h-4 mr-2" />
              Novo Protocolo
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredProtocols.map(protocol => (
            <div
              key={protocol.id}
              className="bg-white rounded-2xl shadow-brand border border-neutral-200 p-6 hover:shadow-brand-lg transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <FileText className="w-5 h-5 text-primary-500" />
                    <h3 className="font-bold text-neutral-800">{protocol.numero_protocol}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusClasses(protocol.status)}`}>
                      {getStatusLabel(protocol.status)}
                    </span>
                  </div>
                  <h4 className="font-semibold text-neutral-700 mb-1">{protocol.assunto}</h4>
                  <p className="text-neutral-600 text-sm mb-2">Órgão: {protocol.orgao_destinatario}</p>
                  <div className="flex items-center space-x-4 text-sm text-neutral-500">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Protocolado: {new Date(protocol.data_protocolo).toLocaleDateString('pt-BR')}
                    </span>
                    {protocol.data_resposta_esperada && (
                      <span className="text-orange-600">
                        Resposta esperada: {new Date(protocol.data_resposta_esperada).toLocaleDateString('pt-BR')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditProtocol(protocol)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteProtocol(protocol.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash className="w-4 h-4 mr-1" />
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
        title={selectedProtocol ? 'Editar Protocolo' : 'Novo Protocolo'}
        size="xl"
      >
        <ProtocolForm
          protocol={selectedProtocol}
          onSubmit={handleSubmitForm}
          onCancel={handleCloseForm}
        />
      </Modal>
    </div>
  )
}

