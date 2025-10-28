/**
 * Simulador de Multas Contratuais
 * Calcula multas baseado em diferentes cenários
 */

import React, { useState, useMemo } from 'react'
import { Calculator, AlertTriangle, DollarSign, Calendar, TrendingDown } from 'lucide-react'
import { Button } from '../../../components/ui/atoms/Button'
import { Input } from '../../../components/ui/atoms/Input'
import { Select } from '../../../components/ui/molecules/Select'
import type { Contract } from '../types'
import type { PenaltyType } from '../types/penalties'

interface PenaltySimulatorProps {
  contract: Contract
}

interface SimulationResult {
  penaltyType: PenaltyType
  daysOverdue: number
  percentualMulta: number
  valorFixoMulta: number
  valorCalculado: number
  valorTotal: number
  description: string
}

const penaltyTypeOptions = [
  { value: 'atraso', label: 'Atraso na Entrega' },
  { value: 'inadimplencia', label: 'Inadimplência' },
  { value: 'qualidade', label: 'Qualidade Inadequada' },
  { value: 'rescisao', label: 'Rescisão Antecipada' },
  { value: 'outros', label: 'Outros' }
]

export function PenaltySimulator({ contract }: PenaltySimulatorProps) {
  const [selectedType, setSelectedType] = useState<PenaltyType>('atraso')
  const [daysOverdue, setDaysOverdue] = useState(0)
  const [percentualMulta, setPercentualMulta] = useState(0.5)
  const [valorFixoMulta, setValorFixoMulta] = useState(0)
  const [showResults, setShowResults] = useState(false)

  const simulationResult: SimulationResult | null = useMemo(() => {
    if (!showResults) return null

    // Calcula multa percentual (por dia)
    const multaPercentual = (contract.valor_total * (percentualMulta / 100)) * daysOverdue

    // Calcula total
    const valorCalculado = multaPercentual + valorFixoMulta
    const valorTotal = valorCalculado

    let description = ''
    switch (selectedType) {
      case 'atraso':
        description = `Multa por ${daysOverdue} ${daysOverdue === 1 ? 'dia' : 'dias'} de atraso`
        break
      case 'inadimplencia':
        description = `Multa por inadimplência de ${daysOverdue} ${daysOverdue === 1 ? 'dia' : 'dias'}`
        break
      case 'qualidade':
        description = 'Multa por qualidade inadequada do serviço/produto'
        break
      case 'rescisao':
        description = 'Multa por rescisão antecipada do contrato'
        break
      case 'outros':
        description = 'Multa por outros motivos contratuais'
        break
    }

    return {
      penaltyType: selectedType,
      daysOverdue,
      percentualMulta,
      valorFixoMulta,
      valorCalculado: multaPercentual,
      valorTotal,
      description
    }
  }, [showResults, selectedType, daysOverdue, percentualMulta, valorFixoMulta, contract.valor_total])

  const handleSimulate = () => {
    setShowResults(true)
  }

  const handleReset = () => {
    setShowResults(false)
    setDaysOverdue(0)
    setPercentualMulta(0.5)
    setValorFixoMulta(0)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(value)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-orange-900">Simulador de Multas</h3>
            <p className="text-sm text-orange-700">Calcule multas baseado em cenários contratuais</p>
          </div>
        </div>

        {/* Info do Contrato */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-orange-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-neutral-600">Contrato:</span>
              <span className="ml-2 font-medium text-neutral-800">{contract.numero_contrato}</span>
            </div>
            <div>
              <span className="text-neutral-600">Valor Total:</span>
              <span className="ml-2 font-medium text-neutral-800">{formatCurrency(contract.valor_total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Parâmetros da Simulação */}
      <div className="bg-white rounded-2xl p-6 border border-neutral-200">
        <h4 className="font-bold text-neutral-800 mb-4">Parâmetros da Simulação</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Tipo de Infração
            </label>
            <Select
              value={selectedType}
              onChange={(value) => setSelectedType(value as PenaltyType)}
              options={penaltyTypeOptions}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Dias de Atraso/Mora</span>
            </label>
            <Input
              type="number"
              min="0"
              value={daysOverdue}
              onChange={(e) => setDaysOverdue(parseInt(e.target.value) || 0)}
              placeholder="0"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Percentual da Multa (% por dia)
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={percentualMulta}
              onChange={(e) => setPercentualMulta(parseFloat(e.target.value) || 0)}
              placeholder="0.5"
              className="w-full"
            />
            <p className="text-xs text-neutral-500 mt-1">
              Ex: 0,5% ao dia sobre o valor do contrato
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center space-x-1">
              <DollarSign className="w-4 h-4" />
              <span>Valor Fixo da Multa (R$)</span>
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={valorFixoMulta}
              onChange={(e) => setValorFixoMulta(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className="w-full"
            />
            <p className="text-xs text-neutral-500 mt-1">
              Valor adicional fixo (se houver)
            </p>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <Button onClick={handleSimulate} variant="primary" className="flex-1">
            <Calculator className="w-4 h-4 mr-2" />
            Calcular Multa
          </Button>
          {showResults && (
            <Button onClick={handleReset} variant="ghost">
              Limpar
            </Button>
          )}
        </div>
      </div>

      {/* Resultados */}
      {showResults && simulationResult && (
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-brand-lg">
          <div className="flex items-center space-x-3 mb-6">
            <AlertTriangle className="w-8 h-8" />
            <div>
              <h3 className="text-2xl font-bold">Resultado da Simulação</h3>
              <p className="text-red-100">{simulationResult.description}</p>
            </div>
          </div>

          {/* Breakdown do Cálculo */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/20">
              <span className="text-red-100">Valor Base do Contrato:</span>
              <span className="text-xl font-bold">{formatCurrency(contract.valor_total)}</span>
            </div>

            {simulationResult.percentualMulta > 0 && simulationResult.daysOverdue > 0 && (
              <>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-red-100">
                    Multa Percentual ({simulationResult.percentualMulta}% × {simulationResult.daysOverdue} dias):
                  </span>
                  <span className="font-medium">{formatCurrency(simulationResult.valorCalculado)}</span>
                </div>
              </>
            )}

            {simulationResult.valorFixoMulta > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-red-100">Multa Fixa:</span>
                <span className="font-medium">{formatCurrency(simulationResult.valorFixoMulta)}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t-2 border-white/40">
              <span className="text-xl font-bold">Total da Multa:</span>
              <span className="text-3xl font-bold">{formatCurrency(simulationResult.valorTotal)}</span>
            </div>
          </div>

          {/* Impacto */}
          <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingDown className="w-5 h-5" />
              <span className="font-bold">Impacto Financeiro</span>
            </div>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-red-100">Percentual sobre o Contrato:</span>
                <span className="font-medium">
                  {((simulationResult.valorTotal / contract.valor_total) * 100).toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-100">Valor Líquido Remanescente:</span>
                <span className="font-medium">
                  {formatCurrency(contract.valor_total - simulationResult.valorTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Alerta */}
          {simulationResult.valorTotal > contract.valor_total * 0.2 && (
            <div className="mt-4 bg-yellow-500/20 backdrop-blur-sm border border-yellow-400/30 rounded-xl p-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-200 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <span className="font-bold text-yellow-100">Atenção:</span>
                  <span className="text-yellow-200 ml-1">
                    A multa representa mais de 20% do valor do contrato. Considere renegociação ou medidas corretivas urgentes.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

