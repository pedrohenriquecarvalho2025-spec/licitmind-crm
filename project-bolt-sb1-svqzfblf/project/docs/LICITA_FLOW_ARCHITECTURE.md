# 🏗️ LicitaFlow - Arquitetura de Sistema Detalhada

> **Arquitetura Frontend (Componentização Extrema) + Backend (Vertical Slice)**  
> Versão: 1.0  
> Data: 28 de Outubro de 2025

---

## 📑 Índice

1. [Visão Geral da Arquitetura](#1-visão-geral-da-arquitetura)
2. [Arquitetura de Frontend](#2-arquitetura-de-frontend)
3. [Arquitetura de Backend](#3-arquitetura-de-backend)
4. [Banco de Dados](#4-banco-de-dados)
5. [Integrações Externas](#5-integrações-externas)
6. [Segurança](#6-segurança)
7. [Performance e Otimização](#7-performance-e-otimização)
8. [Deployment e DevOps](#8-deployment-e-devops)

---

## 1. Visão Geral da Arquitetura

### 1.1. Stack Tecnológico

#### **Frontend**
- **Framework:** React 18.3+ (com TypeScript 5.5+)
- **Build Tool:** Vite 7+
- **Estilização:** TailwindCSS 3.4+ (modo dark/light)
- **State Management:** Context API + Custom Hooks
- **Roteamento:** React Router v6
- **Comunicação API:** Supabase Client (@supabase/supabase-js)
- **Ícones:** Lucide React
- **Gráficos:** Recharts (para BI)
- **Drag & Drop:** @dnd-kit/core
- **Formulários:** React Hook Form + Zod (validação)

#### **Backend (BaaS)**
- **Plataforma:** Supabase
- **Banco de Dados:** PostgreSQL 15+
- **Autenticação:** Supabase Auth (JWT)
- **Storage:** Supabase Storage (S3-compatible)
- **Realtime:** Supabase Realtime (WebSockets)
- **Edge Functions:** Deno (para lógicas complexas)

#### **Integrações**
- **OCR:** Google Cloud Vision API / AWS Textract / Tesseract.js
- **Email:** SendGrid / SMTP Customizado
- **Calendário:** Google Calendar API, CalDAV (Apple)
- **Storage:** Google Drive API
- **Dados Externos:** ReceitaWS (CNPJ)

### 1.2. Diagrama de Arquitetura de Alto Nível

```
┌──────────────────────────────────────────────────────────────────┐
│                         USUÁRIOS                                  │
│  (Navegadores Web: Chrome, Firefox, Safari, Edge)                │
└──────────────────────┬───────────────────────────────────────────┘
                       │ HTTPS
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│                   FRONTEND (React + Vite)                         │
│  ┌────────────────────────────────────────────────────────┐      │
│  │  UI Layer (Atomic Design)                              │      │
│  │  • Átomos: Button, Input, Badge, Icon...              │      │
│  │  • Moléculas: FormField, MetricCard, SearchInput...   │      │
│  │  • Organismos: DataTable, PageHeader, FilterBar...    │      │
│  │  • Views: Dashboard, Editais, Pipeline, Vault...      │      │
│  └────────────────────────────────────────────────────────┘      │
│  ┌────────────────────────────────────────────────────────┐      │
│  │  State Management Layer                                │      │
│  │  • ThemeContext, AuthContext, OrganizationContext      │      │
│  │  • Custom Hooks (useAuth, useDataTable, etc.)         │      │
│  └────────────────────────────────────────────────────────┘      │
│  ┌────────────────────────────────────────────────────────┐      │
│  │  Business Logic Layer (Vertical Slices)                │      │
│  │  • modules/editals/*.api.ts                            │      │
│  │  • modules/contracts/*.api.ts                          │      │
│  │  • modules/suppliers/*.api.ts                          │      │
│  │  • [Comunicação APENAS via APIs públicas]             │      │
│  └────────────────────────────────────────────────────────┘      │
└──────────────────────┬───────────────────────────────────────────┘
                       │ REST + WebSockets
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│                   SUPABASE (BaaS)                                 │
│  ┌────────────────────────────────────────────────────────┐      │
│  │  Auth Layer                                             │      │
│  │  • JWT Authentication                                   │      │
│  │  • RLS (Row Level Security)                            │      │
│  │  • RBAC (Admin, Gestor, Analista, Visualizador)       │      │
│  └────────────────────────────────────────────────────────┘      │
│  ┌────────────────────────────────────────────────────────┐      │
│  │  Database Layer (PostgreSQL)                            │      │
│  │  • Tables: editals, contracts, suppliers, etc.         │      │
│  │  • Indexes, Triggers, Functions                         │      │
│  │  • Full-Text Search (tsvector)                         │      │
│  └────────────────────────────────────────────────────────┘      │
│  ┌────────────────────────────────────────────────────────┐      │
│  │  Storage Layer                                          │      │
│  │  • Buckets: documents, editals, logos                  │      │
│  │  • Policies baseadas em RLS                            │      │
│  └────────────────────────────────────────────────────────┘      │
│  ┌────────────────────────────────────────────────────────┐      │
│  │  Realtime Layer                                         │      │
│  │  • Notificações em tempo real                          │      │
│  │  • Atualizações de status                              │      │
│  └────────────────────────────────────────────────────────┘      │
│  ┌────────────────────────────────────────────────────────┐      │
│  │  Edge Functions (Deno)                                  │      │
│  │  • OCR Processing                                       │      │
│  │  • Email Sending                                        │      │
│  │  • External Integrations                               │      │
│  └────────────────────────────────────────────────────────┘      │
└──────────────────────┬───────────────────────────────────────────┘
                       │ API Calls
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│               SERVIÇOS EXTERNOS                                   │
│  • Google Cloud Vision (OCR)                                      │
│  • Google Drive API (Storage)                                     │
│  • Google Calendar API (Sincronização)                           │
│  • ReceitaWS (Consulta CNPJ)                                      │
│  • SendGrid (Email)                                               │
└──────────────────────────────────────────────────────────────────┘
```

---

## 2. Arquitetura de Frontend

### 2.1. Metodologia de Componentização Extrema (Atomic Design)

**Filosofia:** Construir interfaces montando pequenos componentes reutilizáveis. **NÃO criar páginas monolíticas.**

#### **Hierarquia de Componentes**

```
src/components/
├── ui/
│   ├── atoms/              [LOC ≤50, sem lógica de negócio]
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   ├── Icon.tsx
│   │   ├── Label.tsx
│   │   ├── Title.tsx
│   │   ├── Text.tsx
│   │   ├── Spinner.tsx
│   │   └── index.ts
│   │
│   ├── molecules/          [LOC ≤100, composição de átomos]
│   │   ├── SearchInput.tsx       (Input + Icon + Button)
│   │   ├── FormField.tsx         (Label + Input + Text[erro])
│   │   ├── MetricCard.tsx        (Icon + Title + Text + Badge)
│   │   ├── ModalBase.tsx         (Overlay + Card + Title + Button)
│   │   ├── ConfirmDialog.tsx     (ModalBase + Text + Button×2)
│   │   ├── Select.tsx            (Label + Dropdown + Icon)
│   │   ├── Dropdown.tsx          (Button + List + Icon)
│   │   ├── StatusBadge.tsx       (Badge + Icon + Text)
│   │   ├── InfoBanner.tsx        (Icon + Text + Button)
│   │   └── index.ts
│   │
│   ├── SmartSearch.tsx     [Molécula especial, LOC ≤100]
│   ├── LiveStats.tsx       [Molécula especial, LOC ≤100]
│   ├── QuickActions.tsx    [Molécula especial, LOC ≤100]
│   └── Logo.tsx            [Molécula especial, LOC ≤50]
│
├── shared/
│   └── organisms/          [LOC ≤200, lógica de apresentação]
│       ├── PageHeader.tsx        (Title + Breadcrumb + Button)
│       ├── FilterBar.tsx         (SearchInput + Select× + Button)
│       ├── DataTable.tsx         (Table + Pagination + Spinner)
│       ├── EmptyState.tsx        (Icon + Title + Text + Button)
│       ├── RemindersCenter.tsx   (Card + List[ReminderItem])
│       ├── QuickLinksGrid.tsx    (Grid[QuickActionCard])
│       ├── RecentActivityFeed.tsx (Card + List[ActivityItem])
│       ├── DocumentCard.tsx      (Card + Icon + Title + Badge)
│       ├── CalendarView.tsx      (Calendar Grid + EventCard)
│       ├── TaskItem.tsx          (Checkbox + Text + Badge)
│       ├── SupplierCard.tsx      (Card + Title + Text + Badge)
│       ├── QuotationComparisonTable.tsx (Table + Badge + Button)
│       ├── PortalCard.tsx        (Card + Icon + Title + Button)
│       ├── ContractCard.tsx      (Card + Title + Badge + Text)
│       ├── KanbanBoard.tsx       (Columns[KanbanColumn])
│       ├── KanbanColumn.tsx      (Title + Badge + List[KanbanCard])
│       ├── KanbanCard.tsx        (Card estilo pasta + Text + Badge)
│       └── index.ts
│
├── layout/                 [Componentes de estrutura, LOC ≤200]
│   ├── Header.tsx          (Logo + SearchInput + ThemeToggle + NotificationBell + UserProfileMenu)
│   ├── Sidebar.tsx         (Navigation Menu + CollapseToggle)
│   ├── NotificationBell.tsx (Icon + Badge + Dropdown)
│   └── UserProfileMenu.tsx (Avatar + Dropdown + Button)
│
└── auth/                   [Componentes de autenticação, LOC ≤150]
    ├── AuthGuard.tsx       (Proteção de rotas)
    └── LoginForm.tsx       (FormField× + Button)
```

#### **Regras de Componentização**

1. **Limites de LOC (Lines of Code):**
   - **Átomos:** ≤50 linhas
   - **Moléculas:** ≤100 linhas
   - **Organismos:** ≤200 linhas
   - **Views (páginas):** ≤300 linhas

2. **Responsabilidades:**
   - **Átomos:** Apenas UI, sem lógica de negócio
   - **Moléculas:** Composição de átomos, lógica de apresentação simples
   - **Organismos:** Lógica de apresentação complexa, fetching de dados via hooks
   - **Views:** Orquestração de organismos, roteamento

3. **Otimização:**
   - Usar `React.memo()` em todos os átomos e moléculas
   - Usar `useCallback()` para funções passadas como props
   - Usar `useMemo()` para cálculos complexos

4. **TypeScript:**
   - Props tipadas com interfaces ou types
   - Sem uso de `any` (exceto casos justificados e documentados)
   - Export de tipos junto com componentes

#### **Exemplo de Átomo: Button.tsx**

```typescript
import { memo, forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Spinner } from './Spinner'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: ReactNode
  children: ReactNode
}

export const Button = memo(forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    icon, 
    children, 
    disabled,
    className = '',
    ...props 
  }, ref) => {
    const baseClasses = 'rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2'
    
    const variantClasses = {
      primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-md hover:shadow-lg',
      secondary: 'bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-900 dark:text-neutral-100',
      ghost: 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300',
      danger: 'bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg'
    }
    
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    }
    
    const isDisabled = disabled || loading
    
    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${
          isDisabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${className}`}
        {...props}
      >
        {loading ? <Spinner size="sm" /> : icon}
        {children}
      </button>
    )
  }
))

Button.displayName = 'Button'
```

### 2.2. Arquitetura de Views (Páginas)

**Cada view deve:**
- Compor organismos e moléculas
- Gerenciar estado local (se necessário)
- Fazer chamadas via `*.api.ts` (usando hooks)
- **NÃO** conter lógica de negócio complexa
- **NÃO** exceder 300 LOC (refatorar em componentes se necessário)

#### **Estrutura de uma View (Exemplo: Dashboard)**

```
src/modules/dashboard/
├── views/
│   └── DashboardView.tsx       [≤300 LOC]
│       • Usa: RemindersCenter, QuickLinksGrid, RecentActivityFeed, LiveStats
│       • Hooks: useAuth, useOrganization, useDashboardData (custom hook)
│
├── components/                  [Componentes de domínio do módulo]
│   ├── DashboardMetrics.tsx
│   ├── ReminderItem.tsx
│   └── ActivityItem.tsx
│
├── hooks/
│   └── useDashboardData.ts      [Custom hook para fetching]
│
└── index.ts                     [Re-export da view]
```

#### **Exemplo de View: DashboardView.tsx**

```typescript
import { PageHeader, RemindersCenter, QuickLinksGrid, RecentActivityFeed } from '@/components/shared/organisms'
import { LiveStats } from '@/components/ui'
import { useAuth, useOrganization } from '@/hooks'
import { useDashboardData } from '../hooks/useDashboardData'

export const DashboardView = () => {
  const { user } = useAuth()
  const { organization } = useOrganization()
  const { reminders, activities, metrics, loading } = useDashboardData(organization.id)

  if (loading) return <Spinner />

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title={`Bem-vindo(a), ${user.name}`}
        subtitle="Visão geral da sua organização"
      />
      
      <LiveStats metrics={metrics} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RemindersCenter reminders={reminders} />
          <RecentActivityFeed activities={activities} />
        </div>
        
        <div>
          <QuickLinksGrid />
        </div>
      </div>
    </div>
  )
}
```

### 2.3. State Management

**Estratégia:** Context API + Custom Hooks (sem Redux/Zustand para MVP)

#### **Contextos Globais**

```typescript
// src/contexts/ThemeContext.tsx
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  
  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved) setTheme(saved as 'light' | 'dark')
  }, [])
  
  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', newTheme)
      document.documentElement.classList.toggle('dark', newTheme === 'dark')
      return newTheme
    })
  }, [])
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
```

#### **Custom Hooks**

```typescript
// src/hooks/useAuth.ts
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
      setLoading(false)
    })
    return () => data.subscription.unsubscribe()
  }, [])
  
  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }, [])
  
  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])
  
  return { user, loading, signIn, signOut }
}
```

---

## 3. Arquitetura de Backend

### 3.1. Vertical Slice Architecture

**Filosofia:** Isolar módulos de negócio em fatias verticais. Cada módulo é **autocontido** e se comunica com outros **apenas via interfaces públicas** (`*.api.ts`).

#### **Estrutura de um Módulo**

```
src/modules/editals/
├── types/
│   └── index.ts              [Tipos do domínio: Edital, EditalFilters, EditalStats]
│
├── services/                  [PRIVADO - Acesso direto ao Supabase]
│   └── editals.service.ts     [CRUD, queries complexas]
│
├── editals.api.ts             [PÚBLICO - Interface contratual]
│   • listEditals()
│   • getEdital()
│   • createEdital()
│   • updateEdital()
│   • deleteEdital()
│   • processOCR()
│   • analyzeDocument()
│
├── components/                [Componentes de domínio]
│   ├── EditalForm.tsx
│   ├── EditalDetailsModal.tsx
│   ├── ItemTable.tsx
│   └── DocumentAnalysisPanel.tsx
│
├── views/
│   └── EditalsView.tsx
│
└── index.ts                   [Re-export APENAS da view e API pública]
```

#### **Exemplo de Service (PRIVADO)**

```typescript
// src/modules/editals/services/editals.service.ts
import { supabase } from '@/lib/supabase'
import type { Edital, EditalFilters } from '../types'

