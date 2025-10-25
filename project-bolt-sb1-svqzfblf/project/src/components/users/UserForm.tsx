import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/atoms/Button'
import { Input } from '../ui/atoms/Input'
import { Select } from '../ui/molecules/Select'
import { ModalBase as Modal } from '../ui/molecules/ModalBase'
import { AlertCircle } from 'lucide-react'
import type { Database } from '../../lib/database.types'

type UserProfile = Database['public']['Tables']['user_profiles']['Row']

interface UserFormProps {
  isOpen: boolean
  onClose: () => void
  user?: UserProfile | null
  onSubmit: () => void
}

const roleOptions = [
  { value: 'cliente', label: 'Cliente' },
  { value: 'analista', label: 'Analista' },
  { value: 'gestor', label: 'Gestor' },
  { value: 'admin', label: 'Administrador' },
]

export function UserForm({ isOpen, onClose, user, onSubmit }: UserFormProps) {
  const { profile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    role: 'analista' as const,
    password: '',
  })

  useEffect(() => {
    if (isOpen) {
      if (user) {
        setFormData({
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          password: '',
        })
      } else {
        setFormData({
          email: '',
          full_name: '',
          role: 'analista',
          password: '',
        })
      }
    }
  }, [isOpen, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile?.organization_id) return

    setLoading(true)
    setError('')

    try {
      if (user) {
        // Atualizar usuário existente
        const { error } = await supabase
          .from('user_profiles')
          .update({
            email: formData.email,
            full_name: formData.full_name,
            role: formData.role,
          })
          .eq('id', user.id)

        if (error) throw error
      } else {
        // Criar novo usuário
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        })

        if (authError) throw authError

        if (authData.user) {
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert({
              id: authData.user.id,
              organization_id: profile.organization_id,
              email: formData.email,
              full_name: formData.full_name,
              role: formData.role,
            })

          if (profileError) throw profileError
        }
      }

      onSubmit()
      onClose()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? 'Editar Usuário' : 'Novo Usuário'}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Nome completo"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          required
          placeholder="Nome do usuário"
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="email@exemplo.com"
        />

        {!user && (
          <Input
            label="Senha"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Senha do usuário"
          />
        )}

        <Select
          label="Função"
          name="role"
          value={formData.role}
          onChange={handleChange}
          options={roleOptions}
        />

        {error && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={loading}
          >
            {user ? 'Atualizar' : 'Criar Usuário'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}