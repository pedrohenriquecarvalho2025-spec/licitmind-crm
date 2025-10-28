/**
 * Kit de Habilitação
 * Agrupa documentos necessários para participação em licitações
 */

import React, { useState, useMemo } from 'react'
import { CheckCircle, XCircle, AlertCircle, FileText, Download, Plus } from 'lucide-react'
import { Button } from '../../../components/ui/atoms/Button'
import type { Database } from '../../../lib/database.types'

type Document = Database['public']['Tables']['documents']['Row']

interface QualificationKitProps {
  documents: Document[]
  onDocumentClick?: (document: Document) => void
}

interface KitCategory {
  id: string
  name: string
  description: string
  required: boolean
  documents: Document[]
}

export function QualificationKit({ documents, onDocumentClick }: QualificationKitProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Categorias do Kit de Habilitação
  const categories: Omit<KitCategory, 'documents'>[] = [
    {
      id: 'juridica',
      name: 'Habilitação Jurídica',
      description: 'Documentos de constituição e representação legal',
      required: true,
    },
    {
      id: 'fiscal',
      name: 'Regularidade Fiscal',
      description: 'Certidões negativas de débitos fiscais',
      required: true,
    },
    {
      id: 'economica',
      name: 'Qualificação Econômico-Financeira',
      description: 'Balanços e certidões de regularidade',
      required: true,
    },
    {
      id: 'tecnica',
      name: 'Qualificação Técnica',
      description: 'Atestados, CREA/CAU, equipe técnica',
      required: true,
    },
    {
      id: 'outros',
      name: 'Outros Documentos',
      description: 'Documentos complementares',
      required: false,
    },
  ]

  // Agrupa documentos por categoria
  const kitWithDocuments: KitCategory[] = useMemo(() => {
    return categories.map(cat => ({
      ...cat,
      documents: documents.filter(doc => {
        // Lógica simples de categorização baseada no tipo
        const type = doc.type?.toLowerCase() || ''
        const category = doc.category?.toLowerCase() || ''
        
        if (cat.id === 'juridica') {
          return type.includes('contrato') || category.includes('jurídica')
        }
        if (cat.id === 'fiscal') {
          return type.includes('certidao') || type.includes('certidão') || category.includes('fiscal')
        }
        if (cat.id === 'economica') {
          return category.includes('econômica') || category.includes('financeira')
        }
        if (cat.id === 'tecnica') {
          return type.includes('atestado') || type.includes('crea') || type.includes('cau')
        }
        return cat.id === 'outros'
      }),
    }))
  }, [documents])

  // Estatísticas do kit
  const stats = useMemo(() => {
    const totalRequired = kitWithDocuments.filter(k => k.required).length
    const completeRequired = kitWithDocuments.filter(k => 
      k.required && k.documents.filter(d => d.status === 'valid').length > 0
    ).length
    const totalDocuments = kitWithDocuments.reduce((sum, k) => sum + k.documents.length, 0)
    const validDocuments = kitWithDocuments.reduce((sum, k) => 
      sum + k.documents.filter(d => d.status === 'valid').length, 0
    )

    return {
      completeness: totalRequired > 0 ? Math.round((completeRequired / totalRequired) * 100) : 0,
      totalDocuments,
      validDocuments,
      isReady: completeRequired === totalRequired,
    }
  }, [kitWithDocuments])

  const getCategoryStatus = (category: KitCategory) => {
    if (!category.required) return 'optional'
    const validDocs = category.documents.filter(d => d.status === 'valid')
    if (validDocs.length === 0) return 'missing'
    if (category.documents.some(d => d.status !== 'valid')) return 'warning'
    return 'complete'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case 'missing':
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <AlertCircle className="w-5 h-5 text-neutral-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'border-green-500 bg-green-50'
      case 'warning':
        return 'border-yellow-500 bg-yellow-50'
      case 'missing':
        return 'border-red-500 bg-red-50'
      default:
        return 'border-neutral-300 bg-neutral-50'
    }
  }

  return (
    <div className="space-y-6">
      {/* Status Geral do Kit */}
      <div className={`rounded-2xl p-6 border-2 ${stats.isReady ? 'bg-green-50 border-green-500' : 'bg-yellow-50 border-yellow-500'}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">Kit de Habilitação</h2>
            <p className="text-neutral-700 mt-1">
              {stats.isReady 
                ? '✅ Todos os documentos obrigatórios estão completos' 
                : '⚠️ Documentos pendentes de atualização'}
            </p>
          </div>
          <div className="text-center">
            <div className={`text-5xl font-black ${stats.isReady ? 'text-green-600' : 'text-yellow-600'}`}>
              {stats.completeness}%
            </div>
            <div className="text-sm text-neutral-600">Completo</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div>
              <div className="text-2xl font-bold text-neutral-900">{stats.validDocuments}</div>
              <div className="text-xs text-neutral-600">Docs Válidos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-neutral-900">{stats.totalDocuments}</div>
              <div className="text-xs text-neutral-600">Total de Docs</div>
            </div>
          </div>

          <Button className="bg-primary-600 hover:bg-primary-700">
            <Download className="w-4 h-4 mr-2" />
            Exportar Kit
          </Button>
        </div>
      </div>

      {/* Categorias do Kit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {kitWithDocuments.map(category => {
          const status = getCategoryStatus(category)
          return (
            <div
              key={category.id}
              className={`border-2 rounded-2xl p-6 transition-all cursor-pointer hover:shadow-lg ${getStatusColor(status)}`}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  {getStatusIcon(status)}
                  <div>
                    <h3 className="font-bold text-neutral-900">
                      {category.name}
                      {category.required && <span className="text-red-600 ml-1">*</span>}
                    </h3>
                    <p className="text-sm text-neutral-600 mt-1">{category.description}</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-neutral-700">
                  {category.documents.filter(d => d.status === 'valid').length}/{category.documents.length}
                </span>
              </div>

              {selectedCategory === category.id && category.documents.length > 0 && (
                <div className="mt-4 space-y-2 border-t border-neutral-200 pt-4">
                  {category.documents.map(doc => (
                    <div
                      key={doc.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        onDocumentClick?.(doc)
                      }}
                      className="bg-white rounded-lg p-3 hover:bg-neutral-50 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-neutral-600" />
                        <div>
                          <div className="text-sm font-medium text-neutral-800">{doc.name}</div>
                          <div className="text-xs text-neutral-500">
                            {doc.expiry_date && `Validade: ${new Date(doc.expiry_date).toLocaleDateString('pt-BR')}`}
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        doc.status === 'valid' ? 'bg-green-100 text-green-700' :
                        doc.status === 'expiring' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {doc.status === 'valid' ? 'Válido' : doc.status === 'expiring' ? 'A vencer' : 'Vencido'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {selectedCategory === category.id && category.documents.length === 0 && (
                <div className="mt-4 text-center border-t border-neutral-200 pt-4">
                  <p className="text-sm text-neutral-600 mb-3">Nenhum documento nesta categoria</p>
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Documento
                  </Button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Legenda */}
      <div className="bg-neutral-100 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-neutral-700">Legenda:</span>
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-neutral-700">Completo</span>
            </div>
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <span className="text-neutral-700">Atenção</span>
            </div>
            <div className="flex items-center space-x-2">
              <XCircle className="w-4 h-4 text-red-600" />
              <span className="text-neutral-700">Pendente</span>
            </div>
            <span className="text-red-600 font-semibold">* Obrigatório</span>
          </div>
        </div>
      </div>
    </div>
  )
}