class EditalsService {
  private tableName = 'editals'

  async list(organizationId: string, filters?: EditalFilters) {
    let query = supabase
      .from(this.tableName)
      .select('*')
      .eq('organization_id', organizationId)
    
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    
    if (filters?.orgao) {
      query = query.ilike('orgao', `%${filters.orgao}%`)
    }
    
    return await query.order('data_abertura', { ascending: false })
  }

  async getById(id: string) {
    return await supabase
      .from(this.tableName)
      .select('*, items:edital_items(*)')
      .eq('id', id)
      .single()
  }

  async create(edital: Omit<Edital, 'id' | 'created_at' | 'updated_at'>) {
    return await supabase
      .from(this.tableName)
      .insert(edital)
      .select()
      .single()
  }

  async update(id: string, updates: Partial<Edital>) {
    return await supabase
      .from(this.tableName)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
  }

  async delete(id: string) {
    return await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id)
  }
}

export const editalsService = new EditalsService()
```

#### **Exemplo de API (PÚBLICA)**

```typescript
// src/modules/editals/editals.api.ts
import { editalsService } from './services/editals.service'
import type { Edital, EditalFilters, EditalStats, DocumentAnalysis } from './types'

export interface EditalsAPI {
  listEditals: (organizationId: string, filters?: EditalFilters) => Promise<Edital[]>
  getEdital: (id: string) => Promise<Edital | null>
  createEdital: (edital: Omit<Edital, 'id' | 'created_at' | 'updated_at'>) => Promise<Edital | null>
  updateEdital: (id: string, updates: Partial<Edital>) => Promise<Edital | null>
  deleteEdital: (id: string) => Promise<boolean>
  processOCR: (file: File) => Promise<Partial<Edital>>
  analyzeDocument: (edital: Edital) => Promise<DocumentAnalysis>
}

