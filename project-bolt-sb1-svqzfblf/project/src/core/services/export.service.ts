/**
 * Serviço de Exportação de Dados
 * Suporta CSV e PDF
 */

export class ExportService {
  /**
   * Exporta dados para CSV
   */
  static exportToCSV<T extends Record<string, any>>(
    data: T[],
    filename: string,
    columns?: { key: keyof T; label: string }[]
  ) {
    if (data.length === 0) {
      throw new Error('Nenhum dado para exportar')
    }

    // Define colunas automaticamente se não fornecidas
    const cols = columns || Object.keys(data[0]).map(key => ({ key, label: key }))

    // Cabeçalho
    const header = cols.map(col => `"${col.label}"`).join(',')

    // Linhas
    const rows = data.map(row => {
      return cols
        .map(col => {
          const value = row[col.key]
          // Trata valores especiais
          if (value === null || value === undefined) return '""'
          if (typeof value === 'object') return `"${JSON.stringify(value)}"`
          // Escapa aspas
          return `"${String(value).replace(/"/g, '""')}"`
        })
        .join(',')
    })

    // Combina tudo
    const csv = [header, ...rows].join('\n')

    // Download
    this.downloadFile(csv, `${filename}.csv`, 'text/csv;charset=utf-8;')
  }

  /**
   * Exporta para PDF (versão simplificada)
   * Requer biblioteca jsPDF para funcionalidade completa
   */
  static exportToPDF(
    content: string,
    filename: string,
    title?: string
  ) {
    // HTML simples que pode ser impresso como PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${title || filename}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 40px;
            line-height: 1.6;
          }
          h1 {
            color: #333;
            border-bottom: 3px solid #39A2DB;
            padding-bottom: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #39A2DB;
            color: white;
          }
          tr:nth-child(even) {
            background-color: #f2f2f2;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            color: #666;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        ${title ? `<h1>${title}</h1>` : ''}
        ${content}
        <div class="footer">
          <p>Gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
          <p>LicitMind - Sistema de Gestão de Licitações</p>
        </div>
      </body>
      </html>
    `

    // Abre em nova janela para impressão/salvar como PDF
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
      }, 250)
    }
  }

  /**
   * Exporta tabela HTML para PDF
   */
  static exportTableToPDF<T extends Record<string, any>>(
    data: T[],
    filename: string,
    title: string,
    columns?: { key: keyof T; label: string }[]
  ) {
    const cols = columns || Object.keys(data[0]).map(key => ({ key, label: key }))

    const tableHTML = `
      <table>
        <thead>
          <tr>
            ${cols.map(col => `<th>${col.label}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${data
            .map(
              row => `
            <tr>
              ${cols
                .map(col => {
                  const value = row[col.key]
                  return `<td>${this.formatValue(value)}</td>`
                })
                .join('')}
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    `

    this.exportToPDF(tableHTML, filename, title)
  }

  /**
   * Formata valores para exibição
   */
  private static formatValue(value: any): string {
    if (value === null || value === undefined) return '-'
    if (typeof value === 'boolean') return value ? 'Sim' : 'Não'
    if (typeof value === 'number') {
      // Se parece com moeda
      if (value > 100) {
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(value)
      }
      return value.toString()
    }
    if (value instanceof Date) {
      return value.toLocaleDateString('pt-BR')
    }
    if (typeof value === 'object') {
      return JSON.stringify(value)
    }
    return String(value)
  }

  /**
   * Download de arquivo
   */
  private static downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob(['\ufeff' + content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  /**
   * Exporta relatório de editais
   */
  static exportEditalsReport(editals: any[], format: 'csv' | 'pdf' = 'csv') {
    const columns = [
      { key: 'numero_edital', label: 'Número' },
      { key: 'orgao_entidade', label: 'Órgão' },
      { key: 'objeto', label: 'Objeto' },
      { key: 'modalidade', label: 'Modalidade' },
      { key: 'valor_estimado', label: 'Valor Estimado' },
      { key: 'status', label: 'Status' },
      { key: 'data_publicacao', label: 'Data Publicação' },
    ]

    const filename = `editais_${new Date().toISOString().split('T')[0]}`

    if (format === 'csv') {
      this.exportToCSV(editals, filename, columns)
    } else {
      this.exportTableToPDF(editals, filename, 'Relatório de Editais', columns)
    }
  }

  /**
   * Exporta relatório de contratos
   */
  static exportContractsReport(contracts: any[], format: 'csv' | 'pdf' = 'csv') {
    const columns = [
      { key: 'numero_contrato', label: 'Número' },
      { key: 'contratante', label: 'Contratante' },
      { key: 'objeto', label: 'Objeto' },
      { key: 'valor_total', label: 'Valor Total' },
      { key: 'data_inicio_vigencia', label: 'Início Vigência' },
      { key: 'data_fim_vigencia', label: 'Fim Vigência' },
      { key: 'status', label: 'Status' },
    ]

    const filename = `contratos_${new Date().toISOString().split('T')[0]}`

    if (format === 'csv') {
      this.exportToCSV(contracts, filename, columns)
    } else {
      this.exportTableToPDF(contracts, filename, 'Relatório de Contratos', columns)
    }
  }

  /**
   * Exporta relatório de fornecedores
   */
  static exportSuppliersReport(suppliers: any[], format: 'csv' | 'pdf' = 'csv') {
    const columns = [
      { key: 'nome', label: 'Nome' },
      { key: 'cnpj', label: 'CNPJ' },
      { key: 'categoria', label: 'Categoria' },
      { key: 'email', label: 'Email' },
      { key: 'telefone', label: 'Telefone' },
      { key: 'cidade', label: 'Cidade' },
      { key: 'uf', label: 'UF' },
    ]

    const filename = `fornecedores_${new Date().toISOString().split('T')[0]}`

    if (format === 'csv') {
      this.exportToCSV(suppliers, filename, columns)
    } else {
      this.exportTableToPDF(suppliers, filename, 'Relatório de Fornecedores', columns)
    }
  }
}

export const exportService = ExportService

