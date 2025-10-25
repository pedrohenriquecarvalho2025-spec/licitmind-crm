import React, { useEffect, useState } from 'react'
import { Bell, Sparkles, Sun, Moon } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../contexts/ThemeContext'
import { supabase } from '../../lib/supabase'
import { NotificationCenter } from '../notifications/NotificationCenter'

interface HeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
}

export function Header({ title, description, actions }: HeaderProps) {
  const { profile } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    loadUnreadCount()

    if (!profile?.id) return

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
    <div className="relative bg-neutral-50/95 dark:bg-gradient-to-r dark:from-neutral-900/95 dark:via-neutral-800/95 dark:to-neutral-900/95 backdrop-blur-xl border-b border-neutral-200 dark:border-white/10 px-6 py-4 sticky top-0 z-40 overflow-hidden">
      {/* Animated Tech Lines */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-cyan to-transparent animate-shimmer" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-blue to-transparent animate-shimmer" style={{ animationDelay: '1s' }} />
      </div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-cyan/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="relative flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-blue-dark bg-clip-text text-transparent">
                {title}
              </h1>
            </div>
            {description && (
              <p className="text-neutral-600 dark:text-neutral-400 mt-1 font-medium">{description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="relative p-2.5 text-neutral-600 dark:text-neutral-400 hover:text-brand-cyan transition-all duration-300 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/10 backdrop-blur-sm group"
            title={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 group-hover:scale-110 group-hover:rotate-12 transition-all" />
            ) : (
              <Sun className="w-5 h-5 group-hover:scale-110 group-hover:rotate-12 transition-all" />
            )}
          </button>

          {/* Notifications */}
          <button
            onClick={() => setShowNotifications(true)}
            className="relative p-2.5 text-neutral-600 dark:text-neutral-400 hover:text-brand-cyan transition-all duration-300 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/10 backdrop-blur-sm group"
          >
            <Bell className="w-5 h-5 group-hover:scale-110 group-hover:rotate-12 transition-all" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-red-400 rounded-full text-xs text-white flex items-center justify-center font-bold shadow-lg shadow-red-500/50 animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-3 bg-neutral-100 dark:bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 border border-neutral-200 dark:border-white/10 hover:bg-neutral-200 dark:hover:bg-white/15 transition-all duration-300 group cursor-pointer">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-cyan to-primary-500 rounded-lg flex items-center justify-center shadow-xl shadow-brand-cyan/30 group-hover:scale-110 transition-transform">
                <span className="text-xs font-bold text-white">
                  {profile?.full_name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-brand-tech-green rounded-full border-2 border-neutral-900 animate-pulse shadow-lg shadow-brand-tech-green/50" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-neutral-900 dark:text-white">{profile?.full_name}</p>
              <p className="text-xs text-brand-blue dark:text-brand-cyan capitalize font-bold">{profile?.role}</p>
            </div>
          </div>

          {actions}
        </div>
      </div>

      <NotificationCenter
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </div>
  )
}
