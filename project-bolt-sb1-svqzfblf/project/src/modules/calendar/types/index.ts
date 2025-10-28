/**
 * Tipos do módulo de Calendar
 */

import type { OrganizationEntity, UUID } from '../../../types/common'

export type TaskType = 'task' | 'meeting' | 'deadline'
export type TaskPriority = 'high' | 'medium' | 'low'
export type TaskStatus = 'pending' | 'completed' | 'cancelled'

export interface CalendarTask extends OrganizationEntity {
  title: string
  description: string | null
  task_date: string
  task_time: string | null
  type: TaskType
  priority: TaskPriority
  status: TaskStatus
  edital_id: UUID | null
  assigned_to: UUID | null
  completed_at: string | null
  created_by: UUID
}

export interface TaskFilters {
  status?: TaskStatus
  type?: TaskType
  priority?: TaskPriority
  assigned_to?: UUID
  edital_id?: UUID
  start_date?: string
  end_date?: string
}

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  task: 'Tarefa',
  meeting: 'Reunião',
  deadline: 'Prazo',
}

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  high: 'Alta',
  medium: 'Média',
  low: 'Baixa',
}

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  pending: 'Pendente',
  completed: 'Concluída',
  cancelled: 'Cancelada',
}

