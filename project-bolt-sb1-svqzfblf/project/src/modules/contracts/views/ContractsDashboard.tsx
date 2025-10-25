/**
 * View principal do módulo de Contratos
 * Orquestra os componentes e gerencia o estado da view
 * LOC: ~120 linhas (dentro do limite de 300 para views)
 */

import React, { useState, useEffect } from 'react'
import { Plus, FileSignature } from 'lucide-react'
import { PageHeader } from '../../../components/shared/organisms/PageHeader'
import { Button } from '../../../components/ui/atoms/Button'
import { SearchInput } from '../../../components/ui/molecules/SearchInput'
import { EmptyState } from '../../../components/shared/organisms/EmptyState'
import { Spinner } from '../../../components/ui/atoms/Spinner'
import { ContractStatsGrid } from '../components/ContractStatsGrid'
import { ContractCard } from '../components/ContractCard'
import { useOrganization } from '../../../hooks'
import { contractsAPI } from '../contracts.api'
import type { Contract, ContractStats } from '../types'

export function ContractsDashboard() {
  const { organizationId } = useOrganization()
  const [contracts, setContracts] = useState<Contract[]>([])
  const [stats, setStats] = useState<ContractStats>({
    totalValue: 0,
    activeCount: 0,
    expiringCount: 0,
    totalCount: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadData()
  }, [organizationId])

  const loadData = async () => {
    if (!organizationId) return

    try {
      setLoading(true)
      const [contractsData, statsData] = await Promise.all([
        contractsAPI.listContracts(organizationId),
        contractsAPI.getContractStats(organizationId)
      ])
      
      setContracts(contractsData)
      setStats(statsData)
    } finally {
      setLoading(false)
    }
  }

  const filteredContracts = React.useMemo(() => 
    contracts.filter(contract =>
      contract.numero_contrato.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.objeto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.contratante.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [contracts, searchTerm]
  )

  const handleCreateContract = React.useCallback(() => {
    // TODO: Abrir modal de criação
  }, [])

  const handleContractClick = React.useCallback((contract: Contract) => {
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
        title="Contratos e Empenhos"
        description="Gestão de contratos e controle financeiro"
        actions={
          <Button onClick={handleCreateContract}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Contrato
          </Button>
        }
      />

      <div className="p-6 space-y-6">
        <ContractStatsGrid stats={stats} />

        <div className="space-y-4">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar contratos por número, objeto ou contratante..."
          />

          {filteredContracts.length === 0 ? (
            <EmptyState
              icon={FileSignature}
              title="Nenhum contrato encontrado"
              description="Comece cadastrando seu primeiro contrato no sistema"
              actionLabel="Cadastrar Primeiro Contrato"
              onAction={handleCreateContract}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredContracts.map(contract => (
                <ContractCard
                  key={contract.id}
                  contract={contract}
                  onClick={() => handleContractClick(contract)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

