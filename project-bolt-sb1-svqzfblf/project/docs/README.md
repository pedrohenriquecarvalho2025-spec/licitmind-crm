# 📚 LicitaFlow - Documentação do Projeto

> **Centro de Documentação Técnica e de Produto**  
> Versão: 1.0  
> Data: 28 de Outubro de 2025

---

## 🎯 Visão Geral

O **LicitaFlow** é um **Micro SaaS (CRM Vertical)** focado na gestão **pós-prospecção** de licitações públicas. O sistema organiza, automatiza e otimiza todo o fluxo de trabalho desde a análise do edital até o gerenciamento do contrato, oferecendo:

- ✅ **Automação via OCR:** Extração inteligente de dados de editais
- ✅ **Compliance Simplificado:** Vault de documentos com alertas de vencimento
- ✅ **Gestão Centralizada:** Portais de licitação com credenciais criptografadas
- ✅ **Pipeline Visual:** Kanban de editais (estilo "pasta")
- ✅ **Integrações Nativas:** Google Drive, Google/Apple Calendar, ERPs
- ✅ **BI Embutido:** Relatórios e dashboards para tomada de decisão

---

## 📑 Estrutura da Documentação

Esta documentação está organizada em **4 documentos principais**:

### 1. 📋 [Product Backlog](./LICITA_FLOW_PRODUCT_BACKLOG.md)
**O QUÊ construir**

Contém:
- ✅ Visão do produto e proposta de valor
- ✅ Personas e jornadas de usuário
- ✅ 60+ User Stories organizadas em 15 Epics
- ✅ Critérios de aceitação detalhados
- ✅ Métricas de sucesso (KPIs de produto, técnicos e de negócio)

**Quando usar:** Para entender as funcionalidades, prioridades e requisitos de cada feature.

---

### 2. 🏗️ [System Architecture](./LICITA_FLOW_ARCHITECTURE.md)
**COMO construir (estrutura técnica)**

Contém:
- ✅ Arquitetura de Frontend (Atomic Design + Componentização Extrema)
- ✅ Arquitetura de Backend (Vertical Slice Architecture)
- ✅ Schema de Banco de Dados (PostgreSQL/Supabase)
- ✅ Estratégias de Segurança (RLS, RBAC, Criptografia)
- ✅ Integrações Externas (OCR, Google APIs, ReceitaWS)
- ✅ Performance e Otimização
- ✅ Deployment e DevOps

**Quando usar:** Para entender a estrutura do sistema, decisões de arquitetura e padrões técnicos.

---

### 3. 🎨 [Design System](./LICITA_FLOW_DESIGN_SYSTEM.md)
**COMO construir (componentes de UI)**

Contém:
- ✅ Princípios do Design System (Atomic Design)
- ✅ Tokens de Design (cores, tipografia, espaçamento, sombras)
- ✅ Biblioteca de Componentes:
  - **8 Átomos** (Button, Input, Badge, Icon, Label, Title, Text, Spinner)
  - **13 Moléculas** (FormField, MetricCard, ModalBase, SearchInput, etc.)
  - **17+ Organismos** (DataTable, PageHeader, KanbanBoard, CalendarView, etc.)
- ✅ Padrões de Interação (feedback, confirmações, navegação)
- ✅ Guia de Uso e composição

**Quando usar:** Para implementar componentes de UI, garantir consistência visual e reutilização máxima.

---

### 4. 🚀 [Development Plan](./LICITA_FLOW_DEVELOPMENT_PLAN.md)
**QUANDO construir (roadmap e sprints)**

Contém:
- ✅ Plano de 14 Sprints (7 meses de desenvolvimento)
- ✅ Metodologia de Desenvolvimento (Scrum adaptado)
- ✅ Divisão em 4 Fases:
  - **Fase 0:** Setup e Fundação (1 semana)
  - **Fase 1:** MVP Core - Sprints 1-6 (12 semanas)
  - **Fase 2:** Funcionalidades Avançadas - Sprints 7-10 (8 semanas)
  - **Fase 3:** Integrações e BI - Sprints 11-13 (6 semanas)
  - **Fase 4:** Polimento e Lançamento - Sprint 14 (2 semanas)
