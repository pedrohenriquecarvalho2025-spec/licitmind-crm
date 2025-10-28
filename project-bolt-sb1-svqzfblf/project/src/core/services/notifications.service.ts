/**
 * Serviço de Notificações
 * Gerencia notificações do sistema com suporte a real-time (Supabase)
 */

import { supabase } from '../../lib/supabase'
import { logger } from '../utils/logger'

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  action_url?: string | null
  metadata?: Record<string, any> | null
  created_at: string
}

export interface NotificationCreateData {
  user_id: string
  title: string
  message: string
  type?: 'info' | 'success' | 'warning' | 'error'
  action_url?: string | null
  metadata?: Record<string, any> | null
}

export class NotificationsService {
  private readonly tableName = 'notifications'

  /**
   * Lista notificações do usuário
   */
  async list(userId: string, limit: number = 50): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      return data || []
    } catch (error) {
      logger.error('Error listing notifications', { error, userId })
      // Retorna array vazio se tabela não existe
      return []
    }
  }

  /**
   * Cria nova notificação
   */
  async create(data: NotificationCreateData): Promise<Notification | null> {
    try {
      const insertData = {
        user_id: data.user_id,
        title: data.title,
        message: data.message,
        type: data.type || 'info',
        read: false,
        action_url: data.action_url,
        metadata: data.metadata,
        created_at: new Date().toISOString()
      }

      const { data: notification, error } = await supabase
        .from(this.tableName)
        .insert(insertData)
        .select()
        .single()

      if (error) throw error

      logger.info('Notification created', { notificationId: notification.id })

      return notification
    } catch (error) {
      logger.error('Error creating notification', { error, data })
      return null
    }
  }

  /**
   * Marca notificação como lida
   */
  async markAsRead(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .update({ read: true })
        .eq('id', id)

      if (error) throw error

      logger.info('Notification marked as read', { notificationId: id })
    } catch (error) {
      logger.error('Error marking notification as read', { error, id })
    }
  }

  /**
   * Marca todas notificações como lidas
   */
  async markAllAsRead(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false)

      if (error) throw error

      logger.info('All notifications marked as read', { userId })
    } catch (error) {
      logger.error('Error marking all notifications as read', { error, userId })
    }
  }

  /**
   * Deleta notificação
   */
  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id)

      if (error) throw error

      logger.info('Notification deleted', { notificationId: id })
    } catch (error) {
      logger.error('Error deleting notification', { error, id })
    }
  }

  /**
   * Conta notificações não lidas
   */
  async countUnread(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from(this.tableName)
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false)

      if (error) throw error

      return count || 0
    } catch (error) {
      logger.error('Error counting unread notifications', { error, userId })
      return 0
    }
  }

  /**
   * Subscreve a notificações em tempo real
   */
  subscribeToNotifications(userId: string, callback: (notification: Notification) => void) {
    const subscription = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: this.tableName,
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          callback(payload.new as Notification)
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  /**
   * Cria notificações em massa
   */
  async createBulk(notifications: NotificationCreateData[]): Promise<void> {
    try {
      const insertData = notifications.map(n => ({
        user_id: n.user_id,
        title: n.title,
        message: n.message,
        type: n.type || 'info',
        read: false,
        action_url: n.action_url,
        metadata: n.metadata,
        created_at: new Date().toISOString()
      }))

      const { error } = await supabase
        .from(this.tableName)
        .insert(insertData)

      if (error) throw error

      logger.info('Bulk notifications created', { count: notifications.length })
    } catch (error) {
      logger.error('Error creating bulk notifications', { error })
    }
  }
}

export const notificationsService = new NotificationsService()

