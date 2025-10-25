import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/atoms/Button'
import { Spinner as LoadingSpinner } from '../ui/atoms/Spinner'
import { EditalForm } from './EditalForm'
import { GoogleDriveIntegration } from './GoogleDriveIntegration'
import { CreditCard as Edit, Trash2, FileText, Calendar, DollarSign, Building, User, Filter } from 'lucide-react'
import { FolderOpen } from 'lucide-react'
import type { Database } from '../../lib/database.types'

type Edital = Database['public']['Tables']['editals']['Row'] & {
  responsavel: { full_name: string } | null
}

const statusColors = {
  prospectado: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300',
  em_analise: 'bg-gradient-to-r from-brand-cyan/20 to-brand-blue/20 text-brand-blue-dark border border-brand-cyan/30',
  documentacao: 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300',
  proposta_enviada: 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300',
  em_julgamento: 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border border-orange-300',
  homologado: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300',
  perdido: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300',
}

const statusLabels = {
  prospectado: 'Prospectado',
  em_analise: 'Em Análise',
  documentacao: 'Documentação',
  proposta_enviada: 'Proposta Enviada',
  em_julgamento: 'Em Julgamento',
  homologado: 'Homologado',
  perdido: 'Perdido',
}

const modalidadeLabels = {
  concorrencia: 'Concorrência',
  pregao_presencial: 'Pregão Presencial',
  pregao_eletronico: 'Pregão Eletrônico',
  tomada_precos: 'Tomada de Preços',
  convite: 'Convite',
  dispensa: 'Dispensa',
  inexigibilidade: 'Inexigibilidade',
  rdc: 'RDC',
}

export function EditalsTable() {
  const { profile, hasPermission } = useAuth()
  const [editals, setEditals] = useState<Edital[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEdital, setSelectedEdital] = useState<Edital | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showDriveIntegration, setShowDriveIntegration] = useState(false)
  const [driveEdital, setDriveEdital] = useState<Edital | null>(null)

  useEffect(() => {
    loadEditals()
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

  const handleEdit = (edital: Edital) => {
    setSelectedEdital(edital)
    setShowForm(true)
  }

  const handleDriveIntegration = (edital: Edital) => {
    setDriveEdital(edital)
    setShowDriveIntegration(true)
  }

  const handleDelete = async (edital: Edital) => {
    if (!confirm('Tem certeza que deseja excluir este edital?')) return

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

  const handleFormClose = () => {
    setShowForm(false)
    setSelectedEdital(null)
  }

  const handleFormSubmit = () => {
    loadEditals()
  }

  const formatCurrency = (value: number | null) => {
    if (!value) return '-'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatDate = (date: string | null) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('pt-BR')
  }

  const formatDateTime = (date: string | null) => {
    if (!date) return '-'
    return new Date(date).toLocaleString('pt-BR')
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-gradient-to-br from-brand-cyan/10 to-brand-blue/10 rounded-lg">
              <Filter className="w-5 h-5 text-brand-blue" />
            </div>
            <select className="border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium hover:border-brand-cyan focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20 transition-all">
              <option>Todos os status</option>
              <option>Prospectado</option>
              <option>Em Análise</option>
              <option>Homologado</option>
            </select>
            <select className="border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium hover:border-brand-cyan focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20 transition-all">
              <option>Todas as modalidades</option>
              <option>Pregão Eletrônico</option>
              <option>Concorrência</option>
            </select>
          </div>
          
          {hasPermission('analista') && (
            <Button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>Novo Edital</span>
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        {editals.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex p-4 bg-gradient-to-br from-brand-cyan/10 to-brand-blue/10 rounded-2xl mb-4">
              <FileText className="w-16 h-16 text-brand-blue" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Nenhum edital encontrado
            </h3>
            <p className="text-gray-500 mb-8 text-base">
              Comece cadastrando seu primeiro edital no sistema.
            </p>
            {hasPermission('analista') && (
              <Button onClick={() => setShowForm(true)}>
                Cadastrar Primeiro Edital
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-8 py-5 text-left text-xs font-bold text-brand-blue uppercase tracking-wider">
                    Edital
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-brand-blue uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-brand-blue uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-brand-blue uppercase tracking-wider">
                    Prazo
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-brand-blue uppercase tracking-wider">
                    Responsável
                  </th>
                  <th className="px-8 py-5 text-right text-xs font-bold text-brand-blue uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {editals.map((edital) => (
                  <tr key={edital.id} className="hover:bg-gradient-to-r hover:from-brand-cyan/5 hover:to-brand-blue/5 transition-all duration-200 group">
                    <td className="px-8 py-6">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gradient-to-br from-brand-cyan/10 to-brand-blue/10 rounded-lg group-hover:from-brand-cyan/20 group-hover:to-brand-blue/20 transition-all">
                            <FileText className="w-5 h-5 text-brand-blue" />
                          </div>
                          <span className="font-bold text-gray-900 text-base">
                            {edital.numero_edital}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 ml-1">
                          <Building className="w-4 h-4 text-brand-cyan" />
                          <span className="truncate max-w-md font-medium">{edital.orgao_entidade}</span>
                        </div>
                        <p className="text-sm text-gray-600 ml-1 max-w-xl line-clamp-2">
                          {edital.objeto}
                        </p>
                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300 ml-1">
                          {modalidadeLabels[edital.modalidade]}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center px-4 py-2 rounded-lg text-xs font-bold shadow-sm ${statusColors[edital.status]}`}>
                        {statusLabels[edital.status]}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-green-100 rounded-lg">
                          <DollarSign className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="font-bold text-gray-900">
                          {formatCurrency(edital.valor_estimado)}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-orange-100 rounded-lg">
                          <Calendar className="w-4 h-4 text-orange-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {formatDateTime(edital.data_entrega_propostas)}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {edital.responsavel ? (
                        <div className="flex items-center space-x-2">
                          <div className="p-1.5 bg-brand-cyan/10 rounded-lg">
                            <User className="w-4 h-4 text-brand-blue" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {edital.responsavel.full_name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm font-medium">Não atribuído</span>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleDriveIntegration(edital)}
                          className="p-2 text-gray-400 hover:text-brand-blue hover:bg-brand-cyan/10 rounded-lg transition-all duration-200"
                          title="Google Drive"
                        >
                          <FolderOpen className="w-5 h-5" />
                        </button>
                        {hasPermission('analista') && (
                          <>
                            <button
                              onClick={() => handleEdit(edital)}
                              className="p-2 text-gray-400 hover:text-brand-cyan hover:bg-brand-cyan/10 rounded-lg transition-all duration-200"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(edital)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <EditalForm
        isOpen={showForm}
        onClose={handleFormClose}
        edital={selectedEdital}
        onSubmit={handleFormSubmit}
      />

      {driveEdital && (
        <GoogleDriveIntegration
          edital={driveEdital}
          isOpen={showDriveIntegration}
          onClose={() => {
            setShowDriveIntegration(false)
            setDriveEdital(null)
          }}
        />
      )}
    </div>
  )
}