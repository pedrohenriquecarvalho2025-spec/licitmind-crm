# 🎨 LicitaFlow - Design System

> **Biblioteca de Componentes Reutilizáveis (Atomic Design)**  
> Versão: 1.0  
> Data: 28 de Outubro de 2025

---

## 📑 Índice

1. [Princípios do Design System](#1-princípios-do-design-system)
2. [Tokens de Design](#2-tokens-de-design)
3. [Átomos (Atoms)](#3-átomos-atoms)
4. [Moléculas (Molecules)](#4-moléculas-molecules)
5. [Organismos (Organisms)](#5-organismos-organisms)
6. [Templates e Pages](#6-templates-e-pages)
7. [Padrões de Interação](#7-padrões-de-interação)
8. [Guia de Uso](#8-guia-de-uso)

---

## 1. Princípios do Design System

### 1.1. Filosofia

**Componentização Extrema:** Todo elemento de UI é um componente reutilizável. **NÃO** duplicar código de UI.

**Atomic Design:** Hierarquia clara de complexidade:
- **Átomos:** Elementos básicos (Button, Input, Icon)
- **Moléculas:** Composição de átomos (FormField = Label + Input + ErrorText)
- **Organismos:** Composição de moléculas com lógica (DataTable, FilterBar)

**Limites de Complexidade (LOC):**
- Átomos: ≤50 linhas
- Moléculas: ≤100 linhas
- Organismos: ≤200 linhas
- Views: ≤300 linhas

**Otimização:** Todos os componentes usam `React.memo()`, `useCallback()`, `useMemo()`.

### 1.2. Estrutura de Arquivos

```
src/components/
├── ui/
│   ├── atoms/          [8 componentes básicos]
│   ├── molecules/      [13 componentes compostos]
│   ├── Logo.tsx
│   ├── SmartSearch.tsx
│   ├── LiveStats.tsx
│   ├── QuickActions.tsx
│   ├── StatusBadge.tsx
│   └── InfoBanner.tsx
│
├── shared/
│   └── organisms/      [17+ componentes complexos]
│
└── layout/             [4 componentes estruturais]
```

---

## 2. Tokens de Design

### 2.1. Cores (Tailwind Config)

#### **Brand Colors**
```javascript
colors: {
  'brand': {
    'blue-dark': '#1E3A8A',   // Azul royal escuro (base sólida)
    'blue': '#2B4C9F',        // Azul royal (principal)
    'cyan': '#00D9FF',        // Cyan vibrante (destaque tech)
    'cyan-light': '#5EECFF',  // Cyan claro
    'tech-green': '#00E676',  // Verde neon tech
    'tech-purple': '#7C3AED', // Roxo tech (inovação)
    'tech-orange': '#FF6B35', // Laranja tech (energia)
  },
  
  primary: {
    500: '#2B4C9F',  // brand blue
    600: '#1E3A8A',  // brand blue-dark
  },
  
  success: {
    500: '#2AA876',  // brand tech-green
  },
  
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    800: '#2B2F36',  // brand graphite
    900: '#171717',
  }
}
```

#### **Semantic Colors**
- **Primary (Ação Principal):** `primary-500` (Azul Royal)
- **Success (Sucesso):** `success-500` (Verde Tech)
- **Warning (Alerta):** `yellow-500`
- **Danger (Erro/Exclusão):** `red-500`
- **Neutral (Texto/Background):** `neutral-*`

### 2.2. Tipografia

**Fonte:** Inter (sans-serif)

```javascript
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'monospace'],
}
```

**Escala:**
- `text-xs` (0.75rem / 12px) - Labels pequenas
- `text-sm` (0.875rem / 14px) - Texto secundário
- `text-base` (1rem / 16px) - Corpo de texto
- `text-lg` (1.125rem / 18px) - Subtítulos
- `text-xl` (1.25rem / 20px) - Títulos de seção
- `text-2xl` (1.5rem / 24px) - Títulos de página
- `text-3xl` (1.875rem / 30px) - Títulos principais

**Pesos:**
- `font-normal` (400) - Texto padrão
- `font-medium` (500) - Ênfase leve
- `font-semibold` (600) - Títulos
- `font-bold` (700) - Destaque forte

### 2.3. Espaçamento

**Escala (Tailwind):**
- `p-1` (0.25rem / 4px)
- `p-2` (0.5rem / 8px)
- `p-3` (0.75rem / 12px)
- `p-4` (1rem / 16px) ← **Padrão interno de cards**
- `p-6` (1.5rem / 24px) ← **Padrão interno de páginas**
- `gap-4` (1rem / 16px) ← **Padrão entre elementos**
- `gap-6` (1.5rem / 24px) ← **Padrão entre seções**

### 2.4. Raios de Borda

```javascript
borderRadius: {
  'xl': '0.75rem',  // 12px - Botões, Inputs
  '2xl': '1rem',    // 16px - Cards principais
  '3xl': '1.5rem',  // 24px - Modais
}
```

**Uso:**
- Átomos (Button, Input): `rounded-xl`
- Cards: `rounded-2xl`
- Modais: `rounded-3xl`

### 2.5. Sombras

```javascript
boxShadow: {
  'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',     // Padrão
  'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',   // Cards elevados
  'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',   // Modais
  'brand': '0 4px 14px 0 rgba(15, 76, 92, 0.1)', // Hover especial
}
```

### 2.6. Animações

```javascript
animation: {
  'fade-in': 'fadeIn 0.5s ease-in-out',
  'slide-up': 'slideUp 0.3s ease-out',
  'pulse-slow': 'pulse 3s infinite',
}
```

**Transições Padrão:** `transition-all duration-200`

---

## 3. Átomos (Atoms)

### 3.1. Button

**Localização:** `src/components/ui/atoms/Button.tsx`

**Props:**
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: ReactNode
  disabled?: boolean
  onClick?: () => void
  children: ReactNode
}
```

**Variantes:**
- **primary:** Azul royal, sombra, hover eleva
- **secondary:** Neutro claro/escuro, hover muda tom
- **ghost:** Transparente, hover background leve
- **danger:** Vermelho, para ações destrutivas

**Exemplo:**
```tsx
<Button variant="primary" size="md" icon={<Plus />}>
  Novo Edital
</Button>
```

**LOC:** ≤50  
**Otimização:** `React.memo()`

---

### 3.2. Input

**Localização:** `src/components/ui/atoms/Input.tsx`

**Props:**
```typescript
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'tel'
  placeholder?: string
  value?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  error?: boolean
  disabled?: boolean
  icon?: ReactNode
}
```

**Estados:**
- **Default:** Border neutral
- **Focus:** Border primary, sombra
- **Error:** Border red
- **Disabled:** Opacity 50%

**Exemplo:**
```tsx
<Input 
  type="email" 
  placeholder="seu@email.com" 
  icon={<Mail />}
  error={!!errors.email}
/>
```

**LOC:** ≤50  
**Otimização:** `React.memo()`

---

### 3.3. Badge

**Localização:** `src/components/ui/atoms/Badge.tsx`

**Props:**
```typescript
interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  size?: 'sm' | 'md'
  children: ReactNode
}
```

**Variantes:**
- **success:** Verde, para status positivos
- **warning:** Amarelo, para alertas
- **danger:** Vermelho, para urgências
- **info:** Azul, para informações
- **neutral:** Cinza, para estados neutros

**Exemplo:**
```tsx
<Badge variant="danger">Urgente</Badge>
<Badge variant="success">Ativo</Badge>
```

**LOC:** ≤40  
**Otimização:** `React.memo()`

---

### 3.4. Icon

**Localização:** `src/components/ui/atoms/Icon.tsx`

**Props:**
```typescript
interface IconProps {
  name: keyof typeof icons  // Do lucide-react
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: string
  className?: string
}
```

**Tamanhos:**
- xs: 12px
- sm: 16px
- md: 20px ← **Padrão**
- lg: 24px
- xl: 32px

**Exemplo:**
```tsx
<Icon name="FileText" size="md" />
```

**LOC:** ≤40  
**Otimização:** `React.memo()`

---

### 3.5. Label

**Localização:** `src/components/ui/atoms/Label.tsx`

**Props:**
```typescript
interface LabelProps {
  htmlFor?: string
  required?: boolean
  children: ReactNode
}
```

**Exemplo:**
```tsx
<Label htmlFor="email" required>Email</Label>
```

**LOC:** ≤30  
**Otimização:** `React.memo()`

---

### 3.6. Title

**Localização:** `src/components/ui/atoms/Title.tsx`

**Props:**
```typescript
interface TitleProps {
  level?: 1 | 2 | 3 | 4
  children: ReactNode
  className?: string
}
```

**Níveis:**
- 1: `text-3xl font-bold` - Página principal
- 2: `text-2xl font-semibold` - Seções
- 3: `text-xl font-semibold` - Subseções
- 4: `text-lg font-medium` - Componentes

**Exemplo:**
```tsx
<Title level={1}>Dashboard</Title>
```

**LOC:** ≤40  
**Otimização:** `React.memo()`

---

### 3.7. Text

**Localização:** `src/components/ui/atoms/Text.tsx`

**Props:**
```typescript
interface TextProps {
  variant?: 'body' | 'caption' | 'small'
  color?: 'default' | 'muted' | 'error' | 'success'
  children: ReactNode
}
```

**Variantes:**
- **body:** `text-base` (16px)
- **caption:** `text-sm` (14px)
- **small:** `text-xs` (12px)

**Exemplo:**
```tsx
<Text variant="caption" color="muted">
  Última atualização há 5 minutos
</Text>
```

**LOC:** ≤40  
**Otimização:** `React.memo()`

---

### 3.8. Spinner

**Localização:** `src/components/ui/atoms/Spinner.tsx`

**Props:**
```typescript
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
}
```

**Exemplo:**
```tsx
<Spinner size="md" />
```

**LOC:** ≤30  
**Otimização:** `React.memo()`

---

## 4. Moléculas (Molecules)

### 4.1. SearchInput

**Localização:** `src/components/ui/molecules/SearchInput.tsx`

**Composição:** `Icon (Search)` + `Input` + `Button (X)`

**Props:**
```typescript
interface SearchInputProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  onClear?: () => void
}
```

**Exemplo:**
```tsx
<SearchInput 
  placeholder="Buscar editais..." 
  value={search}
  onChange={setSearch}
/>
```

**LOC:** ≤80  
**Otimização:** `React.memo()` + `useCallback()`

---

### 4.2. FormField

**Localização:** `src/components/ui/molecules/FormField.tsx`

**Composição:** `Label` + `Input` + `Text (erro)`

**Props:**
```typescript
interface FormFieldProps {
  label: string
  name: string
  type?: string
  required?: boolean
  error?: string
  value?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}
```

**Exemplo:**
```tsx
<FormField 
  label="Email" 
  name="email" 
  type="email"
  required
  error={errors.email}
  value={values.email}
  onChange={handleChange}
/>
```

**LOC:** ≤90  
**Otimização:** `React.memo()`

---

### 4.3. MetricCard

**Localização:** `src/components/ui/molecules/MetricCard.tsx`

**Composição:** `Icon` + `Title` + `Text` + `Badge (variação)`

**Props:**
```typescript
interface MetricCardProps {
  icon: ReactNode
  title: string
  value: string | number
  change?: number  // % de variação
  changeType?: 'increase' | 'decrease'
  loading?: boolean
}
```

**Exemplo:**
```tsx
<MetricCard 
  icon={<FileText />}
  title="Editais Ativos"
  value={42}
  change={12}
  changeType="increase"
/>
```

**LOC:** ≤100  
**Otimização:** `React.memo()`

---

### 4.4. ModalBase

**Localização:** `src/components/ui/molecules/ModalBase.tsx`

**Composição:** `Overlay` + `Card` + `Title` + `Button (close)`

**Props:**
```typescript
interface ModalBaseProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}
```

**Exemplo:**
```tsx
<ModalBase 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)}
  title="Novo Edital"
  size="lg"
