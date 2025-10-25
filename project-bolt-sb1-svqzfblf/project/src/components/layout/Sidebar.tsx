import React from 'react'
import {
  BarChart3,
  FileText,
  Kanban,
  Settings,
  Users,
  LogOut,
  TrendingUp,
  Calendar,
  FolderOpen,
  Target,
  Building2,
  ShoppingCart,
  Globe,
  FileSignature,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../contexts/ThemeContext'
import { Logo } from '../ui/Logo'

interface SidebarProps {
  currentView: string
  onViewChange: (view: string) => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export function Sidebar({ currentView, onViewChange, isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const { signOut, hasPermission } = useAuth()

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, roles: ['admin', 'gestor'] },
    { id: 'pipeline', label: 'Pipeline', icon: Kanban, roles: ['admin', 'gestor', 'analista'] },
    { id: 'editals', label: 'Editais', icon: FileText, roles: ['admin', 'gestor', 'analista', 'cliente'] },
    { id: 'suppliers', label: 'Fornecedores', icon: Building2, roles: ['admin', 'gestor', 'analista'] },
    { id: 'quotations', label: 'Cotações', icon: ShoppingCart, roles: ['admin', 'gestor', 'analista'] },
    { id: 'contracts', label: 'Contratos', icon: FileSignature, roles: ['admin', 'gestor'] },
    { id: 'portals', label: 'Portais', icon: Globe, roles: ['admin', 'gestor', 'analista'] },
    { id: 'calendar', label: 'Calendário', icon: Calendar, roles: ['admin', 'gestor', 'analista'] },
    { id: 'documents', label: 'Documentos', icon: FolderOpen, roles: ['admin', 'gestor', 'analista'] },
    { id: 'reports', label: 'Relatórios', icon: TrendingUp, roles: ['admin', 'gestor'] },
    { id: 'users', label: 'Usuários', icon: Users, roles: ['admin', 'gestor'] },
    { id: 'settings', label: 'Configurações', icon: Settings, roles: ['admin'] },
  ]

  const visibleItems = menuItems.filter(item =>
    item.roles.some(role => hasPermission(role))
  )

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className={`relative bg-neutral-50 dark:bg-gradient-to-br dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 h-full flex flex-col shadow-2xl overflow-hidden border-r border-neutral-200 dark:border-transparent transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/5 via-transparent to-brand-blue/5 dark:from-brand-cyan/10 dark:via-transparent dark:to-primary-500/10 animate-glow-pulse" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cyan/5 dark:bg-brand-cyan/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-blue/5 dark:bg-primary-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      
      {/* Toggle Button */}
      {onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          className="absolute -right-3 top-6 z-50 w-6 h-6 bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 rounded-full flex items-center justify-center hover:bg-brand-cyan hover:border-brand-cyan hover:text-white transition-all duration-300 shadow-lg"
          title={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>
      )}

      {/* Logo */}
      <div className="relative p-6 border-b border-neutral-200 dark:border-white/10">
        <div className={`flex items-center group cursor-pointer ${isCollapsed ? 'justify-center' : 'space-x-4'}`}>
          <div className="relative">
            {/* Logo Image with Enhanced Glow */}
            <div className={`relative flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ${isCollapsed ? 'w-10 h-10' : 'w-16 h-16'}`}>
              <Logo className="w-full h-full text-brand-cyan drop-shadow-[0_0_12px_rgba(27,159,216,0.6)]" />
            </div>
            {/* Enhanced Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan via-brand-blue to-brand-cyan rounded-full blur-3xl opacity-30 dark:opacity-50 group-hover:opacity-60 dark:group-hover:opacity-80 transition-opacity animate-glow-pulse" />
            <div className="absolute inset-0 bg-brand-cyan rounded-full blur-2xl opacity-20 dark:opacity-40 animate-pulse" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="font-bold text-2xl tracking-tight bg-gradient-to-r from-brand-blue-dark via-brand-cyan to-brand-blue bg-clip-text text-transparent">LicitMind</h1>
              <p className="text-xs text-brand-blue dark:text-brand-cyan font-bold flex items-center space-x-1.5 mt-0.5">
                <Target className="w-3.5 h-3.5" />
                <span>Gestão de Licitações</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative flex-1 px-4 py-6 overflow-y-auto scrollbar-thin">
        <ul className="space-y-2">
          {visibleItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id

            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`
                    relative w-full flex items-center rounded-xl text-left transition-all duration-300 group overflow-hidden
                    ${isCollapsed ? 'justify-center px-3 py-3' : 'space-x-3 px-4 py-3'}
                    ${isActive
                      ? 'bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-cyan text-white shadow-xl shadow-brand-cyan/30 transform scale-[1.02]'
                      : 'text-neutral-700 dark:text-neutral-400 hover:text-brand-blue dark:hover:text-white hover:bg-brand-cyan/10 dark:hover:bg-white/5 backdrop-blur-sm hover:transform hover:scale-[1.01]'
                    }
                  `}
                  title={isCollapsed ? item.label : undefined}
                >
                  {/* Holographic Effect for Active Item */}
                  {isActive && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-tech-green via-white to-brand-tech-green rounded-r-full" />
                    </>
                  )}
                  <Icon className={`relative z-10 w-5 h-5 transition-all duration-300 ${
                    isActive
                      ? 'text-white drop-shadow-lg'
                      : 'text-neutral-600 dark:text-neutral-400 group-hover:text-brand-blue dark:group-hover:text-brand-cyan group-hover:scale-110'
                  }`} />
                  {!isCollapsed && <span className="relative z-10 font-semibold">{item.label}</span>}
                  {/* Notification Dot (example) */}
                  {isActive && item.id === 'pipeline' && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-brand-tech-green rounded-full animate-pulse shadow-lg shadow-brand-tech-green/50" />
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="relative p-4 mt-auto">
        <button
          onClick={handleSignOut}
          className={`relative w-full flex items-center rounded-xl text-neutral-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 backdrop-blur-sm transition-all duration-300 group overflow-hidden border border-neutral-200 dark:border-neutral-700 hover:border-red-300 dark:hover:border-red-500/30 ${isCollapsed ? 'justify-center px-3 py-3' : 'justify-center space-x-2 px-4 py-3'}`}
          title={isCollapsed ? 'Sair do Sistema' : undefined}
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-all" />
          {!isCollapsed && <span className="font-semibold">Sair do Sistema</span>}
        </button>
      </div>
    </div>
  )
}
