/**
 * Modal de detalhes do Edital com abas
 * Exibe informações completas, documentos, cronograma, anotações e histórico
 */

import React, { useState, useEffect } from 'react'
import {
  X,
  FileText,
  Calendar,
  MessageSquare,
  History,
  Upload,
  Download,
  Trash2,
  Plus,
  Clock,
  User,
  Edit2,
} from 'lucide-react'
import { Button } from '../../../components/ui/atoms/Button'
import { Input } from '../../../components/ui/atoms/Input'
import { Spinner } from '../../../components/ui/atoms/Spinner'
import { StatusBadge } from '../../../components/ui/StatusBadge'
import type { Edital } from '../types'
import { formatCurrency, formatDate } from '../../../core/utils'
import { STATUS_LABELS, MODALIDADE_LABELS } from '../types'
import { useAuth, useOrganization } from '../../../hooks'
import { supabase } from '../../../lib/supabase'

type TabType = 'info' | 'documents' | 'schedule' | 'notes' | 'history'

interface EditalDetailsModalProps {
  edital: Edital
  onClose: () => void
  onEdit: () => void
  onUpdate: () => void
}

interface Document {
  id: string
  name: string
  type: string
  size: number
  url: string
  uploaded_at: string
  uploaded_by: string
}

interface ScheduleEvent {
  id: string
  title: string
  date: string
  description?: string
  completed: boolean
}

interface Note {
  id: string
  content: string
  created_by: string
  created_at: string
  user?: { full_name: string }
}

interface ActivityLog {
  id: string
  action: string
  description: string
  created_at: string
  user?: { full_name: string }
}

