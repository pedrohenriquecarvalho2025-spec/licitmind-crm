/**
 * Serviço de Notificações em Tempo Real
 * Integração completa com Supabase Realtime
 */

import { supabase } from '../../lib/supabase'
import { RealtimeChannel } from '@supabase/supabase-js'

export interface Notification {
  id: string
  user_id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  link?: string
  read: boolean
  created_at: string
}

export type NotificationCallback = (notification: Notification) => void

export class RealtimeNotificationsService {
  private static instance: RealtimeNotificationsService
  private channel: RealtimeChannel | null = null
  private callbacks: NotificationCallback[] = []

  private constructor() {}

  static getInstance(): RealtimeNotificationsService {
    if (!RealtimeNotificationsService.instance) {
      RealtimeNotificationsService.instance = new RealtimeNotificationsService()
    }
    return RealtimeNotificationsService.instance
  }

  /**
   * Inicia a escuta de notificações em tempo real
   */
  async subscribe(userId: string) {
    if (this.channel) {
      this.unsubscribe()
    }

    this.channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const notification = payload.new as Notification
          this.notifyCallbacks(notification)
        }
      )
      .subscribe()
  }

  /**
   * Para de escutar notificações
   */
  unsubscribe() {
    if (this.channel) {
      supabase.removeChannel(this.channel)
      this.channel = null
    }
  }

  /**
   * Registra um callback para receber notificações
   */
  onNotification(callback: NotificationCallback) {
    this.callbacks.push(callback)
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback)
    }
  }

  /**
   * Notifica todos os callbacks registrados
   */
  private notifyCallbacks(notification: Notification) {
    this.callbacks.forEach(callback => {
      try {
        callback(notification)
      } catch (error) {
        console.error('Error in notification callback:', error)
      }
    })
  }

  /**
   * Cria uma nova notificação
   */
  async createNotification(data: Omit<Notification, 'id' | 'created_at' | 'read'>) {
    const { error } = await supabase.from('notifications').insert({
      ...data,
      read: false,
    })

    if (error) throw error
  }

  /**
   * Marca notificação como lida
   */
  async markAsRead(notificationId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)

    if (error) throw error
  }

  /**
   * Marca todas como lidas
   */
  async markAllAsRead(userId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false)

    if (error) throw error
  }

  /**
   * Lista notificações do usuário
   */
  async listNotifications(userId: string, limit = 50) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data as Notification[]
  }

  /**
   * Conta notificações não lidas
   */
  async countUnread(userId: string) {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false)

    if (error) throw error
    return count || 0
  }

  /**
   * Deleta uma notificação
   */
  async deleteNotification(notificationId: string) {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)

    if (error) throw error
  }

  /**
   * Helpers para criar notificações específicas
   */
  async notifyDocumentExpiring(userId: string, documentName: string, daysUntil: number) {
    return this.createNotification({
      user_id: userId,
      type: 'warning',
      title: 'Documento Próximo do Vencimento',
      message: `O documento "${documentName}" vence em ${daysUntil} ${daysUntil === 1 ? 'dia' : 'dias'}`,
      link: '/documents',
    })
  }

  async notifyEditalDeadline(userId: string, editalNumber: string, hours: number) {
    return this.createNotification({
      user_id: userId,
      type: 'error',
      title: 'Prazo de Edital se Aproximando',
      message: `Edital ${editalNumber} - Faltam ${hours} horas para o prazo final`,
      link: '/editals',
    })
  }

  async notifyContractExpiring(userId: string, contractNumber: string, days: number) {
    return this.createNotification({
      user_id: userId,
      type: 'warning',
      title: 'Contrato Próximo do Vencimento',
      message: `Contrato ${contractNumber} vence em ${days} ${days === 1 ? 'dia' : 'dias'}`,
      link: '/contracts',
    })
  }

  async notifyQuotationReceived(userId: string, supplierName: string) {
    return this.createNotification({
      user_id: userId,
      type: 'success',
      title: 'Nova Cotação Recebida',
      message: `${supplierName} enviou uma cotação`,
      link: '/quotations',
    })
  }

  async notifyTaskAssigned(userId: string, taskTitle: string) {
    return this.createNotification({
      user_id: userId,
      type: 'info',
      title: 'Nova Tarefa Atribuída',
      message: `Você foi atribuído à tarefa: ${taskTitle}`,
      link: '/calendar',
    })
  }
}

export const realtimeNotifications = RealtimeNotificationsService.getInstance()

