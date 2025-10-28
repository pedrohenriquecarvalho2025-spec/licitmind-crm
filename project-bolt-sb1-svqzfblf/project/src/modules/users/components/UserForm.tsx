/**
 * Formulário de criação/edição de usuário
 */

import React, { useState } from 'react'
import { X, Mail, User as UserIcon, Shield, AlertCircle } from 'lucide-react'
import { Button } from '../../../components/ui/atoms/Button'
import { Input } from '../../../components/ui/atoms/Input'
import { Select } from '../../../components/ui/atoms/Select'
import type { UserProfile, UserRole } from '../types'
import { ROLE_LABELS } from '../types'

interface UserFormProps {
  user?: UserProfile | null
  onSubmit: (data: UserFormData) => Promise<void>
  onCancel: () => void
  isInvite?: boolean
}

export interface UserFormData {
  email: string
  full_name: string
  role: UserRole
  is_active: boolean
}

export function UserForm({ user, onSubmit, onCancel, isInvite = false }: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    email: user?.email || '',
    full_name: user?.full_name || '',
    role: user?.role || 'analista',
    is_active: user?.is_active ?? true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await onSubmit(formData)
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar usuário')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof UserFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const roleOptions = Object.entries(ROLE_LABELS).map(([value, label]) => ({
    value,
    label,
  }))

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              {isInvite ? 'Convidar Usuário' : user ? 'Editar Usuário' : 'Novo Usuário'}
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              {isInvite
                ? 'Envie um convite por email para um novo membro'
                : 'Preencha as informações do usuário'}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="usuario@exemplo.com"
              required
              disabled={!!user && !isInvite}
            />
            {isInvite && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Um email de convite será enviado para este endereço
              </p>
            )}
          </div>

          {/* Nome Completo */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              <UserIcon className="w-4 h-4 inline mr-2" />
              Nome Completo
            </label>
            <Input
              type="text"
              value={formData.full_name}
              onChange={(e) => handleChange('full_name', e.target.value)}
              placeholder="Nome do usuário"
              required
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              <Shield className="w-4 h-4 inline mr-2" />
              Função
            </label>
            <Select
              value={formData.role}
              onChange={(e) => handleChange('role', e.target.value as UserRole)}
              options={roleOptions}
            />
            <div className="mt-2 p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                <strong>Administrador:</strong> Acesso total ao sistema
                <br />
                <strong>Gestor:</strong> Gerencia editais e equipe
                <br />
                <strong>Analista:</strong> Trabalha com editais
                <br />
                <strong>Cliente:</strong> Acesso limitado
                <br />
                <strong>Visualizador:</strong> Apenas visualização
              </p>
            </div>
          </div>

          {/* Status Ativo */}
          {!isInvite && (
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => handleChange('is_active', e.target.checked)}
                className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
              />
              <label
                htmlFor="is_active"
                className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Usuário ativo
              </label>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-start space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" loading={loading} className="flex-1">
              {isInvite ? 'Enviar Convite' : user ? 'Salvar' : 'Criar Usuário'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