export function EditalDetailsModal({
  edital,
  onClose,
  onEdit,
  onUpdate,
}: EditalDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('info')
  const [documents, setDocuments] = useState<Document[]>([])
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(false)
  const [newNote, setNewNote] = useState('')
  const { user } = useAuth()
  const { organizationId } = useOrganization()

  useEffect(() => {
    if (activeTab === 'documents') loadDocuments()
    if (activeTab === 'schedule') loadSchedule()
    if (activeTab === 'notes') loadNotes()
    if (activeTab === 'history') loadActivityLogs()
  }, [activeTab, edital.id])

  const loadDocuments = async () => {
    // Implementar busca de documentos relacionados ao edital
    setLoading(true)
    try {
      const { data } = await supabase
        .from('documents')
        .select('*')
        .eq('edital_id', edital.id)
        .order('created_at', { ascending: false })

      setDocuments((data as any) || [])
    } catch (error) {
      console.error('Error loading documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadSchedule = async () => {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('calendar_tasks')
        .select('*')
        .eq('edital_id', edital.id)
        .order('date', { ascending: true })

      setScheduleEvents((data as any) || [])
    } catch (error) {
      console.error('Error loading schedule:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadNotes = async () => {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('comments')
        .select('*, user:user_profiles(full_name)')
        .eq('edital_id', edital.id)
        .order('created_at', { ascending: false })

      setNotes((data as any) || [])
    } catch (error) {
      console.error('Error loading notes:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadActivityLogs = async () => {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('activity_logs')
        .select('*, user:user_profiles(full_name)')
        .eq('entity_id', edital.id)
        .eq('entity_type', 'edital')
        .order('created_at', { ascending: false })
        .limit(50)

      setActivityLogs((data as any) || [])
    } catch (error) {
      console.error('Error loading activity logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddNote = async () => {
    if (!newNote.trim() || !user) return

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          edital_id: edital.id,
          user_id: user.id,
          comment: newNote,
          is_internal: true,
        })
        .select('*, user:user_profiles(full_name)')
        .single()

      if (!error && data) {
        setNotes([data as any, ...notes])
        setNewNote('')
      }
    } catch (error) {
      console.error('Error adding note:', error)
    }
  }

  const handleToggleScheduleEvent = async (eventId: string, completed: boolean) => {
    try {
      await supabase
        .from('calendar_tasks')
        .update({ completed: !completed })
        .eq('id', eventId)

      setScheduleEvents(
        scheduleEvents.map((e) => (e.id === eventId ? { ...e, completed: !completed } : e))
      )
    } catch (error) {
      console.error('Error updating schedule event:', error)
    }
  }

  const tabs = [
    { id: 'info' as TabType, label: 'Informações', icon: FileText },
    { id: 'documents' as TabType, label: 'Documentos', icon: Upload },
    { id: 'schedule' as TabType, label: 'Cronograma', icon: Calendar },
    { id: 'notes' as TabType, label: 'Anotações', icon: MessageSquare },
    { id: 'history' as TabType, label: 'Histórico', icon: History },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-xl font-bold text-white truncate">
                Edital {edital.numero_edital}
              </h2>
              <StatusBadge status={edital.status} label={STATUS_LABELS[edital.status]} />
            </div>
            <p className="text-primary-100 text-sm truncate">{edital.orgao_entidade}</p>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <Button variant="outline" size="sm" onClick={onEdit} className="text-white border-white/30 hover:bg-white/10">
              <Edit2 className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50">
          <div className="flex space-x-1 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Tab: Informações */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Modalidade
                  </label>
                  <p className="mt-1 text-neutral-900 dark:text-white">
                    {MODALIDADE_LABELS[edital.modalidade]}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Valor Estimado
                  </label>
                  <p className="mt-1 text-neutral-900 dark:text-white font-bold text-lg">
                    {edital.valor_estimado ? formatCurrency(edital.valor_estimado) : 'Não informado'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Data de Publicação
                  </label>
                  <p className="mt-1 text-neutral-900 dark:text-white">
                    {edital.data_publicacao ? formatDate(edital.data_publicacao) : 'Não informada'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Data de Entrega
                  </label>
                  <p className="mt-1 text-neutral-900 dark:text-white">
                    {edital.data_entrega_propostas
                      ? formatDate(edital.data_entrega_propostas)
                      : 'Não informada'}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Objeto
                </label>
                <p className="mt-2 text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-lg">
                  {edital.objeto}
                </p>
              </div>

              {edital.observacoes && (
                <div>
                  <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Observações
                  </label>
                  <p className="mt-2 text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-lg">
                    {edital.observacoes}
                  </p>
                </div>
              )}

              {edital.arquivo_url && (
                <div>
                  <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2 block">
                    Arquivo Anexado
                  </label>
                  <a
                    href={edital.arquivo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>{edital.arquivo_nome || 'Baixar edital'}</span>
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Tab: Documentos */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Spinner size="lg" />
                </div>
              ) : documents.length === 0 ? (
                <div className="text-center py-12">
                  <Upload className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
                  <p className="text-neutral-500 dark:text-neutral-400">
                    Nenhum documento anexado
                  </p>
                  <Button size="sm" className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Documento
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-neutral-900 dark:text-white truncate">
                            {doc.name}
                          </p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            {formatDate(doc.uploaded_at)} • {(doc.size / 1024).toFixed(0)} KB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button size="sm" variant="ghost">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab: Cronograma */}
          {activeTab === 'schedule' && (
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Spinner size="lg" />
                </div>
              ) : scheduleEvents.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
                  <p className="text-neutral-500 dark:text-neutral-400">
                    Nenhum evento no cronograma
                  </p>
                  <Button size="sm" className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Evento
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {scheduleEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start space-x-3 p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg"
                    >
                      <input
                        type="checkbox"
                        checked={event.completed}
                        onChange={() => handleToggleScheduleEvent(event.id, event.completed)}
                        className="mt-1 w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                      />
                      <div className="flex-1">
                        <p
                          className={`font-medium ${
                            event.completed
                              ? 'line-through text-neutral-500 dark:text-neutral-400'
                              : 'text-neutral-900 dark:text-white'
                          }`}
                        >
                          {event.title}
                        </p>
                        {event.description && (
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                            {event.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-2 mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab: Anotações */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              {/* Add Note */}
              <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-lg">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Digite sua anotação..."
                  rows={3}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-neutral-800 dark:text-white resize-none"
                />
                <div className="flex justify-end mt-2">
                  <Button size="sm" onClick={handleAddNote} disabled={!newNote.trim()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Anotação
                  </Button>
                </div>
              </div>

              {/* Notes List */}
              {loading ? (
                <div className="flex justify-center py-12">
                  <Spinner size="lg" />
                </div>
              ) : notes.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
                  <p className="text-neutral-500 dark:text-neutral-400">
                    Nenhuma anotação ainda
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            {note.user?.full_name || 'Usuário'}
                          </span>
                        </div>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          {formatDate(note.created_at)}
                        </span>
                      </div>
                      <p className="text-neutral-900 dark:text-white whitespace-pre-wrap">
                        {note.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab: Histórico */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Spinner size="lg" />
                </div>
              ) : activityLogs.length === 0 ? (
                <div className="text-center py-12">
                  <History className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
                  <p className="text-neutral-500 dark:text-neutral-400">
                    Nenhuma atividade registrada
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activityLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start space-x-3 p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary-600 mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-neutral-900 dark:text-white">{log.description}</p>
                        <div className="flex items-center space-x-2 mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                          <User className="w-3 h-3" />
                          <span>{log.user?.full_name || 'Sistema'}</span>
                          <span>•</span>
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(log.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

