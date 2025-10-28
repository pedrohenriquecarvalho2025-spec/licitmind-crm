/**
 * View principal do módulo de Pipeline
 * LOC: ~150 linhas
 */

import React, { useState, useEffect } from 'react'
import { PageHeader } from '../../../components/shared/organisms/PageHeader'
import { Spinner } from '../../../components/ui/atoms/Spinner'
import { KanbanBoard } from '../components/KanbanBoard'
import { useOrganization } from '../../../hooks'
import { editalsAPI } from '../../editals/editals.api'
import type { Edital } from '../../editals/types'

interface KanbanColumn {
  id: string
  title: string
  color: string
  items: Edital[]
}

export function PipelineView() {
  const { organizationId } = useOrganization()
  const [columns, setColumns] = useState<KanbanColumn[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEdital, setSelectedEdital] = useState<Edital | null>(null)

  useEffect(() => {
    loadData()
  }, [organizationId])

  const loadData = async () => {
    if (!organizationId) return

    try {
      setLoading(true)
      const editals = await editalsAPI.listEditals(organizationId)

      // Organizar editais por status em colunas
      const columnDefinitions = [
        { id: 'prospectado', title: 'Prospectado', color: 'blue', statuses: ['prospectado'] },
        {
          id: 'em_analise',
          title: 'Em Análise',
          color: 'yellow',
          statuses: ['em_analise'],
        },
        {
          id: 'documentacao',
          title: 'Documentação',
          color: 'purple',
          statuses: ['documentacao'],
        },
        {
          id: 'proposta_enviada',
          title: 'Proposta Enviada',
          color: 'orange',
          statuses: ['proposta_enviada'],
        },
        {
          id: 'em_julgamento',
          title: 'Em Julgamento',
          color: 'blue',
          statuses: ['em_julgamento'],
        },
        { id: 'homologado', title: 'Homologado', color: 'green', statuses: ['homologado'] },
      ]

      const organizedColumns = columnDefinitions.map((def) => ({
        id: def.id,
        title: def.title,
        color: def.color,
        items: editals.filter((edital) => def.statuses.includes(edital.status)),
      }))

      setColumns(organizedColumns)
    } finally {
      setLoading(false)
    }
  }

  const handleMoveCard = async (
    cardId: string,
    fromColumnId: string,
    toColumnId: string
  ) => {
    try {
      // Atualizar status do edital
      await editalsAPI.updateEdital(cardId, {
        status: toColumnId as any,
      })

      // Recarregar dados
      await loadData()
    } catch (error) {
      console.error('Error moving card:', error)
      throw error
    }
  }

  const handleCardClick = (card: Edital) => {
    setSelectedEdital(card)
    // TODO: Abrir modal de detalhes
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
      <PageHeader title="Pipeline" description="Gestão visual do funil de licitações" />

      <div className="p-6">
        <KanbanBoard
          columns={columns}
          onMoveCard={handleMoveCard}
          onCardClick={handleCardClick}
        />
      </div>
    </div>
  )
}
