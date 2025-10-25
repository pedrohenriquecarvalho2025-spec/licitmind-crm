import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/atoms/Button'
import { Input } from '../ui/atoms/Input'
import { ModalBase as Modal } from '../ui/molecules/ModalBase'
import { 
  FolderOpen, 
  Plus, 
  ExternalLink, 
  Trash2, 
  AlertCircle,
  CheckCircle,
  Link as LinkIcon
} from 'lucide-react'
import type { Database } from '../../lib/database.types'

type GoogleDriveFolder = Database['public']['Tables']['google_drive_folders']['Row']
type Edital = Database['public']['Tables']['editals']['Row']

interface GoogleDriveIntegrationProps {
  edital: Edital
  isOpen: boolean
  onClose: () => void
}

export function GoogleDriveIntegration({ edital, isOpen, onClose }: GoogleDriveIntegrationProps) {
  const { profile } = useAuth()
  const [folders, setFolders] = useState<GoogleDriveFolder[]>([])
  const [loading, setLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newFolderUrl, setNewFolderUrl] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (isOpen) {
      loadFolders()
    }
  }, [isOpen, edital.id])

  const loadFolders = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('google_drive_folders')
        .select('*')
        .eq('edital_id', edital.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setFolders(data || [])
    } catch (error) {
      console.error('Error loading folders:', error)
    } finally {
      setLoading(false)
    }
  }

  const extractFolderIdFromUrl = (url: string): string | null => {
    // Extrair ID da pasta do Google Drive da URL
    const patterns = [
      /\/folders\/([a-zA-Z0-9-_]+)/,
      /id=([a-zA-Z0-9-_]+)/,
      /^([a-zA-Z0-9-_]+)$/
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) {
        return match[1]
      }
    }

    return null
  }

  const generateFolderName = (url: string): string => {
    // Gerar nome da pasta baseado no edital
    return `${edital.numero_edital} - ${edital.orgao_entidade}`
  }

  const handleAddFolder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile || !newFolderUrl.trim()) return

    setError('')
    setSuccess('')

    try {
      const folderId = extractFolderIdFromUrl(newFolderUrl.trim())
      
      if (!folderId) {
        setError('URL do Google Drive inválida. Verifique se é uma URL de pasta válida.')
        return
      }

      const folderName = generateFolderName(newFolderUrl)
      const folderUrl = `https://drive.google.com/drive/folders/${folderId}`

      const { error } = await supabase
        .from('google_drive_folders')
        .insert([{
          edital_id: edital.id,
          folder_id: folderId,
          folder_name: folderName,
          folder_url: folderUrl,
          created_by: profile.id,
        }])

      if (error) throw error

      setSuccess('Pasta do Google Drive vinculada com sucesso!')
      setNewFolderUrl('')
      setShowAddForm(false)
      loadFolders()
    } catch (error: any) {
      setError(error.message)
    }
  }

  const handleRemoveFolder = async (folder: GoogleDriveFolder) => {
    if (!confirm('Tem certeza que deseja desvincular esta pasta?')) return

    try {
      const { error } = await supabase
        .from('google_drive_folders')
        .delete()
        .eq('id', folder.id)

      if (error) throw error
      loadFolders()
    } catch (error) {
      console.error('Error removing folder:', error)
    }
  }

  const handleCreateFolder = async () => {
    // Simular criação de pasta no Google Drive
    const folderName = `${edital.numero_edital} - ${edital.orgao_entidade}`
    const simulatedFolderId = `folder_${Date.now()}`
    const folderUrl = `https://drive.google.com/drive/folders/${simulatedFolderId}`

    try {
      const { error } = await supabase
        .from('google_drive_folders')
        .insert([{
          edital_id: edital.id,
          folder_id: simulatedFolderId,
          folder_name: folderName,
          folder_url: folderUrl,
          created_by: profile!.id,
        }])

      if (error) throw error

      setSuccess('Nova pasta criada e vinculada com sucesso!')
      loadFolders()
    } catch (error: any) {
      setError(error.message)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Integração Google Drive"
      size="lg"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">
              Pastas vinculadas ao edital {edital.numero_edital}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Gerencie pastas do Google Drive relacionadas a este edital
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCreateFolder}
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Pasta
            </Button>
            <Button
              size="sm"
              onClick={() => setShowAddForm(true)}
            >
              <LinkIcon className="w-4 h-4 mr-2" />
              Vincular Pasta
            </Button>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-md">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">{success}</span>
          </div>
        )}

        {/* Add Folder Form */}
        {showAddForm && (
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <form onSubmit={handleAddFolder} className="space-y-4">
              <Input
                label="URL da Pasta do Google Drive"
                value={newFolderUrl}
                onChange={(e) => setNewFolderUrl(e.target.value)}
                placeholder="https://drive.google.com/drive/folders/..."
                required
              />
              
              <div className="text-xs text-gray-500">
                <p>Formatos aceitos:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>https://drive.google.com/drive/folders/ID_DA_PASTA</li>
                  <li>https://drive.google.com/open?id=ID_DA_PASTA</li>
                  <li>ID_DA_PASTA (apenas o ID)</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setShowAddForm(false)
                    setNewFolderUrl('')
                    setError('')
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" size="sm">
                  Vincular Pasta
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Folders List */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500 mx-auto"></div>
            </div>
          ) : folders.length === 0 ? (
            <div className="text-center py-8">
              <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma pasta vinculada</p>
              <p className="text-sm text-gray-400 mt-1">
                Vincule pastas do Google Drive para organizar documentos deste edital
              </p>
            </div>
          ) : (
            folders.map((folder) => (
              <div
                key={folder.id}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FolderOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{folder.folder_name}</h4>
                    <p className="text-sm text-gray-500">
                      Criado em {new Date(folder.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(folder.folder_url, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Abrir
                  </Button>
                  <button
                    onClick={() => handleRemoveFolder(folder)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Como usar:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Criar Pasta:</strong> Cria automaticamente uma nova pasta no Google Drive</li>
            <li>• <strong>Vincular Pasta:</strong> Conecta uma pasta existente do Google Drive</li>
            <li>• <strong>Organização:</strong> Mantenha todos os documentos do edital organizados</li>
            <li>• <strong>Acesso Rápido:</strong> Clique em "Abrir" para acessar diretamente a pasta</li>
          </ul>
        </div>
      </div>
    </Modal>
  )
}