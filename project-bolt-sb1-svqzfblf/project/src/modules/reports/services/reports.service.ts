/**
 * Serviço de Relatórios
 * Geração de relatórios em CSV e PDF
 */

import { logger } from '../../../core/utils/logger'

export interface ReportData {
  title: string
  headers: string[]
  rows: any[][]
  metadata?: {
    generatedAt: string
    generatedBy: string
    filters?: Record<string, any>
  }
}

export class ReportsService {
  /**
   * Gera CSV a partir dos dados
   */
  generateCSV(data: ReportData): string {
    try {
      const lines: string[] = []

      // Adiciona cabeçalhos
      lines.push(data.headers.map(h => this.escapeCSV(h)).join(','))

      // Adiciona linhas
      data.rows.forEach(row => {
        lines.push(row.map(cell => this.escapeCSV(String(cell || ''))).join(','))
      })

      return lines.join('\n')
    } catch (error) {
      logger.error('Error generating CSV', { error })
      throw error
    }
  }

  /**
   * Download CSV
   */
  downloadCSV(data: ReportData, filename: string = 'relatorio.csv') {
    try {
      const csv = this.generateCSV(data)
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)

      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      logger.info('CSV downloaded', { filename })
    } catch (error) {
      logger.error('Error downloading CSV', { error })
      throw error
    }
  }

  /**
   * Gera PDF básico (texto simples)
   * Para PDFs mais complexos, usar jsPDF ou similar
   */
  async downloadPDF(data: ReportData, filename: string = 'relatorio.pdf') {
    try {
      // Implementação básica usando window.print
      // Para produção, use jsPDF ou similar

      const htmlContent = this.generateHTMLReport(data)
      
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        throw new Error('Popup bloqueado. Habilite popups para gerar PDF.')
      }

      printWindow.document.write(htmlContent)
      printWindow.document.close()
      
      printWindow.onload = () => {
        printWindow.focus()
        printWindow.print()
      }

      logger.info('PDF generation initiated', { filename })
    } catch (error) {
      logger.error('Error generating PDF', { error })
      throw error
    }
  }

  /**
   * Gera HTML para impressão/PDF
   */
  private generateHTMLReport(data: ReportData): string {
    const now = new Date().toLocaleString('pt-BR')
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${data.title}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            h1 {
              color: #333;
              margin-bottom: 10px;
            }
            .metadata {
              color: #666;
              font-size: 12px;
              margin-bottom: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
              font-weight: bold;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <h1>${data.title}</h1>
          <div class="metadata">
            <p>Gerado em: ${data.metadata?.generatedAt || now}</p>
            ${data.metadata?.generatedBy ? `<p>Gerado por: ${data.metadata.generatedBy}</p>` : ''}
          </div>
          <table>
            <thead>
              <tr>
                ${data.headers.map(h => `<th>${this.escapeHTML(h)}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data.rows.map(row => `
                <tr>
                  ${row.map(cell => `<td>${this.escapeHTML(String(cell || ''))}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `
  }

  /**
   * Escapa string para CSV
   */
  private escapeCSV(str: string): string {
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  /**
   * Escapa HTML
   */
  private escapeHTML(str: string): string {
    const div = document.createElement('div')
    div.textContent = str
    return div.innerHTML
  }

  /**
   * Formata data para relatórios
   */
  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  /**
   * Formata moeda para relatórios
   */
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }
}

export const reportsService = new ReportsService()

