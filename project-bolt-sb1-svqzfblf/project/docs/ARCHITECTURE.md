# 🏗️ Arquitetura LicitMind - Documentação Completa

## **Visão Geral**

O LicitMind foi refatorado seguindo a **Metodologia de Componentização Extrema** e **Atomic Design**, resultando em uma arquitetura altamente modular, escalável e manutenível, adequada para um produto comercial (SaaS).

---

## **📐 Princípios Arquiteturais**

### **1. Single Responsibility Principle (SRP)**
Cada componente, função, classe e módulo tem uma única responsabilidade bem definida e coesa.

### **2. Atomic Design**
Componentes organizados em hierarquia crescente de complexidade:
- **Átomos:** Componentes mínimos (≤ 50 LOC)
- **Moléculas:** Composição de átomos (≤ 100 LOC)
- **Organismos:** Composição complexa (≤ 200 LOC)
- **Views:** Orquestração de organismos (≤ 300 LOC)

### **3. Vertical Slice Architecture**
Módulos de negócio isolados verticalmente com:
- Tipos próprios
- Serviços de dados
- Interface contratual (API)
- Componentes de domínio
- Views específicas

### **4. Dependency Inversion**
Módulos comunicam-se EXCLUSIVAMENTE via interfaces contratuais (*.api.ts).
Acesso direto a serviços/repositórios de outros módulos é PROIBIDO.

---

## **🗂️ Estrutura de Diretórios**

```
src/
├── types/                          # Tipos compartilhados
│   ├── common.ts                   # Tipos base (UUID, Timestamp, BaseEntity)
│   ├── ui.ts                       # Tipos de UI (ButtonVariant, TableColumn)
│   └── index.ts
│
├── core/                           # Infraestrutura base
│   ├── config/
│   │   ├── constants.ts            # Constantes globais
│   │   └── index.ts
│   ├── utils/
│   │   ├── formatters.ts           # Formatação (moeda, data, CNPJ)
│   │   ├── validators.ts           # Validações (email, CNPJ, phone)
│   │   ├── logger.ts               # Sistema de logging
│   │   └── index.ts
│   └── index.ts
│
├── hooks/                          # Hooks customizados reutilizáveis
│   ├── useAuth.ts                  # Autenticação e permissões
│   ├── useDataTable.ts             # Gerenciamento de tabelas
│   ├── useOrganization.ts          # Contexto de organização
│   ├── useSupabaseQuery.ts         # Queries com loading/error
│   ├── useSupabaseMutation.ts      # Mutações otimizadas
│   └── index.ts
│
├── components/
│   ├── ui/
│   │   ├── atoms/                  # Componentes mínimos (≤50 LOC)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Icon.tsx
│   │   │   ├── Label.tsx
│   │   │   ├── Title.tsx
│   │   │   ├── Text.tsx
│   │   │   ├── Spinner.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── molecules/              # Componentes funcionais (≤100 LOC)
│   │       ├── SearchInput.tsx
│   │       ├── FormField.tsx
│   │       ├── MetricCard.tsx
│   │       ├── ModalBase.tsx
│   │       ├── ConfirmDialog.tsx
│   │       ├── Select.tsx
│   │       └── index.ts
│   │
│   └── shared/
│       └── organisms/              # Organismos compartilhados (≤200 LOC)
│           ├── PageHeader.tsx
│           ├── FilterBar.tsx
│           ├── DataTable.tsx
│           ├── EmptyState.tsx
│           └── index.ts
│
├── modules/                        # Módulos de negócio (Vertical Slices)
│   │
│   ├── contracts/                  # Módulo de Contratos
│   │   ├── types/
│   │   │   └── index.ts            # Contract, ContractStatus, ContractStats
│   │   ├── services/
│   │   │   └── contracts.service.ts # Acesso a dados (Supabase)
│   │   ├── contracts.api.ts        # ⚠️ INTERFACE CONTRATUAL (única forma de acesso externo)
│   │   ├── components/
│   │   │   ├── ContractCard.tsx
│   │   │   └── ContractStatsGrid.tsx
│   │   ├── views/
│   │   │   └── ContractsDashboard.tsx
│   │   └── index.ts                # Exportações públicas
│   │
│   ├── suppliers/                  # Módulo de Fornecedores
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   └── suppliers.service.ts
│   │   ├── suppliers.api.ts        # ⚠️ INTERFACE CONTRATUAL
│   │   └── index.ts
│   │
│   └── editals/                    # Módulo de Editais
│       ├── types/
│       ├── services/
│       ├── editals.api.ts          # ⚠️ INTERFACE CONTRATUAL
│       ├── components/
│       ├── views/
│       └── index.ts
│
├── lib/                            # Bibliotecas externas
│   ├── supabase.ts
│   └── database.types.ts
│
├── contexts/                       # Contextos React
│   └── ThemeContext.tsx
│
├── App.tsx                         # Roteador principal
└── main.tsx                        # Entry point
```