class EditalsAPIImpl implements EditalsAPI {
  async listEditals(organizationId: string, filters?: EditalFilters) {
    const { data } = await editalsService.list(organizationId, filters)
    return data || []
  }

  async getEdital(id: string) {
    const { data } = await editalsService.getById(id)
    return data
  }

  async createEdital(edital: Omit<Edital, 'id' | 'created_at' | 'updated_at'>) {
    const { data } = await editalsService.create(edital)
    return data
  }

  async updateEdital(id: string, updates: Partial<Edital>) {
    const { data } = await editalsService.update(id, updates)
    return data
  }

  async deleteEdital(id: string) {
    const { data, error } = await editalsService.delete(id)
    return !error
  }

  async processOCR(file: File): Promise<Partial<Edital>> {
    // Chamar Edge Function do Supabase que processa OCR
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch('/functions/v1/ocr-process', {
      method: 'POST',
      body: formData
    })
    
    return await response.json()
  }

  async analyzeDocument(edital: Edital): Promise<DocumentAnalysis> {
    // Lógica de análise (pode ser local ou via Edge Function)
    const risks = []
    const opportunities = []
    
    // Exemplo: Detectar prazos curtos
    const diasAteAbertura = Math.ceil(
      (new Date(edital.data_abertura).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
    
    if (diasAteAbertura < 7) {
      risks.push({ type: 'prazo_curto', message: 'Prazo muito curto para preparação' })
    }
    
    // Exemplo: Detectar alto valor
    if (edital.valor_estimado > 1000000) {
      opportunities.push({ type: 'alto_valor', message: 'Edital de alto valor' })
    }
    
    return { risks, opportunities, riskLevel: risks.length > 2 ? 'high' : 'low' }
  }
}

export const editalsAPI: EditalsAPI = new EditalsAPIImpl()
```

### 3.2. Comunicação entre Módulos

**Regra:** Módulos SÓ podem se comunicar via `*.api.ts`. **NÃO** acessar `services` de outros módulos diretamente.

**Exemplo:**

```typescript
// ❌ ERRADO
import { contractsService } from '@/modules/contracts/services/contracts.service'

// ✅ CORRETO
import { contractsAPI } from '@/modules/contracts'

const contracts = await contractsAPI.listContracts(organizationId)
```

---

## 4. Banco de Dados

### 4.1. Schema do PostgreSQL

**Tabelas Principais:**

```sql
-- Organizações (Multi-tenancy)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  cnpj TEXT UNIQUE,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usuários (estende auth.users do Supabase)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'gestor', 'analista', 'visualizador')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Editais
CREATE TABLE editals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  numero TEXT NOT NULL,
  orgao TEXT NOT NULL,
  objeto TEXT NOT NULL,
  modalidade TEXT,
  data_abertura TIMESTAMPTZ NOT NULL,
  data_limite_proposta TIMESTAMPTZ,
  valor_estimado NUMERIC(15,2),
  status TEXT NOT NULL CHECK (status IN ('prospeccao', 'analise', 'cotacao', 'proposta', 'enviado', 'resultado')),
  responsavel_id UUID REFERENCES users(id),
  documento_url TEXT,
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Itens de Editais
CREATE TABLE edital_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  edital_id UUID REFERENCES editals(id) ON DELETE CASCADE NOT NULL,
  codigo TEXT,
  descricao TEXT NOT NULL,
  quantidade NUMERIC(15,3) NOT NULL,
  unidade TEXT NOT NULL,
  valor_unitario NUMERIC(15,2),
  valor_total NUMERIC(15,2) GENERATED ALWAYS AS (quantidade * COALESCE(valor_unitario, 0)) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fornecedores
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  cnpj TEXT NOT NULL,
  razao_social TEXT NOT NULL,
  nome_fantasia TEXT,
  contato TEXT,
  email TEXT,
  telefone TEXT,
  endereco TEXT,
  categorias TEXT[],
  rating NUMERIC(2,1) CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, cnpj)
);

