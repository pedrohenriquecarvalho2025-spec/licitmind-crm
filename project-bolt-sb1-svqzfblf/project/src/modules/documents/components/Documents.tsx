import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/atoms/Button'
import { Input } from '../ui/atoms/Input'
import { ModalBase as Modal } from '../ui/molecules/ModalBase'
import { Spinner as LoadingSpinner } from '../ui/atoms/Spinner'
import { Select } from '../ui/molecules/Select'
import {
  FolderOpen,
  FileText,
  Upload,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  Clock,
  Shield
} from 'lucide-react'
import type { Database } from '../../lib/database.types'

type Document = Database['public']['Tables']['documents']['Row']

const documentTypes = [
  { value: 'atestado', label: 'Atestado de Qualificação Técnica' },
  { value: 'crea_cau', label: 'CREA / CAU' },
  { value: 'certidao', label: 'Certidões' },
  { value: 'licenca', label: 'Licenças' },
  { value: 'outros', label: 'Outros' },
]

const categories = [
  'Engenharia Civil',
  'Arquitetura',
  'Tecnologia da Informação',
  'Consultoria',
  'Serviços Gerais',
  'Obras Públicas'
]

export function Documents() {
  const { profile } = useAuth()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    loadDocuments()
  }, [profile])

  const loadDocuments = async () => {
    if (!profile?.organization_id) return

    try {
      setLoading(true)

      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('organization_id', profile.organization_id)
        .order('created_at', { ascending: false })

      if (error) throw error

      await supabase.rpc('update_document_status')

      setDocuments(data || [])
    } catch (error) {
      console.error('Error loading documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'bg-green-100 text-green-800 border-green-200'
      case 'expiring': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'expired': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-neutral-100 text-neutral-800 border-neutral-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid': return <CheckCircle className="w-4 h-4" />
      case 'expiring': return <Clock className="w-4 h-4" />
      case 'expired': return <AlertTriangle className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'valid': return 'Válido'
      case 'expiring': return 'Vencendo'
      case 'expired': return 'Vencido'
      default: return 'Desconhecido'
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || doc.type === filterType
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  const getAlerts = () => {
    const expiring = documents.filter(doc => doc.status === 'expiring').length
    const expired = documents.filter(doc => doc.status === 'expired').length
    return { expiring, expired }
  }

  const alerts = getAlerts()

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Alerts */}
      {(alerts.expiring > 0 || alerts.expired > 0) && (
        <div className="bg-gradient-to-r from-red-50 to-yellow-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-red-800">Atenção: Documentos Pendentes</h3>
              <p className="text-sm text-red-600">Alguns documentos precisam de atenção</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alerts.expired > 0 && (
              <div className="bg-red-100 border border-red-200 rounded-xl p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span className="font-semibold text-red-800">
                    {alerts.expired} documento{alerts.expired > 1 ? 's' : ''} vencido{alerts.expired > 1 ? 's' : ''}
                  </span>
                </div>
                <p className="text-sm text-red-600 mt-1">Renovação urgente necessária</p>
              </div>
            )}
            
            {alerts.expiring > 0 && (
              <div className="bg-yellow-100 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <span className="font-semibold text-yellow-800">
                    {alerts.expiring} documento{alerts.expiring > 1 ? 's' : ''} vencendo
                  </span>
                </div>
                <p className="text-sm text-yellow-600 mt-1">Atenção nos próximos 30 dias</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-800">Documentos</h2>
          <p className="text-neutral-600">Gestão inteligente de documentos obrigatórios</p>
        </div>
        <Button onClick={() => setShowUploadModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Upload Documento
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-brand border border-neutral-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar documentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">Todos os tipos</option>
            {documentTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">Todos os status</option>
            <option value="valid">Válidos</option>
            <option value="expiring">Vencendo</option>
            <option value="expired">Vencidos</option>
          </select>

          <Button variant="secondary">
            <Filter className="w-4 h-4 mr-2" />
            Filtros Avançados
          </Button>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((document) => (
          <div key={document.id} className="bg-white rounded-2xl shadow-brand border border-neutral-200 p-6 hover:shadow-brand-lg transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-brand-cyan rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(document.status)} flex items-center space-x-1`}>
                {getStatusIcon(document.status)}
                <span>{getStatusLabel(document.status)}</span>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-bold text-neutral-800 mb-2 line-clamp-2">{document.name}</h3>
              <p className="text-sm text-neutral-600 mb-1">{document.category}</p>
              <p className="text-xs text-neutral-500">
                {documentTypes.find(t => t.value === document.type)?.label}
              </p>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Tamanho:</span>
                <span className="font-medium">{formatFileSize(document.size)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Upload:</span>
                <span className="font-medium">{formatDate(document.uploaded_at)}</span>
              </div>
              {document.expiry_date && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Vencimento:</span>
                  <span className={`font-medium ${
                    document.status === 'expired' ? 'text-red-600' :
                    document.status === 'expiring' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {formatDate(document.expiry_date)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors text-sm font-medium">
                <Eye className="w-4 h-4" />
                <span>Visualizar</span>
              </button>
              <button className="flex items-center justify-center p-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
              </button>
              <button className="flex items-center justify-center p-2 bg-neutral-100 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-800 mb-2">
            Nenhum documento encontrado
          </h3>
          <p className="text-neutral-600 mb-6">
            {searchTerm || filterType !== 'all' || filterStatus !== 'all'
              ? 'Tente ajustar os filtros de busca'
              : 'Comece fazendo upload dos seus documentos obrigatórios'
            }
          </p>
          <Button onClick={() => setShowUploadModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Upload Primeiro Documento
          </Button>
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload de Documento"
        size="lg"
      >
        <div className="space-y-6">
          <div className="border-2 border-dashed border-brand-cyan/30 rounded-2xl p-8 text-center bg-gradient-to-br from-brand-cyan/5 to-primary-500/5">
            <div className="w-16 h-16 bg-gradient-to-br from-brand-cyan to-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-neutral-800 mb-2">Arraste arquivos aqui</h3>
            <p className="text-neutral-600 mb-4">ou clique para selecionar</p>
            <Button variant="secondary">
              Selecionar Arquivos
            </Button>
            <p className="text-xs text-neutral-500 mt-4">
              Formatos aceitos: PDF, DOC, DOCX, JPG, PNG (máx. 10MB)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Tipo de Documento
              </label>
              <select className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                {documentTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Categoria
              </label>
              <select className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Data de Vencimento (opcional)"
            type="date"
            placeholder="Selecione a data de vencimento"
          />

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
              Cancelar
            </Button>
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Fazer Upload
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}