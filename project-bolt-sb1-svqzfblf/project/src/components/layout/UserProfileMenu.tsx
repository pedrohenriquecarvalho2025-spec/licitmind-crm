import React from 'react'
import { User, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { Dropdown } from '../ui/molecules/Dropdown'

interface UserProfileMenuProps {
  onProfileClick?: () => void
  onSettingsClick?: () => void
}

export function UserProfileMenu({ onProfileClick, onSettingsClick }: UserProfileMenuProps) {
  const { profile, signOut } = useAuth()

  const handleLogout = async () => {
    await signOut()
  }

  const menuItems = [
    {
      id: 'profile',
      label: 'Meu Perfil',
      icon: <User className="w-4 h-4" />,
      onClick: () => {
        if (onProfileClick) {
          onProfileClick()
        } else {
          console.log('Profile clicked - implement navigation')
        }
      }
    },
    {
      id: 'settings',
      label: 'Configurações',
      icon: <Settings className="w-4 h-4" />,
      onClick: () => {
        if (onSettingsClick) {
          onSettingsClick()
        } else {
          console.log('Settings clicked - implement navigation')
        }
      }
    },
    {
      id: 'logout',
      label: 'Sair do Sistema',
      icon: <LogOut className="w-4 h-4" />,
      onClick: handleLogout,
      variant: 'danger' as const
    }
  ]

  const trigger = (
    <div className="flex items-center space-x-3 bg-neutral-100 dark:bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 border border-neutral-200 dark:border-white/10 hover:bg-neutral-200 dark:hover:bg-white/15 transition-all duration-300 group cursor-pointer">
      <div className="relative">
        <div className="w-8 h-8 bg-gradient-to-br from-brand-cyan to-primary-500 rounded-lg flex items-center justify-center shadow-xl shadow-brand-cyan/30 group-hover:scale-110 transition-transform">
          <span className="text-xs font-bold text-white">
            {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
          </span>
        </div>
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-brand-tech-green rounded-full border-2 border-white dark:border-neutral-800 animate-pulse shadow-lg shadow-brand-tech-green/50" />
      </div>
      <div className="hidden md:block">
        <p className="text-sm font-semibold text-neutral-900 dark:text-white">
          {profile?.full_name || 'Usuário'}
        </p>
        <p className="text-xs text-brand-blue dark:text-brand-cyan capitalize font-bold">
          {profile?.role || 'cliente'}
        </p>
      </div>
    </div>
  )

  return <Dropdown trigger={trigger} items={menuItems} align="right" />
}

