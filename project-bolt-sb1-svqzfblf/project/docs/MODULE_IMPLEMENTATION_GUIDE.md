# 🏗️ LicitaFlow - Guia de Implementação de Módulos

> **Tutorial Prático: Vertical Slice Architecture**  
> Versão: 1.0  
> Data: 28 de Outubro de 2025

---

## 📑 Índice

1. [Introdução](#1-introdução)
2. [Estrutura de um Módulo](#2-estrutura-de-um-módulo)
3. [Passo a Passo: Implementação Completa](#3-passo-a-passo-implementação-completa)
4. [Exemplo Completo: Módulo Editals](#4-exemplo-completo-módulo-editals)
5. [Exemplo Completo: Módulo Suppliers](#5-exemplo-completo-módulo-suppliers)
6. [Boas Práticas](#6-boas-práticas)
7. [Checklist de Validação](#7-checklist-de-validação)

---

## 1. Introdução

### 1.1. O que é Vertical Slice Architecture?

**Vertical Slice** é um padrão de arquitetura onde cada **módulo de negócio** é **isolado verticalmente**, contendo tudo o que precisa para funcionar:

- ✅ **Types** (tipos do domínio)
- ✅ **Services** (acesso ao banco de dados - PRIVADO)
- ✅ **API** (interface pública - como outros módulos se comunicam)
- ✅ **Components** (componentes de domínio)
- ✅ **Views** (páginas do módulo)

### 1.2. Regra de Ouro

**Módulos SÓ se comunicam via `*.api.ts`**

```tsx
// ❌ ERRADO - Acesso direto ao service de outro módulo
import { contractsService } from '@/modules/contracts/services/contracts.service'

// ✅ CORRETO - Acesso via API pública
import { contractsAPI } from '@/modules/contracts'
```

### 1.3. Vantagens

- ✅ **Manutenibilidade:** Cada módulo é independente
- ✅ **Testabilidade:** Fácil mockar APIs
- ✅ **Escalabilidade:** Novos módulos não quebram os existentes
- ✅ **Clareza:** Limites claros de responsabilidade

---

## 2. Estrutura de um Módulo

### 2.1. Template Padrão

```
src/modules/[module-name]/
│
├── types/
│   └── index.ts              # Tipos do domínio (export)
│
├── services/                  # PRIVADO (não exportar no index.ts)
│   └── [module].service.ts   # CRUD e queries
│
├── [module].api.ts            # PÚBLICO (interface contratual)
│
├── components/                # Componentes de domínio (opcional)
│   ├── [Module]Form.tsx
│   ├── [Module]Details.tsx
│   └── [Other]Component.tsx
│
├── views/
│   └── [Module]View.tsx       # View principal
│
└── index.ts                   # Re-exports (APENAS view e api)
```

### 2.2. O que exportar no `index.ts`

```typescript
// src/modules/editals/index.ts

// ✅ EXPORTAR
export * from './editals.api'       // API pública
export { EditalsView } from './views/EditalsView'  // View principal
export type * from './types'        // Tipos (para uso externo)

// ❌ NÃO EXPORTAR
// export * from './services/editals.service'  // NUNCA exportar services
// export * from './components/...'             // Componentes são privados do módulo
```

---

## 3. Passo a Passo: Implementação Completa

### Passo 1: Definir Tipos do Domínio

**Arquivo:** `src/modules/editals/types/index.ts`

```typescript
/**
 * Tipos do domínio de Editais
 * @module modules/editals/types
 */

export interface Edital {
  id: string
  organization_id: string
  numero: string
  orgao: string
  objeto: string
  modalidade: string
  data_abertura: string
  data_limite_proposta?: string
  valor_estimado: number
  status: EditalStatus
  responsavel_id?: string
  documento_url?: string
  observacoes?: string
  created_at: string
  updated_at: string
}

export type EditalStatus = 
  | 'prospeccao' 
  | 'analise' 
  | 'cotacao' 
  | 'proposta' 
  | 'enviado' 
  | 'resultado'

export interface EditalItem {
  id: string
  edital_id: string
  codigo: string
  descricao: string
  quantidade: number
  unidade: string
  valor_unitario: number
  valor_total: number
}

export interface EditalFilters {
  status?: EditalStatus
  orgao?: string
  responsavel_id?: string
  data_abertura_inicio?: string
  data_abertura_fim?: string
}

export interface EditalStats {
  totalAtivos: number
  totalEmAnalise: number
  valorTotalPipeline: number
  taxaSucesso: number
}

export interface DocumentAnalysis {
  risks: AnalysisInsight[]
  opportunities: AnalysisInsight[]
  riskLevel: 'low' | 'medium' | 'high'
}

export interface AnalysisInsight {
  type: string
  message: string
  severity?: 'low' | 'medium' | 'high'
}
```

---

### Passo 2: Implementar Service (PRIVADO)

**Arquivo:** `src/modules/editals/services/editals.service.ts`

```typescript
/**
 * Service PRIVADO de Editais
 * NÃO deve ser acessado diretamente por outros módulos
 * 
 * @private
 * @module modules/editals/services
 */

import { supabase } from '@/lib/supabase'
import type { Edital, EditalFilters } from '../types'

class EditalsService {
  private tableName = 'editals'

  /**
   * Lista editais com filtros opcionais
   */
  async list(organizationId: string, filters?: EditalFilters) {
    let query = supabase
      .from(this.tableName)
      .select('*')
      .eq('organization_id', organizationId)
    
    // Aplicar filtros
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    
    if (filters?.orgao) {
      query = query.ilike('orgao', `%${filters.orgao}%`)
    }
    
    if (filters?.responsavel_id) {
      query = query.eq('responsavel_id', filters.responsavel_id)
    }
    
    if (filters?.data_abertura_inicio) {
      query = query.gte('data_abertura', filters.data_abertura_inicio)
    }
    
    if (filters?.data_abertura_fim) {
      query = query.lte('data_abertura', filters.data_abertura_fim)
    }
    
    return await query.order('data_abertura', { ascending: false })
  }

  /**
   * Busca edital por ID (com itens)
   */
  async getById(id: string) {
    return await supabase
      .from(this.tableName)
      .select(`
        *,
        items:edital_items(*),
        responsavel:users(id, name, email)
      `)
      .eq('id', id)
      .single()
  }

  /**
   * Cria novo edital
   */
  async create(edital: Omit<Edital, 'id' | 'created_at' | 'updated_at'>) {
    return await supabase
      .from(this.tableName)
      .insert(edital)
      .select()
      .single()
  }

  /**
   * Atualiza edital existente
   */
  async update(id: string, updates: Partial<Edital>) {
    return await supabase
      .from(this.tableName)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
  }

  /**
   * Deleta edital
   */
  async delete(id: string) {
    return await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id)
  }

  /**
   * Busca editais por full-text search
   */
  async search(organizationId: string, query: string) {
    return await supabase
      .from(this.tableName)
      .select('*')
      .eq('organization_id', organizationId)
      .textSearch('fts', query, { type: 'websearch', config: 'portuguese' })
  }
}

// Singleton instance
export const editalsService = new EditalsService()
```

---

### Passo 3: Implementar API Pública (Interface Contratual)

**Arquivo:** `src/modules/editals/editals.api.ts`

```typescript
/**
 * Interface Contratual do Módulo de Editais
 * Esta é a ÚNICA forma permitida de outros módulos interagirem com Editais
 * 
 * IMPORTANTE: Acesso direto aos services é PROIBIDO
 * 
 * @public
 * @module modules/editals/editals.api
 */

import { editalsService } from './services/editals.service'
import type { 
  Edital, 
  EditalFilters, 
  EditalStats, 
  DocumentAnalysis 
} from './types'

export interface EditalsAPI {
  // Queries
  listEditals: (organizationId: string, filters?: EditalFilters) => Promise<Edital[]>
  getEdital: (id: string) => Promise<Edital | null>
  searchEditals: (organizationId: string, query: string) => Promise<Edital[]>
  getEditalStats: (organizationId: string) => Promise<EditalStats>
  
  // Mutations
  createEdital: (edital: Omit<Edital, 'id' | 'created_at' | 'updated_at'>) => Promise<Edital | null>
  updateEdital: (id: string, updates: Partial<Edital>) => Promise<Edital | null>
  deleteEdital: (id: string) => Promise<boolean>
  
  // Business Logic
  processOCR: (file: File) => Promise<Partial<Edital>>
  analyzeDocument: (edital: Edital) => Promise<DocumentAnalysis>
  calculateDaysUntilDeadline: (edital: Edital) => number
  isUrgent: (edital: Edital) => boolean
}

class EditalsAPIImpl implements EditalsAPI {
  async listEditals(organizationId: string, filters?: EditalFilters) {
    const { data, error } = await editalsService.list(organizationId, filters)
    
    if (error) {
      console.error('Error listing editals:', error)
      return []
    }
    
    return data || []
  }

  async getEdital(id: string) {
    const { data, error } = await editalsService.getById(id)
    
    if (error) {
      console.error('Error fetching edital:', error)
      return null
    }
    
    return data
  }

  async searchEditals(organizationId: string, query: string) {
    const { data, error } = await editalsService.search(organizationId, query)
    
    if (error) {
      console.error('Error searching editals:', error)
      return []
    }
    
    return data || []
  }

  async getEditalStats(organizationId: string): Promise<EditalStats> {
    const editais = await this.listEditals(organizationId)
    
    return {
      totalAtivos: editais.filter(e => e.status !== 'resultado').length,
      totalEmAnalise: editais.filter(e => e.status === 'analise').length,
      valorTotalPipeline: editais.reduce((sum, e) => sum + e.valor_estimado, 0),
      taxaSucesso: 0, // Calcular baseado em histórico
    }
  }

  async createEdital(edital: Omit<Edital, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await editalsService.create(edital)
    
    if (error) {
      console.error('Error creating edital:', error)
      return null
    }
    
    return data
  }

  async updateEdital(id: string, updates: Partial<Edital>) {
    const { data, error } = await editalsService.update(id, updates)
    
    if (error) {
      console.error('Error updating edital:', error)
      return null
    }
    
    return data
  }

  async deleteEdital(id: string) {
    const { error } = await editalsService.delete(id)
    return !error
  }

  async processOCR(file: File): Promise<Partial<Edital>> {
    // Chamar Edge Function do Supabase
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const response = await fetch('/functions/v1/ocr-process', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${supabase.auth.session()?.access_token}`
        }
      })
      
      if (!response.ok) throw new Error('OCR processing failed')
      
      return await response.json()
    } catch (error) {
      console.error('OCR Error:', error)
      throw error
    }
  }

  async analyzeDocument(edital: Edital): Promise<DocumentAnalysis> {
    const risks: any[] = []
    const opportunities: any[] = []
    
    // Análise 1: Prazo curto
    const daysUntil = this.calculateDaysUntilDeadline(edital)
    if (daysUntil < 7) {
      risks.push({ 
        type: 'prazo_curto', 
        message: `Apenas ${daysUntil} dias até a abertura`,
        severity: 'high'
      })
    }
    
    // Análise 2: Alto valor
    if (edital.valor_estimado > 1000000) {
      opportunities.push({ 
        type: 'alto_valor', 
        message: 'Edital de alto valor',
        severity: 'high'
      })
    }
    
    // Análise 3: Objeto complexo (muito longo)
    if (edital.objeto.length > 500) {
      risks.push({ 
        type: 'objeto_complexo', 
        message: 'Objeto da licitação muito complexo',
        severity: 'medium'
      })
    }
    
    // Determinar nível de risco geral
    const highRisks = risks.filter(r => r.severity === 'high').length
    const riskLevel = highRisks > 1 ? 'high' : highRisks === 1 ? 'medium' : 'low'
    
    return { risks, opportunities, riskLevel }
  }

  calculateDaysUntilDeadline(edital: Edital): number {
    const today = new Date()
    const deadline = new Date(edital.data_abertura)
    const diffTime = deadline.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  isUrgent(edital: Edital): boolean {
    return this.calculateDaysUntilDeadline(edital) <= 3
  }
}

// Instância singleton da API pública
export const editalsAPI: EditalsAPI = new EditalsAPIImpl()
```

---

### Passo 4: Criar Custom Hook (Opcional mas Recomendado)

**Arquivo:** `src/modules/editals/hooks/useEditals.ts`

```typescript
/**
 * Custom hook para gerenciar estado de editais
 * @module modules/editals/hooks
 */

import { useState, useEffect, useCallback } from 'react'
import { editalsAPI } from '../editals.api'
import type { Edital, EditalFilters } from '../types'
import { useOrganization } from '@/hooks'

export const useEditals = (filters?: EditalFilters) => {
  const { organization } = useOrganization()
  const [editais, setEditais] = useState<Edital[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchEditais = useCallback(async () => {
    if (!organization?.id) return
    
    try {
      setLoading(true)
      setError(null)
      const data = await editalsAPI.listEditals(organization.id, filters)
      setEditais(data)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [organization?.id, filters])

  useEffect(() => {
    fetchEditais()
  }, [fetchEditais])

  const createEdital = useCallback(async (edital: Omit<Edital, 'id' | 'created_at' | 'updated_at'>) => {
    const newEdital = await editalsAPI.createEdital(edital)
    if (newEdital) {
      setEditais(prev => [newEdital, ...prev])
    }
    return newEdital
  }, [])

  const updateEdital = useCallback(async (id: string, updates: Partial<Edital>) => {
    const updated = await editalsAPI.updateEdital(id, updates)
    if (updated) {
      setEditais(prev => prev.map(e => e.id === id ? updated : e))
    }
    return updated
  }, [])

  const deleteEdital = useCallback(async (id: string) => {
    const success = await editalsAPI.deleteEdital(id)
    if (success) {
      setEditais(prev => prev.filter(e => e.id !== id))
    }
    return success
  }, [])

  return {
    editais,
    loading,
    error,
    refetch: fetchEditais,
    createEdital,
    updateEdital,
    deleteEdital
  }
}
```

---

### Passo 5: Implementar View

**Arquivo:** `src/modules/editals/views/EditalsView.tsx`

```typescript
/**
 * View principal do módulo de Editais
 * @module modules/editals/views
 */

import { useState } from 'react'
import { PageHeader, FilterBar, DataTable, EmptyState } from '@/components/shared/organisms'
import { Button } from '@/components/ui/atoms'
import { ModalBase } from '@/components/ui/molecules'
import { Plus, FileText } from 'lucide-react'
import { useEditals } from '../hooks/useEditals'
import { EditalForm } from '../components/EditalForm'
import type { EditalFilters } from '../types'

export const EditalsView = () => {
  const [filters, setFilters] = useState<EditalFilters>({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { editais, loading, createEdital } = useEditals(filters)

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters({})
  }

  const handleCreateEdital = async (data: any) => {
    await createEdital(data)
    setIsModalOpen(false)
  }

  const columns = [
    { key: 'numero', label: 'Número', sortable: true },
    { key: 'orgao', label: 'Órgão', sortable: true },
    { key: 'objeto', label: 'Objeto' },
    { 
      key: 'valor_estimado', 
      label: 'Valor Estimado',
      render: (value: number) => formatCurrency(value)
    },
    { 
      key: 'data_abertura', 
      label: 'Data de Abertura',
      render: (value: string) => formatDate(value)
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string) => <StatusBadge status={value} />
    }
  ]

  return (
    <div className="space-y-6 p-6">
      <PageHeader 
        title="Editais"
        subtitle="Gerencie suas licitações"
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Editais' }
        ]}
        actions={
          <Button 
            variant="primary"
            icon={<Plus />}
            onClick={() => setIsModalOpen(true)}
          >
            Novo Edital
          </Button>
        }
      />
      
      <FilterBar 
        searchValue={filters.orgao}
        onSearchChange={(value) => handleFilterChange('orgao', value)}
        filters={[
          { 
            key: 'status', 
            type: 'select', 
            label: 'Status',
            options: [
              { value: 'prospeccao', label: 'Prospecção' },
              { value: 'analise', label: 'Análise' },
              { value: 'cotacao', label: 'Cotação' },
              { value: 'proposta', label: 'Proposta' },
              { value: 'enviado', label: 'Enviado' },
              { value: 'resultado', label: 'Resultado' }
            ]
          }
        ]}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />
      
      {editais.length > 0 ? (
        <DataTable 
          columns={columns}
          data={editais}
          loading={loading}
          onRowClick={(edital) => navigate(`/editals/${edital.id}`)}
        />
      ) : (
        <EmptyState 
          icon={<FileText size={48} />}
          title="Nenhum edital encontrado"
          message="Comece criando seu primeiro edital"
          action={{ 
            label: 'Novo Edital', 
            onClick: () => setIsModalOpen(true) 
          }}
        />
      )}

      <ModalBase
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Edital"
        size="lg"
      >
        <EditalForm 
          onSubmit={handleCreateEdital}
          onCancel={() => setIsModalOpen(false)}
        />
      </ModalBase>
    </div>
  )
}
```

---

### Passo 6: Exportar no index.ts

**Arquivo:** `src/modules/editals/index.ts`

```typescript
/**
 * Exportação pública do módulo Editals
 * IMPORTANTE: APENAS view e API são exportados
 * 
 * @module modules/editals
 */

// ✅ API pública (interface contratual)
export * from './editals.api'

// ✅ View principal
export { EditalsView } from './views/EditalsView'

// ✅ Tipos (para uso externo)
export type * from './types'

// ❌ NÃO exportar:
// - services (privados)
// - components (privados do módulo)
// - hooks (opcionalmente podem ser exportados se úteis externamente)
```

---

## 4. Exemplo Completo: Módulo Editals

Veja a estrutura completa implementada:

```
src/modules/editals/
├── types/
│   └── index.ts                # ✅ Tipos do domínio
│
├── services/
│   └── editals.service.ts      # 🔒 PRIVADO - CRUD
│
├── editals.api.ts               # ✅ PÚBLICO - Interface
│
├── hooks/
│   └── useEditals.ts            # Custom hook
│
├── components/
│   ├── EditalForm.tsx           # Formulário de criação/edição
│   ├── EditalDetails.tsx        # Detalhes completos
│   ├── ItemTable.tsx            # Tabela de itens
│   └── DocumentAnalysisPanel.tsx # Análise de documento
│
├── views/
│   └── EditalsView.tsx          # ✅ View principal
│
└── index.ts                     # ✅ Re-exports públicos
```

---

## 5. Exemplo Completo: Módulo Suppliers

```
src/modules/suppliers/
├── types/
│   └── index.ts
│
├── services/
│   └── suppliers.service.ts    # 🔒 PRIVADO
│
├── suppliers.api.ts             # ✅ PÚBLICO
│
├── hooks/
│   └── useSuppliers.ts
│
├── components/
│   ├── SupplierForm.tsx
│   ├── SupplierDetails.tsx
│   └── RatingStars.tsx
│
├── views/
│   └── SuppliersView.tsx       # ✅ View principal
│
└── index.ts                     # ✅ Re-exports
```

**suppliers.api.ts (resumido):**

```typescript
export interface SuppliersAPI {
  listSuppliers: (organizationId: string, filters?: SupplierFilters) => Promise<Supplier[]>
  getSupplier: (id: string) => Promise<Supplier | null>
  createSupplier: (supplier: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>) => Promise<Supplier | null>
  updateSupplier: (id: string, updates: Partial<Supplier>) => Promise<Supplier | null>
  deleteSupplier: (id: string) => Promise<boolean>
  fetchCNPJData: (cnpj: string) => Promise<ReceitaWSResponse>
}

class SuppliersAPIImpl implements SuppliersAPI {
  // Implementação...
  
  async fetchCNPJData(cnpj: string): Promise<ReceitaWSResponse> {
    const cleanCNPJ = cnpj.replace(/\D/g, '')
    const response = await fetch(`https://www.receitaws.com.br/v1/cnpj/${cleanCNPJ}`)
    
    if (!response.ok) throw new Error('CNPJ não encontrado')
    
    return await response.json()
  }
}

export const suppliersAPI: SuppliersAPI = new SuppliersAPIImpl()
```

---

## 6. Boas Práticas

### 6.1. Nomenclatura

**Services:**
- `editals.service.ts` (não `editalsService.ts`)
- Classe: `EditalsService`
- Instância: `editalsService`

**APIs:**
- `editals.api.ts` (não `editalsAPI.ts`)
- Interface: `EditalsAPI`
- Implementação: `EditalsAPIImpl`
- Instância: `editalsAPI`

**Views:**
- `EditalsView.tsx` (não `Editals.tsx`)
- Componente: `EditalsView`

### 6.2. Tratamento de Erros

**No Service:**
```typescript
async list(organizationId: string) {
  return await supabase
    .from(this.tableName)
    .select('*')
    .eq('organization_id', organizationId)
  // Retorna { data, error } do Supabase
}
```

**Na API:**
```typescript
async listEditals(organizationId: string) {
  const { data, error } = await editalsService.list(organizationId)
  
  if (error) {
    console.error('Error listing editals:', error)
    // Opcional: enviar para Sentry
    return []
  }
  
  return data || []
}
```

**Na View/Hook:**
```typescript
try {
  const editais = await editalsAPI.listEditals(orgId)
  setEditais(editais)
} catch (err) {
  toast.error('Erro ao carregar editais')
  console.error(err)
}
```

### 6.3. Comunicação entre Módulos

**Exemplo:** Módulo de Contratos precisa de dados de Editais

```typescript
// ✅ CORRETO - Via API pública
import { editalsAPI } from '@/modules/editals'

export class ContractsAPIImpl implements ContractsAPI {
  async createContractFromEdital(editalId: string) {
    // Buscar edital via API pública
    const edital = await editalsAPI.getEdital(editalId)
    
    if (!edital) throw new Error('Edital não encontrado')
    
    // Criar contrato com dados do edital
    return await contractsService.create({
      edital_id: edital.id,
      objeto: edital.objeto,
      valor_total: edital.valor_estimado,
      // ...
    })
  }
}
```

---

## 7. Checklist de Validação

Ao implementar um novo módulo, validar:

### Estrutura
- [ ] Diretório `types/` com `index.ts`
- [ ] Diretório `services/` com `[module].service.ts`
- [ ] Arquivo `[module].api.ts` na raiz do módulo
- [ ] Diretório `views/` com `[Module]View.tsx`
- [ ] Arquivo `index.ts` exportando APENAS API e View

### Types
- [ ] Tipos principais do domínio definidos
- [ ] Tipos de filtros definidos
- [ ] Tipos de resposta/payload definidos
- [ ] Todos os tipos exportados

### Service
- [ ] Classe com nome `[Module]Service`
- [ ] Métodos: `list`, `getById`, `create`, `update`, `delete`
- [ ] Queries otimizadas com filtros
- [ ] NÃO exportado no `index.ts`

### API
- [ ] Interface `[Module]API` definida
- [ ] Implementação `[Module]APIImpl`
- [ ] Instância singleton exportada
- [ ] Tratamento de erros em todos os métodos
- [ ] Documentação JSDoc

### View
- [ ] Usa componentes do Design System
- [ ] Compõe organismos (não duplica código)
- [ ] LOC ≤300
- [ ] Responsiva
- [ ] Suporta modo claro/escuro

### Comunicação
- [ ] Nenhum módulo acessa `services` de outros módulos diretamente
- [ ] Toda comunicação via `*.api.ts`

### Código
- [ ] 100% TypeScript (sem `any` injustificados)
- [ ] `React.memo()` em componentes
- [ ] `useCallback()` em callbacks
- [ ] `useMemo()` em cálculos complexos

---

## 📚 Recursos Adicionais

- **Product Backlog:** [LICITA_FLOW_PRODUCT_BACKLOG.md](./LICITA_FLOW_PRODUCT_BACKLOG.md)
- **System Architecture:** [LICITA_FLOW_ARCHITECTURE.md](./LICITA_FLOW_ARCHITECTURE.md)
- **Design System:** [LICITA_FLOW_DESIGN_SYSTEM.md](./LICITA_FLOW_DESIGN_SYSTEM.md)
- **Component Reference:** [COMPONENT_QUICK_REFERENCE.md](./COMPONENT_QUICK_REFERENCE.md)

---

**Última atualização:** 28 de Outubro de 2025  
**Versão:** 1.0

**Dúvidas?** Consulte a documentação completa ou abra uma issue no repositório.

