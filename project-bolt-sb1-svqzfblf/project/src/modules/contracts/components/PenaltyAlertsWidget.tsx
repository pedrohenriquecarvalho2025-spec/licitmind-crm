/**
 * Widget de Alertas de Multas de Contratos
 * Monitora contratos próximos de vencimento e calcula multas potenciais
 */

import React, { useMemo } from 'react'
import { AlertTriangle, Clock, DollarSign } from 'lucide-react'
import type { Contract } from '../types'

interface PenaltyAlertsWidgetProps {
  contracts: Contract[]
}

interface ContractAlert {
  contract: Contract
  days_until_expiry: number
  status: 'warning' | 'danger' | 'ok'
  message: string
}

export function PenaltyAlertsWidget({ contracts }: PenaltyAlertsWidgetProps) {
  const alerts = useMemo(() => {
    const now = new Date()
    const contractAlerts: ContractAlert[] = []

    contracts
      .filter(c => c.status === 'ativo')
      .forEach(contract => {
        const endDate = new Date(contract.data_fim_vigencia)
        const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

        if (daysUntilExpiry < 0) {
          contractAlerts.push({
            contract,
            days_until_expiry: daysUntilExpiry,
            status: 'danger',
            message: `Contrato vencido há ${Math.abs(daysUntilExpiry)} dias`
          })
        } else if (daysUntilExpiry <= 30) {
          contractAlerts.push({
            contract,
            days_until_expiry: daysUntilExpiry,
            status: 'warning',
            message: `Vence em ${daysUntilExpiry} ${daysUntilExpiry === 1 ? 'dia' : 'dias'}`
          })
        }
      })

    return contractAlerts.sort((a, b) => a.days_until_expiry - b.days_until_expiry)
  }, [contracts])

  const stats = useMemo(() => {
    const danger = alerts.filter(a => a.status === 'danger').length
    const warning = alerts.filter(a => a.status === 'warning').length
    const totalValue = alerts.reduce((sum, a) => sum + a.contract.valor_total, 0)

    return { danger, warning, total: alerts.length, totalValue }
  }, [alerts])

  if (alerts.length === 0) {
    return (
      <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-green-900">Tudo em Dia!</h3>
            <p className="text-sm text-green-700">Nenhum contrato requer atenção no momento</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <div className="text-2xl font-bold text-red-800">{stats.danger}</div>
          <div className="text-sm text-red-700">Contratos Vencidos</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
          <div className="text-2xl font-bold text-yellow-800">{stats.warning}</div>
          <div className="text-sm text-yellow-700">Vencendo em Breve</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="text-2xl font-bold text-blue-800">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(stats.totalValue)}
          </div>
          <div className="text-sm text-blue-700">Valor em Risco</div>
        </div>
      </div>

      {/* Alertas */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        <h3 className="font-bold text-neutral-800 mb-4 flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          <span>Contratos Requerem Atenção</span>
        </h3>

        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`rounded-xl p-4 border-l-4 ${
                alert.status === 'danger'
                  ? 'bg-red-50 border-red-500'
                  : 'bg-yellow-50 border-yellow-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <AlertTriangle className={`w-4 h-4 ${
                      alert.status === 'danger' ? 'text-red-600' : 'text-yellow-600'
                    }`} />
                    <span className="font-medium text-neutral-800">
                      {alert.contract.numero_contrato}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-700 mb-2">{alert.contract.objeto}</p>
                  <div className="flex items-center space-x-4 text-xs text-neutral-600">
                    <span>Contratante: {alert.contract.contratante}</span>
                    <span className="flex items-center space-x-1">
                      <DollarSign className="w-3 h-3" />
                      <span>
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(alert.contract.valor_total)}
                      </span>
                    </span>
                  </div>
                </div>
                <div className={`text-right ${
                  alert.status === 'danger' ? 'text-red-700' : 'text-yellow-700'
                }`}>
                  <div className="text-sm font-bold">{alert.message}</div>
                  <div className="text-xs">
                    {new Date(alert.contract.data_fim_vigencia).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

