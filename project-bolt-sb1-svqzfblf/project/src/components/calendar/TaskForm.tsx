import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { ModalBase as Modal } from '../ui/molecules/ModalBase'
import { Button } from '../ui/atoms/Button'
import { Input } from '../ui/atoms/Input'
import { Select } from '../ui/molecules/Select'
import { Calendar, Clock, AlertCircle } from 'lucide-react'
import type { Database } from '../../lib/database.types'

type CalendarTask = Database['public']['Tables']['calendar_tasks']['Row']
type CalendarTaskInsert = Database['public']['Tables']['calendar_tasks']['Insert']

interface TaskFormProps {
  isOpen: boolean
  onClose: () => void
  task?: CalendarTask | null
  onSuccess: () => void
  defaultDate?: string
}

export function TaskForm({ isOpen, onClose, task, onSuccess, defaultDate }: TaskFormProps) {
  const { profile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editals, setEditals] = useState<Array<{ id: string; numero_edital: string }>>([])
  const [users, setUsers] = useState<Array<{ id: string; full_name: string }>>([])

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    task_date: defaultDate || new Date().toISOString().split('T')[0],
    task_time: '',
    type: 'task' as 'task' | 'meeting' | 'deadline',
    priority: 'medium' as 'high' | 'medium' | 'low',
    edital_id: '',
    assigned_to: ''
  })

  useEffect(() => {
    if (isOpen) {
      loadEditals()
      loadUsers()

      if (task) {
        setFormData({
          title: task.title,
          description: task.description || '',
          task_date: task.task_date,
          task_time: task.task_time || '',
          type: task.type,
          priority: task.priority,
          edital_id: task.edital_id || '',
          assigned_to: task.assigned_to || ''
        })
      } else {
        setFormData({
          title: '',
          description: '',
          task_date: defaultDate || new Date().toISOString().split('T')[0],
          task_time: '',
          type: 'task',
          priority: 'medium',
          edital_id: '',
          assigned_to: ''
        })
      }
    }
  }, [isOpen, task, defaultDate])

  const loadEditals = async () => {
    if (!profile?.organization_id) return

    try {
      const { data, error } = await supabase
        .from('editals')
        .select('id, numero_edital')
        .eq('organization_id', profile.organization_id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      setEditals(data || [])
    } catch (error) {
      console.error('Error loading editals:', error)
    }
  }

  const loadUsers = async () => {
    if (!profile?.organization_id) return

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, full_name')
        .eq('organization_id', profile.organization_id)
        .eq('is_active', true)
        .order('full_name')

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error loading users:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!profile?.organization_id || !profile.id) {
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

      const taskData: CalendarTaskInsert = {
        organization_id: profile.organization_id,
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        task_date: formData.task_date,
        task_time: formData.task_time || null,
        type: formData.type,
        priority: formData.priority,
        edital_id: formData.edital_id || null,
        assigned_to: formData.assigned_to || null,
        created_by: profile.id
      }

      if (task) {
        const { error } = await supabase
          .from('calendar_tasks')
          .update(taskData)
          .eq('id', task.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('calendar_tasks')
          .insert(taskData)

        if (error) throw error
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Editar Tarefa' : 'Nova Tarefa'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2 text-red-800">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Descrição detalhada da tarefa..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
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
          >
            <option value="task">Tarefa</option>
            <option value="meeting">Reunião</option>
            <option value="deadline">Prazo</option>
          </Select>

          <Select
            label="Prioridade"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
          >
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
          </Select>
        </div>

        <Select
          label="Edital Relacionado (opcional)"
          value={formData.edital_id}
          onChange={(e) => setFormData({ ...formData, edital_id: e.target.value })}
        >
          <option value="">Nenhum</option>
          {editals.map(edital => (
            <option key={edital.id} value={edital.id}>
              {edital.numero_edital}
            </option>
          ))}
        </Select>

        <Select
          label="Atribuir Para (opcional)"
          value={formData.assigned_to}
          onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
        >
          <option value="">Nenhum</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.full_name}
            </option>
          ))}
        </Select>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : task ? 'Atualizar' : 'Criar Tarefa'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