-- Cotações
CREATE TABLE quotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  edital_id UUID REFERENCES editals(id) ON DELETE CASCADE NOT NULL,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE NOT NULL,
  valor_total NUMERIC(15,2),
  prazo_entrega INTEGER,
  condicoes_pagamento TEXT,
  observacoes TEXT,
  status TEXT NOT NULL CHECK (status IN ('solicitada', 'recebida', 'selecionada', 'rejeitada')),
  documento_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portais de Licitação
CREATE TABLE bidding_portals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  url TEXT NOT NULL,
  tipo TEXT CHECK (tipo IN ('comprasnet', 'bll', 'municipal', 'estadual', 'outro')),
  usuario TEXT NOT NULL,
  senha_encrypted TEXT NOT NULL, -- AES-256 encrypted
  ultimo_acesso TIMESTAMPTZ,
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contratos
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  edital_id UUID REFERENCES editals(id) ON DELETE SET NULL,
  numero TEXT NOT NULL,
  objeto TEXT NOT NULL,
  valor_total NUMERIC(15,2) NOT NULL,
  data_inicio_vigencia DATE NOT NULL,
  data_fim_vigencia DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('ativo', 'encerrado', 'suspenso')),
  orgao_contratante TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documentos (Vault)
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('certidao', 'balanco', 'atestado', 'contrato_social', 'outro')),
  nome TEXT NOT NULL,
  arquivo_url TEXT NOT NULL,
  data_emissao DATE,
  data_vencimento DATE,
  orgao_emissor TEXT,
  tags TEXT[],
  versao INTEGER DEFAULT 1,
  parent_id UUID REFERENCES documents(id) ON DELETE SET NULL, -- Para controle de versão
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Calendário / Tarefas
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('tarefa', 'edital_abertura', 'contrato_vencimento', 'documento_vencimento')),
  titulo TEXT NOT NULL,
  descricao TEXT,
  data_inicio TIMESTAMPTZ NOT NULL,
  data_fim TIMESTAMPTZ,
  prioridade TEXT CHECK (prioridade IN ('alta', 'media', 'baixa')),
  status TEXT CHECK (status IN ('pendente', 'concluida', 'cancelada')),
  atribuido_a UUID REFERENCES users(id),
  vinculo_id UUID, -- ID genérico (edital, contrato, documento)
  vinculo_tipo TEXT, -- Tipo do vínculo
  google_calendar_id TEXT, -- Para sincronização
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notificações
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  tipo TEXT NOT NULL,
  titulo TEXT NOT NULL,
  mensagem TEXT,
  lida BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Logs de Auditoria
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  acao TEXT NOT NULL,
  modulo TEXT NOT NULL,
  entidade_id UUID,
  entidade_tipo TEXT,
  valores_anteriores JSONB,
  valores_novos JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.2. Índices e Otimizações