>
  <EditalForm onSubmit={handleSubmit} />
</ModalBase>
```

**LOC:** ≤100  
**Otimização:** `React.memo()` + `useCallback()`

---

### 4.5. ConfirmDialog

**Localização:** `src/components/ui/molecules/ConfirmDialog.tsx`

**Composição:** `ModalBase` + `Text` + `Button` × 2

**Props:**
```typescript
interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
}
```

**Exemplo:**
```tsx
<ConfirmDialog 
  isOpen={showDelete}
  onClose={() => setShowDelete(false)}
  onConfirm={handleDelete}
  title="Excluir Edital"
  message="Tem certeza? Esta ação não pode ser desfeita."
  variant="danger"
/>
```

**LOC:** ≤90  
**Otimização:** `React.memo()`

---

### 4.6. Select

**Localização:** `src/components/ui/molecules/Select.tsx`

**Composição:** `Label` + `Dropdown` + `Icon`

**Props:**
```typescript
interface SelectProps {
  label?: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
}
```

**Exemplo:**
```tsx
<Select 
  label="Status"
  value={status}
  onChange={setStatus}
  options={[
    { value: 'analise', label: 'Em Análise' },
    { value: 'cotacao', label: 'Cotação' }
  ]}
/>
```

**LOC:** ≤100  
**Otimização:** `React.memo()` + `useMemo()`

---

### 4.7. Dropdown

**Localização:** `src/components/ui/molecules/Dropdown.tsx`

**Composição:** `Button` + `List` + `Icon`

**Props:**
```typescript
interface DropdownProps {
  trigger: ReactNode
  items: { label: string; onClick: () => void; icon?: ReactNode }[]
  align?: 'left' | 'right'
}
```

**Exemplo:**
```tsx
<Dropdown 
  trigger={<Button variant="ghost"><MoreVertical /></Button>}
  items={[
    { label: 'Editar', onClick: handleEdit, icon: <Edit /> },
    { label: 'Excluir', onClick: handleDelete, icon: <Trash /> }
  ]}
