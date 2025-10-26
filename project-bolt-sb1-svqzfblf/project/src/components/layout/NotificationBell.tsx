import React, { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'
import { NotificationCenter } from '../notifications/NotificationCenter'

export function NotificationBell() {
  const { profile } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    loadUnreadCount()

    if (!profile?.id) return

    // Real-time subscription for notifications
    const channel = supabase
      .channel(`notifications-${profile.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${profile.id}`,
        },
        () => {
          loadUnreadCount()
        }
      )
      .subscribe()

    return () => {
      if (channel && typeof channel.unsubscribe === 'function') {
        channel.unsubscribe()
      }
    }
  }, [profile?.id])

  const loadUnreadCount = async () => {
    if (!profile?.id) return

    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', profile.id)
        .eq('read', false)

      if (error) throw error
      setUnreadCount(count || 0)
    } catch (error) {
      console.error('Error loading unread count:', error)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowNotifications(true)}
        className="relative p-2.5 text-neutral-600 dark:text-neutral-400 hover:text-brand-cyan transition-all duration-300 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/10 backdrop-blur-sm group"
        title="Notificações"
      >
        <Bell className="w-5 h-5 group-hover:scale-110 group-hover:rotate-12 transition-all" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-gradient-to-r from-red-500 to-red-400 rounded-full text-xs text-white flex items-center justify-center font-bold shadow-lg shadow-red-500/50 animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      <NotificationCenter
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </>
  )
}

