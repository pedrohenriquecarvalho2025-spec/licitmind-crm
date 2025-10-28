/**
 * View principal do módulo de Editais
 * Orquestra os componentes e gerencia o estado da view
 * LOC: ~150 linhas
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Plus, FileText } from 'lucide-react'
import { PageHeader } from '../../../components/shared/organisms/PageHeader'
import { Button } from '../../../components/ui/atoms/Button'
import { SearchInput } from '../../../components/ui/molecules/SearchInput'
import { EmptyState } from '../../../components/shared/organisms/EmptyState'
import { Spinner } from '../../../components/ui/atoms/Spinner'
import { EditalStatsGrid } from '../components/EditalStatsGrid'
import { EditalCard } from '../components/EditalCard'
import { EditalForm, type EditalFormData } from '../components/EditalForm'
import { EditalDetailsModal } from '../components/EditalDetailsModal'
import { useOrganization, useAuth } from '../../../hooks'
import { editalsAPI } from '../editals.api'
import type { Edital, EditalStats } from '../types'

export function EditalsView() {
  const { organizationId } = useOrganization()
  const { user } = useAuth()
  const [editals, setEditals] = useState<Edital[]>([])
  const [stats, setStats] = useState<EditalStats>({
    totalValue: 0,
    activeCount: 0,
    wonCount: 0,
    totalCount: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [selectedEdital, setSelectedEdital] = useState<Edital | null>(null)

  useEffect(() => {
    loadData()
  }, [organizationId])

  const loadData = async () => {
    if (!organizationId) return

    try {
      setLoading(true)
      const [editalsData, statsData] = await Promise.all([
        editalsAPI.listEditals(organizationId),
        editalsAPI.getEditalStats(organizationId)
      ])
      
      setEditals(editalsData)
      setStats(statsData)
    } finally {
      setLoading(false)
    }
  }

  const filteredEditals = useMemo(() => 
    editals.filter(edital =>
      edital.numero_edital.toLowerCase().includes(searchTerm.toLowerCase()) ||
      edital.objeto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      edital.orgao_contratante.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [editals, searchTerm]
  )

  const handleCreateEdital = useCallback(() => {
    setSelectedEdital(null)
    setShowForm(true)
  }, [])

  const handleEditalClick = useCallback((edital: Edital) => {
    setSelectedEdital(edital)
    setShowDetails(true)
  }, [])

  const handleCloseForm = useCallback(() => {
    setShowForm(false)
    setSelectedEdital(null)
  }, [])

  const handleCloseDetails = useCallback(() => {
    setShowDetails(false)
    setSelectedEdital(null)
  }, [])

  const handleEditFromDetails = useCallback(() => {
    setShowDetails(false)
    setShowForm(true)
  }, [])

  const handleSubmitForm = async (data: EditalFormData) => {
    if (!organizationId || !user) return

    try {
      if (selectedEdital) {
        // Atualizar edital existente
        await editalsAPI.updateEdital(
          selectedEdital.id,
          {
            numero_edital: data.numero_edital,
            orgao_entidade: data.orgao_entidade,
            objeto: data.objeto,
            modalidade: data.modalidade as any,
            data_publicacao: data.data_publicacao,
            data_entrega_propostas: data.data_entrega_propostas,
            valor_estimado: data.valor_estimado,
            status: data.status as any,
            responsavel_id: data.responsavel_id,
            observacoes: data.observacoes,
            organization_id: organizationId,
          },
          data.arquivo,
          user.id
        )
      } else {
        // Criar novo edital
        await editalsAPI.createEdital(
          {
            numero_edital: data.numero_edital,
            orgao_entidade: data.orgao_entidade,
            objeto: data.objeto,
            modalidade: data.modalidade as any,
            data_publicacao: data.data_publicacao,
            data_entrega_propostas: data.data_entrega_propostas,
            valor_estimado: data.valor_estimado,
            status: data.status as any,
            responsavel_id: data.responsavel_id,
            observacoes: data.observacoes,
            organization_id: organizationId,
            created_by: user.id,
          },
          data.arquivo
        )
      }

      // Recarregar dados
      await loadData()
      handleCloseForm()
    } catch (error) {
      console.error('Error saving edital:', error)
      throw error
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <PageHeader
        title="Editais"
        description="Gestão de editais e licitações"
        actions={
          <Button onClick={handleCreateEdital}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Edital
          </Button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <EditalStatsGrid stats={stats} loading={loading} />

        {/* Search */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar por número, objeto ou órgão..."
          />
        </div>

        {/* Editals List */}
        {filteredEditals.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="Nenhum edital encontrado"
            description={
              searchTerm
                ? 'Tente ajustar os filtros de busca'
                : 'Comece cadastrando seu primeiro edital'
            }
            actionLabel={!searchTerm ? 'Novo Edital' : undefined}
            onAction={!searchTerm ? handleCreateEdital : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEditals.map(edital => (
              <EditalCard
                key={edital.id}
                edital={edital}
                onClick={() => handleEditalClick(edital)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <EditalForm
          edital={selectedEdital}
          onSubmit={handleSubmitForm}
          onCancel={handleCloseForm}
        />
      )}

      {/* Details Modal */}
      {showDetails && selectedEdital && (
        <EditalDetailsModal
          edital={selectedEdital}
          onClose={handleCloseDetails}
          onEdit={handleEditFromDetails}
          onUpdate={loadData}
        />
      )}
    </div>
  )
}

