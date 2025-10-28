/**
 * Interface de Comparação de Cotações
 * Compara múltiplos fornecedores lado a lado
 */

import React, { useState, useMemo } from 'react'
import { Check, X, TrendingDown, Award, DollarSign, Clock, Star } from 'lucide-react'
import { Button } from '../../../components/ui/atoms/Button'
import type { Quotation } from '../types'

interface QuotationComparisonProps {
  quotations: Quotation[]
  onSelectWinner?: (quotationId: string) => void
  onClose?: () => void
}

interface ComparisonItem {
  id: string
  supplier: string
  value: number
  delivery_days: number
  payment_terms?: string
  warranty_months?: number
  score: number
}

export function QuotationComparison({ quotations, onSelectWinner, onClose }: QuotationComparisonProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // Transforma cotações em itens de comparação
  const comparisonItems: ComparisonItem[] = useMemo(() => {
    return quotations.map(q => {
      let score = 0
      
      // Calcula score baseado em critérios
      const minValue = Math.min(...quotations.map(qt => qt.valor_total || 0))
      const minDelivery = Math.min(...quotations.map(qt => qt.prazo_entrega_dias || 0))
      
      // Menor preço = maior score (até 50 pontos)
      if (q.valor_total === minValue) score += 50
      else if (q.valor_total) {
        const diff = ((q.valor_total - minValue) / minValue) * 100
        score += Math.max(0, 50 - diff)
      }
      
      // Menor prazo = maior score (até 30 pontos)
      if (q.prazo_entrega_dias === minDelivery) score += 30
      else if (q.prazo_entrega_dias) {
        const diff = ((q.prazo_entrega_dias - minDelivery) / minDelivery) * 100
        score += Math.max(0, 30 - diff)
      }
      
      // Garantia (até 20 pontos)
      if (q.garantia_meses) {
        score += Math.min(20, q.garantia_meses * 2)
      }
      
      return {
        id: q.id,
        supplier: q.fornecedor_nome || 'Fornecedor',
        value: q.valor_total || 0,
        delivery_days: q.prazo_entrega_dias || 0,
        payment_terms: q.condicoes_pagamento,
        warranty_months: q.garantia_meses,
        score: Math.round(score)
      }
    })
      .sort((a, b) => b.score - a.score) // Ordena por score
  }, [quotations])

  const bestPrice = useMemo(() => 
    Math.min(...comparisonItems.map(i => i.value)), 
    [comparisonItems]
  )

  const bestDelivery = useMemo(() => 
    Math.min(...comparisonItems.map(i => i.delivery_days).filter(d => d > 0)), 
    [comparisonItems]
  )

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const handleSelectWinner = () => {
    if (selectedId && onSelectWinner) {
      onSelectWinner(selectedId)
    }
  }

  if (comparisonItems.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-brand p-8 text-center">
        <p className="text-neutral-600">Nenhuma cotação para comparar</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Comparação de Cotações</h2>
          <p className="text-neutral-600 mt-1">
            Compare {comparisonItems.length} fornecedor(es) lado a lado
          </p>
        </div>
        {onClose && (
          <Button variant="ghost" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {comparisonItems.map((item, index) => {
          const isSelected = selectedId === item.id
          const isBestValue = item.value === bestPrice
          const isBestDelivery = item.delivery_days === bestDelivery
          const isWinner = index === 0

          return (
            <div
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className={`relative bg-white rounded-2xl border-2 p-6 cursor-pointer transition-all hover:shadow-lg ${
                isSelected 
                  ? 'border-primary-500 shadow-lg' 
                  : isWinner
                  ? 'border-green-500'
                  : 'border-neutral-200 hover:border-primary-300'
              }`}
            >
              {/* Winner Badge */}
              {isWinner && (
                <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
              )}

              {/* Score */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Star className={`w-5 h-5 ${isWinner ? 'text-yellow-500 fill-yellow-500' : 'text-neutral-300'}`} />
                  <span className="text-sm font-semibold text-neutral-600">
                    Score: {item.score}/100
                  </span>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              {/* Supplier */}
              <h3 className="text-xl font-bold text-neutral-900 mb-6">
                {item.supplier}
              </h3>

              {/* Metrics */}
              <div className="space-y-4">
                {/* Valor */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-neutral-500" />
                      <span className="text-sm text-neutral-600">Valor Total</span>
                    </div>
                    {isBestValue && (
                      <div className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center space-x-1">
                        <TrendingDown className="w-3 h-3" />
                        <span>Melhor</span>
                      </div>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-neutral-900">
                    {formatCurrency(item.value)}
                  </div>
                  {!isBestValue && bestPrice > 0 && (
                    <div className="text-xs text-red-600 mt-1">
                      +{formatCurrency(item.value - bestPrice)} vs melhor
                    </div>
                  )}
                </div>

                {/* Prazo de Entrega */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-neutral-500" />
                      <span className="text-sm text-neutral-600">Prazo</span>
                    </div>
                    {isBestDelivery && (
                      <div className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center space-x-1">
                        <TrendingDown className="w-3 h-3" />
                        <span>Mais rápido</span>
                      </div>
                    )}
                  </div>
                  <div className="text-lg font-bold text-neutral-700">
                    {item.delivery_days} {item.delivery_days === 1 ? 'dia' : 'dias'}
                  </div>
                </div>

                {/* Condições de Pagamento */}
                {item.payment_terms && (
                  <div className="bg-neutral-50 rounded-lg p-3">
                    <div className="text-xs text-neutral-600 mb-1">Pagamento</div>
                    <div className="text-sm font-medium text-neutral-800">
                      {item.payment_terms}
                    </div>
                  </div>
                )}

                {/* Garantia */}
                {item.warranty_months && (
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-xs text-blue-600 mb-1">Garantia</div>
                    <div className="text-sm font-bold text-blue-800">
                      {item.warranty_months} {item.warranty_months === 1 ? 'mês' : 'meses'}
                    </div>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      isWinner ? 'bg-green-500' : 'bg-primary-500'
                    }`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Actions */}
      {onSelectWinner && (
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-neutral-200">
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          )}
          <Button
            onClick={handleSelectWinner}
            disabled={!selectedId}
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="w-5 h-5 mr-2" />
            Selecionar Vencedor
          </Button>
        </div>
      )}

      {/* Legend */}
      <div className="bg-neutral-100 rounded-xl p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-neutral-700">Critérios de Avaliação:</span>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-neutral-700">Menor Preço (50pts)</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-neutral-700">Menor Prazo (30pts)</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-600" />
              <span className="text-neutral-700">Garantia (20pts)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

