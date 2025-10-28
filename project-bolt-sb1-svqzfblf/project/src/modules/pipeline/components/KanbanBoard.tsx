/**
 * Componente Kanban Board com Drag-and-Drop
 * Implementa funcionalidade de arrastar e soltar entre colunas
 */

import React, { useState, DragEvent } from 'react'
import { MoreVertical, Plus, TrendingUp } from 'lucide-react'
import { Button } from '../../../components/ui/atoms/Button'
import { formatCurrency } from '../../../core/utils'
import type { Edital } from '../../editals/types'

interface KanbanColumn {
  id: string
  title: string
  color: string
  items: Edital[]
}

interface KanbanBoardProps {
  columns: KanbanColumn[]
  onMoveCard: (cardId: string, fromColumnId: string, toColumnId: string) => Promise<void>
  onCardClick: (card: Edital) => void
}

export function KanbanBoard({ columns: initialColumns, onMoveCard, onCardClick }: KanbanBoardProps) {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns)
  const [draggedCard, setDraggedCard] = useState<{
    card: Edital
    columnId: string
  } | null>(null)
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null)

  const handleDragStart = (e: DragEvent, card: Edital, columnId: string) => {
    setDraggedCard({ card, columnId })
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', e.currentTarget.innerHTML)
    
    // Adiciona uma classe ao elemento arrastado
    setTimeout(() => {
      (e.target as HTMLElement).style.opacity = '0.5'
    }, 0)
  }

  const handleDragEnd = (e: DragEvent) => {
    (e.target as HTMLElement).style.opacity = '1'
    setDraggedCard(null)
    setDragOverColumnId(null)
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragEnter = (columnId: string) => {
    setDragOverColumnId(columnId)
  }

  const handleDragLeave = () => {
    setDragOverColumnId(null)
  }

  const handleDrop = async (e: DragEvent, toColumnId: string) => {
    e.preventDefault()
    setDragOverColumnId(null)

    if (!draggedCard || draggedCard.columnId === toColumnId) return

    // Atualizar estado local imediatamente para feedback visual
    setColumns((prevColumns) => {
      const newColumns = prevColumns.map((col) => {
        if (col.id === draggedCard.columnId) {
          return {
            ...col,
            items: col.items.filter((item) => item.id !== draggedCard.card.id),
          }
        }
        if (col.id === toColumnId) {
          return {
            ...col,
            items: [...col.items, draggedCard.card],
          }
        }
        return col
      })
      return newColumns
    })

    // Chamar callback para persistir mudança
    try {
      await onMoveCard(draggedCard.card.id, draggedCard.columnId, toColumnId)
    } catch (error) {
      // Reverter em caso de erro
      setColumns(initialColumns)
      console.error('Error moving card:', error)
    }
  }

  const calculateColumnTotal = (items: Edital[]) => {
    return items.reduce((sum, item) => sum + (item.valor_estimado || 0), 0)
  }

  const getColumnColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-500',
      yellow: 'bg-yellow-500',
      purple: 'bg-purple-500',
      green: 'bg-green-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500',
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="flex space-x-4 overflow-x-auto pb-6">
      {columns.map((column) => (
        <div
          key={column.id}
          className="flex-shrink-0 w-80"
          onDragOver={handleDragOver}
          onDragEnter={() => handleDragEnter(column.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          {/* Column Header */}
          <div className="bg-white dark:bg-neutral-800 rounded-t-xl border border-neutral-200 dark:border-neutral-700 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getColumnColor(column.color)}`} />
                <h3 className="font-bold text-neutral-900 dark:text-white">{column.title}</h3>
                <span className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-700 rounded-full text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                  {column.items.length}
                </span>
              </div>
              <button className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            {/* Column Stats */}
            <div className="flex items-center space-x-2 text-sm">
              <TrendingUp className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
              <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                {formatCurrency(calculateColumnTotal(column.items))}
              </span>
            </div>
          </div>

          {/* Column Body */}
          <div
            className={`min-h-[500px] bg-neutral-50 dark:bg-neutral-900/30 border-x border-b border-neutral-200 dark:border-neutral-700 rounded-b-xl p-3 space-y-3 transition-colors ${
              dragOverColumnId === column.id
                ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700'
                : ''
            }`}
          >
            {column.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-neutral-400 dark:text-neutral-500">
                <p className="text-sm">Nenhum item</p>
              </div>
            ) : (
              column.items.map((card) => (
                <div
                  key={card.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, card, column.id)}
                  onDragEnd={handleDragEnd}
                  onClick={() => onCardClick(card)}
                  className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 cursor-move hover:shadow-lg transition-all hover:border-primary-300 dark:hover:border-primary-600 group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                      {card.numero_edital}
                    </span>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300">
                      <MoreVertical className="w-3 h-3" />
                    </button>
                  </div>

                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2 line-clamp-2">
                    {card.objeto}
                  </h4>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-1">
                    {card.orgao_entidade}
                  </p>

                  <div className="flex items-center justify-between">
                    {card.valor_estimado ? (
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(card.valor_estimado)}
                      </span>
                    ) : (
                      <span className="text-xs text-neutral-400">Valor não informado</span>
                    )}

                    {card.data_entrega_propostas && (
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        {new Date(card.data_entrega_propostas).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}

            {/* Add Card Button */}
            <button className="w-full py-3 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-500 dark:text-neutral-400 hover:border-primary-400 dark:hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Adicionar card</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

