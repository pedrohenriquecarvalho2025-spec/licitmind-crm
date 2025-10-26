/**
 * View principal do módulo de Fornecedores
 * Orquestra os componentes e gerencia o estado da view
 * LOC: ~140 linhas
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Plus, Building2 } from 'lucide-react'
import { PageHeader } from '../../../components/shared/organisms/PageHeader'
import { Button } from '../../../components/ui/atoms/Button'
import { SearchInput } from '../../../components/ui/molecules/SearchInput'
import { EmptyState } from '../../../components/shared/organisms/EmptyState'
import { Spinner } from '../../../components/ui/atoms/Spinner'
import { SupplierStatsGrid } from '../components/SupplierStatsGrid'
import { SupplierCard } from '../components/SupplierCard'
import { useOrganization } from '../../../hooks'
import { suppliersAPI } from '../suppliers.api'
import type { Supplier } from '../types'

export function SuppliersView() {
  const { organizationId } = useOrganization()
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadData()
  }, [organizationId])

  const loadData = async () => {
    if (!organizationId) return

    try {
      setLoading(true)
      const data = await suppliersAPI.listSuppliers(organizationId)
      setSuppliers(data)
    } finally {
      setLoading(false)
    }
  }

  const filteredSuppliers = useMemo(() => 
    suppliers.filter(supplier =>
      supplier.razao_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.cnpj.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (supplier.nome_fantasia && supplier.nome_fantasia.toLowerCase().includes(searchTerm.toLowerCase()))
    ),
    [suppliers, searchTerm]
  )

  const stats = useMemo(() => {
    const activeCount = suppliers.filter(s => s.is_active).length
    return {
      totalCount: suppliers.length,
      activeCount,
      inactiveCount: suppliers.length - activeCount
    }
  }, [suppliers])

  const handleCreateSupplier = useCallback(() => {
    // TODO: Abrir modal de criação
  }, [])

  const handleSupplierClick = useCallback((supplier: Supplier) => {
    // TODO: Abrir modal de detalhes/edição
  }, [])

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
        title="Fornecedores"
        description="Gestão de fornecedores e produtos"
        actions={
          <Button onClick={handleCreateSupplier}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Fornecedor
          </Button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <SupplierStatsGrid
          totalCount={stats.totalCount}
          activeCount={stats.activeCount}
          inactiveCount={stats.inactiveCount}
          loading={loading}
        />

        {/* Search */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar por razão social, CNPJ ou nome fantasia..."
          />
        </div>

        {/* Suppliers List */}
        {filteredSuppliers.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="Nenhum fornecedor encontrado"
            description={
              searchTerm
                ? 'Tente ajustar os filtros de busca'
                : 'Comece cadastrando seu primeiro fornecedor'
            }
            actionLabel={!searchTerm ? 'Novo Fornecedor' : undefined}
            onAction={!searchTerm ? handleCreateSupplier : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSuppliers.map(supplier => (
              <SupplierCard
                key={supplier.id}
                supplier={supplier}
                onClick={() => handleSupplierClick(supplier)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