```sql
-- Índices simples para queries frequentes
CREATE INDEX idx_editals_organization_id ON editals(organization_id);
CREATE INDEX idx_editals_status ON editals(status);
CREATE INDEX idx_editals_data_abertura ON editals(data_abertura);

-- Índice composto para filtros combinados
CREATE INDEX idx_editals_org_status_data ON editals(organization_id, status, data_abertura DESC);

-- Índice GIN para full-text search
CREATE INDEX idx_editals_fulltext ON editals USING GIN (
  to_tsvector('portuguese', COALESCE(numero, '') || ' ' || COALESCE(orgao, '') || ' ' || COALESCE(objeto, ''))
);

-- Índice para arrays (tags, categorias)
CREATE INDEX idx_documents_tags ON documents USING GIN (tags);
CREATE INDEX idx_suppliers_categorias ON suppliers USING GIN (categorias);

-- Índices para foreign keys
CREATE INDEX idx_edital_items_edital_id ON edital_items(edital_id);
CREATE INDEX idx_quotations_edital_id ON quotations(edital_id);
CREATE INDEX idx_quotations_supplier_id ON quotations(supplier_id);
```

### 4.3. Triggers

```sql
-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_editals_updated_at BEFORE UPDATE ON editals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para log de auditoria
CREATE OR REPLACE FUNCTION log_audit()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (
    organization_id,
    user_id,
    acao,
    modulo,
    entidade_id,
    entidade_tipo,
    valores_anteriores,
    valores_novos
  ) VALUES (
    NEW.organization_id,
    current_setting('request.jwt.claims', true)::json->>'sub',
    TG_OP,
    TG_TABLE_NAME,
    NEW.id,
    TG_TABLE_NAME,
    CASE WHEN TG_OP = 'UPDATE' THEN to_jsonb(OLD) ELSE NULL END,
    to_jsonb(NEW)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_editals AFTER INSERT OR UPDATE OR DELETE ON editals
  FOR EACH ROW EXECUTE FUNCTION log_audit();
```

