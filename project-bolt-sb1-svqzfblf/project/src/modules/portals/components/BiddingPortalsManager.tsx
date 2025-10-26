import React, { useState, useEffect } from 'react'
import { Globe, Plus, Search, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/atoms/Button'
import { Input } from '../ui/atoms/Input'
import { Spinner as LoadingSpinner } from '../ui/atoms/Spinner'
import { PortalForm } from './PortalForm'

interface BiddingPortal {
  id: string
  nome_portal: string
  url: string | null
  tipo: string | null
  usuario: string | null
  data_cadastro: string | null
  data_ultima_atualizacao: string | null
  data_validade_acesso: string | null
  status: 'ativo' | 'vencido' | 'pendente_renovacao' | 'inativo'
  observacoes: string | null
}

export function BiddingPortalsManager() {
  const [portals, setPortals] = useState<BiddingPortal[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedPortal, setSelectedPortal] = useState<BiddingPortal | null>(null)
  const { profile } = useAuth()

  useEffect(() => {
    loadPortals()
  }, [profile])

  const loadPortals = async () => {
    if (!profile?.organization_id) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('bidding_portals')
        .select('*')
        .eq('organization_id', profile.organization_id)
        .order('nome_portal')

      if (error) throw error
      setPortals(data || [])
    } catch (error) {
      console.error('Error loading portals:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ativo':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'vencido':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'pendente_renovacao':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'inativo':
        return <Clock className="w-5 h-5 text-gray-400" />
      default:
        return null
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      ativo: 'Ativo',
      vencido: 'Vencido',
      pendente_renovacao: 'Pendente Renovação',
      inativo: 'Inativo'
    }
    return labels[status] || status
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ativo: 'bg-green-50 border-green-200',
      vencido: 'bg-red-50 border-red-200',
      pendente_renovacao: 'bg-yellow-50 border-yellow-200',
      inativo: 'bg-gray-50 border-gray-200'
    }
    return colors[status] || 'bg-gray-50 border-gray-200'
  }

  const getDaysUntilExpiry = (dataValidade: string | null) => {
    if (!dataValidade) return null
    const today = new Date()
    const expiry = new Date(dataValidade)
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const filteredPortals = portals.filter(portal =>
    portal.nome_portal.toLowerCase().includes(searchTerm.toLowerCase()) ||
    portal.tipo?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-neutral-800">Portais de Licitação</h2>
            <p className="text-sm text-neutral-600">{portals.length} portais cadastrados</p>
          </div>
        </div>
        <Button onClick={() => { setSelectedPortal(null); setShowForm(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Portal
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Buscar portais..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Ativos</p>
              <p className="text-2xl font-bold text-green-700">
                {portals.filter(p => p.status === 'ativo').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">Pendente Renovação</p>
              <p className="text-2xl font-bold text-yellow-700">
                {portals.filter(p => p.status === 'pendente_renovacao').length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Vencidos</p>
              <p className="text-2xl font-bold text-red-700">
                {portals.filter(p => p.status === 'vencido').length}
              </p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Inativos</p>
              <p className="text-2xl font-bold text-gray-700">
                {portals.filter(p => p.status === 'inativo').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Portals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPortals.map((portal) => {
          const daysUntilExpiry = getDaysUntilExpiry(portal.data_validade_acesso)
          
          return (
            <div
              key={portal.id}
              className={`rounded-xl border-2 p-6 hover:shadow-lg transition-shadow ${getStatusColor(portal.status)}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-neutral-800 mb-1">{portal.nome_portal}</h3>
                  {portal.tipo && (
                    <span className="inline-block px-2 py-1 bg-white rounded text-xs font-medium text-neutral-600 capitalize">
                      {portal.tipo}
                    </span>
                  )}
                </div>
                {getStatusIcon(portal.status)}
              </div>

              <div className="space-y-2 mb-4">
                {portal.usuario && (
                  <div className="text-sm">
                    <span className="text-neutral-500">Usuário:</span>
                    <span className="ml-2 font-medium text-neutral-700">{portal.usuario}</span>
                  </div>
                )}
                {portal.data_validade_acesso && (
                  <div className="text-sm">
                    <span className="text-neutral-500">Validade:</span>
                    <span className="ml-2 font-medium text-neutral-700">
                      {new Date(portal.data_validade_acesso).toLocaleDateString('pt-BR')}
                    </span>
                    {daysUntilExpiry !== null && (
                      <span className={`ml-2 text-xs ${
                        daysUntilExpiry < 0 ? 'text-red-600' :
                        daysUntilExpiry < 30 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        ({daysUntilExpiry < 0 ? 'Vencido' : `${daysUntilExpiry} dias`})
                      </span>
                    )}
                  </div>
                )}
                {portal.data_ultima_atualizacao && (
                  <div className="text-sm">
                    <span className="text-neutral-500">Última atualização:</span>
                    <span className="ml-2 font-medium text-neutral-700">
                      {new Date(portal.data_ultima_atualizacao).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex space-x-2 pt-4 border-t border-neutral-200">
                {portal.url && (
                  <a
                    href={portal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center px-3 py-2 bg-white hover:bg-neutral-50 rounded-lg transition-colors text-sm font-medium text-brand-cyan"
                  >
                    Acessar
                  </a>
                )}
                <button
                  onClick={() => { setSelectedPortal(portal); setShowForm(true); }}
                  className="flex-1 px-3 py-2 bg-white hover:bg-neutral-50 rounded-lg transition-colors text-sm font-medium"
                >
                  Editar
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {filteredPortals.length === 0 && (
        <div className="text-center py-12">
          <Globe className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-500">Nenhum portal encontrado</p>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <PortalForm
          portal={selectedPortal}
          onClose={() => { setShowForm(false); setSelectedPortal(null); }}
          onSuccess={() => { setShowForm(false); setSelectedPortal(null); loadPortals(); }}
        />
      )}
    </div>
  )
}