/>
```

**LOC:** ≤100  
**Otimização:** `React.memo()`

---

### 4.8. StatusBadge

**Localização:** `src/components/ui/StatusBadge.tsx`

**Composição:** `Badge` + `Icon` + `Text`

**Props:**
```typescript
interface StatusBadgeProps {
  status: 'pending' | 'active' | 'completed' | 'cancelled'
  size?: 'sm' | 'md'
}
```

**Mapeamento:**
- pending: Amarelo + Clock
- active: Verde + CheckCircle
- completed: Azul + Check
- cancelled: Vermelho + X

**Exemplo:**
```tsx
<StatusBadge status="active" />
```

**LOC:** ≤70  
**Otimização:** `React.memo()` + `useMemo()`

---

### 4.9. InfoBanner

**Localização:** `src/components/ui/InfoBanner.tsx`

**Composição:** `Icon` + `Text` + `Button (dismiss)`

**Props:**
```typescript
interface InfoBannerProps {
  type?: 'info' | 'warning' | 'success' | 'error'
  message: string
  action?: { label: string; onClick: () => void }
  dismissible?: boolean
  onDismiss?: () => void
}
```

**Exemplo:**
```tsx
<InfoBanner 
  type="warning"
  message="3 documentos vencem nos próximos 7 dias"
  action={{ label: 'Ver Documentos', onClick: () => navigate('/vault') }}
  dismissible