### 4.4. Row Level Security (RLS)

**Exemplo: Tabela `editals`**

```sql
-- Ativar RLS
ALTER TABLE editals ENABLE ROW LEVEL SECURITY;

-- Policy: Visualizar apenas editais da própria organização
CREATE POLICY "Visualizar editais da organização"
  ON editals FOR SELECT
  USING (organization_id = (current_setting('request.jwt.claims', true)::json->>'organization_id')::uuid);

-- Policy: Admin e Gestor podem inserir
CREATE POLICY "Admin e Gestor podem criar editais"
  ON editals FOR INSERT
  WITH CHECK (
    organization_id = (current_setting('request.jwt.claims', true)::json->>'organization_id')::uuid
    AND (current_setting('request.jwt.claims', true)::json->>'role')::text IN ('admin', 'gestor')
  );

-- Policy: Admin, Gestor e Analista podem atualizar
CREATE POLICY "Atualizar editais"
  ON editals FOR UPDATE
  USING (
    organization_id = (current_setting('request.jwt.claims', true)::json->>'organization_id')::uuid
    AND (current_setting('request.jwt.claims', true)::json->>'role')::text IN ('admin', 'gestor', 'analista')
  );

-- Policy: Apenas Admin pode excluir
CREATE POLICY "Admin pode excluir editais"
  ON editals FOR DELETE
  USING (
    organization_id = (current_setting('request.jwt.claims', true)::json->>'organization_id')::uuid
    AND (current_setting('request.jwt.claims', true)::json->>'role')::text = 'admin'
  );
```

