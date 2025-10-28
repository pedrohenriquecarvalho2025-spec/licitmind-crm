/**
 * View de Relatórios
 * Interface para geração de relatórios em CSV/PDF
 */

import React, { useState } from 'react'
import { FileText, Download, Calendar, FileSpreadsheet, FileType } from 'lucide-react'
import { Button } from '../../../components/ui/atoms/Button'
import { Select } from '../../../components/ui/molecules/Select'
import { Input } from '../../../components/ui/atoms/Input'
import { reportsService, type ReportData } from '../services/reports.service'
import { useAuth } from '../../../hooks/useAuth'

const reportTypes = [
  { value: 'editals', label: 'Relatório de Editais' },
  { value: 'contracts', label: 'Relatório de Contratos' },
  { value: 'deliveries', label: 'Relatório de Entregas' },
  { value: 'quotations', label: 'Relatório de Cotações' },
  { value: 'suppliers', label: 'Relatório de Fornecedores' }
]

export function ReportsView() {
  const { profile } = useAuth()
  const [selectedType, setSelectedType] = useState('editals')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [generating, setGenerating] = useState(false)

  const generateMockData = (): ReportData => {
    // Mock data - em produção, buscar do banco
    return {
      title: `Relatório de ${reportTypes.find(t => t.value === selectedType)?.label}`,
      headers: ['ID', 'Descrição', 'Data', 'Valor', 'Status'],
      rows: [
        ['001', 'Item de Exemplo 1', '01/01/2024', 'R$ 10.000,00', 'Ativo'],
        ['002', 'Item de Exemplo 2', '02/01/2024', 'R$ 15.000,00', 'Ativo'],
        ['003', 'Item de Exemplo 3', '03/01/2024', 'R$ 8.500,00', 'Encerrado']
      ],
      metadata: {
        generatedAt: new Date().toLocaleString('pt-BR'),
        generatedBy: profile?.full_name || 'Sistema',
        filters: {
          dateFrom,
          dateTo,
          type: selectedType
        }
      }
    }
  }

  const handleGenerateCSV = async () => {
    try {
      setGenerating(true)
      const data = generateMockData()
      reportsService.downloadCSV(data, `relatorio_${selectedType}_${Date.now()}.csv`)
    } catch (error) {
      console.error('Error generating CSV:', error)
      alert('Erro ao gerar relatório CSV')
    } finally {
      setGenerating(false)
    }
  }

  const handleGeneratePDF = async () => {
    try {
      setGenerating(true)
      const data = generateMockData()
      await reportsService.downloadPDF(data, `relatorio_${selectedType}_${Date.now()}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Erro ao gerar relatório PDF. Habilite popups no navegador.')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-neutral-800">Relatórios</h1>
        <p className="text-neutral-600 mt-1">Gere relatórios personalizados em CSV ou PDF</p>
      </div>

      {/* Configuração do Relatório */}
      <div className="bg-white rounded-2xl shadow-brand border border-neutral-200 p-6 mb-6">
        <h3 className="text-lg font-bold text-neutral-800 mb-4 flex items-center space-x-2">
          <FileText className="w-5 h-5 text-primary-500" />
          <span>Configurar Relatório</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Tipo de Relatório
            </label>
            <Select
              value={selectedType}
              onChange={setSelectedType}
              options={reportTypes}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Data Inicial</span>
            </label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Data Final</span>
            </label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Ações de Exportação */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-brand p-8 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Exportar CSV</h3>
              <p className="text-green-100 text-sm">Formato Excel/Planilhas</p>
            </div>
          </div>
          <p className="text-green-100 mb-6">
            Ideal para análise em planilhas e manipulação de dados.
          </p>
          <Button
            onClick={handleGenerateCSV}
            disabled={generating}
            className="w-full bg-white text-green-600 hover:bg-green-50"
          >
            <Download className="w-4 h-4 mr-2" />
            {generating ? 'Gerando...' : 'Baixar CSV'}
          </Button>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-brand p-8 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <FileType className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Exportar PDF</h3>
              <p className="text-red-100 text-sm">Formato Documento</p>
            </div>
          </div>
          <p className="text-red-100 mb-6">
            Ideal para compartilhamento e impressão de documentos.
          </p>
          <Button
            onClick={handleGeneratePDF}
            disabled={generating}
            className="w-full bg-white text-red-600 hover:bg-red-50"
          >
            <Download className="w-4 h-4 mr-2" />
            {generating ? 'Gerando...' : 'Baixar PDF'}
          </Button>
        </div>
      </div>

      {/* Informações */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h4 className="font-bold text-blue-900 mb-2">ℹ️ Informações</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Os relatórios são gerados com base nos filtros selecionados</li>
          <li>• CSV é recomendado para análise de dados em planilhas</li>
          <li>• PDF é recomendado para documentação e compartilhamento</li>
          <li>• Para PDFs, certifique-se de que popups estão habilitados no navegador</li>
        </ul>
      </div>
    </div>
  )
}
