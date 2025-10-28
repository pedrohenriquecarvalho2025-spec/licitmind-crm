/**
 * Widget de Simulador de Multas
 * Calcula multas de contratos em atraso
 */

import React, { useState, useEffect } from 'react'
import { AlertTriangle, Calculator, TrendingDown, DollarSign } from 'lucide-react'
import { Button } from '../../../components/ui/atoms/Button'
import { supabase } from '../../../lib/supabase'
import { useOrganization } from '../../../hooks/useOrganization'

interface ContractWithPenalty {
  id: string
  numero_contrato: string
  contratante: string
  valor_total: number
  data_fim_vigencia: string
  multa_tipo?: 'percentual' | 'valor_fixo' | 'diaria'
  multa_percentual?: number
  multa_valor_fixo?: number
  multa_diaria?: number
  status: string
}

export function PenaltySimulator() {
  const { organizationId } = useOrganization()
  const [contracts, setContracts] = useState<ContractWithPenalty[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (organizationId) {
      loadExpiredContracts()
    }
  }, [organizationId])

  const loadExpiredContracts = async () => {
    if (!organizationId) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('status', 'ativo')
        .lt('data_fim_vigencia', new Date().toISOString())
        .order('data_fim_vigencia', { ascending: true })
        .limit(10)

      if (error) throw error
      setContracts(data || [])
    } catch (error) {
      console.error('Error loading contracts:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculatePenalty = (contract: ContractWithPenalty): number => {
    if (!contract.data_fim_vigencia) return 0

    const today = new Date()
    const endDate = new Date(contract.data_fim_vigencia)
    const daysOverdue = Math.ceil((today.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24))

    if (daysOverdue <= 0) return 0

    let penalty = 0

    switch (contract.multa_tipo) {
      case 'percentual':
        penalty = (contract.valor_total * (contract.multa_percentual || 0)) / 100
        break
      
      case 'valor_fixo':
        penalty = contract.multa_valor_fixo || 0
        break
      
      case 'diaria':
        penalty = (contract.multa_diaria || 0) * daysOverdue
        break
      
      default:
        // Multa padrão de 1% ao dia sobre o valor total (limitada ao valor do contrato)
        penalty = Math.min(
          (contract.valor_total * 0.01 * daysOverdue),
          contract.valor_total
        )
    }

    return penalty
  }

  const getDaysOverdue = (contract: ContractWithPenalty): number => {
    if (!contract.data_fim_vigencia) return 0
    const today = new Date()
    const endDate = new Date(contract.data_fim_vigencia)
    return Math.ceil((today.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24))
  }

  const totalPenalties = contracts.reduce((sum, c) => sum + calculatePenalty(c), 0)

  if (loading) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"></div>
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl border border-red-200 dark:border-red-700 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-100 dark:bg-red-900/40 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-900 dark:text-red-100">
              Simulador de Multas
            </h3>
            <p className="text-sm text-red-700 dark:text-red-300">
              Contratos em atraso
            </p>
          </div>
        </div>
        <Button 
          size="sm" 
          variant="outline" 
          className="border-red-300 text-red-700 hover:bg-red-100"
          onClick={loadExpiredContracts}
        >
          <Calculator className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {contracts.length === 0 ? (
        <div className="text-center py-8">
          <TrendingDown className="w-12 h-12 text-green-500 mx-auto mb-3 opacity-50" />
          <p className="text-neutral-600 dark:text-neutral-400">
            Nenhum contrato em atraso no momento
          </p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
            Parabéns! Todos os contratos estão em dia.
          </p>
        </div>
      ) : (
        <>
          {/* Resumo Total */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 mb-4 border-2 border-red-300 dark:border-red-700">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-red-800 dark:text-red-200">
                Multas Totais Estimadas
              </span>
              <span className="text-2xl font-bold text-red-600 dark:text-red-400 flex items-center">
                <DollarSign className="w-5 h-5 mr-1" />
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(totalPenalties)}
              </span>
            </div>
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              {contracts.length} {contracts.length === 1 ? 'contrato' : 'contratos'} em atraso
            </p>
          </div>

          {/* Lista de Contratos */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {contracts.map((contract) => {
              const penalty = calculatePenalty(contract)
              const daysOverdue = getDaysOverdue(contract)

              return (
                <div
                  key={contract.id}
                  className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-red-200 dark:border-red-700 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-neutral-900 dark:text-white truncate">
                        {contract.numero_contrato}
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate">
                        {contract.contratante}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-xs font-medium rounded-full whitespace-nowrap ml-2">
                      {daysOverdue} {daysOverdue === 1 ? 'dia' : 'dias'} atraso
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-neutral-500 dark:text-neutral-400">
                        Valor: {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(contract.valor_total)}
                      </p>
                      <p className="text-xs text-red-600 dark:text-red-400">
                        Venceu: {new Date(contract.data_fim_vigencia).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">Multa estimada</p>
                      <p className="text-lg font-bold text-red-600 dark:text-red-400">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(penalty)}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-red-200 dark:border-red-700">
            <p className="text-xs text-red-700 dark:text-red-300 italic">
              ⚠️ Valores estimados. Multas reais podem variar conforme cláusulas contratuais.
            </p>
          </div>
        </>
      )}
    </div>
  )
}