/>
```

**LOC:** ≤90  
**Otimização:** `React.memo()`

---

### 4.10. SmartSearch

**Localização:** `src/components/ui/SmartSearch.tsx`

**Composição:** `SearchInput` + `Dropdown (resultados)` + `Badge (atalho)`

**Props:**
```typescript
interface SmartSearchProps {
  onSearch: (query: string) => void
  results: SearchResult[]
  loading?: boolean
}
```

**Features:**
- Busca em tempo real (debounce 300ms)
- Resultados agrupados por tipo
- Atalho de teclado (Ctrl+K)
- Highlight nos resultados

**Exemplo:**
```tsx
<SmartSearch 
  onSearch={handleSearch}
  results={searchResults}
  loading={isSearching}
/>
```

**LOC:** ≤100  
**Otimização:** `React.memo()` + `useDebounce()`

---

### 4.11. LiveStats

**Localização:** `src/components/ui/LiveStats.tsx`

**Composição:** Grid de `MetricCard` × 4

**Props:**
```typescript
interface LiveStatsProps {
  metrics: {
    editaisAtivos: number
    taxaSucesso: number
    valorPipeline: number
    contratosVigentes: number
  }
  loading?: boolean
}
```

**Exemplo:**
```tsx
<LiveStats metrics={dashboardMetrics} />
```

**LOC:** ≤90  
**Otimização:** `React.memo()`

---

### 4.12. QuickActions

**Localização:** `src/components/ui/QuickActions.tsx`

**Composição:** Grid de `Button` com ícones

**Props:**
```typescript
interface QuickActionsProps {
  actions: { 
    icon: ReactNode
    label: string
    onClick: () => void
  }[]
}
```

**Exemplo:**
```tsx
<QuickActions 
  actions={[
    { icon: <Plus />, label: 'Novo Edital', onClick: handleNewEdital },
    { icon: <Calendar />, label: 'Calendário', onClick: () => navigate('/calendar') }
  ]}
