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
import { useAuth } from './hooks/useAuth'
import { hasViewPermission, type ViewId as PermissionViewId } from './core/config/permissions'
import { AlertCircle } from 'lucide-react'

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
  const { profile } = useAuth()

  const { title, description, component } = viewConfigs[currentView]

  // Verifica se o usuário tem permissão para acessar a view atual
  const hasPermission =
    profile && hasViewPermission(profile.role, currentView as PermissionViewId)

  // Componente de acesso negado
  const AccessDenied = () => (
    <div className="flex items-center justify-center min-h-screen p-6">
      <div className="max-w-md w-full bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 p-8 text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
          Acesso Negado
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          Você não possui permissão para acessar este módulo. Entre em contato com o
          administrador do sistema.
        </p>
        <button
          onClick={() => setCurrentView('dashboard')}
          className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
        >
          Voltar ao Dashboard
        </button>
      </div>
    </div>
  )

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
            <Suspense
              fallback={
                <div className="flex items-center justify-center min-h-screen">
                  <Spinner size="lg" />
                </div>
              }
            >
              {hasPermission ? component : <AccessDenied />}
            </Suspense>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}

export default App