- ✅ Cronograma detalhado com entregas por sprint
- ✅ Riscos e Mitigações
- ✅ Critérios de Sucesso (MVP e Pós-Lançamento)

**Quando usar:** Para planejar sprints, entender prioridades temporais e acompanhar progresso.

---

## 🧭 Como Navegar na Documentação

### Para Product Owners / Gerentes de Produto:
1. Comece pelo [**Product Backlog**](./LICITA_FLOW_PRODUCT_BACKLOG.md) para entender as funcionalidades
2. Consulte o [**Development Plan**](./LICITA_FLOW_DEVELOPMENT_PLAN.md) para cronogramas e prioridades
3. Revise [**System Architecture**](./LICITA_FLOW_ARCHITECTURE.md) (seção de visão geral) para contexto técnico

### Para Desenvolvedores Frontend:
1. Estude o [**Design System**](./LICITA_FLOW_DESIGN_SYSTEM.md) completamente
2. Consulte [**System Architecture**](./LICITA_FLOW_ARCHITECTURE.md) (seção de Frontend)
3. Referencie [**Product Backlog**](./LICITA_FLOW_PRODUCT_BACKLOG.md) para requisitos funcionais de cada User Story

### Para Desenvolvedores Backend:
1. Estude [**System Architecture**](./LICITA_FLOW_ARCHITECTURE.md) (seções de Backend e Banco de Dados)
2. Consulte [**Product Backlog**](./LICITA_FLOW_PRODUCT_BACKLOG.md) para entender regras de negócio
3. Referencie [**Development Plan**](./LICITA_FLOW_DEVELOPMENT_PLAN.md) para prioridades de implementação

### Para UX/UI Designers:
1. Comece pelo [**Design System**](./LICITA_FLOW_DESIGN_SYSTEM.md)
2. Consulte [**Product Backlog**](./LICITA_FLOW_PRODUCT_BACKLOG.md) (seção de Personas e Jornadas)
3. Referencie [**System Architecture**](./LICITA_FLOW_ARCHITECTURE.md) (seção de UI/UX)

### Para QA/Testers:
1. Use o [**Product Backlog**](./LICITA_FLOW_PRODUCT_BACKLOG.md) para criar casos de teste baseados em critérios de aceitação
2. Consulte [**Development Plan**](./LICITA_FLOW_DEVELOPMENT_PLAN.md) (seção de Definição de Pronto)
3. Referencie [**System Architecture**](./LICITA_FLOW_ARCHITECTURE.md) para entender fluxos técnicos

---

## 🏛️ Princípios de Arquitetura

### Frontend: Componentização Extrema (Atomic Design)

**Filosofia:** Construir interfaces montando componentes reutilizáveis. **NÃO** criar páginas monolíticas.

**Hierarquia:**
```
Átomos (≤50 LOC)
  ↓
Moléculas (≤100 LOC)
  ↓
Organismos (≤200 LOC)
  ↓
Views (≤300 LOC)
```

**Regras:**
- ✅ Todos os componentes usam `React.memo()`
- ✅ Funções passadas como props usam `useCallback()`
- ✅ Cálculos complexos usam `useMemo()`
- ✅ 100% TypeScript (sem `any` injustificado)

### Backend: Vertical Slice Architecture

**Filosofia:** Isolar módulos de negócio em fatias verticais. Cada módulo é autocontido.

**Estrutura:**
```
src/modules/[module-name]/
├── types/          [Tipos do domínio]
├── services/       [PRIVADO - Acesso ao Supabase]
├── [module].api.ts [PÚBLICO - Interface contratual]
├── components/     [Componentes de domínio]
└── views/          [View principal]
```

**Regra de Ouro:** Módulos SÓ se comunicam via `*.api.ts`. **NÃO** acessar `services` de outros módulos.

---

## 🎨 Design System - Componentes Principais

### Átomos (8)
`Button`, `Input`, `Badge`, `Icon`, `Label`, `Title`, `Text`, `Spinner`

