import { useEffect, useState } from 'react'
import { Activity, FileText, CheckCircle, Clock, User, Calendar } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'

interface ActivityItem {
  id: string
  action: string
  entity_type: string
  entity_name: string
  user_name: string
  created_at: string
}

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const { profile } = useAuth()

  useEffect(() => {
    loadActivities()
  }, [profile])

  const loadActivities = async () => {
    if (!profile?.organization_id) return

    try {
      setLoading(true)

      // Get recent editals changes
      const { data: editals } = await supabase
        .from('editals')
        .select(`
          id,
          numero_edital,
          status,
          created_at,
          updated_at,
          profiles:created_by (full_name)
        `)
        .eq('organization_id', profile.organization_id)
        .order('updated_at', { ascending: false })
        .limit(10)

      const activities: ActivityItem[] = []

      editals?.forEach((edital) => {
        const isNew = new Date(edital.created_at).getTime() === new Date(edital.updated_at).getTime()
        
        activities.push({
          id: edital.id,
          action: isNew ? 'criou' : 'atualizou',
          entity_type: 'edital',
          entity_name: edital.numero_edital || 'Edital sem número',
          user_name: edital.profiles?.full_name || 'Usuário',
          created_at: edital.updated_at
        })
      })

      // Sort by date
      activities.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )

      setActivities(activities.slice(0, 15))
    } catch (error) {
      console.error('Error loading activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (entityType: string, action: string) => {
    if (action === 'criou') return FileText
    if (action === 'atualizou') return Activity
    if (action === 'concluiu') return CheckCircle
    return Clock
  }

  const getActivityColor = (action: string) => {
    switch (action) {
      case 'criou': return 'from-brand-tech-green to-emerald-500'
      case 'atualizou': return 'from-brand-cyan to-brand-blue'
      case 'concluiu': return 'from-brand-tech-purple to-purple-600'
      default: return 'from-neutral-500 to-neutral-600'
    }
  }

  const formatTimeAgo = (date: string) => {
    const now = new Date()
    const past = new Date(date)
    const diffMs = now.getTime() - past.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Agora'
    if (diffMins < 60) return `${diffMins}min atrás`
    if (diffHours < 24) return `${diffHours}h atrás`
    if (diffDays < 7) return `${diffDays}d atrás`
    return past.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  }

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-brand-tech-orange to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Últimas Atividades</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Ações recentes da equipe</p>
        </div>
      </div>

      {/* Activities List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-brand-cyan border-t-transparent rounded-full mx-auto"></div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-3">Carregando...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
            <p className="text-neutral-500 dark:text-neutral-400">Nenhuma atividade recente</p>
            <p className="text-sm text-neutral-400 dark:text-neutral-500">As ações da equipe aparecerão aqui</p>
          </div>
        ) : (
          activities.map((activity) => {
            const Icon = getActivityIcon(activity.entity_type, activity.action)
            const color = getActivityColor(activity.action)
            
            return (
              <div
                key={activity.id}
                className="group flex items-start space-x-3 p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-all"
              >
                {/* Icon */}
                <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center flex-shrink-0 shadow-md`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-neutral-900 dark:text-white">
                    <span className="font-semibold">{activity.user_name}</span>
                    {' '}
                    <span className="text-neutral-600 dark:text-neutral-400">{activity.action}</span>
                    {' '}
                    <span className="font-semibold text-brand-cyan">{activity.entity_name}</span>
                  </p>
                  
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="w-3 h-3 text-neutral-400 dark:text-neutral-500" />
                    <span className="text-xs text-neutral-500 dark:text-neutral-500">
                      {formatTimeAgo(activity.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* View All Link */}
      {activities.length > 0 && (
        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <button className="w-full text-center text-sm font-semibold text-brand-cyan hover:text-brand-blue transition-colors">
            Ver todas as atividades →
          </button>
        </div>
      )}
    </div>
  )
}