---

## 5. Integrações Externas

### 5.1. Google Cloud Vision (OCR)

**Implementação:** Edge Function do Supabase (Deno)

```typescript
// supabase/functions/ocr-process/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { ImageAnnotatorClient } from '@google-cloud/vision'

serve(async (req) => {
  const formData = await req.formData()
  const file = formData.get('file') as File
  
  const client = new ImageAnnotatorClient({
    credentials: JSON.parse(Deno.env.get('GOOGLE_CREDENTIALS') || '{}')
  })
  
  const [result] = await client.documentTextDetection({
    image: { content: await file.arrayBuffer() }
  })
  
  const text = result.fullTextAnnotation?.text || ''
  
  // Parsing inteligente (regex + NLP básico)
  const numero = text.match(/Edital\s+n[º°]?\s*(\d+\/\d+)/i)?.[1]
  const orgao = text.match(/Órgão:\s*(.+)/i)?.[1]
  // ... mais extrações
  
  return new Response(JSON.stringify({ numero, orgao, texto_completo: text }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

### 5.2. ReceitaWS (Consulta CNPJ)

**Implementação:** Client-side (fetch direto)

```typescript
export const fetchCNPJData = async (cnpj: string) => {
  const cleanCNPJ = cnpj.replace(/\D/g, '')
  const response = await fetch(`https://www.receitaws.com.br/v1/cnpj/${cleanCNPJ}`)
  
  if (!response.ok) throw new Error('CNPJ não encontrado')
  
  const data = await response.json()
  return {
    razaoSocial: data.nome,
    nomeFantasia: data.fantasia,
    endereco: `${data.logradouro}, ${data.numero} - ${data.bairro}, ${data.municipio}/${data.uf}`
  }
}
```

### 5.3. Google Calendar API

**Implementação:** Edge Function + OAuth2

```typescript
// supabase/functions/google-calendar-sync/index.ts
import { google } from 'googleapis'

