import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { RemindersCenter } from './RemindersCenter'
import { QuickLinks } from './QuickLinks'
import { RecentActivity } from './RecentActivity'

export function Dashboard() {
  const { profile } = useAuth()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'Bom dia'
    if (hour < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-blue-dark rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black mb-2 flex items-center space-x-3">
              <Sparkles className="w-8 h-8" />
              <span>{getGreeting()}, {profile?.full_name?.split(' ')[0] || 'Usuário'}!</span>
            </h1>
            <p className="text-white/90 text-lg">
              {currentTime.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-white/80 text-sm font-semibold">Central de Produtividade</p>
            <p className="text-2xl font-bold">{currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>
      </div>

      {/* Main Grid - 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Central de Lembretes */}
          <RemindersCenter />
          
          {/* Últimas Atividades */}
          <RecentActivity />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Botões de Acesso Rápido */}
          <QuickLinks />
        </div>
      </div>
    </div>
  )
}