/>
```

**LOC:** ≤80  
**Otimização:** `React.memo()`

---

## 5. Organismos (Organisms)

### 5.1. PageHeader

**Localização:** `src/components/shared/organisms/PageHeader.tsx`

**Composição:** `Title` + `Breadcrumb` + `Button` (ações)

**Props:**
```typescript
interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumb?: { label: string; href?: string }[]
  actions?: ReactNode
}
```

**Exemplo:**
```tsx
<PageHeader 
  title="Editais"
  subtitle="Gerencie suas licitações"
  breadcrumb={[
    { label: 'Home', href: '/' },
    { label: 'Editais' }
  ]}
  actions={
    <Button icon={<Plus />} onClick={handleNew}>
      Novo Edital
    </Button>
  }
/>
```

**LOC:** ≤120  
**Otimização:** `React.memo()`

---

### 5.2. FilterBar

**Localização:** `src/components/shared/organisms/FilterBar.tsx`

**Composição:** `SearchInput` + `Select` × N + `Button (limpar)`

**Props:**
```typescript
interface FilterBarProps {
  searchValue?: string
  onSearchChange?: (value: string) => void
  filters?: FilterConfig[]
  onFilterChange?: (key: string, value: any) => void
  onClearFilters?: () => void
}

interface FilterConfig {
  key: string
  type: 'select' | 'date' | 'range'
  label: string
  options?: { value: string; label: string }[]
}
```

**Exemplo:**
```tsx
<FilterBar 
  searchValue={search}
  onSearchChange={setSearch}
  filters={[
    { key: 'status', type: 'select', label: 'Status', options: statusOptions },
    { key: 'orgao', type: 'select', label: 'Órgão', options: orgaoOptions }
  ]}
  onFilterChange={handleFilterChange}
  onClearFilters={clearFilters}
/>
```

**LOC:** ≤150  
**Otimização:** `React.memo()` + `useCallback()`

---

### 5.3. DataTable

**Localização:** `src/components/shared/organisms/DataTable.tsx`

**Composição:** `Table` + `Pagination` + `Spinner` + `EmptyState`

**Props:**
```typescript
interface DataTableProps<T> {
  columns: ColumnDef<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
  onRowClick?: (row: T) => void
  pagination?: {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
  }
  sortable?: boolean
}

interface ColumnDef<T> {
  key: keyof T
  label: string
  render?: (value: any, row: T) => ReactNode
  sortable?: boolean
  width?: string
}
```

**Exemplo:**
```tsx
<DataTable 
  columns={[
    { key: 'numero', label: 'Número', sortable: true },
    { key: 'orgao', label: 'Órgão' },
    { 
      key: 'status', 
      label: 'Status', 
      render: (value) => <StatusBadge status={value} /> 
    }
  ]}
  data={editais}
  loading={loading}
  onRowClick={handleRowClick}
  pagination={paginationConfig}
