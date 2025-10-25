import React, { useEffect, useState, useMemo } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { Spinner as LoadingSpinner } from '../ui/atoms/Spinner'
import { PipelineColumn } from './PipelineColumn'
import { Input } from '../ui/atoms/Input'
import { Select } from '../ui/molecules/Select'
import { EditalDetailsModal } from '../editals/EditalDetailsModal'
import { EditalForm } from '../editals/EditalForm'
import { Search, Filter, X, TrendingUp, DollarSign, Clock } from 'lucide-react'
import type { Database } from '../../lib/database.types'

type Edital = Database['public']['Tables']['editals']['Row'] & {
  responsavel: { full_name: string } | null
}

type Pipeline = Database['public']['Tables']['pipelines']['Row']
type PipelineStage = Database['public']['Tables']['pipeline_stages']['Row']

interface PipelineViewProps {
  pipeline: Pipeline
  stages: PipelineStage[]
  onStageUpdate: () => void
}

export function PipelineView({ pipeline, stages, onStageUpdate }: PipelineViewProps) {
  const { profile } = useAuth()
  const [editals, setEditals] = useState<Edital[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterModalidade, setFilterModalidade] = useState<string>('all')
  const [filterResponsavel, setFilterResponsavel] = useState<string>('all')
  const [responsaveis, setResponsaveis] = useState<Array<{ id: string; full_name: string }>>([])
  const [showFilters, setShowFilters] = useState(false)
  const [selectedEdital, setSelectedEdital] = useState<Edital | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    loadEditals()
    loadResponsaveis()
  }, [profile])

  const loadEditals = async () => {
    if (!profile?.organization_id) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('editals')
        .select(`
          *,
          responsavel:responsavel_id (
            full_name
          )
        `)
        .eq('organization_id', profile.organization_id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setEditals(data as Edital[] || [])
    } catch (error) {
      console.error('Error loading editals:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadResponsaveis = async () => {
    if (!profile?.organization_id) return

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, full_name')
        .eq('organization_id', profile.organization_id)
        .eq('is_active', true)
        .order('full_name')

      if (error) throw error
      setResponsaveis(data || [])
    } catch (error) {
      console.error('Error loading responsaveis:', error)
    }
  }

  const handleStatusChange = async (editalId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('editals')
        .update({ status: newStatus as any })
        .eq('id', editalId)

      if (error) throw error

      // Atualizar estado local
      setEditals(prev => prev.map(edital => 
        edital.id === editalId 
          ? { ...edital, status: newStatus as any }
          : edital
      ))
      
      onStageUpdate()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const filteredEditals = useMemo(() => {
    return editals.filter(edital => {
      const matchesSearch =
        edital.numero_edital.toLowerCase().includes(searchTerm.toLowerCase()) ||
        edital.orgao_entidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        edital.objeto.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesModalidade = filterModalidade === 'all' || edital.modalidade === filterModalidade
      const matchesResponsavel = filterResponsavel === 'all' || edital.responsavel_id === filterResponsavel

      return matchesSearch && matchesModalidade && matchesResponsavel
    })
  }, [editals, searchTerm, filterModalidade, filterResponsavel])

  const getEditalsByStage = (stageName: string) => {
    const stageStatusMap: Record<string, string> = {
      'Prospectados': 'prospectado',
      'Em Análise': 'em_analise',
      'Documentação': 'documentacao',
      'Proposta Enviada': 'proposta_enviada',
      'Em Julgamento': 'em_julgamento',
      'Homologados': 'homologado',
      'Perdidos': 'perdido',
    }

    const status = stageStatusMap[stageName] || stageName.toLowerCase().replace(/\s+/g, '_')
    return filteredEditals.filter(edital => edital.status === status)
  }

  const analytics = useMemo(() => {
    const total = filteredEditals.length
    const totalValue = filteredEditals.reduce((sum, e) => sum + (e.valor_estimado || 0), 0)
    const avgValue = total > 0 ? totalValue / total : 0

    const homologados = filteredEditals.filter(e => e.status === 'homologado').length
    const winRate = total > 0 ? (homologados / total * 100).toFixed(1) : '0'

    const withDeadline = filteredEditals.filter(e => e.data_entrega_propostas && new Date(e.data_entrega_propostas) > new Date())
    const avgDays = withDeadline.length > 0
      ? Math.round(withDeadline.reduce((sum, e) => {
          const days = Math.ceil((new Date(e.data_entrega_propostas!).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
          return sum + days
        }, 0) / withDeadline.length)
      : 0

    return { total, totalValue, avgValue, winRate, avgDays }
  }, [filteredEditals])

  const clearFilters = () => {
    setSearchTerm('')
    setFilterModalidade('all')
    setFilterResponsavel('all')
  }

  const hasActiveFilters = searchTerm || filterModalidade !== 'all' || filterResponsavel !== 'all'

  const handleViewDetails = (edital: Edital) => {
    setSelectedEdital(edital)
    setShowDetailsModal(true)
  }

  const handleEditEdital = (edital: Edital) => {
    setSelectedEdital(edital)
    setShowDetailsModal(false)
    setShowEditModal(true)
  }

  const handleDeleteEdital = async (edital: Edital) => {
    if (!confirm(`Tem certeza que deseja excluir o edital ${edital.numero_edital}?`)) return

    try {
      const { error } = await supabase
        .from('editals')
        .delete()
        .eq('id', edital.id)

      if (error) throw error
      loadEditals()
    } catch (error) {
      console.error('Error deleting edital:', error)
    }
  }

  const handleFormSuccess = () => {
    setShowEditModal(false)
    setSelectedEdital(null)
    loadEditals()
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="relative bg-white border-b border-gray-200 px-6 py-6 overflow-hidden">
        {/* Background Gradient Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-brand-cyan/5 to-brand-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-brand-blue/5 to-brand-cyan/5 rounded-full blur-3xl" />
        
        <div className="relative flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-blue-dark bg-clip-text text-transparent">{pipeline.name}</h3>
            {pipeline.description && (
              <p className="text-sm text-gray-600 font-medium mt-1">{pipeline.description}</p>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="relative flex items-center space-x-2 px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-blue-dark rounded-xl hover:shadow-lg hover:shadow-brand-cyan/30 transition-all duration-300 transform hover:scale-105"
          >
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-brand-tech-green rounded-full animate-pulse shadow-lg shadow-brand-tech-green/50" />
            )}
          </button>
        </div>

        {showFilters && (
          <div className="relative space-y-4 p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-brand-blue mb-2">Buscar</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 p-1.5 bg-brand-cyan/10 rounded-lg">
                    <Search className="w-4 h-4 text-brand-cyan" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Número, órgão ou objeto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 border-2 border-gray-200 focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-blue mb-2">Modalidade</label>
                <Select
                  value={filterModalidade}
                  onChange={(e) => setFilterModalidade(e.target.value)}
                  className="border-2 border-gray-200 focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20 rounded-lg font-medium"
                >
                  <option value="all">Todas</option>
                  <option value="pregao_eletronico">Pregão Eletrônico</option>
                  <option value="pregao_presencial">Pregão Presencial</option>
                  <option value="concorrencia">Concorrência</option>
                  <option value="tomada_precos">Tomada de Preços</option>
                  <option value="convite">Convite</option>
                  <option value="dispensa">Dispensa</option>
                  <option value="inexigibilidade">Inexigibilidade</option>
                  <option value="rdc">RDC</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-blue mb-2">Responsável</label>
                <Select
                  value={filterResponsavel}
                  onChange={(e) => setFilterResponsavel(e.target.value)}
                  className="border-2 border-gray-200 focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20 rounded-lg font-medium"
                >
                  <option value="all">Todos</option>
                  {responsaveis.map(resp => (
                    <option key={resp.id} value={resp.id}>
                      {resp.full_name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="flex justify-end">
                <button
                  onClick={clearFilters}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-bold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                >
                  <X className="w-4 h-4" />
                  <span>Limpar filtros</span>
                </button>
              </div>
            )}
          </div>
        )}

        <div className="relative grid grid-cols-4 gap-4 mt-6">
          <div className="relative group bg-gradient-to-br from-brand-cyan/10 to-brand-blue/10 rounded-xl p-4 border border-brand-cyan/20 hover:shadow-lg hover:shadow-brand-cyan/20 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-brand-cyan/10 rounded-full blur-2xl" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs text-brand-blue font-bold uppercase tracking-wider mb-1">Total de Editais</p>
                <p className="text-3xl font-black bg-gradient-to-r from-brand-blue to-brand-cyan bg-clip-text text-transparent">{analytics.total}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-brand-cyan to-brand-blue rounded-xl shadow-lg shadow-brand-cyan/30">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="relative group bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200 hover:shadow-lg hover:shadow-green-200 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-200/30 rounded-full blur-2xl" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs text-green-700 font-bold uppercase tracking-wider mb-1">Valor Total</p>
                <p className="text-3xl font-black text-green-900">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(analytics.totalValue)}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg shadow-green-500/30">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="relative group bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200 hover:shadow-lg hover:shadow-amber-200 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-200/30 rounded-full blur-2xl" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs text-amber-700 font-bold uppercase tracking-wider mb-1">Taxa de Ganho</p>
                <p className="text-3xl font-black text-amber-900">{analytics.winRate}%</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg shadow-amber-500/30">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="relative group bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200 hover:shadow-lg hover:shadow-purple-200 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200/30 rounded-full blur-2xl" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs text-purple-700 font-bold uppercase tracking-wider mb-1">Prazo Médio</p>
                <p className="text-3xl font-black text-purple-900">{analytics.avgDays}d</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg shadow-purple-500/30">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex space-x-6 p-6 h-full">
          {stages.map(stage => (
            <PipelineColumn
              key={stage.id}
              title={stage.name}
              color={stage.color}
              editals={getEditalsByStage(stage.name)}
              onStatusChange={(editalId, newStatus) => handleStatusChange(editalId, newStatus)}
              canDrop={stage.name.toLowerCase().replace(/\s+/g, '_')}
              onViewDetails={handleViewDetails}
              onEdit={handleEditEdital}
              onDelete={handleDeleteEdital}
            />
          ))}
        </div>
      </div>

      <EditalDetailsModal
        edital={selectedEdital}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false)
          setSelectedEdital(null)
        }}
        onEdit={handleEditEdital}
      />

      <EditalForm
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedEdital(null)
        }}
        edital={selectedEdital}
        onSuccess={handleFormSuccess}
      />
    </div>
  )
}