/**
 * View principal do módulo de Usuários
 */

import React, { useState, useEffect } from 'react'
import { Users, Plus } from 'lucide-react'
import { PageHeader } from '../../../components/shared/organisms/PageHeader'
import { Button } from '../../../components/ui/atoms/Button'
import { Spinner } from '../../../components/ui/atoms/Spinner'
import { EmptyState } from '../../../components/shared/organisms/EmptyState'
import { useOrganization } from '../../../hooks'
import { usersAPI } from '../users.api'
import type { UserProfile } from '../types'

export function UsersView() {
  const { organizationId } = useOrganization()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <PageHeader
        title="Usuários"
        description="Gestão de usuários e permissões"
        actions={
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Usuário
          </Button>
        }
      />

      <div className="p-6">
        {users.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Nenhum usuário encontrado"
            description="Comece convidando membros para sua organização"
          />
        ) : (
          <div className="bg-white dark:bg-neutral-800 rounded-xl border p-6">
            <p className="text-neutral-600">{users.length} usuário(s)</p>
          </div>
        )}
      </div>
    </div>
  )
}

