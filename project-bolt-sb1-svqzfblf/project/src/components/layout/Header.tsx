import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { Title } from '../ui/atoms/Title'
import { Text } from '../ui/atoms/Text'
import { NotificationBell } from './NotificationBell'
import { UserProfileMenu } from './UserProfileMenu'

interface HeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
}

export function Header({ title, description, actions }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="relative bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 px-6 py-4 sticky top-0 z-40 overflow-hidden backdrop-blur-xl bg-white/95 dark:bg-neutral-900/95">
      {/* Subtle Background Effects */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-cyan to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-blue to-transparent" />
      </div>
      
      {/* Floating Orbs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cyan/5 dark:bg-brand-cyan/10 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-blue/5 dark:bg-brand-blue/10 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '2s' }} />
      
      {/* Content */}
      <div className="relative flex items-center justify-between">
        {/* Left Side: Title & Description */}
        <div className="flex-1 min-w-0">
          <Title 
            level={2} 
            className="bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-blue-dark bg-clip-text text-transparent"
          >
            {title}
          </Title>
          {description && (
            <Text 
              variant="caption" 
              weight="medium" 
              color="muted"
              className="mt-1"
            >
              {description}
            </Text>
          )}
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center space-x-2 ml-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="relative p-2.5 text-neutral-600 dark:text-neutral-400 hover:text-brand-cyan dark:hover:text-brand-cyan transition-all duration-300 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/10 backdrop-blur-sm group"
            title={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
            aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 group-hover:scale-110 group-hover:rotate-12 transition-all" />
            ) : (
              <Sun className="w-5 h-5 group-hover:scale-110 group-hover:rotate-12 transition-all" />
            )}
          </button>

          {/* Notification Bell */}
          <NotificationBell />

          {/* User Profile Menu */}
          <UserProfileMenu />

          {/* Custom Actions */}
          {actions && (
            <div className="ml-2 pl-2 border-l border-neutral-200 dark:border-neutral-700">
              {actions}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
