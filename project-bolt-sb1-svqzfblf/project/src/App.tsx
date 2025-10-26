/**
 * Componente raiz da aplicação refatorado
 * Orquestra o roteamento e layout principal
 * LOC: ~100 linhas (limite 300 para views)
 */

import React, { useState, Suspense, lazy } from 'react'
import { AuthGuard } from './components/auth/AuthGuard'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import { Spinner } from './components/ui/atoms/Spinner'

// Lazy loading de TODOS os módulos refatorados
const DashboardView = lazy(() =>
  import('./modules/dashboard').then(m => ({ default: m.DashboardView }))
)
const ContractsDashboard = lazy(() => 
  import('./modules/contracts').then(m => ({ default: m.ContractsDashboard }))
)
const EditalsView = lazy(() =>
  import('./modules/editals').then(m => ({ default: m.EditalsView }))
)
const PipelineView = lazy(() =>
  import('./modules/pipeline').then(m => ({ default: m.PipelineView }))
)
const UsersView = lazy(() =>
  import('./modules/users').then(m => ({ default: m.UsersView }))
)
const SettingsView = lazy(() =>
  import('./modules/settings').then(m => ({ default: m.SettingsView }))
)
const ReportsView = lazy(() =>
  import('./modules/reports').then(m => ({ default: m.ReportsView }))
)
const CalendarView = lazy(() =>
  import('./modules/calendar').then(m => ({ default: m.CalendarView }))
)
const DocumentsView = lazy(() =>
  import('./modules/documents').then(m => ({ default: m.DocumentsView }))
)
const QuotationsView = lazy(() =>
  import('./modules/quotations').then(m => ({ default: m.QuotationsView }))
)
const PortalsView = lazy(() =>
  import('./modules/portals').then(m => ({ default: m.PortalsView }))
)

const SuppliersView = lazy(() =>
  import('./modules/suppliers').then(m => ({ default: m.SuppliersView }))
)

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
    component: <DashboardView />
  },
  pipeline: {
    title: 'Pipeline',
    description: 'Gestão visual do funil de licitações',
    component: <PipelineView />
  },
  editals: {
    title: 'Editais',
    description: 'Gestão de editais e licitações',
    component: <EditalsView />
  },
  users: {
    title: 'Usuários',
    description: 'Gestão de usuários e permissões',
    component: <UsersView />
  },
  settings: {
    title: 'Configurações',
    description: 'Configurações do sistema',
    component: <SettingsView />
  },
  reports: {
    title: 'Relatórios',
    description: 'Análises e relatórios detalhados',
    component: <ReportsView />
  },
  calendar: {
    title: 'Calendário',
    description: 'Prazos e tarefas organizadas',
    component: <CalendarView />
  },
  documents: {
    title: 'Documentos',
    description: 'Gestão inteligente de documentos',
    component: <DocumentsView />
  },
  suppliers: {
    title: 'Fornecedores',
    description: 'Gestão de fornecedores e produtos',
    component: <SuppliersView />
  },
  quotations: {
    title: 'Cotações',
    description: 'Solicitações e comparação de cotações',
    component: <QuotationsView />
  },
  portals: {
    title: 'Portais de Licitação',
    description: 'Gestão de acessos aos portais',
    component: <PortalsView />
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

