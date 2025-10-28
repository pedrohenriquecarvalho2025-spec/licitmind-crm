/**
 * Widget de Agenda de Disputas
 * Exibe próximas datas de disputa/abertura de editais
 */

import React, { useEffect, useState } from 'react'
import { Calendar, FileText, Clock, MapPin, ArrowRight } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { useOrganization } from '../../../hooks/useOrganization'
import { Spinner } from '../../../components/ui/atoms/Spinner'

interface BiddingEvent {
  id: string
  editalNumber: string
  entity: string
  eventDate: string
  eventType: 'entrega' | 'abertura' | 'disputa'
  daysUntil: number
  isToday: boolean
  isTomorrow: boolean
  status: string
}

export function BiddingSchedule() {
  const { organizationId } = useOrganization()
  const [events, setEvents] = useState<BiddingEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBiddingEvents()
  }, [organizationId])

  const loadBiddingEvents = async () => {
    if (!organizationId) return

    try {
      setLoading(true)

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const thirtyDaysFromNow = new Date()
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

      // Buscar editais com datas futuras
      const { data: editals } = await supabase
        .from('editals')
        .select('id, numero_edital, orgao_entidade, data_entrega_propostas, status')
        .eq('organization_id', organizationId)
        .not('data_entrega_propostas', 'is', null)
        .gte('data_entrega_propostas', today.toISOString())
        .lte('data_entrega_propostas', thirtyDaysFromNow.toISOString())
        .in('status', ['prospectado', 'em_analise', 'documentacao', 'proposta_enviada'])
        .order('data_entrega_propostas', { ascending: true })

      const now = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const biddingEvents: BiddingEvent[] = []

      editals?.forEach((edital) => {
        const eventDate = new Date(edital.data_entrega_propostas)
        const daysUntil = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

        const isToday = eventDate.toDateString() === today.toDateString()
        const isTomorrow = eventDate.toDateString() === tomorrow.toDateString()

        // Determinar tipo de evento baseado no status
        let eventType: BiddingEvent['eventType'] = 'disputa'
        if (edital.status === 'prospectado' || edital.status === 'em_analise') {
          eventType = 'entrega'
        } else if (edital.status === 'documentacao') {
          eventType = 'abertura'
        }

        biddingEvents.push({
          id: edital.id,
          editalNumber: edital.numero_edital,
          entity: edital.orgao_entidade,
          eventDate: edital.data_entrega_propostas,
          eventType,
          daysUntil,
          isToday,
          isTomorrow,
          status: edital.status,
        })
      })

      setEvents(biddingEvents)
    } catch (error) {
      console.error('Error loading bidding events:', error)
    } finally {
      setLoading(false)
    }
  }

  const getEventTypeLabel = (type: BiddingEvent['eventType']) => {
    switch (type) {
      case 'entrega':
        return 'Entrega de Propostas'
      case 'abertura':
        return 'Abertura'
      case 'disputa':
        return 'Disputa'
      default:
        return 'Evento'
    }
  }

  const getEventTypeColor = (type: BiddingEvent['eventType']) => {
    switch (type) {
      case 'entrega':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
      case 'abertura':
        return 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
      case 'disputa':
        return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
      default:
        return 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
    }
  }

  const getDaysText = (event: BiddingEvent) => {
    if (event.isToday) return 'Hoje'
    if (event.isTomorrow) return 'Amanhã'
    return `Em ${event.daysUntil} dias`
  }

  const getDateColor = (event: BiddingEvent) => {
    if (event.isToday) return 'text-red-600 dark:text-red-400 font-bold'
    if (event.isTomorrow) return 'text-orange-600 dark:text-orange-400 font-semibold'
    if (event.daysUntil <= 7) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-neutral-600 dark:text-neutral-400'
  }

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              Agenda de Disputas
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Próximas datas importantes
            </p>
          </div>
        </div>
        {events.length > 0 && (
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold">
            {events.length}
          </span>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Spinner size="md" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">
            Nenhuma disputa programada
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-brand-cyan dark:hover:border-brand-cyan hover:shadow-md transition-all bg-neutral-50 dark:bg-neutral-900/50"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-semibold ${getEventTypeColor(
                        event.eventType
                      )}`}
                    >
                      {getEventTypeLabel(event.eventType)}
                    </span>
                    <span className={`text-sm font-semibold ${getDateColor(event)}`}>
                      {getDaysText(event)}
                    </span>
                  </div>
                  <p className="font-bold text-neutral-900 dark:text-white truncate mb-1">
                    Edital {event.editalNumber}
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{event.entity}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <Clock className="w-4 h-4" />
                  <span>
                    {new Date(event.eventDate).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <button className="text-brand-cyan hover:text-brand-cyan-dark flex items-center space-x-1 text-sm font-semibold transition-colors">
                  <span>Ver edital</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

