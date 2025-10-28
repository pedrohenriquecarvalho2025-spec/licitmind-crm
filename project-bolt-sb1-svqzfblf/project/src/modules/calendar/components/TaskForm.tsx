/**
 * Formulário de Tarefa com CRUD completo
 */

import React, { useState, useEffect } from 'react'
import { X, AlertCircle, Trash2 } from 'lucide-react'
import { Button } from '../../../components/ui/atoms/Button'
import { Input } from '../../../components/ui/atoms/Input'
import { Select } from '../../../components/ui/atoms/Select'
import { useAuth, useOrganization } from '../../../hooks'
import { calendarAPI } from '../calendar.api'
import { editalsAPI } from '../../editals/editals.api'
import { usersAPI } from '../../users/users.api'
import type { CalendarTask } from '../types'

interface TaskFormProps {
  task?: CalendarTask | null
  onClose: () => void
  onSuccess: () => void
  defaultDate?: string
}

export function TaskForm({ task, onClose, onSuccess, defaultDate }: TaskFormProps) {
  const { user } = useAuth()
  const { organizationId } = useOrganization()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [editals, setEditals] = useState<Array<{ id: string; numero_edital: string }>>([])
  const [users, setUsers] = useState<Array<{ id: string; full_name: string }>>([])

  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    task_date: task?.task_date || defaultDate || new Date().toISOString().split('T')[0],
    task_time: task?.task_time || '',
    type: task?.type || ('task' as const),
    priority: task?.priority || ('medium' as const),
    edital_id: task?.edital_id || '',
    assigned_to: task?.assigned_to || '',
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    if (!organizationId) return

    try {
      const [editalsData, usersData] = await Promise.all([
        editalsAPI.listEditals(organizationId),
        usersAPI.listUsers(organizationId),
      ])

      setEditals(
        editalsData.map((e) => ({ id: e.id, numero_edital: e.numero_edital }))
      )
      setUsers(usersData.map((u) => ({ id: u.id, full_name: u.full_name })))
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!organizationId || !user) {
      setError('Usuário não autenticado')
      return
    }

    if (!formData.title.trim()) {
      setError('Título é obrigatório')
      return
    }

    try {
      setLoading(true)
      setError('')

      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        task_date: formData.task_date,
        task_time: formData.task_time || null,
        type: formData.type,
        priority: formData.priority,
        edital_id: formData.edital_id || null,
        assigned_to: formData.assigned_to || null,
        organization_id: organizationId,
        created_by: user.id,
      }

      if (task) {
        await calendarAPI.updateTask(task.id, taskData, user.id)
      } else {
        await calendarAPI.createTask(taskData as any)
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      console.error('Error saving task:', err)
      setError(err.message || 'Erro ao salvar tarefa')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!task || !user) return

    if (!confirm(`Tem certeza que deseja excluir a tarefa "${task.title}"?`)) return

    try {
      setDeleting(true)
      await calendarAPI.deleteTask(task.id, user.id)
      onSuccess()
      onClose()
    } catch (err: any) {
      console.error('Error deleting task:', err)
      setError(err.message || 'Erro ao excluir tarefa')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            {task ? 'Editar Tarefa' : 'Nova Tarefa'}
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-start space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <Input
            label="Título"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Ex: Reunião com equipe"
            required
          />

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrição detalhada da tarefa..."
              rows={3}
              className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-neutral-900 dark:text-white resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Data"
              type="date"
              value={formData.task_date}
              onChange={(e) => setFormData({ ...formData, task_date: e.target.value })}
              required
            />

            <Input
              label="Horário (opcional)"
              type="time"
              value={formData.task_time}
              onChange={(e) => setFormData({ ...formData, task_time: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Tipo"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              options={[
                { value: 'task', label: 'Tarefa' },
                { value: 'meeting', label: 'Reunião' },
                { value: 'deadline', label: 'Prazo' },
              ]}
            />

            <Select
              label="Prioridade"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
              options={[
                { value: 'low', label: 'Baixa' },
                { value: 'medium', label: 'Média' },
                { value: 'high', label: 'Alta' },
              ]}
            />
          </div>

          <Select
            label="Edital Relacionado (opcional)"
            value={formData.edital_id}
            onChange={(e) => setFormData({ ...formData, edital_id: e.target.value })}
            options={[
              { value: '', label: 'Nenhum' },
              ...editals.map((e) => ({ value: e.id, label: e.numero_edital })),
            ]}
          />

          <Select
            label="Atribuir Para (opcional)"
            value={formData.assigned_to}
            onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
            options={[
              { value: '', label: 'Nenhum' },
              ...users.map((u) => ({ value: u.id, label: u.full_name })),
            ]}
          />

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-700">
            {task ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleDelete}
                disabled={deleting}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {deleting ? 'Excluindo...' : 'Excluir'}
              </Button>
            ) : (
              <div />
            )}

            <div className="flex items-center space-x-3">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancelar
              </Button>
              <Button type="submit" loading={loading}>
                {task ? 'Salvar' : 'Criar Tarefa'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