### Moléculas (13)
`SearchInput`, `FormField`, `MetricCard`, `ModalBase`, `ConfirmDialog`, `Select`, `Dropdown`, `StatusBadge`, `InfoBanner`, `SmartSearch`, `LiveStats`, `QuickActions`, `Logo`

### Organismos Compartilhados (17+)
`PageHeader`, `FilterBar`, `DataTable`, `EmptyState`, `RemindersCenter`, `QuickLinksGrid`, `RecentActivityFeed`, `KanbanBoard`, `KanbanCard`, `DocumentCard`, `CalendarView`, `SupplierCard`, `QuotationComparisonTable`, `PortalCard`, `ContractCard`, e mais...

---

## 🗂️ Módulos do Sistema

| # | Módulo | Prioridade | Sprint | Funcionalidades Principais |
|---|--------|-----------|--------|---------------------------|
| 1 | **Auth** | P0 | 1 | Login, Registro, RBAC, Multi-tenancy |
| 2 | **Dashboard** | P0 | 1-2 | Lembretes, Links Rápidos, Atividade, KPIs, Banner |
| 3 | **Editals** | P0 | 2-3 | CRUD, OCR, Análise de Documento, Itens |
| 4 | **Pipeline** | P0 | 4 | Kanban, Drag & Drop, Filtros, Métricas |
| 5 | **Vault (Documents)** | P0 | 5 | CRUD, Alertas de Vencimento, Versões, Busca |
| 6 | **Calendar** | P0 | 6 | Eventos, Tarefas, Sincronização Google/Apple |
| 7 | **Suppliers** | P1 | 7 | CRUD, ReceitaWS, Histórico, Avaliações |
| 8 | **Quotations** | P1 | 8 | Solicitação, Upload, Comparação, Seleção |
| 9 | **Portals** | P1 | 9 | CRUD, Credenciais Criptografadas, Métricas |
| 10 | **Contracts** | P1 | 9-10 | CRUD, Alertas, Dashboard, Aditivos |
| 11 | **Reports** | P2 | 13 | BI, Gráficos, Exportação (PDF/Excel/CSV) |
| 12 | **Users** | P2 | - | Gestão de Usuários (Admin), Logs de Auditoria |
| 13 | **Notifications** | P2 | - | Centro de Notificações, Realtime, Preferências |
| 14 | **Settings** | P2 | 11-12 | Org Config, Integrações, SMTP, OCR Config |

---

## 📊 Stack Tecnológico

### Frontend
- **Framework:** React 18.3+ (TypeScript 5.5+)
- **Build:** Vite 7+
- **Styling:** TailwindCSS 3.4+
- **State:** Context API + Custom Hooks
- **Router:** React Router v6
- **Icons:** Lucide React
- **Charts:** Recharts
- **DnD:** @dnd-kit/core

### Backend (BaaS)
- **Platform:** Supabase
- **Database:** PostgreSQL 15+
- **Auth:** Supabase Auth (JWT)
- **Storage:** Supabase Storage
- **Realtime:** Supabase Realtime (WebSockets)
- **Functions:** Deno (Edge Functions)

### Integrações
- **OCR:** Google Cloud Vision API
- **Email:** SendGrid
- **Calendar:** Google Calendar API, CalDAV (Apple)
- **Storage:** Google Drive API
- **Data:** ReceitaWS (CNPJ)

---

## 🎯 Roadmap de Alto Nível