serve(async (req) => {
  const { accessToken, events } = await req.json()
  
  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: accessToken })
  
  const calendar = google.calendar({ version: 'v3', auth })
  
  // Criar eventos no Google Calendar
  for (const event of events) {
    await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: event.titulo,
        description: event.descricao,
        start: { dateTime: event.data_inicio },
        end: { dateTime: event.data_fim }
      }
    })
  }
  
  return new Response(JSON.stringify({ success: true }))
})
```

---

## 6. Segurança

### 6.1. Autenticação

- **JWT:** Supabase Auth gerencia tokens
- **Refresh Token:** Renovação automática
- **Session:** Persistida no localStorage (segura via HTTPS)

### 6.2. Autorização (RBAC)

**Roles:**
- **Admin:** Acesso total
- **Gestor:** Criar/editar/excluir (exceto usuários)
- **Analista:** Criar/editar
- **Visualizador:** Apenas visualizar

**Implementação:** Policies no Supabase RLS

### 6.3. Criptografia

**Senhas de Portais:**
```typescript
import { AES, enc } from 'crypto-js'

const SECRET_KEY = Deno.env.get('ENCRYPTION_KEY')

export const encrypt = (text: string) => {
  return AES.encrypt(text, SECRET_KEY).toString()
}

export const decrypt = (ciphertext: string) => {
  return AES.decrypt(ciphertext, SECRET_KEY).toString(enc.Utf8)
}
```

### 6.4. Proteção de Rotas

```typescript
// src/components/auth/AuthGuard.tsx
export const AuthGuard = ({ children, requiredRole }) => {
  const { user, loading } = useAuth()
  
  if (loading) return <Spinner />
  
  if (!user) {
    return <Navigate to="/login" />
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/403" />
  }
  
  return children
}
```

---

## 7. Performance e Otimização

### 7.1. Frontend

- **Code Splitting:** `React.lazy()` + `Suspense`
- **Memoização:** `React.memo()`, `useMemo()`, `useCallback()`
- **Lazy Loading de Imagens:** `loading="lazy"`
- **Debounce:** Buscas em tempo real
- **Virtualization:** Listas longas (`react-window`)

### 7.2. Backend

- **Índices:** Queries otimizadas com índices
- **Paginação:** Limite de 50 registros por página
- **Cache:** Supabase Edge Cache (CDN)
- **Materialized Views:** KPIs agregados
- **Connection Pooling:** Supabase Pooler

### 7.3. Métricas

- **FCP:** < 1.5s
- **TTI:** < 3s
- **LCP:** < 2.5s
- **CLS:** < 0.1

---

## 8. Deployment e DevOps

### 8.1. CI/CD

**GitHub Actions:**
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

### 8.2. Ambientes

- **Development:** `dev.licitaflow.com.br`
- **Staging:** `staging.licitaflow.com.br`
- **Production:** `app.licitaflow.com.br`

### 8.3. Monitoramento

- **Logs:** Supabase Dashboard
- **Erros:** Sentry
- **Analytics:** Google Analytics / Plausible
- **Uptime:** UptimeRobot

---

**Documento gerado em:** 28 de Outubro de 2025  
**Versão:** 1.0  
**Responsável:** Equipe de Arquitetura LicitaFlow

