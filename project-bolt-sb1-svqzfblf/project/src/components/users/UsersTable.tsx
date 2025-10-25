import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/atoms/Button'
import { Spinner as LoadingSpinner } from '../ui/atoms/Spinner'
import { UserForm } from './UserForm'
import { CreditCard as Edit, Trash2, Users as UsersIcon, Shield, UserCheck, UserX } from 'lucide-react'
import type { Database } from '../../lib/database.types'

type UserProfile = Database['public']['Tables']['user_profiles']['Row']

const roleLabels = {
  admin: 'Administrador',
  gestor: 'Gestor',
  analista: 'Analista',
  cliente: 'Cliente',
}

const roleColors = {
  admin: 'bg-purple-100 text-purple-800',
  gestor: 'bg-blue-100 text-blue-800',
  analista: 'bg-green-100 text-green-800',
  cliente: 'bg-gray-100 text-gray-800',
}

export function UsersTable() {
  const { profile, hasPermission } = useAuth()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [profile])

  const loadUsers = async () => {
    if (!profile?.organization_id) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('organization_id', profile.organization_id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (user: UserProfile) => {
    setSelectedUser(user)
    setShowForm(true)
  }

  const handleToggleStatus = async (user: UserProfile) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_active: !user.is_active })
        .eq('id', user.id)

      if (error) throw error
      loadUsers()
    } catch (error) {
      console.error('Error updating user status:', error)
    }
  }

  const handleDelete = async (user: UserProfile) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return

    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', user.id)

      if (error) throw error
      loadUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setSelectedUser(null)
  }

  const handleFormSubmit = () => {
    loadUsers()
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Usuários</h2>
          <p className="text-gray-600">Gerencie usuários e permissões da organização</p>
        </div>
        {hasPermission('admin') && (
          <Button onClick={() => setShowForm(true)}>
            Novo Usuário
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {users.length === 0 ? (
          <div className="text-center py-12">
            <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum usuário encontrado
            </h3>
            <p className="text-gray-500 mb-6">
              Comece adicionando usuários à sua organização.
            </p>
            {hasPermission('admin') && (
              <Button onClick={() => setShowForm(true)}>
                Adicionar Primeiro Usuário
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Função
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Criado em
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.full_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.full_name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                        <Shield className="w-3 h-3 mr-1" />
                        {roleLabels[user.role]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {user.is_active ? (
                          <>
                            <UserCheck className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-green-600">Ativo</span>
                          </>
                        ) : (
                          <>
                            <UserX className="w-4 h-4 text-red-500" />
                            <span className="text-sm text-red-600">Inativo</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {hasPermission('admin') && user.id !== profile?.id && (
                        <>
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className={`text-sm px-2 py-1 rounded ${
                              user.is_active 
                                ? 'text-red-600 hover:bg-red-50' 
                                : 'text-green-600 hover:bg-green-50'
                            }`}
                          >
                            {user.is_active ? 'Desativar' : 'Ativar'}
                          </button>
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-gray-400 hover:text-sky-600 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <UserForm
        isOpen={showForm}
        onClose={handleFormClose}
        user={selectedUser}
        onSubmit={handleFormSubmit}
      />
    </div>
  )
}