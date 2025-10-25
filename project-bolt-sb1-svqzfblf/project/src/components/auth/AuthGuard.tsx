import React from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Spinner as LoadingSpinner } from '../ui/atoms/Spinner'
import { LoginForm } from './LoginForm'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'gestor' | 'analista' | 'cliente'
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { user, profile, loading, hasPermission } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  if (requiredRole && !hasPermission(requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Negado</h2>
          <p className="text-gray-600">Você não possui permissão para acessar esta página.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}