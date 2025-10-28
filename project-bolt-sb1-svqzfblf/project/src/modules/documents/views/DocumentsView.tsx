/**
 * View principal de Documentos com abas
 */

import React, { useState, useEffect } from 'react'
import { FileText, Shield } from 'lucide-react'
import { Documents as DocumentsComponent } from '../components/Documents'
import { ValidityMonitor } from '../components/ValidityMonitor'
import { documentsAPI } from '../documents.api'
import { useAuth } from '../../../hooks/useAuth'
import type { Document } from '../types'

type TabView = 'documents' | 'monitor'

export function DocumentsView() {
  const { profile } = useAuth()
  const [currentTab, setCurrentTab] = useState<TabView>('documents')
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDocuments()
  }, [profile])

  const loadDocuments = async () => {
    if (!profile?.organization_id) return

    try {
      setLoading(true)
      const data = await documentsAPI.listDocuments(profile.organization_id)
      setDocuments(data)
    } catch (error) {
      console.error('Error loading documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDocumentClick = (document: Document) => {
    // Aqui pode abrir um modal de detalhes ou navegar para outra view
    console.log('Document clicked:', document)
  }

  return (
    <div className="p-6">
      {/* Header com Tabs */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-neutral-800 mb-4">Cofre de Documentos</h1>
        
        <div className="bg-white rounded-2xl shadow-brand border border-neutral-200 p-2">
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentTab('documents')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                currentTab === 'documents'
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>Todos os Documentos</span>
            </button>
            <button
              onClick={() => setCurrentTab('monitor')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                currentTab === 'monitor'
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Shield className="w-5 h-5" />
              <span>Monitor de Validade</span>
              {documents.filter(d => d.status === 'expiring' || d.status === 'expired').length > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {documents.filter(d => d.status === 'expiring' || d.status === 'expired').length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo das Tabs */}
      {currentTab === 'documents' && <DocumentsComponent />}
      {currentTab === 'monitor' && !loading && (
        <ValidityMonitor documents={documents} onDocumentClick={handleDocumentClick} />
      )}
    </div>
  )
}

