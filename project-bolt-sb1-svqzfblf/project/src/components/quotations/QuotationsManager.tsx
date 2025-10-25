import React, { useState, useEffect } from 'react'
import { ShoppingCart, Plus, Search, Eye, FileText } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/atoms/Button'
import { Input } from '../ui/atoms/Input'
import { Spinner as LoadingSpinner } from '../ui/atoms/Spinner'

interface Quotation {
  id: string
  numero_cotacao: string
  descricao: string | null
  data_solicitacao: string
  data_limite_resposta: string | null
  status: string
  edital_id: string | null
}

export function QuotationsManager() {
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const { profile } = useAuth()

  useEffect(() => {
    loadQuotations()
  }, [profile])

  const loadQuotations = async () => {
    if (!profile?.organization_id) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('quotations')
        .select('*')
        .eq('organization_id', profile.organization_id)
        .order('data_solicitacao', { ascending: false })

      if (error) throw error
      setQuotations(data || [])
    } catch (error) {
      console.error('Error loading quotations:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pendente: 'bg-yellow-100 text-yellow-800',
      em_andamento: 'bg-blue-100 text-blue-800',
      recebida: 'bg-purple-100 text-purple-800',
      aprovada: 'bg-green-100 text-green-800',
      rejeitada: 'bg-red-100 text-red-800',
      cancelada: 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pendente: 'Pendente',
      em_andamento: 'Em Andamento',
      recebida: 'Recebida',
      aprovada: 'Aprovada',
      rejeitada: 'Rejeitada',
      cancelada: 'Cancelada'
    }
    return labels[status] || status
  }

  const filteredQuotations = quotations.filter(quotation =>
    quotation.numero_cotacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quotation.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-neutral-800">Cotações</h2>
            <p className="text-sm text-neutral-600">{quotations.length} cotações cadastradas</p>
          </div>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nova Cotação
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Buscar cotações..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Quotations Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                Número
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                Descrição
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                Data Solicitação
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                Prazo Resposta
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {filteredQuotations.map((quotation) => (
              <tr key={quotation.id} className="hover:bg-neutral-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 text-neutral-400 mr-2" />
                    <span className="font-medium text-neutral-900">{quotation.numero_cotacao}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-neutral-600">
                    {quotation.descricao || '-'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                  {new Date(quotation.data_solicitacao).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                  {quotation.data_limite_resposta 
                    ? new Date(quotation.data_limite_resposta).toLocaleDateString('pt-BR')
                    : '-'
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(quotation.status)}`}>
                    {getStatusLabel(quotation.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button className="text-brand-cyan hover:text-primary-500 transition-colors">
                    <Eye className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredQuotations.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500">Nenhuma cotação encontrada</p>
          </div>
        )}
      </div>
    </div>
  )
}
