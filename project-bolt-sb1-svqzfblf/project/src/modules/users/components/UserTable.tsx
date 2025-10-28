/**
 * Tabela de usuários com ações
 */

import React from 'react'
import { Edit2, Trash2, Mail, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '../../../components/ui/atoms/Button'
import { StatusBadge } from '../../../components/ui/StatusBadge'
import type { UserProfile } from '../types'
import { ROLE_LABELS } from '../types'

interface UserTableProps {
  users: UserProfile[]
  onEdit: (user: UserProfile) => void
  onDelete: (user: UserProfile) => void
  loading?: boolean
}

export function UserTable({ users, onEdit, onDelete, loading }: UserTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-neutral-200 dark:border-neutral-700">
            <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              Usuário
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              Email
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              Função
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              Status
            </th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
          {users.map((user) => (
            <tr
              key={user.id}
              className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
            >
              {/* Usuário */}
              <td className="py-3 px-4">
                <div className="flex items-center space-x-3">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.full_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                      <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm">
                        {user.full_name
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">
                      {user.full_name}
                    </p>
                  </div>
                </div>
              </td>

              {/* Email */}
              <td className="py-3 px-4">
                <div className="flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
              </td>

              {/* Função */}
              <td className="py-3 px-4">
                <StatusBadge
                  status={
                    user.role === 'admin'
                      ? 'success'
                      : user.role === 'gestor'
                      ? 'info'
                      : user.role === 'analista'
                      ? 'warning'
                      : 'default'
                  }
                  label={ROLE_LABELS[user.role]}
                />
              </td>

              {/* Status */}
              <td className="py-3 px-4">
                <div className="flex items-center space-x-2">
                  {user.is_active ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                        Ativo
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                        Inativo
                      </span>
                    </>
                  )}
                </div>
              </td>

              {/* Ações */}
              <td className="py-3 px-4">
                <div className="flex items-center justify-end space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(user)}
                    title="Editar usuário"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(user)}
                    title="Remover usuário"
                    className="text-red-600 hover:text-red-700 dark:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-neutral-500 dark:text-neutral-400">Nenhum usuário encontrado</p>
        </div>
      )}
    </div>
  )
}

