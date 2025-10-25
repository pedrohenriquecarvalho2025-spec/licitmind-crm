import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/atoms/Button'
import { ModalBase as Modal } from '../ui/molecules/ModalBase'
import {
  Bell,
  Clock,
  AlertTriangle,
  CheckCircle,
  X,
  Calendar,
  FileText
} from 'lucide-react'
import type { Database } from '../../lib/database.types'

type Notification = Database['public']['Tables']['notifications']['Row']

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const { profile } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadNotifications()
    }
  }, [isOpen, profile])

  const loadNotifications = async () => {
    if (!profile?.id) return

    try {
      setLoading(true)

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      setNotifications(data || [])
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)

      if (error) throw error

      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      )
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', profile?.id)
        .eq('read', false)

      if (error) throw error

      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      )
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'deadline':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'status_change':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'new_edital':
        return <FileText className="w-5 h-5 text-blue-500" />
      case 'system':
        return <Bell className="w-5 h-5 text-purple-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Central de Notificações" size="lg">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-600">
              {unreadCount} não lidas de {notifications.length} total
            </span>
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Marcar todas como lidas
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto space-y-2">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500 mx-auto"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma notificação encontrada</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-colors ${
                  notification.read 
                    ? 'bg-gray-50 border-gray-200' 
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className={`text-sm font-medium ${
                          notification.read ? 'text-gray-900' : 'text-gray-900'
                        }`}>
                          {notification.title}
                        </h4>
                        <p className={`text-sm mt-1 ${
                          notification.read ? 'text-gray-600' : 'text-gray-700'
                        }`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {formatDate(notification.created_at)}
                        </p>
                      </div>
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>Atualizações em tempo real</span>
            <Button variant="ghost" size="sm" onClick={loadNotifications}>
              Atualizar
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}