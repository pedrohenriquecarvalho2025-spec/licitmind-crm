/**
 * Interface Contratual do Módulo de Calendar
 */

import { calendarService } from './services/calendar.service'
import type { CalendarTask, TaskFilters } from './types'

export interface CalendarAPI {
  listTasks: (organizationId: string, filters?: TaskFilters) => Promise<CalendarTask[]>
  getTask: (id: string) => Promise<CalendarTask | null>
  createTask: (task: Omit<CalendarTask, 'id' | 'created_at' | 'updated_at'>) => Promise<CalendarTask | null>
  updateTask: (id: string, updates: Partial<CalendarTask>, userId?: string) => Promise<CalendarTask | null>
  deleteTask: (id: string, userId?: string) => Promise<boolean>
  markAsCompleted: (id: string, userId: string) => Promise<CalendarTask | null>
  markAsPending: (id: string, userId: string) => Promise<CalendarTask | null>
}

class CalendarAPIImpl implements CalendarAPI {
  async listTasks(organizationId: string, filters?: TaskFilters) {
    const { data } = await calendarService.list(organizationId, filters)
    return data || []
  }

  async getTask(id: string) {
    const { data } = await calendarService.getById(id)
    return data
  }

  async createTask(task: Omit<CalendarTask, 'id' | 'created_at' | 'updated_at'>) {
    const { data } = await calendarService.create(task)
    return data
  }

  async updateTask(id: string, updates: Partial<CalendarTask>, userId?: string) {
    const { data } = await calendarService.update(id, updates, userId)
    return data
  }

  async deleteTask(id: string, userId?: string) {
    const { data } = await calendarService.delete(id, userId)
    return data || false
  }

  async markAsCompleted(id: string, userId: string) {
    const { data } = await calendarService.markAsCompleted(id, userId)
    return data
  }

  async markAsPending(id: string, userId: string) {
    const { data } = await calendarService.markAsPending(id, userId)
    return data
  }
}

export const calendarAPI: CalendarAPI = new CalendarAPIImpl()

