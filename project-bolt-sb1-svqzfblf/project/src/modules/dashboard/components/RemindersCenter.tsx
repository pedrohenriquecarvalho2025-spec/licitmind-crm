import { useState, useEffect } from 'react'
import { MessageSquare, CheckCircle, Clock, Plus, X, Send } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'

interface Reminder {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  completed: boolean
  created_by: string
  created_at: string
  author_name?: string
}

export function RemindersCenter() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [showForm, setShowForm] = useState(false)
  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low'
  })
  const { profile } = useAuth()

  useEffect(() => {
    loadReminders()
  }, [profile])

  const loadReminders = async () => {
    if (!profile?.organization_id) return

    const { data, error } = await supabase
      .from('reminders')
      .select(`
        *,
        profiles:created_by (full_name)
      `)
      .eq('organization_id', profile.organization_id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (!error && data) {
      setReminders(data.map(r => ({
        ...r,
        author_name: r.profiles?.full_name || 'Usuário'
      })))
    }
  }

  const createReminder = async () => {
    if (!profile?.organization_id || !newReminder.title.trim()) return

    const { error } = await supabase
      .from('reminders')
      .insert({
        ...newReminder,
        organization_id: profile.organization_id,
        created_by: profile.id,
        completed: false
      })

    if (!error) {
      setNewReminder({ title: '', description: '', priority: 'medium' })
      setShowForm(false)
      loadReminders()
    }
  }

  const toggleComplete = async (id: string, completed: boolean) => {
    await supabase
      .from('reminders')
      .update({ completed: !completed })
      .eq('id', id)
    
    loadReminders()
  }

  const deleteReminder = async (id: string) => {
    await supabase
      .from('reminders')
      .delete()
      .eq('id', id)
    
    loadReminders()
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'from-red-500 to-orange-500'
      case 'medium': return 'from-yellow-500 to-orange-400'
      case 'low': return 'from-blue-500 to-cyan-500'
      default: return 'from-neutral-500 to-neutral-600'
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return { text: 'Alta', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' }
      case 'medium': return { text: 'Média', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' }
      case 'low': return { text: 'Baixa', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' }
      default: return { text: 'Normal', color: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400' }
    }
  }

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 bg-gradient-to-br from-brand-tech-purple to-purple-600 rounded-xl flex items-center justify-center shadow-lg`}>
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Central de Lembretes</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Tarefas e recados da equipe</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-gradient-to-r from-brand-tech-purple to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Novo</span>
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-6 p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <input
            type="text"
            placeholder="Título do lembrete..."
            value={newReminder.title}
            onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
            className="w-full px-4 py-2 mb-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-tech-purple text-neutral-900 dark:text-white"
          />
          
          <textarea
            placeholder="Descrição (opcional)..."
            value={newReminder.description}
            onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
            className="w-full px-4 py-2 mb-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-tech-purple text-neutral-900 dark:text-white resize-none"
            rows={2}
          />
          
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {(['high', 'medium', 'low'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setNewReminder({ ...newReminder, priority: p })}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    newReminder.priority === p
                      ? getPriorityBadge(p).color
                      : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  {getPriorityBadge(p).text}
                </button>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={createReminder}
                className="px-4 py-2 bg-gradient-to-r from-brand-tech-purple to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Criar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reminders List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {reminders.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
            <p className="text-neutral-500 dark:text-neutral-400">Nenhum lembrete ainda</p>
            <p className="text-sm text-neutral-400 dark:text-neutral-500">Clique em "Novo" para criar</p>
          </div>
        ) : (
          reminders.map((reminder) => {
            const badge = getPriorityBadge(reminder.priority)
            
            return (
              <div
                key={reminder.id}
                className={`group relative p-4 rounded-xl border-2 transition-all ${
                  reminder.completed
                    ? 'bg-neutral-50 dark:bg-neutral-900/30 border-neutral-200 dark:border-neutral-700 opacity-60'
                    : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:border-brand-tech-purple hover:shadow-lg'
                }`}
              >
                {/* Priority Indicator */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${getPriorityColor(reminder.priority)} rounded-l-xl`} />
                
                <div className="flex items-start space-x-3 ml-2">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleComplete(reminder.id, reminder.completed)}
                    className={`mt-1 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                      reminder.completed
                        ? 'bg-brand-tech-green border-brand-tech-green'
                        : 'border-neutral-300 dark:border-neutral-600 hover:border-brand-tech-purple'
                    }`}
                  >
                    {reminder.completed && <CheckCircle className="w-4 h-4 text-white" />}
                  </button>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className={`font-bold ${reminder.completed ? 'line-through text-neutral-500 dark:text-neutral-500' : 'text-neutral-900 dark:text-white'}`}>
                        {reminder.title}
                      </h4>
                      
                      <button
                        onClick={() => deleteReminder(reminder.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all"
                      >
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                    
                    {reminder.description && (
                      <p className={`text-sm mb-2 ${reminder.completed ? 'text-neutral-400 dark:text-neutral-600' : 'text-neutral-600 dark:text-neutral-400'}`}>
                        {reminder.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${badge.color}`}>
                          {badge.text}
                        </span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-500">
                          por {reminder.author_name}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-xs text-neutral-400 dark:text-neutral-500">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(reminder.created_at).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
