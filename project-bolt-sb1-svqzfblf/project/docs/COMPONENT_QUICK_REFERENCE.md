# 🎨 LicitaFlow - Guia de Referência Rápida de Componentes

> **Cheat Sheet para Desenvolvedores**  
> Versão: 1.0  
> Data: 28 de Outubro de 2025

---

## 📋 Índice de Componentes por Categoria

### Átomos (8)
[Button](#button) • [Input](#input) • [Badge](#badge) • [Icon](#icon) • [Label](#label) • [Title](#title) • [Text](#text) • [Spinner](#spinner)

### Moléculas (13)
[SearchInput](#searchinput) • [FormField](#formfield) • [MetricCard](#metriccard) • [ModalBase](#modalbase) • [ConfirmDialog](#confirmdialog) • [Select](#select) • [Dropdown](#dropdown) • [StatusBadge](#statusbadge) • [InfoBanner](#infobanner) • [SmartSearch](#smartsearch) • [LiveStats](#livestats) • [QuickActions](#quickactions) • [Logo](#logo)

### Organismos (17+)
[PageHeader](#pageheader) • [FilterBar](#filterbar) • [DataTable](#datatable) • [EmptyState](#emptystate) • [RemindersCenter](#reminderscenter) • [QuickLinksGrid](#quicklinksgrid) • [RecentActivityFeed](#recentactivityfeed) • [KanbanBoard](#kanbanboard) • [KanbanCard](#kanbancard) • [DocumentCard](#documentcard) • [CalendarView](#calendarview) • [TaskItem](#taskitem) • [SupplierCard](#suppliercard) • [QuotationComparisonTable](#quotationcomparisontable) • [PortalCard](#portalcard) • [ContractCard](#contractcard)

---

## 🔹 Átomos

### Button
**Path:** `src/components/ui/atoms/Button.tsx`  
**LOC:** ≤50  
**Uso:** Ação primária/secundária/ghost/danger

```tsx
import { Button } from '@/components/ui/atoms'

// Exemplo básico
<Button variant="primary" onClick={handleClick}>
  Salvar
</Button>

// Com ícone e loading
<Button 
  variant="primary" 
  icon={<Plus />}
  loading={isLoading}
  onClick={handleSubmit}
>
  Novo Edital
</Button>

// Props
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

---

### Input
**Path:** `src/components/ui/atoms/Input.tsx`  
**LOC:** ≤50  
**Uso:** Campo de entrada de texto

```tsx
import { Input } from '@/components/ui/atoms'

<Input 
  type="email" 
  placeholder="seu@email.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={!!errors.email}
  icon={<Mail />}
/>

// Props
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

---

### Badge
**Path:** `src/components/ui/atoms/Badge.tsx`  
**LOC:** ≤40  
**Uso:** Indicador visual de status

```tsx
import { Badge } from '@/components/ui/atoms'

<Badge variant="success">Ativo</Badge>
<Badge variant="danger">Urgente</Badge>

// Props
interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  size?: 'sm' | 'md'
  children: ReactNode
}
```

---

### Icon
**Path:** `src/components/ui/atoms/Icon.tsx`  
**LOC:** ≤40  
**Uso:** Ícones do Lucide React

```tsx
import { Icon } from '@/components/ui/atoms'

<Icon name="FileText" size="md" />
<Icon name="Check" size="lg" color="green" />

// Props
interface IconProps {
  name: keyof typeof icons  // Nomes do lucide-react
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: string
  className?: string
}
```

---

### Label
**Path:** `src/components/ui/atoms/Label.tsx`  
**LOC:** ≤30  
**Uso:** Rótulo de formulário

```tsx
import { Label } from '@/components/ui/atoms'

<Label htmlFor="email" required>Email</Label>

// Props
interface LabelProps {
  htmlFor?: string
  required?: boolean
  children: ReactNode
}
```

---

### Title
**Path:** `src/components/ui/atoms/Title.tsx`  
**LOC:** ≤40  
**Uso:** Títulos de seção

```tsx
import { Title } from '@/components/ui/atoms'

<Title level={1}>Dashboard</Title>
<Title level={2}>Estatísticas</Title>

// Props
interface TitleProps {
  level?: 1 | 2 | 3 | 4
  children: ReactNode
  className?: string
}
```

---

### Text
**Path:** `src/components/ui/atoms/Text.tsx`  
**LOC:** ≤40  
**Uso:** Texto corpo/caption/small

```tsx
import { Text } from '@/components/ui/atoms'

<Text variant="body">Texto principal</Text>
<Text variant="caption" color="muted">Última atualização</Text>

// Props
interface TextProps {
  variant?: 'body' | 'caption' | 'small'
  color?: 'default' | 'muted' | 'error' | 'success'
  children: ReactNode
}
```

---

### Spinner
**Path:** `src/components/ui/atoms/Spinner.tsx`  
**LOC:** ≤30  
**Uso:** Indicador de carregamento

```tsx
import { Spinner } from '@/components/ui/atoms'

<Spinner size="md" />
<Spinner size="lg" color="primary" />

// Props
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
}
```

---

## 🔸 Moléculas

### SearchInput
**Path:** `src/components/ui/molecules/SearchInput.tsx`  
**LOC:** ≤80  
**Composição:** Icon + Input + Button  
**Uso:** Campo de busca

```tsx
import { SearchInput } from '@/components/ui/molecules'

<SearchInput 
  placeholder="Buscar editais..."
  value={search}
  onChange={setSearch}
  onClear={handleClear}
/>

// Props
interface SearchInputProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  onClear?: () => void
}
```

---

### FormField
**Path:** `src/components/ui/molecules/FormField.tsx`  
**LOC:** ≤90  
**Composição:** Label + Input + Text(erro)  
**Uso:** Campo de formulário completo

```tsx
import { FormField } from '@/components/ui/molecules'

<FormField 
  label="Email"
  name="email"
  type="email"
  required
  error={errors.email}
  value={values.email}
  onChange={handleChange}
/>

// Props
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

---

### MetricCard
**Path:** `src/components/ui/molecules/MetricCard.tsx`  
**LOC:** ≤100  
**Composição:** Icon + Title + Text + Badge  
**Uso:** Card de métrica/KPI

```tsx
import { MetricCard } from '@/components/ui/molecules'

<MetricCard 
  icon={<FileText />}
  title="Editais Ativos"
  value={42}
  change={12}
  changeType="increase"
/>

// Props
interface MetricCardProps {
  icon: ReactNode
  title: string
  value: string | number
  change?: number
  changeType?: 'increase' | 'decrease'
  loading?: boolean
}
```

---

### ModalBase
**Path:** `src/components/ui/molecules/ModalBase.tsx`  
**LOC:** ≤100  
**Composição:** Overlay + Card + Title + Button  
**Uso:** Modal genérico

```tsx
import { ModalBase } from '@/components/ui/molecules'

<ModalBase 
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Novo Edital"
  size="lg"
>
  <EditalForm onSubmit={handleSubmit} />
</ModalBase>

// Props
interface ModalBaseProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}
```

---

### ConfirmDialog
**Path:** `src/components/ui/molecules/ConfirmDialog.tsx`  
**LOC:** ≤90  
**Composição:** ModalBase + Text + Button×2  
**Uso:** Diálogo de confirmação

```tsx
import { ConfirmDialog } from '@/components/ui/molecules'

<ConfirmDialog 
  isOpen={showDelete}
  onClose={() => setShowDelete(false)}
  onConfirm={handleDelete}
  title="Excluir Edital"
  message="Tem certeza? Esta ação não pode ser desfeita."
  variant="danger"
/>

// Props
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

---

### Select
**Path:** `src/components/ui/molecules/Select.tsx`  
**LOC:** ≤100  
**Composição:** Label + Dropdown + Icon  
**Uso:** Seleção de opção

```tsx
import { Select } from '@/components/ui/molecules'

<Select 
  label="Status"
  value={status}
  onChange={setStatus}
  options={[
    { value: 'analise', label: 'Em Análise' },
    { value: 'cotacao', label: 'Cotação' }
  ]}
/>

// Props
interface SelectProps {
  label?: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
}
```

---

### StatusBadge
**Path:** `src/components/ui/StatusBadge.tsx`  
**LOC:** ≤70  
**Composição:** Badge + Icon + Text  
**Uso:** Badge de status com ícone

```tsx
import { StatusBadge } from '@/components/ui'

<StatusBadge status="active" />
<StatusBadge status="pending" size="sm" />

// Props
interface StatusBadgeProps {
  status: 'pending' | 'active' | 'completed' | 'cancelled'
  size?: 'sm' | 'md'
}
```

---

### InfoBanner
**Path:** `src/components/ui/InfoBanner.tsx`  
**LOC:** ≤90  
**Composição:** Icon + Text + Button  
**Uso:** Banner informativo

```tsx
import { InfoBanner } from '@/components/ui'

<InfoBanner 
  type="warning"
  message="3 documentos vencem nos próximos 7 dias"
  action={{ label: 'Ver Documentos', onClick: () => navigate('/vault') }}
  dismissible
  onDismiss={handleDismiss}
/>

// Props
interface InfoBannerProps {
  type?: 'info' | 'warning' | 'success' | 'error'
  message: string
  action?: { label: string; onClick: () => void }
  dismissible?: boolean
  onDismiss?: () => void
}
```

---

## 🔶 Organismos

### PageHeader
**Path:** `src/components/shared/organisms/PageHeader.tsx`  
**LOC:** ≤120  
**Composição:** Title + Breadcrumb + Button  
**Uso:** Cabeçalho de página

```tsx
import { PageHeader } from '@/components/shared/organisms'

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

// Props
interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumb?: { label: string; href?: string }[]
  actions?: ReactNode
}
```

---

### FilterBar
**Path:** `src/components/shared/organisms/FilterBar.tsx`  
**LOC:** ≤150  
**Composição:** SearchInput + Select×N + Button  
**Uso:** Barra de filtros

```tsx
import { FilterBar } from '@/components/shared/organisms'

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

// Props
interface FilterBarProps {
  searchValue?: string
  onSearchChange?: (value: string) => void
  filters?: FilterConfig[]
  onFilterChange?: (key: string, value: any) => void
  onClearFilters?: () => void
}
```

---

### DataTable
**Path:** `src/components/shared/organisms/DataTable.tsx`  
**LOC:** ≤200  
**Composição:** Table + Pagination + Spinner + EmptyState  
**Uso:** Tabela de dados

```tsx
import { DataTable } from '@/components/shared/organisms'

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
  pagination={{
    currentPage: page,
    totalPages: totalPages,
    onPageChange: setPage
  }}
/>

// Props
interface DataTableProps<T> {
  columns: ColumnDef<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
  onRowClick?: (row: T) => void
  pagination?: PaginationConfig
  sortable?: boolean
}
```

---

### EmptyState
**Path:** `src/components/shared/organisms/EmptyState.tsx`  
**LOC:** ≤80  
**Composição:** Icon + Title + Text + Button  
**Uso:** Estado vazio

```tsx
import { EmptyState } from '@/components/shared/organisms'

<EmptyState 
  icon={<FileText size={48} />}
  title="Nenhum edital encontrado"
  message="Comece criando seu primeiro edital"
  action={{ label: 'Novo Edital', onClick: handleNew }}
/>

// Props
interface EmptyStateProps {
  icon?: ReactNode
  title: string
  message: string
  action?: { label: string; onClick: () => void }
}
```

---

### KanbanBoard
**Path:** `src/components/shared/organisms/KanbanBoard.tsx`  
**LOC:** ≤200  
**Composição:** Container + KanbanColumn×N  
**Uso:** Quadro Kanban

```tsx
import { KanbanBoard } from '@/components/shared/organisms'

<KanbanBoard 
  columns={pipelineColumns}
  onCardMove={handleCardMove}
  loading={loading}
/>

// Props
interface KanbanBoardProps {
  columns: KanbanColumn[]
  onCardMove: (cardId: string, newColumnId: string) => void
  loading?: boolean
}
```

---

### KanbanCard
**Path:** `src/components/shared/organisms/KanbanCard.tsx`  
**LOC:** ≤120  
**Composição:** Card estilo pasta + Badge + Avatar  
**Uso:** Card de item no Kanban

```tsx
import { KanbanCard } from '@/components/shared/organisms'

<KanbanCard 
  numero="001/2025"
  orgao="Prefeitura Municipal"
  valor={150000}
  prazo="2025-11-15"
  urgencia="alta"
  responsavel={{ nome: "João Silva" }}
  onClick={handleClick}
/>

// Props
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

---

### CalendarView
**Path:** `src/components/shared/organisms/CalendarView.tsx`  
**LOC:** ≤200  
**Composição:** Grid + EventCard×N  
**Uso:** Visualização de calendário

```tsx
import { CalendarView } from '@/components/shared/organisms'

<CalendarView 
  events={calendarEvents}
  view={view}
  onViewChange={setView}
  onEventClick={handleEventClick}
/>

// Props
interface CalendarViewProps {
  events: CalendarEvent[]
  view: 'month' | 'week' | 'day'
  onViewChange: (view: 'month' | 'week' | 'day') => void
  onEventClick?: (event: CalendarEvent) => void
}
```

---

## 🎯 Quando Usar Cada Componente

### Para Formulários:
✅ **FormField** - Campo completo com label e erro  
✅ **Input** - Campo simples sem label  
✅ **Select** - Seleção de opções  
✅ **Button** - Enviar/Cancelar  

### Para Listagens:
✅ **DataTable** - Tabela com paginação  
✅ **FilterBar** - Filtros acima da tabela  
✅ **SearchInput** - Busca rápida  
✅ **EmptyState** - Quando não há dados  

### Para Feedback:
✅ **Spinner** - Carregamento  
✅ **Badge** - Status visual  
✅ **InfoBanner** - Avisos importantes  
✅ **ConfirmDialog** - Confirmação de ação  

### Para Navegação:
✅ **PageHeader** - Cabeçalho de página  
✅ **Button** - Ações principais  
✅ **Dropdown** - Menu de ações  

### Para Dashboards:
✅ **MetricCard** - KPIs  
✅ **LiveStats** - Estatísticas em tempo real  
✅ **RemindersCenter** - Próximos eventos  
✅ **RecentActivityFeed** - Atividade recente  

### Para Gestão de Projetos:
✅ **KanbanBoard** - Visualização Kanban  
✅ **KanbanCard** - Item no Kanban  
✅ **CalendarView** - Calendário  

---

## 📝 Checklist de Implementação

Ao usar um componente:

- [ ] Importar do caminho correto (`@/components/...`)
- [ ] Verificar props obrigatórias
- [ ] Aplicar tipos TypeScript
- [ ] Usar `useCallback()` para callbacks
- [ ] Adicionar key única em listas
- [ ] Testar responsividade
- [ ] Verificar modo claro/escuro

---

## 🚀 Exemplos de Composição

### Página de Listagem Completa

```tsx
import { PageHeader, FilterBar, DataTable, EmptyState } from '@/components/shared/organisms'
import { Button } from '@/components/ui/atoms'
import { Plus } from 'lucide-react'

export const EditalsView = () => {
  return (
    <div className="space-y-6 p-6">
      <PageHeader 
        title="Editais"
        subtitle="Gerencie suas licitações"
        actions={
          <Button icon={<Plus />} onClick={handleNew}>
            Novo Edital
          </Button>
        }
      />
      
      <FilterBar 
        searchValue={search}
        onSearchChange={setSearch}
        filters={filterConfig}
        onFilterChange={handleFilterChange}
      />
      
      {editais.length > 0 ? (
        <DataTable 
          columns={columns}
          data={editais}
          loading={loading}
          onRowClick={handleRowClick}
          pagination={paginationConfig}
        />
      ) : (
        <EmptyState 
          icon={<FileText size={48} />}
          title="Nenhum edital encontrado"
          message="Comece criando seu primeiro edital"
          action={{ label: 'Novo Edital', onClick: handleNew }}
        />
      )}
    </div>
  )
}
```

### Formulário Modal

```tsx
import { ModalBase } from '@/components/ui/molecules'
import { FormField } from '@/components/ui/molecules'
import { Button } from '@/components/ui/atoms'

export const EditalFormModal = ({ isOpen, onClose, onSubmit }) => {
  return (
    <ModalBase 
      isOpen={isOpen}
      onClose={onClose}
      title="Novo Edital"
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <FormField 
            label="Número"
            name="numero"
            required
            error={errors.numero}
            value={values.numero}
            onChange={handleChange}
          />
          
          <FormField 
            label="Órgão"
            name="orgao"
            required
            error={errors.orgao}
            value={values.orgao}
            onChange={handleChange}
          />
          
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" loading={loading}>
              Salvar
            </Button>
          </div>
        </div>
      </form>
    </ModalBase>
  )
}
```

---

**Última atualização:** 28 de Outubro de 2025  
**Versão:** 1.0

**Para documentação completa, consulte:** [LICITA_FLOW_DESIGN_SYSTEM.md](./LICITA_FLOW_DESIGN_SYSTEM.md)

