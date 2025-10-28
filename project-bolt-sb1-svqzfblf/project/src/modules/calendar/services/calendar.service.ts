/**
 * Serviço de acesso a dados de Calendar
 */

import { supabase } from '../../../lib/supabase'
import type { CalendarTask, TaskFilters } from '../types'
import { logger } from '../../../core/utils'
import { auditService } from '../../../core/services/audit.service'

export class CalendarService {
  private tableName = 'calendar_tasks'

  async list(organizationId: string, filters?: TaskFilters) {
    try {
      let query = supabase
        .from(this.tableName)
        .select(`
          *,
          assigned_user:assigned_to(full_name),
          edital:edital_id(numero_edital)
        `)
        .eq('organization_id', organizationId)

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      if (filters?.type) {
        query = query.eq('type', filters.type)
      }

      if (filters?.priority) {
        query = query.eq('priority', filters.priority)
      }

      if (filters?.assigned_to) {
        query = query.eq('assigned_to', filters.assigned_to)
      }

      if (filters?.edital_id) {
        query = query.eq('edital_id', filters.edital_id)
      }

      if (filters?.start_date) {
        query = query.gte('task_date', filters.start_date)
      }

      if (filters?.end_date) {
        query = query.lte('task_date', filters.end_date)
      }

      query = query.order('task_date', { ascending: true })

      const { data, error } = await query

      if (error) throw error
      return { data: data as CalendarTask[], error: null }
    } catch (error) {
      logger.error('Error listing tasks:', error)
      return { data: null, error }
    }
  }

  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select(`
          *,
          assigned_user:assigned_to(full_name),
          edital:edital_id(numero_edital)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return { data: data as CalendarTask, error: null }
    } catch (error) {
      logger.error('Error getting task:', error)
      return { data: null, error }
    }
  }

  async create(task: Omit<CalendarTask, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .insert({
          ...task,
          status: 'pending',
        })
        .select()
        .single()

      if (error) throw error

      // Registrar no audit log
      const createdTask = data as CalendarTask
      await auditService.logCreate(
        task.created_by,
        task.organization_id,
        'task',
        createdTask.id,
        createdTask.title
      )

      return { data: createdTask, error: null }
    } catch (error) {
      logger.error('Error creating task:', error)
      return { data: null, error }
    }
  }

  async update(id: string, updates: Partial<CalendarTask>, userId?: string) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Registrar no audit log
      const updatedTask = data as CalendarTask
      if (userId && updatedTask.organization_id) {
        await auditService.logUpdate(
          userId,
          updatedTask.organization_id,
          'task',
          updatedTask.id,
          updatedTask.title,
          updates
        )
      }

      return { data: updatedTask, error: null }
    } catch (error) {
      logger.error('Error updating task:', error)
      return { data: null, error }
    }
  }

  async delete(id: string, userId?: string) {
    try {
      // Buscar dados da tarefa antes de deletar para o audit log
      const { data: taskData } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single()

      const { error } = await supabase.from(this.tableName).delete().eq('id', id)

      if (error) throw error

      // Registrar no audit log
      if (taskData && userId) {
        const task = taskData as CalendarTask
        if (task.organization_id) {
          await auditService.logDelete(
            userId,
            task.organization_id,
            'task',
            task.id,
            task.title
          )
        }
      }

      return { data: true, error: null }
    } catch (error) {
      logger.error('Error deleting task:', error)
      return { data: null, error }
    }
  }

  async markAsCompleted(id: string, userId: string) {
    return this.update(
      id,
      {
        status: 'completed',
        completed_at: new Date().toISOString(),
      },
      userId
    )
  }

  async markAsPending(id: string, userId: string) {
    return this.update(
      id,
      {
        status: 'pending',
        completed_at: null,
      },
      userId
    )
  }
}

export const calendarService = new CalendarService()

