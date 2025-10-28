/**
 * Monitor de Validade de Credenciais de Portais
 * Exibe alertas e estatísticas sobre acessos vencidos ou próximos do vencimento
 */

import React, { useState, useMemo } from 'react'
import { AlertTriangle, CheckCircle, Clock, Calendar, Globe, TrendingUp, AlertCircle, Key, Shield } from 'lucide-react'
import type { BiddingPortal } from '../types'

interface PortalValidityMonitorProps {
  portals: BiddingPortal[]
  onPortalClick?: (portal: BiddingPortal) => void
}

interface ValidityStats {
  ativo: number
  pendente_renovacao: number
  vencido: number
  inativo: number
  total: number
  complianceRate: number
}

interface ExpiringGroup {
  label: string
  days: number
  portals: BiddingPortal[]
  color: string
}

export function PortalValidityMonitor({ portals, onPortalClick }: PortalValidityMonitorProps) {
  const [selectedView, setSelectedView] = useState<'overview' | 'expiring' | 'expired'>('overview')

  // Calcula estatísticas de validade
  const stats: ValidityStats = useMemo(() => {
    const ativo = portals.filter(p => p.status === 'ativo').length
    const pendente_renovacao = portals.filter(p => p.status === 'pendente_renovacao').length
    const vencido = portals.filter(p => p.status === 'vencido').length
    const inativo = portals.filter(p => p.status === 'inativo').length
    const total = portals.length

    return {
      ativo,
      pendente_renovacao,
      vencido,
      inativo,
      total,
      complianceRate: total > 0 ? Math.round((ativo / total) * 100) : 0
    }
  }, [portals])

  // Agrupa portais por período de expiração
  const expiringGroups: ExpiringGroup[] = useMemo(() => {
    const now = new Date()
    const groups: ExpiringGroup[] = [
      { label: 'Vencidos', days: -1, portals: [], color: 'red' },
      { label: 'Próximos 7 dias', days: 7, portals: [], color: 'red' },
      { label: 'Próximos 15 dias', days: 15, portals: [], color: 'orange' },
      { label: 'Próximos 30 dias', days: 30, portals: [], color: 'yellow' },
      { label: 'Próximos 60 dias', days: 60, portals: [], color: 'blue' },
    ]

    portals
      .filter(p => p.data_validade_acesso)
      .forEach(portal => {
        const validadeDate = new Date(portal.data_validade_acesso!)
        const daysUntilExpiry = Math.ceil((validadeDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

        if (daysUntilExpiry < 0) {
          groups[0].portals.push(portal)
        } else if (daysUntilExpiry <= 7) {
          groups[1].portals.push(portal)
        } else if (daysUntilExpiry <= 15) {
          groups[2].portals.push(portal)
        } else if (daysUntilExpiry <= 30) {
          groups[3].portals.push(portal)
        } else if (daysUntilExpiry <= 60) {
          groups[4].portals.push(portal)
        }
      })

    return groups.filter(g => g.portals.length > 0)
  }, [portals])

  // Portais críticos (vencidos ou vencendo em 7 dias)
  const criticalPortals = useMemo(() => {
    const now = new Date()
    return portals
      .filter(p => {
        if (!p.data_validade_acesso) return false
        const validadeDate = new Date(p.data_validade_acesso)
        const daysUntilExpiry = Math.ceil((validadeDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        return daysUntilExpiry <= 7
      })
      .sort((a, b) => {
        const dateA = new Date(a.data_validade_acesso!)
        const dateB = new Date(b.data_validade_acesso!)
        return dateA.getTime() - dateB.getTime()
      })
  }, [portals])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const getDaysUntilExpiry = (validadeDate: string): number => {
    const now = new Date()
    const validade = new Date(validadeDate)
    return Math.ceil((validade.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  }

  const getGroupColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; text: string; border: string }> = {
      red: { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-200' },
      yellow: { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-200' },
      blue: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' }
    }
    return colorMap[color] || colorMap.yellow
  }

  const getPortalTypeLabel = (tipo: string | null) => {
    const labels: Record<string, string> = {
      federal: 'Federal',
      estadual: 'Estadual',
      municipal: 'Municipal',
      privado: 'Privado',
      outros: 'Outros'
    }
    return tipo ? labels[tipo] || tipo : 'N/A'
  }

  return (
    <div className="space-y-6">
      {/* Header com Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-brand p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8" />
            <span className="text-3xl font-bold">{stats.ativo}</span>
          </div>
          <div className="text-green-50 text-sm">Portais Ativos</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl shadow-brand p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8" />
            <span className="text-3xl font-bold">{stats.pendente_renovacao}</span>
          </div>
          <div className="text-yellow-50 text-sm">Pendente Renovação</div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-brand p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-8 h-8" />
            <span className="text-3xl font-bold">{stats.vencido}</span>
          </div>
          <div className="text-red-50 text-sm">Acessos Vencidos</div>
        </div>

        <div className="bg-gradient-to-br from-primary-500 to-brand-cyan rounded-2xl shadow-brand p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8" />
            <span className="text-3xl font-bold">{stats.complianceRate}%</span>
          </div>
          <div className="text-primary-50 text-sm">Taxa de Compliance</div>
        </div>
      </div>

      {/* Barra de Navegação */}
      <div className="bg-white rounded-2xl shadow-brand border border-neutral-200 p-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedView('overview')}
            className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all ${
              selectedView === 'overview'
                ? 'bg-primary-500 text-white shadow-lg'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setSelectedView('expiring')}
            className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all ${
              selectedView === 'expiring'
                ? 'bg-yellow-500 text-white shadow-lg'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            A Renovar ({stats.pendente_renovacao})
          </button>
          <button
            onClick={() => setSelectedView('expired')}
            className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all ${
              selectedView === 'expired'
                ? 'bg-red-500 text-white shadow-lg'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            Vencidos ({stats.vencido})
          </button>
        </div>
      </div>

      {/* Conteúdo por Visão */}
      {selectedView === 'overview' && (
        <div className="space-y-6">
          {/* Alertas Críticos */}
          {criticalPortals.length > 0 && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-red-900">Ação Urgente Necessária!</h3>
                  <p className="text-sm text-red-700">
                    {criticalPortals.length} portal(is) requer(em) renovação imediata
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {criticalPortals.slice(0, 5).map(portal => {
                  const days = getDaysUntilExpiry(portal.data_validade_acesso!)
                  return (
                    <div
                      key={portal.id}
                      onClick={() => onPortalClick?.(portal)}
                      className="bg-white rounded-xl p-4 border border-red-200 hover:border-red-400 cursor-pointer transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            {portal.certificado_digital ? (
                              <Shield className="w-5 h-5 text-red-600" />
                            ) : (
                              <Key className="w-5 h-5 text-red-600" />
                            )}
                            <Globe className="w-5 h-5 text-red-600" />
                          </div>
                          <div>
                            <div className="font-medium text-neutral-800">{portal.nome_portal}</div>
                            <div className="text-xs text-neutral-600">{getPortalTypeLabel(portal.tipo)}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-bold ${days < 0 ? 'text-red-600' : 'text-orange-600'}`}>
                            {days < 0 ? `Vencido há ${Math.abs(days)} dias` : `Vence em ${days} dias`}
                          </div>
                          <div className="text-xs text-neutral-500">{formatDate(portal.data_validade_acesso!)}</div>
                        </div>
                      </div>
                      {portal.certificado_digital && (
                        <div className="mt-2 text-xs text-red-700 flex items-center space-x-1">
                          <Shield className="w-3 h-3" />
                          <span>Certificado Digital</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {criticalPortals.length > 5 && (
                <button
                  onClick={() => setSelectedView('expiring')}
                  className="mt-4 w-full py-2 text-sm font-medium text-red-700 hover:text-red-800 transition-colors"
                >
                  Ver todos os {criticalPortals.length} portais críticos →
                </button>
              )}
            </div>
          )}

          {/* Grupos de Expiração */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {expiringGroups.map((group, index) => {
              const colorClasses = getGroupColorClasses(group.color)
              return (
                <div
                  key={index}
                  className={`${colorClasses.bg} border ${colorClasses.border} rounded-2xl p-6`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className={`w-5 h-5 ${colorClasses.text}`} />
                      <h3 className={`font-bold ${colorClasses.text}`}>{group.label}</h3>
                    </div>
                    <span className={`text-2xl font-bold ${colorClasses.text}`}>
                      {group.portals.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {group.portals.slice(0, 3).map(portal => (
                      <div
                        key={portal.id}
                        onClick={() => onPortalClick?.(portal)}
                        className="bg-white/60 backdrop-blur-sm rounded-lg p-3 hover:bg-white cursor-pointer transition-all text-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-neutral-800 truncate">{portal.nome_portal}</div>
                            <div className="text-xs text-neutral-600">
                              {getPortalTypeLabel(portal.tipo)}
                              {portal.certificado_digital && ' • Certificado Digital'}
                            </div>
                          </div>
                        </div>
                        {portal.data_validade_acesso && (
                          <div className="text-xs text-neutral-600 mt-1">
                            Vence: {formatDate(portal.data_validade_acesso)}
                          </div>
                        )}
                      </div>
                    ))}
                    {group.portals.length > 3 && (
                      <div className="text-xs text-neutral-600 text-center pt-2">
                        +{group.portals.length - 3} portal(is)
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Visão: A Renovar */}
      {selectedView === 'expiring' && (
        <div className="bg-white rounded-2xl shadow-brand border border-neutral-200 p-6">
          <h3 className="text-xl font-bold text-neutral-800 mb-4">Portais Pendentes de Renovação</h3>
          {stats.pendente_renovacao === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-neutral-600">Nenhum portal pendente de renovação</p>
            </div>
          ) : (
            <div className="space-y-3">
              {portals
                .filter(p => p.status === 'pendente_renovacao')
                .sort((a, b) => {
                  if (!a.data_validade_acesso || !b.data_validade_acesso) return 0
                  return new Date(a.data_validade_acesso).getTime() - new Date(b.data_validade_acesso).getTime()
                })
                .map(portal => {
                  const days = portal.data_validade_acesso ? getDaysUntilExpiry(portal.data_validade_acesso) : null
                  return (
                    <div
                      key={portal.id}
                      onClick={() => onPortalClick?.(portal)}
                      className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 hover:border-yellow-400 cursor-pointer transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="flex items-center space-x-1">
                            {portal.certificado_digital ? (
                              <Shield className="w-5 h-5 text-yellow-600" />
                            ) : (
                              <Key className="w-5 h-5 text-yellow-600" />
                            )}
                            <Globe className="w-5 h-5 text-yellow-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-neutral-800">{portal.nome_portal}</div>
                            <div className="text-sm text-neutral-600">
                              {getPortalTypeLabel(portal.tipo)}
                              {portal.usuario && ` • ${portal.usuario}`}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {days !== null && (
                            <div className="text-sm font-bold text-yellow-700">
                              {days} {days === 1 ? 'dia' : 'dias'}
                            </div>
                          )}
                          {portal.data_validade_acesso && (
                            <div className="text-xs text-neutral-500">{formatDate(portal.data_validade_acesso)}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </div>
      )}

      {/* Visão: Vencidos */}
      {selectedView === 'expired' && (
        <div className="bg-white rounded-2xl shadow-brand border border-neutral-200 p-6">
          <h3 className="text-xl font-bold text-neutral-800 mb-4">Portais com Acesso Vencido</h3>
          {stats.vencido === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-neutral-600">Nenhum portal com acesso vencido! 🎉</p>
            </div>
          ) : (
            <div className="space-y-3">
              {portals
                .filter(p => p.status === 'vencido')
                .sort((a, b) => {
                  if (!a.data_validade_acesso || !b.data_validade_acesso) return 0
                  return new Date(b.data_validade_acesso).getTime() - new Date(a.data_validade_acesso).getTime()
                })
                .map(portal => {
                  const days = portal.data_validade_acesso ? Math.abs(getDaysUntilExpiry(portal.data_validade_acesso)) : null
                  return (
                    <div
                      key={portal.id}
                      onClick={() => onPortalClick?.(portal)}
                      className="bg-red-50 border border-red-200 rounded-xl p-4 hover:border-red-400 cursor-pointer transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="flex items-center space-x-1">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                            {portal.certificado_digital && (
                              <Shield className="w-5 h-5 text-red-600" />
                            )}
                            <Globe className="w-5 h-5 text-red-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-neutral-800">{portal.nome_portal}</div>
                            <div className="text-sm text-neutral-600">
                              {getPortalTypeLabel(portal.tipo)}
                              {portal.usuario && ` • ${portal.usuario}`}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {days !== null && (
                            <div className="text-sm font-bold text-red-700">
                              Há {days} {days === 1 ? 'dia' : 'dias'}
                            </div>
                          )}
                          {portal.data_validade_acesso && (
                            <div className="text-xs text-neutral-500">{formatDate(portal.data_validade_acesso)}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

