/**
 * Widget de Alertas de Vencimento
 * Exibe documentos e credenciais próximos do vencimento
 */

import React, { useEffect, useState } from 'react'
import { AlertTriangle, FileText, Key, Calendar, Clock } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { useOrganization } from '../../../hooks/useOrganization'
import { Spinner } from '../../../components/ui/atoms/Spinner'

interface ExpirationItem {
  id: string
  type: 'document' | 'portal'
  name: string
  expirationDate: string
  daysUntilExpiration: number
  status: 'expired' | 'critical' | 'warning' | 'ok'
}

export function ExpirationAlerts() {
  const { organizationId } = useOrganization()
  const [items, setItems] = useState<ExpirationItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadExpirationItems()
  }, [organizationId])

  const loadExpirationItems = async () => {
    if (!organizationId) return

    try {
      setLoading(true)

      // Buscar documentos próximos do vencimento
      const { data: documents } = await supabase
        .from('documents')
        .select('id, name, expiration_date')
        .eq('organization_id', organizationId)
        .not('expiration_date', 'is', null)
        .gte('expiration_date', new Date().toISOString())
        .order('expiration_date', { ascending: true })
        .limit(5)

      // Buscar credenciais de portais próximas do vencimento
      const { data: portals } = await supabase
        .from('bidding_portals')
        .select('id, name, password_expiry_date')
        .eq('organization_id', organizationId)
        .not('password_expiry_date', 'is', null)
        .gte('password_expiry_date', new Date().toISOString())
        .order('password_expiry_date', { ascending: true })
        .limit(5)

      const now = new Date()
      const expirationItems: ExpirationItem[] = []

      // Processar documentos
      documents?.forEach((doc) => {
        const expirationDate = new Date(doc.expiration_date)
        const daysUntil = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

        let status: ExpirationItem['status'] = 'ok'
        if (daysUntil < 0) status = 'expired'
        else if (daysUntil <= 7) status = 'critical'
        else if (daysUntil <= 30) status = 'warning'

        expirationItems.push({
          id: doc.id,
          type: 'document',
          name: doc.name,
          expirationDate: doc.expiration_date,
          daysUntilExpiration: daysUntil,
          status,
        })
      })

      // Processar portais
      portals?.forEach((portal) => {
        const expirationDate = new Date(portal.password_expiry_date)
        const daysUntil = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

        let status: ExpirationItem['status'] = 'ok'
        if (daysUntil < 0) status = 'expired'
        else if (daysUntil <= 7) status = 'critical'
        else if (daysUntil <= 30) status = 'warning'

        expirationItems.push({
          id: portal.id,
          type: 'portal',
          name: portal.name,
          expirationDate: portal.password_expiry_date,
          daysUntilExpiration: daysUntil,
          status,
        })
      })

      // Ordenar por proximidade de vencimento
      expirationItems.sort((a, b) => a.daysUntilExpiration - b.daysUntilExpiration)
      setItems(expirationItems.slice(0, 10))
    } catch (error) {
      console.error('Error loading expiration items:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: ExpirationItem['status']) => {
    switch (status) {
      case 'expired':
        return 'bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300'
      case 'critical':
        return 'bg-orange-100 dark:bg-orange-900/20 border-orange-300 dark:border-orange-800 text-orange-700 dark:text-orange-300'
      case 'warning':
        return 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300'
      default:
        return 'bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-800 text-green-700 dark:text-green-300'
    }
  }

  const getStatusText = (item: ExpirationItem) => {
    if (item.daysUntilExpiration < 0) {
      return 'Vencido há ' + Math.abs(item.daysUntilExpiration) + ' dias'
    } else if (item.daysUntilExpiration === 0) {
      return 'Vence hoje!'
    } else if (item.daysUntilExpiration === 1) {
      return 'Vence amanhã'
    } else {
      return 'Vence em ' + item.daysUntilExpiration + ' dias'
    }
  }

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              Alertas de Vencimento
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Documentos e credenciais para renovar
            </p>
          </div>
        </div>
        {items.length > 0 && (
          <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-full text-sm font-semibold">
            {items.length}
          </span>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Spinner size="md" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">
            Nenhum item próximo do vencimento
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${getStatusColor(
                item.status
              )}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  {item.type === 'document' ? (
                    <FileText className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Key className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{item.name}</p>
                    <p className="text-sm opacity-80 mt-1">
                      {item.type === 'document' ? 'Documento' : 'Credencial de Portal'}
                    </p>
                  </div>
                </div>
                <div className="text-right ml-3 flex-shrink-0">
                  <div className="flex items-center space-x-1 font-bold text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{getStatusText(item)}</span>
                  </div>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(item.expirationDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

