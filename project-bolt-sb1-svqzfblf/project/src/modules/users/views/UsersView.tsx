/**
 * View principal do módulo de Usuários
 */

import React, { useState, useEffect } from 'react'
import { Users, Plus, Mail, Search, AlertCircle, CheckCircle } from 'lucide-react'
import { PageHeader } from '../../../components/shared/organisms/PageHeader'
import { Button } from '../../../components/ui/atoms/Button'
import { Input } from '../../../components/ui/atoms/Input'
import { Spinner } from '../../../components/ui/atoms/Spinner'
import { EmptyState } from '../../../components/shared/organisms/EmptyState'
import { useOrganization } from '../../../hooks'
import { usersAPI } from '../users.api'
import { UserForm, type UserFormData } from '../components/UserForm'
import { UserTable } from '../components/UserTable'
import type { UserProfile } from '../types'

type ModalMode = 'create' | 'edit' | 'invite' | null

export function UsersView() {
  const { organizationId } = useOrganization()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [notification, setNotification] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  useEffect(() => {
    loadData()
  }, [organizationId])

  const loadData = async () => {
    if (!organizationId) return

    try {
      setLoading(true)
      const data = await usersAPI.listUsers(organizationId)
      setUsers(data)
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const handleCreateUser = async (data: UserFormData) => {
    if (!organizationId) return

    const user = await usersAPI.createUser({
      ...data,
      organization_id: organizationId,
    })

    if (user) {
      showNotification('success', 'Usuário criado com sucesso!')
      setModalMode(null)
      loadData()
    } else {
      throw new Error('Erro ao criar usuário')
    }
  }

  const handleInviteUser = async (data: UserFormData) => {
    if (!organizationId) return

    const result = await usersAPI.inviteUser({
      ...data,
      organization_id: organizationId,
    })

    if (result.success) {
      showNotification('success', result.message)
      setModalMode(null)
      loadData()
    } else {
      throw new Error(result.message)
    }
  }

  const handleUpdateUser = async (data: UserFormData) => {
    if (!selectedUser) return

    const updated = await usersAPI.updateUser(selectedUser.id, data)

    if (updated) {
      showNotification('success', 'Usuário atualizado com sucesso!')
      setModalMode(null)
      setSelectedUser(null)
      loadData()
    } else {
      throw new Error('Erro ao atualizar usuário')
    }
  }

  const handleDeleteUser = async (user: UserProfile) => {
    if (!confirm(`Tem certeza que deseja remover ${user.full_name}?`)) return

    const success = await usersAPI.deleteUser(user.id)

    if (success) {
      showNotification('success', 'Usuário removido com sucesso!')
      loadData()
    } else {
      showNotification('error', 'Erro ao remover usuário')
    }
  }

  const handleEdit = (user: UserProfile) => {
    setSelectedUser(user)
    setModalMode('edit')
  }

  const handleCloseModal = () => {
    setModalMode(null)
    setSelectedUser(null)
  }

  const handleSubmit = async (data: UserFormData) => {
    if (modalMode === 'invite') {
      await handleInviteUser(data)
    } else if (modalMode === 'edit') {
      await handleUpdateUser(data)
    } else {
      await handleCreateUser(data)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center space-x-3 px-4 py-3 rounded-xl shadow-lg ${
            notification.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          )}
          <p
            className={`text-sm font-medium ${
              notification.type === 'success'
                ? 'text-green-800 dark:text-green-200'
                : 'text-red-800 dark:text-red-200'
            }`}
          >
            {notification.message}
          </p>
        </div>
      )}

      <PageHeader
        title="Usuários"
        description="Gestão de usuários e permissões"
        actions={
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={() => setModalMode('invite')}>
              <Mail className="w-4 h-4 mr-2" />
              Convidar
            </Button>
            <Button onClick={() => setModalMode('create')}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Usuário
            </Button>
          </div>
        }
      />

      <div className="p-6">
        {users.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Nenhum usuário encontrado"
            description="Comece convidando membros para sua organização"
            action={
              <Button onClick={() => setModalMode('invite')}>
                <Mail className="w-4 h-4 mr-2" />
                Convidar Primeiro Usuário
              </Button>
            }
          />
        ) : (
          <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
            {/* Search Bar */}
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <Input
                  type="text"
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* User Table */}
            <UserTable
              users={filteredUsers}
              onEdit={handleEdit}
              onDelete={handleDeleteUser}
            />

            {/* Footer Stats */}
            <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {filteredUsers.length} de {users.length} usuário(s)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalMode && (
        <UserForm
          user={selectedUser}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isInvite={modalMode === 'invite'}
        />
      )}
    </div>
  )
}