---

## **🔌 Comunicação Entre Módulos**

### **Regra de Ouro:**
> **Módulos SÓ podem se comunicar via Interfaces Contratuais (*.api.ts)**

### **✅ CORRETO:**
```typescript
// Em outro módulo (ex: editals)
import { contractsAPI } from '../contracts'

// Usar a API pública
const contracts = await contractsAPI.listContracts(orgId)
```

### **❌ PROIBIDO:**
```typescript
// NUNCA fazer isso:
import { contractsService } from '../contracts/services/contracts.service'
const contracts = await contractsService.list(orgId) // ❌ VIOLAÇÃO
```

### **Por que isso é importante?**
- **Encapsulamento:** Mudanças internas não afetam outros módulos
- **Testabilidade:** APIs podem ser mockadas facilmente
- **Manutenibilidade:** Contratos claros entre módulos
- **Escalabilidade:** Módulos podem ser extraídos para microserviços

---

## **🧩 Anatomia de um Módulo**

### **Exemplo: Módulo de Contratos**

```
modules/contracts/
├── types/index.ts                  # Tipos do domínio
│   - Contract
│   - ContractStatus
│   - ContractFilters
│   - ContractStats
│
├── services/contracts.service.ts   # ⚠️ PRIVADO (não exportar)
│   - Classe ContractsService
│   - Métodos: list(), getById(), create(), update(), delete()
│   - Acesso direto ao Supabase
│   - Logging de erros
│
├── contracts.api.ts                # ⚠️ PÚBLICO (interface contratual)
│   - Interface ContractsAPI
│   - Implementação ContractsAPIImpl
│   - Exportação: contractsAPI (singleton)
│   - Métodos públicos:
│     * listContracts()
│     * getContract()
│     * createContract()
│     * updateContract()
│     * deleteContract()
│     * getContractStats()
│     * calculateDaysUntilExpiry()
│     * isExpiring()
│
├── components/                     # Componentes de domínio
│   ├── ContractCard.tsx           # Organismo específico (~50 LOC)
│   └── ContractStatsGrid.tsx      # Organismo específico (~40 LOC)
│
├── views/
│   └── ContractsDashboard.tsx     # View principal (~120 LOC)
│       - Orquestra componentes
│       - Gerencia estado local
│       - Usa contractsAPI
│       - Usa hooks compartilhados
│
└── index.ts                        # Exportações públicas
    - ContractsDashboard (view)
    - contractsAPI (interface)
    - Tipos (Contract, ContractStatus, etc.)
```

---

## **📏 Limites de LOC (Lines of Code)**

### **Filosofia:**
LOC são uma ferramenta para garantir o SRP, não uma regra arbitrária.

| Tipo | LOC Máximo | Exceção Permitida? |
|------|------------|-------------------|
| Átomos | 50 | Raramente |
| Moléculas | 100 | Com justificativa |
| Organismos | 200 | Com justificativa |
| Views | 300 | Com justificativa |
| Serviços | 300 | Com justificativa |
| Funções | 30 | Com justificativa |

### **Como Justificar Exceções:**
```typescript
// JUSTIFICATIVA LOC: Este componente excede 100 LOC pois...
// 1. Divide responsabilidades prejudicaria a coesão
// 2. Lógica de validação complexa é específica deste contexto
// 3. Alternativa seria criar 5 componentes interconectados reduzindo clareza
```

---

## **🎨 Padrões de Design**

### **1. Composição sobre Herança**
```typescript
// ✅ BOM
<PageHeader 
  title="Contratos"
  actions={<Button>Novo</Button>}
/>

// ❌ EVITAR
class ContractPageHeader extends PageHeader { ... }
```

### **2. Render Props / Children**
```typescript
<FormField label="Nome" error={errors.name}>
  <Input {...register('name')} />
</FormField>
```

### **3. Custom Hooks para Lógica**
```typescript
function useContracts(organizationId: string) {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadContracts()
  }, [organizationId])
  
  return { contracts, loading, refetch: loadContracts }
}
```

---

## **🔐 Segurança e Autenticação**

### **RLS (Row Level Security)**
- Todas as tabelas protegidas por `organization_id`
- Policies por role (admin, gestor, analista, cliente)
- `useAuth()` hook para verificação de permissões

### **Hierarquia de Permissões**
```typescript
ROLE_HIERARCHY = {
  admin: 4,        // Controle total
  gestor: 3,       // Visão da equipe
  analista: 2,     // CRUD próprio
  cliente: 1,      // Somente leitura
  client_viewer: 0 // Leitura ultra-restrita
}
```

---

## **📊 Performance e Otimização**