/>
```

**LOC:** ≤200  
**Otimização:** `React.memo()` + `useMemo()` + Virtualization para listas longas

---

### 5.4. EmptyState

**Localização:** `src/components/shared/organisms/EmptyState.tsx`

**Composição:** `Icon` + `Title` + `Text` + `Button`

**Props:**
```typescript
interface EmptyStateProps {
  icon?: ReactNode
  title: string
  message: string
  action?: { label: string; onClick: () => void }
}
```

**Exemplo:**
```tsx
<EmptyState 
  icon={<FileText size={48} />}
  title="Nenhum edital encontrado"
  message="Comece criando seu primeiro edital"
  action={{ label: 'Novo Edital', onClick: handleNew }}
/>
```

**LOC:** ≤80  
**Otimização:** `React.memo()`

---

### 5.5. RemindersCenter

**Localização:** `src/components/shared/organisms/RemindersCenter.tsx`

**Composição:** Card + List de `ReminderItem`

**Props:**
```typescript
interface RemindersCenterProps {
  reminders: Reminder[]
  loading?: boolean
}

interface Reminder {
  id: string
  type: 'edital' | 'tarefa' | 'documento'
  titulo: string
  data: string
  urgencia: 'alta' | 'media' | 'baixa'
}
```

**Exemplo:**
```tsx
<RemindersCenter reminders={upcomingReminders} />
```

**LOC:** ≤150  
**Otimização:** `React.memo()` + `useMemo()`

---

### 5.6. QuickLinksGrid

**Localização:** `src/components/shared/organisms/QuickLinksGrid.tsx`

**Composição:** Grid 2×3 de `QuickActionCard`

**Props:**
```typescript
interface QuickLinksGridProps {
  links?: QuickLink[]  // Opcional, usa links padrão se não fornecido
}

interface QuickLink {
  icon: ReactNode
  title: string
  description: string
  href: string
}
```

**Exemplo:**
```tsx
<QuickLinksGrid />
```

**LOC:** ≤120  
**Otimização:** `React.memo()`

---

### 5.7. RecentActivityFeed

**Localização:** `src/components/shared/organisms/RecentActivityFeed.tsx`

**Composição:** Card + List de `ActivityItem` + Badge (realtime)

**Props:**
```typescript
interface RecentActivityFeedProps {
  activities: Activity[]
  loading?: boolean
  realtime?: boolean
}

interface Activity {
  id: string
  user: { name: string; avatar?: string }
  action: string
  target: string
  timestamp: string
}
```

**Exemplo:**
```tsx
<RecentActivityFeed activities={recentActivities} realtime />
```

**LOC:** ≤150  
**Otimização:** `React.memo()` + Supabase Realtime

---

### 5.8. KanbanBoard

**Localização:** `src/components/shared/organisms/KanbanBoard.tsx`

**Composição:** Container horizontal + `KanbanColumn` × N

**Props:**
```typescript
interface KanbanBoardProps {
  columns: KanbanColumn[]
  onCardMove: (cardId: string, newColumnId: string) => void
  loading?: boolean
}

interface KanbanColumn {
  id: string
  title: string
  cards: KanbanCard[]
  color?: string
}
```

**Exemplo:**
```tsx
<KanbanBoard 
  columns={pipelineColumns}
  onCardMove={handleCardMove}
/>
```

**LOC:** ≤200  
**Deps:** `@dnd-kit/core`  
**Otimização:** `React.memo()` + `useCallback()`

---

### 5.9. KanbanCard

**Localização:** `src/components/shared/organisms/KanbanCard.tsx`

**Composição:** Card estilo "pasta" + `Badge` + Avatar + `Icon`

**Props:**
```typescript
interface KanbanCardProps {
  numero: string
  orgao: string
  valor: number
  prazo: string
  urgencia: 'alta' | 'media' | 'baixa'
  responsavel?: { nome: string; avatar?: string }
  onClick?: () => void
}
```

**Estilo:** Card com tab superior (efeito de pasta), sombra ao hover

**Exemplo:**
```tsx
<KanbanCard 
  numero="001/2025"
  orgao="Prefeitura Municipal"
  valor={150000}
  prazo="2025-11-15"
  urgencia="alta"
  responsavel={{ nome: "João Silva" }}
