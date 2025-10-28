/**
 * Monitor de Validade de Documentos
 * Exibe alertas e estatísticas sobre documentos vencidos ou próximos do vencimento
 */

import React, { useState, useEffect, useMemo } from 'react'
import { AlertTriangle, CheckCircle, Clock, Calendar, FileText, TrendingUp, AlertCircle } from 'lucide-react'
import type { Database } from '../../../lib/database.types'

type Document = Database['public']['Tables']['documents']['Row']

interface ValidityMonitorProps {
  documents: Document[]
  onDocumentClick?: (document: Document) => void
}

interface ValidityStats {
  valid: number
  expiring: number
  expired: number
  total: number
  complianceRate: number
}

interface ExpiringGroup {
  label: string
  days: number
  documents: Document[]
  color: string
}

export function ValidityMonitor({ documents, onDocumentClick }: ValidityMonitorProps) {
  const [selectedView, setSelectedView] = useState<'overview' | 'expiring' | 'expired'>('overview')

  // Calcula estatísticas de validade
  const stats: ValidityStats = useMemo(() => {
    const valid = documents.filter(d => d.status === 'valid').length
    const expiring = documents.filter(d => d.status === 'expiring').length
    const expired = documents.filter(d => d.status === 'expired').length
    const total = documents.length

    return {
      valid,
      expiring,
      expired,
      total,
      complianceRate: total > 0 ? Math.round((valid / total) * 100) : 0
    }
  }, [documents])

  // Agrupa documentos por período de expiração
  const expiringGroups: ExpiringGroup[] = useMemo(() => {
    const now = new Date()
    const groups: ExpiringGroup[] = [
      { label: 'Vencidos', days: -1, documents: [], color: 'red' },
      { label: 'Próximos 7 dias', days: 7, documents: [], color: 'red' },
      { label: 'Próximos 15 dias', days: 15, documents: [], color: 'orange' },
      { label: 'Próximos 30 dias', days: 30, documents: [], color: 'yellow' },
      { label: 'Próximos 60 dias', days: 60, documents: [], color: 'blue' },
    ]

    documents
      .filter(d => d.expiry_date)
      .forEach(doc => {
        const expiryDate = new Date(doc.expiry_date!)
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

        if (daysUntilExpiry < 0) {
          groups[0].documents.push(doc)
        } else if (daysUntilExpiry <= 7) {
          groups[1].documents.push(doc)
        } else if (daysUntilExpiry <= 15) {
          groups[2].documents.push(doc)
        } else if (daysUntilExpiry <= 30) {
          groups[3].documents.push(doc)
        } else if (daysUntilExpiry <= 60) {
          groups[4].documents.push(doc)
        }
      })

    return groups.filter(g => g.documents.length > 0)
  }, [documents])

  // Documentos críticos (vencidos ou vencendo em 7 dias)
  const criticalDocuments = useMemo(() => {
    const now = new Date()
    return documents
      .filter(d => {
        if (!d.expiry_date) return false
        const expiryDate = new Date(d.expiry_date)
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        return daysUntilExpiry <= 7
      })
      .sort((a, b) => {
        const dateA = new Date(a.expiry_date!)
        const dateB = new Date(b.expiry_date!)
        return dateA.getTime() - dateB.getTime()
      })
  }, [documents])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const getDaysUntilExpiry = (expiryDate: string): number => {
    const now = new Date()
    const expiry = new Date(expiryDate)
    return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
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

  return (
    <div className="space-y-6">
      {/* Header com Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-brand p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8" />
            <span className="text-3xl font-bold">{stats.valid}</span>
          </div>
          <div className="text-green-50 text-sm">Documentos Válidos</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl shadow-brand p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8" />
            <span className="text-3xl font-bold">{stats.expiring}</span>
          </div>
          <div className="text-yellow-50 text-sm">A Vencer em Breve</div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-brand p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-8 h-8" />
            <span className="text-3xl font-bold">{stats.expired}</span>
          </div>
          <div className="text-red-50 text-sm">Documentos Vencidos</div>
        </div>

        <div className="bg-gradient-to-br from-primary-500 to-brand-cyan rounded-2xl shadow-brand p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8" />
            <span className="text-3xl font-bold">{stats.complianceRate}%</span>
          </div>
          <div className="text-primary-50 text-sm">Taxa de Conformidade</div>
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
            A Vencer ({stats.expiring})
          </button>
          <button
            onClick={() => setSelectedView('expired')}
            className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all ${
              selectedView === 'expired'
                ? 'bg-red-500 text-white shadow-lg'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            Vencidos ({stats.expired})
          </button>
        </div>
      </div>

      {/* Conteúdo por Visão */}
      {selectedView === 'overview' && (
        <div className="space-y-6">
          {/* Alertas Críticos */}
          {criticalDocuments.length > 0 && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-red-900">Atenção Urgente!</h3>
                  <p className="text-sm text-red-700">
                    {criticalDocuments.length} documento(s) requer(em) ação imediata
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {criticalDocuments.slice(0, 5).map(doc => {
                  const days = getDaysUntilExpiry(doc.expiry_date!)
                  return (
                    <div
                      key={doc.id}
                      onClick={() => onDocumentClick?.(doc)}
                      className="bg-white rounded-xl p-4 border border-red-200 hover:border-red-400 cursor-pointer transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-red-600" />
                          <div>
                            <div className="font-medium text-neutral-800">{doc.name}</div>
                            <div className="text-xs text-neutral-600">{doc.category}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-bold ${days < 0 ? 'text-red-600' : 'text-orange-600'}`}>
                            {days < 0 ? `Vencido há ${Math.abs(days)} dias` : `Vence em ${days} dias`}
                          </div>
                          <div className="text-xs text-neutral-500">{formatDate(doc.expiry_date!)}</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {criticalDocuments.length > 5 && (
                <button
                  onClick={() => setSelectedView('expiring')}
                  className="mt-4 w-full py-2 text-sm font-medium text-red-700 hover:text-red-800 transition-colors"
                >
                  Ver todos os {criticalDocuments.length} documentos críticos →
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
                      {group.documents.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {group.documents.slice(0, 3).map(doc => (
                      <div
                        key={doc.id}
                        onClick={() => onDocumentClick?.(doc)}
                        className="bg-white/60 backdrop-blur-sm rounded-lg p-3 hover:bg-white cursor-pointer transition-all text-sm"
                      >
                        <div className="font-medium text-neutral-800 truncate">{doc.name}</div>
                        <div className="text-xs text-neutral-600">
                          Vence: {formatDate(doc.expiry_date!)}
                        </div>
                      </div>
                    ))}
                    {group.documents.length > 3 && (
                      <div className="text-xs text-neutral-600 text-center pt-2">
                        +{group.documents.length - 3} documento(s)
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Visão: A Vencer */}
      {selectedView === 'expiring' && (
        <div className="bg-white rounded-2xl shadow-brand border border-neutral-200 p-6">
          <h3 className="text-xl font-bold text-neutral-800 mb-4">Documentos a Vencer</h3>
          {stats.expiring === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-neutral-600">Nenhum documento próximo do vencimento</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents
                .filter(d => d.status === 'expiring')
                .sort((a, b) => {
                  if (!a.expiry_date || !b.expiry_date) return 0
                  return new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime()
                })
                .map(doc => {
                  const days = doc.expiry_date ? getDaysUntilExpiry(doc.expiry_date) : null
                  return (
                    <div
                      key={doc.id}
                      onClick={() => onDocumentClick?.(doc)}
                      className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 hover:border-yellow-400 cursor-pointer transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <FileText className="w-5 h-5 text-yellow-600" />
                          <div className="flex-1">
                            <div className="font-medium text-neutral-800">{doc.name}</div>
                            <div className="text-sm text-neutral-600">{doc.category}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          {days !== null && (
                            <div className="text-sm font-bold text-yellow-700">
                              {days} {days === 1 ? 'dia' : 'dias'}
                            </div>
                          )}
                          {doc.expiry_date && (
                            <div className="text-xs text-neutral-500">{formatDate(doc.expiry_date)}</div>
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
          <h3 className="text-xl font-bold text-neutral-800 mb-4">Documentos Vencidos</h3>
          {stats.expired === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-neutral-600">Nenhum documento vencido! 🎉</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents
                .filter(d => d.status === 'expired')
                .sort((a, b) => {
                  if (!a.expiry_date || !b.expiry_date) return 0
                  return new Date(b.expiry_date).getTime() - new Date(a.expiry_date).getTime()
                })
                .map(doc => {
                  const days = doc.expiry_date ? Math.abs(getDaysUntilExpiry(doc.expiry_date)) : null
                  return (
                    <div
                      key={doc.id}
                      onClick={() => onDocumentClick?.(doc)}
                      className="bg-red-50 border border-red-200 rounded-xl p-4 hover:border-red-400 cursor-pointer transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                          <div className="flex-1">
                            <div className="font-medium text-neutral-800">{doc.name}</div>
                            <div className="text-sm text-neutral-600">{doc.category}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          {days !== null && (
                            <div className="text-sm font-bold text-red-700">
                              Há {days} {days === 1 ? 'dia' : 'dias'}
                            </div>
                          )}
                          {doc.expiry_date && (
                            <div className="text-xs text-neutral-500">{formatDate(doc.expiry_date)}</div>
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