### **1. Lazy Loading de Módulos**
```typescript
const ContractsDashboard = React.lazy(() => 
  import('./modules/contracts').then(m => ({ default: m.ContractsDashboard }))
)
```

### **2. Memoização**
```typescript
const MemoizedContractCard = React.memo(ContractCard)
```

### **3. Virtual Scrolling**
Para listas grandes (>100 itens), usar `react-virtual`.

### **4. Debounce em Buscas**
```typescript
const debouncedSearch = useDebouncedCallback(
  (term) => setSearchTerm(term),
  300
)
```

---

## **🧪 Testabilidade**

### **Testes por Camada:**

**Átomos/Moléculas:**
```typescript
describe('Button', () => {
  it('renders with correct variant', () => {
    render(<Button variant="primary">Click</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-gradient-to-r')
  })
})
```

**Hooks:**
```typescript
describe('useDataTable', () => {
  it('handles pagination', () => {
    const { result } = renderHook(() => useDataTable())
    act(() => result.current.handlePageChange(2))
    expect(result.current.pagination.page).toBe(2)
  })
})
```

**APIs (Mocking):**
```typescript
jest.mock('../modules/contracts/contracts.api', () => ({
  contractsAPI: {
    listContracts: jest.fn().mockResolvedValue([])
  }
}))
```

---

## **📖 Guia de Extensibilidade**

### **Como Adicionar um Novo Módulo**

#### **1. Criar Estrutura:**
```bash
mkdir -p src/modules/novo_modulo/{types,services,components,views}
```

#### **2. Definir Tipos:**
```typescript
// src/modules/novo_modulo/types/index.ts
export interface MinhaEntidade extends OrganizationEntity {
  nome: string
  // ...
}
```

#### **3. Criar Serviço:**
```typescript
// src/modules/novo_modulo/services/meu_modulo.service.ts
export class MeuModuloService {
  private tableName = 'minha_tabela'
  
  async list(organizationId: string) { ... }
  async getById(id: string) { ... }
  // ...
}
```

#### **4. Definir API Pública:**
```typescript
// src/modules/novo_modulo/novo_modulo.api.ts
export interface NovoModuloAPI {
  listarItens: (orgId: string) => Promise<Item[]>
  // ...
}

class NovoModuloAPIImpl implements NovoModuloAPI {
  async listarItens(orgId: string) {
    const { data } = await meuModuloService.list(orgId)
    return data || []
  }
}

export const novoModuloAPI: NovoModuloAPI = new NovoModuloAPIImpl()
```

#### **5. Criar Componentes e Views:**
```typescript
// src/modules/novo_modulo/views/Dashboard.tsx
export function NovoModuloDashboard() {
  const { organizationId } = useOrganization()
  const [items, setItems] = useState([])
  
  useEffect(() => {
    loadData()
  }, [organizationId])
  
  const loadData = async () => {
    const data = await novoModuloAPI.listarItens(organizationId!)
    setItems(data)
  }
  
  return <PageHeader title="Novo Módulo" />
}
```

#### **6. Exportar Publicamente:**
```typescript
// src/modules/novo_modulo/index.ts
export { NovoModuloDashboard } from './views/Dashboard'
export { novoModuloAPI } from './novo_modulo.api'
export type { MinhaEntidade } from './types'
```

#### **7. Adicionar ao App:**
```typescript
// src/App.tsx
import { NovoModuloDashboard } from './modules/novo_modulo'

const viewConfigs = {
  // ...
  novo_modulo: {
    title: 'Novo Módulo',
    description: 'Descrição',
    component: <NovoModuloDashboard />
  }
}
```

---

## **✅ Checklist de Qualidade**

Antes de considerar um módulo completo, verificar:

- [ ] Tipos TypeScript definidos sem `any`
- [ ] Serviços com error handling e logging
- [ ] API pública documentada
- [ ] Componentes respeitam limites de LOC
- [ ] Views usam hooks compartilhados
- [ ] Sem acesso direto a serviços de outros módulos
- [ ] RLS policies implementadas no banco
- [ ] Índices de performance criados
- [ ] Testes unitários escritos
- [ ] Documentação inline (JSDoc)

---

## **🚀 Próximos Passos**

1. ✅ **Migrar componentes legados** para nova estrutura
2. ✅ **Implementar testes automatizados** (Jest + Testing Library)
3. ✅ **Configurar CI/CD** (GitHub Actions)
4. ✅ **Adicionar Storybook** para documentação de componentes
5. ✅ **Implementar Error Boundaries** para resiliência
6. ✅ **Adicionar Sentry** para monitoramento de erros
7. ✅ **Otimizar bundle size** (code splitting avançado)

---

**Esta arquitetura garante que o LicitMind seja um produto robusto, escalável e manutenível, pronto para crescimento comercial e evolução contínua.**