/>
```

**LOC:** ≤120  
**Otimização:** `React.memo()`

---

### 5.10. DocumentCard

**Localização:** `src/components/shared/organisms/DocumentCard.tsx`

**Composição:** Card + `Icon` (tipo) + `Title` + `Badge` (vencimento) + `Button` × 3

**Props:**
```typescript
interface DocumentCardProps {
  documento: {
    id: string
    nome: string
    tipo: string
    dataVencimento?: string
    arquivoUrl: string
  }
  onView?: () => void
  onDownload?: () => void
  onDelete?: () => void
}
```

**Exemplo:**
```tsx
<DocumentCard 
  documento={doc}
  onView={handleView}
  onDownload={handleDownload}
  onDelete={handleDelete}
/>
```

**LOC:** ≤130  
**Otimização:** `React.memo()`

---

### 5.11. CalendarView

**Localização:** `src/components/shared/organisms/CalendarView.tsx`

**Composição:** Grid de calendário + `EventCard` × N

**Props:**
```typescript
interface CalendarViewProps {
  events: CalendarEvent[]
  view: 'month' | 'week' | 'day'
  onViewChange: (view: 'month' | 'week' | 'day') => void
  onEventClick?: (event: CalendarEvent) => void
}

interface CalendarEvent {
  id: string
  title: string
  start: string
  end?: string
  type: 'edital' | 'tarefa' | 'contrato'
}
```

**Exemplo:**
```tsx
<CalendarView 
  events={calendarEvents}
  view={view}
  onViewChange={setView}
  onEventClick={handleEventClick}
/>
```

**LOC:** ≤200  
**Otimização:** `React.memo()` + `useMemo()`

---

### 5.12. SupplierCard

**Localização:** `src/components/shared/organisms/SupplierCard.tsx`

**Composição:** Card + `Title` + `Text` × 3 + `Badge` (rating) + `Button`

**Props:**
```typescript
interface SupplierCardProps {
  fornecedor: {
    id: string
    razaoSocial: string
    cnpj: string
    email: string
    telefone: string
    rating?: number
  }
  onClick?: () => void
}
```

**Exemplo:**
```tsx
<SupplierCard 
  fornecedor={supplier}
  onClick={() => navigate(`/suppliers/${supplier.id}`)}
/>
```

**LOC:** ≤100  
**Otimização:** `React.memo()`

---

### 5.13. QuotationComparisonTable

**Localização:** `src/components/shared/organisms/QuotationComparisonTable.tsx`

**Composição:** Table especial (colunas = fornecedores) + `Badge` + `Button`

**Props:**
```typescript
interface QuotationComparisonTableProps {
  quotations: Quotation[]
  onSelectWinner: (quotationId: string) => void
}

interface Quotation {
  id: string
  fornecedor: { nome: string; rating: number }
  valorTotal: number
  prazoEntrega: number
  condicoes: string
}
```

**Exemplo:**
```tsx
<QuotationComparisonTable 
  quotations={receivedQuotations}
  onSelectWinner={handleSelectWinner}
/>
```

**LOC:** ≤180  
**Otimização:** `React.memo()` + `useMemo()`

---

### 5.14. PortalCard

**Localização:** `src/components/shared/organisms/PortalCard.tsx`

**Composição:** Card + `Icon` + `Title` + `Text` (último acesso) + `Button` × 2

**Props:**
```typescript
interface PortalCardProps {
  portal: {
    id: string
    nome: string
    url: string
    tipo: string
    ultimoAcesso?: string
  }
  onOpen?: () => void
  onEdit?: () => void
}
```

**Exemplo:**
```tsx
<PortalCard 
  portal={portalData}
  onOpen={handleOpen}
  onEdit={handleEdit}
/>
```

**LOC:** ≤100  
**Otimização:** `React.memo()`

---

### 5.15. ContractCard

**Localização:** `src/components/shared/organisms/ContractCard.tsx`

**Composição:** Card + `Title` + `Badge` (status) + `Text` × 3 + Progress bar

**Props:**
```typescript
interface ContractCardProps {
  contrato: {
    id: string
    numero: string
    objeto: string
    valorTotal: number
    dataInicio: string
    dataFim: string
    status: 'ativo' | 'encerrado' | 'suspenso'
  }
  onClick?: () => void
}
```

**Exemplo:**
```tsx
<ContractCard 
  contrato={contract}
  onClick={() => navigate(`/contracts/${contract.id}`)}
