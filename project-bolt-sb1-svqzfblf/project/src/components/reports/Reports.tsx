import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/atoms/Button'
import { Spinner as LoadingSpinner } from '../ui/atoms/Spinner'
import { 
  FileText, 
  Download, 
  Calendar,
  TrendingUp,
  DollarSign,
  Target,
  Building,
  BarChart3
} from 'lucide-react'

interface ReportData {
  totalEditals: number
  totalValue: number
  conversionRate: number
  avgValue: number
  statusDistribution: Array<{ status: string; count: number; percentage: number }>
  modalidadeDistribution: Array<{ modalidade: string; count: number; value: number }>
  monthlyTrend: Array<{ month: string; count: number; value: number }>
  topOrgaos: Array<{ name: string; count: number; value: number }>
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

export function Reports() {
  const { profile } = useAuth()
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    loadReportData()
  }, [profile, dateRange])

  const loadReportData = async () => {
    if (!profile?.organization_id) return

    try {
      setLoading(true)

      const { data: editals, error } = await supabase
        .from('editals')
        .select('*')
        .eq('organization_id', profile.organization_id)
        .gte('created_at', dateRange.start)
        .lte('created_at', dateRange.end + 'T23:59:59')

      if (error) throw error

      // Calcular estatísticas
      const totalEditals = editals?.length || 0
      const totalValue = editals?.reduce((sum, e) => sum + (e.valor_estimado || 0), 0) || 0
      const avgValue = totalEditals > 0 ? totalValue / totalEditals : 0

      const homologados = editals?.filter(e => e.status === 'homologado').length || 0
      const participated = editals?.filter(e => 
        ['proposta_enviada', 'em_julgamento', 'homologado', 'perdido'].includes(e.status)
      ).length || 0
      const conversionRate = participated > 0 ? (homologados / participated) * 100 : 0

      // Distribuição por status
      const statusCount = editals?.reduce((acc, e) => {
        acc[e.status] = (acc[e.status] || 0) + 1
        return acc
      }, {} as Record<string, number>) || {}

      const statusDistribution = Object.entries(statusCount).map(([status, count]) => ({
        status,
        count,
        percentage: totalEditals > 0 ? (count / totalEditals) * 100 : 0
      }))

      // Distribuição por modalidade
      const modalidadeStats = editals?.reduce((acc, e) => {
        if (!acc[e.modalidade]) {
          acc[e.modalidade] = { count: 0, value: 0 }
        }
        acc[e.modalidade].count += 1
        acc[e.modalidade].value += e.valor_estimado || 0
        return acc
      }, {} as Record<string, { count: number; value: number }>) || {}

      const modalidadeDistribution = Object.entries(modalidadeStats).map(([modalidade, stats]) => ({
        modalidade,
        count: stats.count,
        value: stats.value
      }))

      // Top órgãos
      const orgaoStats = editals?.reduce((acc, e) => {
        if (!acc[e.orgao_entidade]) {
          acc[e.orgao_entidade] = { count: 0, value: 0 }
        }
        acc[e.orgao_entidade].count += 1
        acc[e.orgao_entidade].value += e.valor_estimado || 0
        return acc
      }, {} as Record<string, { count: number; value: number }>) || {}

      const topOrgaos = Object.entries(orgaoStats)
        .sort(([,a], [,b]) => b.value - a.value)
        .slice(0, 10)
        .map(([name, stats]) => ({
          name,
          count: stats.count,
          value: stats.value
        }))

      // Tendência mensal (últimos 12 meses)
      const monthlyStats = editals?.reduce((acc, e) => {
        const month = new Date(e.created_at).toISOString().slice(0, 7)
        if (!acc[month]) {
          acc[month] = { count: 0, value: 0 }
        }
        acc[month].count += 1
        acc[month].value += e.valor_estimado || 0
        return acc
      }, {} as Record<string, { count: number; value: number }>) || {}

      const monthlyTrend = Object.entries(monthlyStats)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, stats]) => ({
          month,
          count: stats.count,
          value: stats.value
        }))

      setReportData({
        totalEditals,
        totalValue,
        conversionRate,
        avgValue,
        statusDistribution,
        modalidadeDistribution,
        monthlyTrend,
        topOrgaos
      })
    } catch (error) {
      console.error('Error loading report data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const exportReport = () => {
    if (!reportData) return

    const csvContent = [
      ['Relatório de Licitações'],
      ['Período:', `${dateRange.start} a ${dateRange.end}`],
      [''],
      ['Resumo Geral'],
      ['Total de Editais', reportData.totalEditals],
      ['Valor Total', formatCurrency(reportData.totalValue)],
      ['Valor Médio', formatCurrency(reportData.avgValue)],
      ['Taxa de Conversão', `${reportData.conversionRate.toFixed(1)}%`],
      [''],
      ['Distribuição por Status'],
      ['Status', 'Quantidade', 'Percentual'],
      ...reportData.statusDistribution.map(item => [
        statusLabels[item.status as keyof typeof statusLabels],
        item.count,
        `${item.percentage.toFixed(1)}%`
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `relatorio-licitacoes-${dateRange.start}-${dateRange.end}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!reportData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Erro ao carregar dados do relatório.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Calendar className="w-5 h-5 text-gray-500" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            />
            <span className="text-gray-500">até</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            />
          </div>
          
          <Button onClick={exportReport} variant="secondary">
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Editais</p>
              <p className="text-3xl font-bold text-gray-900">{reportData.totalEditals}</p>
            </div>
            <FileText className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Valor Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(reportData.totalValue)}
              </p>
            </div>
            <DollarSign className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
              <p className="text-3xl font-bold text-gray-900">
                {reportData.conversionRate.toFixed(1)}%
              </p>
            </div>
            <Target className="w-12 h-12 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Valor Médio</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(reportData.avgValue)}
              </p>
            </div>
            <TrendingUp className="w-12 h-12 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Gráficos e Tabelas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição por Status */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Distribuição por Status</h3>
          <div className="space-y-3">
            {reportData.statusDistribution.map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {statusLabels[item.status as keyof typeof statusLabels]}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Órgãos */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Principais Órgãos</h3>
          <div className="space-y-3">
            {reportData.topOrgaos.slice(0, 5).map((orgao, index) => (
              <div key={orgao.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-600">
                      {index + 1}
                    </span>
                  </div>
                  <span className="text-sm text-gray-900 truncate max-w-48">
                    {orgao.name}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(orgao.value)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {orgao.count} editais
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modalidades */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Distribuição por Modalidade</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 text-sm font-medium text-gray-600">Modalidade</th>
                <th className="text-right py-2 text-sm font-medium text-gray-600">Quantidade</th>
                <th className="text-right py-2 text-sm font-medium text-gray-600">Valor Total</th>
                <th className="text-right py-2 text-sm font-medium text-gray-600">Valor Médio</th>
              </tr>
            </thead>
            <tbody>
              {reportData.modalidadeDistribution.map((item) => (
                <tr key={item.modalidade} className="border-b border-gray-100">
                  <td className="py-2 text-sm text-gray-900">
                    {modalidadeLabels[item.modalidade as keyof typeof modalidadeLabels]}
                  </td>
                  <td className="py-2 text-sm text-gray-900 text-right">{item.count}</td>
                  <td className="py-2 text-sm text-gray-900 text-right">
                    {formatCurrency(item.value)}
                  </td>
                  <td className="py-2 text-sm text-gray-900 text-right">
                    {formatCurrency(item.count > 0 ? item.value / item.count : 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}