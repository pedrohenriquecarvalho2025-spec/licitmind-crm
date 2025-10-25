import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/atoms/Button'
import { Spinner as LoadingSpinner } from '../ui/atoms/Spinner'
import { TaskForm } from './TaskForm'
import { Calendar as CalendarIcon, Clock, Plus, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle, FileText, Users, CreditCard as Edit, Trash2 } from 'lucide-react'
import type { Database } from '../../lib/database.types'

type CalendarTask = Database['public']['Tables']['calendar_tasks']['Row']

interface CalendarEvent {
  id: string
  title: string
  date: string
  time: string
  type: 'deadline' | 'meeting' | 'task'
  priority: 'high' | 'medium' | 'low'
  description?: string
  edital_id?: string
  task?: CalendarTask
}

export function Calendar() {
  const { profile } = useAuth()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [selectedTask, setSelectedTask] = useState<CalendarTask | null>(null)

  useEffect(() => {
    loadEvents()
  }, [profile, currentDate])

  const loadEvents = async () => {
    if (!profile?.organization_id) return

    try {
      setLoading(true)

      const [editalsResult, tasksResult] = await Promise.all([
        supabase
          .from('editals')
          .select('*')
          .eq('organization_id', profile.organization_id)
          .not('data_entrega_propostas', 'is', null),
        supabase
          .from('calendar_tasks')
          .select('*')
          .eq('organization_id', profile.organization_id)
          .eq('status', 'pending')
      ])

      if (editalsResult.error) throw editalsResult.error
      if (tasksResult.error) throw tasksResult.error

      const editalEvents: CalendarEvent[] = editalsResult.data?.map(edital => {
        const deadline = new Date(edital.data_entrega_propostas!)
        const now = new Date()
        const daysUntil = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

        return {
          id: `edital-${edital.id}`,
          title: `Prazo: ${edital.numero_edital}`,
          date: deadline.toISOString().split('T')[0],
          time: deadline.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          type: 'deadline' as const,
          priority: daysUntil <= 3 ? 'high' as const : daysUntil <= 7 ? 'medium' as const : 'low' as const,
          description: edital.objeto,
          edital_id: edital.id
        }
      }) || []

      const taskEvents: CalendarEvent[] = tasksResult.data?.map(task => ({
        id: task.id,
        title: task.title,
        date: task.task_date,
        time: task.task_time || '00:00',
        type: task.type,
        priority: task.priority,
        description: task.description || undefined,
        edital_id: task.edital_id || undefined,
        task
      })) || []

      setEvents([...editalEvents, ...taskEvents])
    } catch (error) {
      console.error('Error loading events:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i)
      days.push({ date: prevDate, isCurrentMonth: false })
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ date: new Date(year, month, day), isCurrentMonth: true })
    }

    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      days.push({ date: new Date(year, month + 1, day), isCurrentMonth: false })
    }

    return days
  }

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return events.filter(event => event.date === dateStr)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1))
      return newDate
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-neutral-100 text-neutral-800 border-neutral-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deadline': return <Clock className="w-3 h-3" />
      case 'meeting': return <Users className="w-3 h-3" />
      case 'task': return <CheckCircle className="w-3 h-3" />
      default: return <CalendarIcon className="w-3 h-3" />
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return

    try {
      const { error } = await supabase
        .from('calendar_tasks')
        .delete()
        .eq('id', taskId)

      if (error) throw error
      loadEvents()
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const handleEditTask = (task: CalendarTask) => {
    setSelectedTask(task)
    setShowTaskForm(true)
  }

  const handleTaskSuccess = () => {
    setShowTaskForm(false)
    setSelectedTask(null)
    loadEvents()
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const days = getDaysInMonth(currentDate)
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-neutral-800">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex bg-neutral-100 rounded-lg p-1">
            {(['month', 'week', 'day'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === mode
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-800'
                }`}
              >
                {mode === 'month' ? 'Mês' : mode === 'week' ? 'Semana' : 'Dia'}
              </button>
            ))}
          </div>
          <Button onClick={() => setShowTaskForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Tarefa
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-brand border border-neutral-200 overflow-hidden">
        <div className="grid grid-cols-7 bg-neutral-50 border-b border-neutral-200">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
            <div key={day} className="p-4 text-center text-sm font-semibold text-neutral-600">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const dayEvents = getEventsForDate(day.date)
            const isToday = day.date.toDateString() === new Date().toDateString()
            const isSelected = selectedDate?.toDateString() === day.date.toDateString()

            return (
              <div
                key={index}
                className={`min-h-32 p-2 border-b border-r border-neutral-100 hover:bg-neutral-50 transition-colors cursor-pointer ${
                  !day.isCurrentMonth ? 'bg-neutral-25 text-neutral-400' : ''
                } ${isSelected ? 'bg-primary-50 border-primary-200' : ''}`}
                onClick={() => setSelectedDate(day.date)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${
                    isToday
                      ? 'w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs'
                      : day.isCurrentMonth ? 'text-neutral-800' : 'text-neutral-400'
                  }`}>
                    {day.date.getDate()}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="w-2 h-2 bg-primary-500 rounded-full" />
                  )}
                </div>

                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className={`text-xs p-1 rounded border ${getPriorityColor(event.priority)} truncate`}
                    >
                      <div className="flex items-center space-x-1">
                        {getTypeIcon(event.type)}
                        <span className="truncate">{event.title}</span>
                      </div>
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-neutral-500 text-center">
                      +{dayEvents.length - 3} mais
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-brand border border-neutral-200 p-6">
        <h3 className="font-bold text-neutral-800 mb-4 flex items-center space-x-2">
          <CalendarIcon className="w-5 h-5 text-primary-500" />
          <span>Eventos de Hoje</span>
        </h3>

        <div className="space-y-3">
          {getEventsForDate(new Date()).map((event) => (
            <div key={event.id} className="flex items-center space-x-4 p-3 bg-neutral-50 rounded-xl">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getPriorityColor(event.priority)}`}>
                {getTypeIcon(event.type)}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-neutral-800">{event.title}</h4>
                <p className="text-sm text-neutral-600">{event.description}</p>
                <p className="text-xs text-neutral-500">{event.time}</p>
              </div>
              <div className="flex items-center space-x-2">
                {event.priority === 'high' && (
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                )}
                {event.task && (
                  <>
                    <button
                      onClick={() => handleEditTask(event.task!)}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(event.id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}

          {getEventsForDate(new Date()).length === 0 && (
            <p className="text-neutral-500 text-center py-8">
              Nenhum evento para hoje
            </p>
          )}
        </div>
      </div>

      <TaskForm
        isOpen={showTaskForm}
        onClose={() => {
          setShowTaskForm(false)
          setSelectedTask(null)
        }}
        task={selectedTask}
        onSuccess={handleTaskSuccess}
      />
    </div>
  )
}