/>
```

**LOC:** ≤130  
**Otimização:** `React.memo()`

---

## 6. Templates e Pages

**Templates** são layouts que combinam organismos em uma estrutura fixa.

**Pages (Views)** usam templates e adicionam lógica de negócio.

**Exemplo de Template:**
```tsx
// src/templates/DashboardTemplate.tsx
export const DashboardTemplate = ({ 
  header, 
  metrics, 
  reminders, 
  quickLinks, 
  activity 
}) => (
  <div className="space-y-6 p-6">
    {header}
    {metrics}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {reminders}
        {activity}
      </div>
      <div>{quickLinks}</div>
    </div>
  </div>
)
```

---

## 7. Padrões de Interação

### 7.1. Feedback de Ações

**Loading States:**
- Botões: `<Button loading>Salvando...</Button>`
- Tabelas: `<DataTable loading />`
- Página inteira: `<Spinner />` centralizado

**Sucesso:**
- Toast notification verde
- Mensagem: "Salvo com sucesso!"

**Erro:**
- Toast notification vermelha
- Mensagem descritiva do erro

### 7.2. Confirmação de Ações Destrutivas

**Sempre usar `ConfirmDialog` para:**
- Excluir registros
- Arquivar/Cancelar processos
- Desativar usuários

### 7.3. Navegação

**Breadcrumb:** Em `PageHeader` para contexto

**Tabs:** Para visualizações alternativas de dados

**Modal vs. Página:** 
- Modal: Formulários rápidos, detalhes
- Página: Processos complexos, muitos campos

### 7.4. Acessibilidade

- **Keyboard Navigation:** Tab, Enter, Esc
- **ARIA Labels:** Em todos os componentes interativos
- **Contrast Ratio:** ≥4.5:1 (WCAG AA)
- **Focus Visible:** Outline azul em foco

---

## 8. Guia de Uso

### 8.1. Como Escolher o Componente Certo

**Precisa de um botão?** → `Button`  
**Precisa de um input com label e erro?** → `FormField`  
**Precisa de uma tabela com paginação?** → `DataTable`  
**Precisa de um modal?** → `ModalBase` ou `ConfirmDialog`

### 8.2. Composição vs. Criação

**✅ PRIORIZE COMPOSIÇÃO:**
```tsx
// BOM: Compor componentes existentes
<PageHeader title="Editais" actions={<Button>Novo</Button>} />
```

**❌ EVITE CRIAR DO ZERO:**
```tsx
// RUIM: Duplicar código de UI
<div className="flex justify-between...">
  <h1>Editais</h1>
  <button>Novo</button>
</div>
```

### 8.3. Estendendo Componentes

Se um componente não atende exatamente, estenda-o:

```tsx
// MyCustomButton.tsx
import { Button } from '@/components/ui/atoms'

export const MyCustomButton = (props) => (
  <Button 
    {...props}
    className={`my-custom-class ${props.className}`}
  />
)
```

### 8.4. Temas e Dark Mode

**Todos os componentes devem usar classes `dark:`:**

```tsx
<div className="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100">
  ...
</div>
```

**Testar:** Toggle no Header deve funcionar instantaneamente

---

## 📌 Checklist de Novo Componente

Ao criar um novo componente:

- [ ] Props tipadas com TypeScript
- [ ] Usa `React.memo()` (átomos e moléculas)
- [ ] Usa `useCallback()` e `useMemo()` (organismos)
- [ ] Respeita limite de LOC
- [ ] Classes Tailwind seguem padrões do Design System
- [ ] Suporta modo claro/escuro
- [ ] Acessível (ARIA, keyboard)
- [ ] Documentado com JSDoc
- [ ] Exportado em `index.ts`
- [ ] Testado isoladamente
- [ ] Adicionado no Storybook (futuro)

---

**Documento gerado em:** 28 de Outubro de 2025  
**Versão:** 1.0  
**Responsável:** Equipe de Design LicitaFlow

