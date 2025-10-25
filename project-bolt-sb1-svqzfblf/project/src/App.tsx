/**
 * Componente raiz da aplicação refatorado
 * Orquestra o roteamento e layout principal
 * LOC: ~100 linhas (limite 300 para views)
 */

import React, { useState, Suspense, lazy } from 'react'
import { AuthGuard } from './components/auth/AuthGuard'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import { Dashboard } from './components/dashboard/Dashboard'
import { Spinner } from './components/ui/atoms/Spinner'

// Lazy loading de módulos
const ContractsDashboard = lazy(() => 
  import('./modules/contracts').then(m => ({ default: m.ContractsDashboard }))
)
import { EditalsTable } from './components/editals/EditalsTable'
import { PipelineManager } from './components/pipeline/PipelineManager'
import { UsersTable } from './components/users/UsersTable'
import { Settings } from './components/settings/Settings'
import { Reports } from './components/reports/Reports'
import { Calendar } from './components/calendar/Calendar'
import { Documents } from './components/documents/Documents'
import { SuppliersManager } from './components/suppliers/SuppliersManager'
import { QuotationsManager } from './components/quotations/QuotationsManager'
import { BiddingPortalsManager } from './components/portals/BiddingPortalsManager'

type ViewId = 
  | 'dashboard'
  | 'pipeline'
  | 'editals'
  | 'users'
  | 'settings'
  | 'reports'
  | 'calendar'
  | 'documents'
  | 'suppliers'
  | 'quotations'
  | 'portals'
  | 'contracts'

interface ViewConfig {
  title: string
  description: string
  component: React.ReactNode
}

const viewConfigs: Record<ViewId, ViewConfig> = {
  dashboard: {
    title: 'Dashboard',
    description: 'Visão geral das licitações e métricas',
    component: <Dashboard />
  },
  pipeline: {
    title: 'Pipeline',
    description: 'Acompanhamento visual do funil de licitações',
    component: <PipelineManager />
  },
  editals: {
    title: 'Editais',
    description: 'Lista completa de editais cadastrados',
    component: <EditalsTable />
  },
  users: {
    title: 'Usuários',
    description: 'Gestão de usuários e permissões',
    component: <div className="p-6"><UsersTable /></div>
  },
  settings: {
    title: 'Configurações',
    description: 'Configurações do sistema',
    component: <div className="p-6"><Settings /></div>
  },
  reports: {
    title: 'Relatórios',
    description: 'Análises e relatórios detalhados',
    component: <div className="p-6"><Reports /></div>
  },
  calendar: {
    title: 'Calendário',
    description: 'Prazos e tarefas organizadas',
    component: <div className="p-6"><Calendar /></div>
  },
  documents: {
    title: 'Documentos',
    description: 'Gestão inteligente de documentos',
    component: <div className="p-6"><Documents /></div>
  },
  suppliers: {
    title: 'Fornecedores',
    description: 'Gestão de fornecedores e produtos',
    component: <div className="p-6"><SuppliersManager /></div>
  },
  quotations: {
    title: 'Cotações',
    description: 'Solicitações e comparação de cotações',
    component: <div className="p-6"><QuotationsManager /></div>
  },
  portals: {
    title: 'Portais de Licitação',
    description: 'Gestão de acessos aos portais',
    component: <div className="p-6"><BiddingPortalsManager /></div>
  },
  contracts: {
    title: 'Contratos e Empenhos',
    description: 'Gestão de contratos e controle financeiro',
    component: <ContractsDashboard />
  }
}

function App() {
  const [currentView, setCurrentView] = useState<ViewId>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const { title, description, component } = viewConfigs[currentView]

  return (
    <AuthGuard>
      <div className="h-screen flex bg-gradient-to-br from-neutral-100 to-neutral-50 dark:from-neutral-900 dark:to-neutral-800">
        <Sidebar 
          currentView={currentView} 
          onViewChange={setCurrentView as any}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title={title} description={description} />
          <main className="flex-1 overflow-y-auto bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-screen">
                <Spinner size="lg" />
              </div>
            }>
              {component}
            </Suspense>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}

export default App