```
┌─────────────────────────────────────────────────────────────────┐
│ FASE 0: Setup e Fundação (1 semana)                             │
│ • Ambiente de desenvolvimento                                    │
│ • Design System base (átomos, moléculas, organismos)            │
│ • Layout estrutural (Header, Sidebar, AuthGuard)                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ FASE 1: MVP Core (12 semanas - Sprints 1-6)                     │
│ Sprint 1: Auth + Dashboard Base                                  │
│ Sprint 2: Dashboard Completo + Editais CRUD                      │
│ Sprint 3: OCR e Análise de Documentos                            │
│ Sprint 4: Pipeline Kanban                                        │
│ Sprint 5: Vault de Documentos                                    │
│ Sprint 6: Calendário e Tarefas                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ FASE 2: Funcionalidades Avançadas (8 semanas - Sprints 7-10)    │
│ Sprint 7: Gestão de Fornecedores                                │
│ Sprint 8: Gestão de Cotações                                     │
│ Sprint 9: Portais e Contratos                                    │
│ Sprint 10: Análise Avançada + Alertas                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ FASE 3: Integrações e BI (6 semanas - Sprints 11-13)            │
│ Sprint 11: Google Calendar + Google Drive                        │
│ Sprint 12: Apple Calendar + SMTP                                 │
│ Sprint 13: BI e Relatórios                                       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ FASE 4: Polimento e Lançamento (2 semanas - Sprint 14)          │
│ • Correção de bugs                                               │
│ • Otimização de performance                                      │
│ • Testes com usuários beta                                       │
│ • Deploy final em produção                                       │
│ • Lançamento público                                             │
└─────────────────────────────────────────────────────────────────┘
```

**Total:** 29 semanas (~7 meses)

---

## ✅ Critérios de Sucesso do MVP

### Técnicos
- [ ] 100% TypeScript (sem `any` injustificados)
- [ ] Componentes dentro dos limites de LOC
- [ ] Vertical Slice Architecture aplicada
- [ ] RLS ativado em todas as tabelas
- [ ] Performance: FCP < 1.5s, TTI < 3s, LCP < 2.5s
- [ ] Responsivo: Mobile, Tablet, Desktop
- [ ] Acessibilidade: WCAG 2.1 AA
- [ ] Temas: Claro e Escuro funcionando

### Produto
- [ ] 10 módulos funcionais
- [ ] OCR extrai 80%+ dos dados corretamente
- [ ] Integrações Google funcionando
- [ ] 3-5 organizações beta usando
- [ ] NPS ≥60 nos testes beta
- [ ] 0 bugs críticos em produção

### Negócio (3 meses pós-lançamento)
- [ ] 50 organizações ativas
- [ ] Taxa de retenção ≥85%
- [ ] MRR de R$ 5.000

---

## 🔗 Links Rápidos

- **Product Backlog:** [LICITA_FLOW_PRODUCT_BACKLOG.md](./LICITA_FLOW_PRODUCT_BACKLOG.md)
- **System Architecture:** [LICITA_FLOW_ARCHITECTURE.md](./LICITA_FLOW_ARCHITECTURE.md)
- **Design System:** [LICITA_FLOW_DESIGN_SYSTEM.md](./LICITA_FLOW_DESIGN_SYSTEM.md)
- **Development Plan:** [LICITA_FLOW_DEVELOPMENT_PLAN.md](./LICITA_FLOW_DEVELOPMENT_PLAN.md)

---

## 📝 Versionamento da Documentação

| Versão | Data | Alterações | Responsável |
|--------|------|-----------|-------------|
| 1.0 | 28/10/2025 | Criação inicial de todos os documentos | Equipe LicitaFlow |

---

## 🤝 Contribuindo

Esta documentação é um **documento vivo**. Se você encontrar inconsistências, erros ou tiver sugestões de melhorias:

1. Crie uma issue no repositório
2. Proponha alterações via Pull Request
3. Documente as mudanças na seção de versionamento

---

## 📧 Contato

Para dúvidas sobre a documentação ou o projeto:
- **Email:** produto@licitaflow.com.br
- **Slack:** #licitaflow-dev

---

**Última atualização:** 28 de Outubro de 2025  
**Versão:** 1.0  
**Status:** 🟢 Ativo

---

## 🚀 Vamos construir o LicitaFlow!

Esta documentação fornece tudo o que você precisa para entender, planejar e desenvolver o LicitaFlow. Siga os princípios de arquitetura, reutilize componentes ao máximo e mantenha o foco no valor para o usuário.

**Próximo passo:** Iniciar a [Fase 0: Setup e Fundação](./LICITA_FLOW_DEVELOPMENT_PLAN.md#3-fase-0-setup-e-fundação)

