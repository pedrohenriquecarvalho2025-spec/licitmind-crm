# 🚀 LicitaFlow - Plano de Desenvolvimento Inicial

> **Roadmap de Implementação (MVP → Lançamento)**  
> Versão: 1.0  
> Data: 28 de Outubro de 2025

---

## 📑 Índice

1. [Visão Geral do Plano](#1-visão-geral-do-plano)
2. [Metodologia de Desenvolvimento](#2-metodologia-de-desenvolvimento)
3. [Fase 0: Setup e Fundação](#3-fase-0-setup-e-fundação)
4. [Fase 1: MVP Core (Sprints 1-6)](#4-fase-1-mvp-core-sprints-1-6)
5. [Fase 2: Funcionalidades Avançadas (Sprints 7-10)](#5-fase-2-funcionalidades-avançadas-sprints-7-10)
6. [Fase 3: Integrações e BI (Sprints 11-13)](#6-fase-3-integrações-e-bi-sprints-11-13)
7. [Fase 4: Polimento e Lançamento (Sprint 14)](#7-fase-4-polimento-e-lançamento-sprint-14)
8. [Cronograma Detalhado](#8-cronograma-detalhado)
9. [Riscos e Mitigações](#9-riscos-e-mitigações)
10. [Critérios de Sucesso](#10-critérios-de-sucesso)

---

## 1. Visão Geral do Plano

### 1.1. Objetivo

Desenvolver o **LicitaFlow MVP** em **14 sprints de 2 semanas** (7 meses), seguindo rigorosamente:
- **Atomic Design** com limites de LOC
- **Vertical Slice Architecture** com interfaces contratuais
- **Reutilização máxima** de componentes existentes

### 1.2. Escopo do MVP

**Módulos Incluídos:**
1. Autenticação e Organizações
2. Dashboard Inteligente
3. Gestão de Editais (com OCR)
4. Pipeline Kanban
5. Vault de Documentos
6. Calendário e Tarefas
7. Gestão de Fornecedores
8. Gestão de Cotações
9. Gestão de Portais
10. Gestão de Contratos

**Módulos Pós-MVP:**
- Relatórios e BI Avançado
- Integrações ERP
- Mobile App
- Marketplace de Integrações

### 1.3. Equipe Sugerida

- **1 Product Owner** (part-time)
- **2 Desenvolvedores Full-Stack** (React + Supabase)
- **1 UX/UI Designer** (part-time, primeiras 4 sprints)
- **1 QA/Tester** (part-time, a partir da Sprint 4)

---

## 2. Metodologia de Desenvolvimento

### 2.1. Scrum Adaptado

- **Sprints:** 2 semanas
- **Planning:** Segunda-feira (2h)
- **Daily Standups:** 15min (assíncrono via Slack/Discord)
- **Review:** Sexta-feira da segunda semana (1h)
- **Retrospective:** Sexta-feira da segunda semana (30min)

### 2.2. Definição de Pronto (DoD)

Uma User Story está pronta quando:
- [ ] Código implementado e revisado (code review)
- [ ] Componentes seguem limites de LOC
- [ ] Tipos TypeScript completos
- [ ] Otimizações aplicadas (`React.memo`, `useCallback`, `useMemo`)
- [ ] Responsivo (mobile, tablet, desktop)
- [ ] Modo claro/escuro funcionando
- [ ] Testado manualmente
- [ ] Merged na branch `develop`

### 2.3. Branches e Workflow

```
main (produção)
  ↑
develop (staging)
  ↑
feature/US-XXX-nome-da-feature
```

**Processo:**
1. Criar branch `feature/US-XXX` a partir de `develop`
2. Desenvolver + commit atômicos
3. Pull Request para `develop` (review obrigatório)
4. Merge após aprovação
5. Deploy automático em `staging`
6. Testes de aceitação
7. Merge `develop → main` ao fim da sprint
8. Deploy em produção

### 2.4. Stack de Ferramentas

**Desenvolvimento:**
- **IDE:** VSCode com extensões (ESLint, Prettier, Tailwind IntelliSense)
- **Versionamento:** Git + GitHub
- **CI/CD:** GitHub Actions
- **Deploy Frontend:** Vercel
- **Backend:** Supabase Cloud

**Gestão:**
- **Project Management:** GitHub Projects / Linear / Jira
- **Docs:** Notion / Confluence
- **Comunicação:** Slack / Discord

---

## 3. Fase 0: Setup e Fundação

**Duração:** 1 semana (antes da Sprint 1)

### 3.1. Tarefas

#### **Setup de Ambiente**
- [ ] Criar repositório no GitHub
- [ ] Configurar projeto React + Vite + TypeScript
- [ ] Configurar TailwindCSS com tema customizado
- [ ] Criar projeto no Supabase
- [ ] Configurar variáveis de ambiente (`.env.local`)

#### **Design System Base**
- [ ] Implementar tokens de design (cores, tipografia, espaçamento)
- [ ] Criar Átomos existentes: `Button`, `Input`, `Badge`, `Icon`, `Label`, `Title`, `Text`, `Spinner`
- [ ] Criar Moléculas existentes: `SearchInput`, `FormField`, `MetricCard`, `ModalBase`, `ConfirmDialog`, `Select`, `Dropdown`
- [ ] Criar Organismos compartilhados: `PageHeader`, `FilterBar`, `DataTable`, `EmptyState`
- [ ] Criar `ThemeContext` e toggle claro/escuro

#### **Layout Base**
- [ ] Criar `Header` com logo, toggle de tema, notificações, perfil
- [ ] Criar `Sidebar` com menu de navegação (colapsável)
- [ ] Criar `AuthGuard` para proteção de rotas

#### **Banco de Dados**
- [ ] Executar migrações base (organizations, users)
- [ ] Configurar RLS e policies básicas
- [ ] Testar autenticação Supabase

**Entrega:** Ambiente pronto, Design System base funcional, Layout estrutural

---

## 4. Fase 1: MVP Core (Sprints 1-6)

### Sprint 1: Autenticação e Dashboard Base

**Duração:** 2 semanas  
**Objetivo:** Usuários podem se registrar, fazer login e ver um dashboard básico

#### **User Stories:**
- US-001: Autenticação e Autorização (5 pts)
- US-002: Multi-Tenancy e Organizações (8 pts)
- US-003: RBAC (13 pts)
- US-004: Tema Claro/Escuro (3 pts)
- US-005: Dashboard - Lembretes Inteligentes (8 pts)
- US-006: Dashboard - Links Rápidos (5 pts)

**Total de Pontos:** 42

#### **Tarefas Técnicas:**
- Implementar fluxo de registro/login com Supabase Auth
- Criar tabelas `organizations` e `users` com RLS
- Implementar `useAuth` hook
- Implementar `useOrganization` hook
- Criar `DashboardView` compondo organismos
- Criar `RemindersCenter` organism
- Criar `QuickLinksGrid` organism

**Entregas:**
- Login/Registro funcional
- Dashboard com lembretes e links rápidos
- RBAC implementado
- Tema claro/escuro funcional

---

### Sprint 2: Dashboard Completo + Início de Editais

**Duração:** 2 semanas  
**Objetivo:** Dashboard completo e CRUD básico de editais

#### **User Stories:**
- US-007: Dashboard - Atividade Recente (8 pts)
- US-008: Dashboard - Estatísticas em Tempo Real (8 pts)
- US-009: Dashboard - Banner Informativo (3 pts)
- US-010: CRUD de Editais (13 pts)

**Total de Pontos:** 32

#### **Tarefas Técnicas:**
- Implementar Supabase Realtime para atividades
- Criar `RecentActivityFeed` organism
- Criar `LiveStats` molecule
- Criar `InfoBanner` molecule
- Criar tabela `editals` com índices e triggers
- Implementar módulo `editals` com Vertical Slice Architecture
- Criar `editals.api.ts` (interface contratual)
- Criar `editals.service.ts` (CRUD privado)
- Criar `EditalsView` com `DataTable` + `FilterBar`
- Criar `EditalForm` molecule

**Entregas:**
- Dashboard 100% funcional
- Listagem e CRUD de editais (sem OCR ainda)

---

### Sprint 3: OCR e Análise de Documentos

**Duração:** 2 semanas  
**Objetivo:** Upload de PDF com OCR automático

#### **User Stories:**
- US-011: Upload de Edital com OCR (21 pts)
- US-012: Gestão de Itens do Edital (13 pts)

**Total de Pontos:** 34

#### **Tarefas Técnicas:**
- Configurar Google Cloud Vision API (ou Tesseract.js)
- Criar Edge Function `ocr-process`
- Implementar parsing inteligente de PDFs
- Criar `DocumentUploader` molecule
- Criar `ItemTable` organism (tabela editável inline)
- Integrar OCR no fluxo de criação de editais
- Testar com diferentes formatos de editais reais

**Entregas:**
- Upload de PDF funcional
- OCR extrai dados básicos (número, órgão, objeto, data, valor)
- Tabela de itens editável

---

### Sprint 4: Pipeline Kanban

**Duração:** 2 semanas  
**Objetivo:** Visualização Kanban de editais

#### **User Stories:**
- US-015: Visualização Kanban de Editais (13 pts)
- US-016: Drag & Drop entre Colunas (13 pts)
- US-017: Filtros no Pipeline (8 pts)
- US-018: Métricas por Coluna (5 pts)

**Total de Pontos:** 39

#### **Tarefas Técnicas:**
- Instalar e configurar `@dnd-kit/core`
- Criar `KanbanBoard` organism
- Criar `KanbanColumn` organism
- Criar `KanbanCard` organism (estilo pasta)
- Implementar lógica de drag & drop
- Adicionar filtros no `PipelineView`
- Calcular métricas por coluna (count, soma de valores)

**Entregas:**
- Pipeline Kanban funcional com drag & drop
- Filtros e métricas por coluna

---

### Sprint 5: Vault de Documentos

**Duração:** 2 semanas  
**Objetivo:** Gestão de documentos com alertas de vencimento

#### **User Stories:**
- US-019: CRUD de Documentos (13 pts)
- US-020: Alertas de Vencimento de Documentos (13 pts)
- US-021: Controle de Versão de Documentos (8 pts)
- US-022: Pesquisa Full-Text e Filtros (13 pts)

**Total de Pontos:** 47

#### **Tarefas Técnicas:**
- Criar tabela `documents` com índices GIN
- Configurar Supabase Storage (bucket `documents`)
- Implementar módulo `documents` (Vertical Slice)
- Criar `documents.api.ts`
- Criar `VaultView` com `DataTable` + `FilterBar`
- Criar `DocumentCard` organism
- Criar `DocumentUploader` molecule (reutilizar)
- Implementar job de notificações de vencimento (cron)
- Criar `ExpiringDocumentsWidget` no Dashboard

**Entregas:**
- Vault funcional com upload, download, exclusão
- Alertas de vencimento (email + widget no Dashboard)
- Pesquisa full-text

---

### Sprint 6: Calendário e Tarefas

**Duração:** 2 semanas  
**Objetivo:** Calendário com eventos e tarefas

#### **User Stories:**
- US-023: Calendário de Eventos e Tarefas (13 pts)
- US-024: CRUD de Tarefas Manuais (13 pts)

**Total de Pontos:** 26

#### **Tarefas Técnicas:**
- Criar tabela `calendar_events`
- Implementar módulo `calendar` (Vertical Slice)
- Criar `CalendarView` organism
- Criar `TaskForm` molecule
- Criar `TaskItem` molecule
- Implementar visualização mensal/semanal/diária
- Sincronizar eventos de editais (data de abertura) automaticamente
- Notificações de tarefas próximas

**Entregas:**
- Calendário funcional com visualizações múltiplas
- CRUD de tarefas
- Sincronização automática de eventos de editais

---

## 5. Fase 2: Funcionalidades Avançadas (Sprints 7-10)

### Sprint 7: Gestão de Fornecedores

**Duração:** 2 semanas  
**Objetivo:** CRUD de fornecedores com integração ReceitaWS

#### **User Stories:**
- US-027: CRUD de Fornecedores (8 pts)
- US-028: Integração ReceitaWS (8 pts)
- US-029: Histórico de Cotações por Fornecedor (8 pts)
- US-030: Avaliação de Fornecedores (5 pts)

**Total de Pontos:** 29

#### **Tarefas Técnicas:**
- Criar tabela `suppliers`
- Implementar módulo `suppliers` (Vertical Slice)
- Criar `suppliers.api.ts`
- Criar `SuppliersView` com `DataTable`
- Criar `SupplierForm` molecule
- Criar `SupplierCard` organism
- Integrar API ReceitaWS (client-side)
- Sistema de avaliação (1-5 estrelas)

**Entregas:**
- CRUD de fornecedores funcional
- Busca automática por CNPJ (ReceitaWS)
- Histórico e avaliações

---

### Sprint 8: Gestão de Cotações

**Duração:** 2 semanas  
**Objetivo:** Solicitação e comparação de cotações

#### **User Stories:**
- US-031: Solicitação de Cotação (13 pts)
- US-032: Upload de Propostas Recebidas (8 pts)
- US-033: Tabela Comparativa de Cotações (13 pts)
- US-034: Seleção de Vencedor (5 pts)

**Total de Pontos:** 39

#### **Tarefas Técnicas:**
- Criar tabela `quotations`
- Implementar módulo `quotations` (Vertical Slice)
- Criar `QuotationForm` molecule
- Criar `QuotationComparisonTable` organism
- Implementar envio de emails (SendGrid ou SMTP)
- Template de email de solicitação
- Upload de propostas (Storage)
- Lógica de seleção de vencedor

**Entregas:**
- Solicitação de cotação por email funcional
- Comparação lado a lado de propostas
- Seleção de vencedor

---

### Sprint 9: Gestão de Portais e Contratos

**Duração:** 2 semanas  
**Objetivo:** Gestão de portais com credenciais criptografadas e contratos

#### **User Stories:**
- US-035: CRUD de Portais de Licitação (13 pts)
- US-036: Registro de Últimos Acessos (5 pts)
- US-037: Métricas de Portais (8 pts)
- US-038: CRUD de Contratos (13 pts)

**Total de Pontos:** 39

#### **Tarefas Técnicas:**
- Criar tabelas `bidding_portals` e `contracts`
- Implementar criptografia AES-256 (Edge Function)
- Implementar módulo `portals` (Vertical Slice)
- Criar `PortalsView` com grid de `PortalCard`
- Implementar módulo `contracts` (Vertical Slice)
- Criar `ContractsView` com `DataTable`
- Criar `ContractCard` organism

**Entregas:**
- Gestão de portais com credenciais seguras
- CRUD de contratos funcional

---

### Sprint 10: Análise de Documentos e Alertas de Contratos

**Duração:** 2 semanas  
**Objetivo:** Análise automática de editais e alertas de vencimento de contratos

#### **User Stories:**
- US-013: Análise Automática de Documento (21 pts)
- US-039: Alertas de Vencimento de Contratos (8 pts)
- US-040: Dashboard de Contratos (13 pts)
- US-041: Histórico de Aditivos e Reajustes (8 pts)

**Total de Pontos:** 50

#### **Tarefas Técnicas:**
- Implementar lógica de análise de documentos (NLP básico ou regex)
- Identificar cláusulas restritivas, prazos críticos, oportunidades
- Criar `DocumentAnalysisPanel` organism
- Configurar job de alertas de contratos (cron)
- Criar `ExpiringContractsWidget` no Dashboard
- Dashboard de métricas de contratos
- Histórico de aditivos (tabela relacionada)

**Entregas:**
- Análise automática de editais funcional
- Alertas de vencimento de contratos
- Dashboard de contratos completo

---

## 6. Fase 3: Integrações e BI (Sprints 11-13)

### Sprint 11: Integrações Google (Calendar e Drive)

**Duração:** 2 semanas  
**Objetivo:** Sincronização com Google Calendar e Google Drive

#### **User Stories:**
- US-025: Integração com Google Calendar (21 pts)
- US-052: Integração com Google Drive (21 pts)

**Total de Pontos:** 42

#### **Tarefas Técnicas:**
- Configurar OAuth2 para Google APIs
- Criar Edge Functions para sincronização
- Implementar sincronização bidirecional de eventos
- Upload automático de documentos para Google Drive
- Configurações de integração na view de Settings

**Entregas:**
- Sincronização com Google Calendar funcional
- Backup automático de documentos no Drive

---

### Sprint 12: Integrações Apple Calendar e SMTP

**Duração:** 2 semanas  
**Objetivo:** Sincronização com Apple Calendar e configuração SMTP

#### **User Stories:**
- US-026: Integração com Apple Calendar (21 pts)
- US-054: Configuração SMTP para Emails (13 pts)

**Total de Pontos:** 34

#### **Tarefas Técnicas:**
- Implementar CalDAV para Apple Calendar
- Configuração de servidor SMTP customizado
- Template de emails personalizável
- Testes de envio de email

**Entregas:**
- Sincronização com Apple Calendar funcional
- SMTP customizado configurável

---

### Sprint 13: BI e Relatórios

**Duração:** 2 semanas  
**Objetivo:** Dashboard de BI com gráficos e exportação de relatórios

#### **User Stories:**
- US-042: Dashboard de BI (21 pts)
- US-043: Exportação de Relatórios (13 pts)

**Total de Pontos:** 34

#### **Tarefas Técnicas:**
- Instalar e configurar Recharts
- Criar gráficos: Taxa de sucesso, Valor médio, Distribuição por órgão, Tempo por etapa
- Implementar filtros de período
- Exportação para PDF (usando jsPDF)
- Exportação para Excel (usando xlsx)
- Exportação para CSV

**Entregas:**
- Dashboard de BI com 4+ gráficos interativos
- Exportação em PDF/Excel/CSV funcional

---

## 7. Fase 4: Polimento e Lançamento (Sprint 14)

### Sprint 14: Polimento, Testes e Lançamento

**Duração:** 2 semanas  
**Objetivo:** Corrigir bugs, otimizar performance, preparar lançamento

#### **Tarefas:**

**Semana 1: Polimento**
- [ ] Revisar todos os módulos (code review)
- [ ] Corrigir bugs conhecidos
- [ ] Otimizar queries lentas
- [ ] Adicionar loading states faltantes
- [ ] Melhorar mensagens de erro
- [ ] Revisar responsividade (mobile/tablet)
- [ ] Revisar acessibilidade (WCAG AA)
- [ ] Adicionar analytics (Google Analytics / Plausible)
- [ ] Configurar Sentry para monitoramento de erros

**Semana 2: Testes e Lançamento**
- [ ] Testes de carga (stress testing)
- [ ] Testes de segurança (penetration testing básico)
- [ ] Testes de aceitação com usuários beta (3-5 organizações)
- [ ] Coleta de feedback e ajustes finais
- [ ] Documentação de usuário (FAQ, tutoriais)
- [ ] Deploy final em produção
- [ ] Configurar domínio customizado
- [ ] Configurar SSL/HTTPS
- [ ] Anúncio público / lançamento

**Entregas:**
- MVP 100% funcional em produção
- Documentação completa
- 3-5 organizações beta usando o sistema

---

## 8. Cronograma Detalhado

| Sprint | Semanas | Início | Fim | Foco | Pontos |
|--------|---------|--------|-----|------|--------|
| **Setup** | 1 | Sem 0 | Sem 0 | Fundação | - |
| **Sprint 1** | 2 | Sem 1-2 | - | Auth + Dashboard Base | 42 |
| **Sprint 2** | 2 | Sem 3-4 | - | Dashboard Completo + Editais | 32 |
| **Sprint 3** | 2 | Sem 5-6 | - | OCR e Análise | 34 |
| **Sprint 4** | 2 | Sem 7-8 | - | Pipeline Kanban | 39 |
| **Sprint 5** | 2 | Sem 9-10 | - | Vault de Documentos | 47 |
| **Sprint 6** | 2 | Sem 11-12 | - | Calendário e Tarefas | 26 |
| **Sprint 7** | 2 | Sem 13-14 | - | Fornecedores | 29 |
| **Sprint 8** | 2 | Sem 15-16 | - | Cotações | 39 |
| **Sprint 9** | 2 | Sem 17-18 | - | Portais e Contratos | 39 |
| **Sprint 10** | 2 | Sem 19-20 | - | Análise + Alertas Contratos | 50 |
| **Sprint 11** | 2 | Sem 21-22 | - | Integrações Google | 42 |
| **Sprint 12** | 2 | Sem 23-24 | - | Apple Calendar + SMTP | 34 |
| **Sprint 13** | 2 | Sem 25-26 | - | BI e Relatórios | 34 |
| **Sprint 14** | 2 | Sem 27-28 | - | Polimento e Lançamento | - |

**Total:** 29 semanas (~7 meses) incluindo setup

---

## 9. Riscos e Mitigações

### 9.1. Riscos Técnicos

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| **OCR impreciso** | Alta | Alto | Implementar fallback manual + treinar modelo com editais reais |
| **Performance de queries** | Média | Alto | Aplicar índices desde o início, monitorar com Supabase Dashboard |
| **Integrações Google falharem** | Média | Médio | Implementar retry logic, logs detalhados, documentação clara |
| **Bugs em produção** | Alta | Alto | Testes rigorosos, Sentry para monitoramento, rollback rápido |
| **Supabase RLS complexo** | Média | Médio | Testes de permissões em cada sprint, documentação de policies |

### 9.2. Riscos de Produto

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| **Feature creep** | Alta | Alto | Priorização rigorosa no backlog, MVP enxuto |
| **Baixa adoção inicial** | Média | Alto | Beta testing com 3-5 clientes antes do lançamento |
| **Feedback negativo de UX** | Média | Médio | Validação de protótipos, testes de usabilidade |
| **Concorrência direta** | Baixa | Médio | Foco em diferencial (OCR, Vault, Integrações) |

### 9.3. Riscos de Equipe

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| **Saída de desenvolvedor** | Baixa | Alto | Documentação detalhada, pair programming |
| **Atraso em sprints** | Média | Médio | Buffer de 10% no cronograma, priorização flexível |
| **Falta de alinhamento** | Baixa | Médio | Reuniões regulares, comunicação assíncrona clara |

---

## 10. Critérios de Sucesso

### 10.1. Critérios Técnicos (MVP)

- [ ] **100% TypeScript** (sem `any` injustificados)
- [ ] **Componentes dentro dos limites de LOC**
- [ ] **Vertical Slice Architecture** aplicada em todos os módulos
- [ ] **RLS ativado** em todas as tabelas
- [ ] **Performance:** FCP < 1.5s, TTI < 3s, LCP < 2.5s
- [ ] **Responsivo:** Mobile, Tablet, Desktop
- [ ] **Acessibilidade:** WCAG 2.1 AA
- [ ] **Temas:** Claro e Escuro funcionando

### 10.2. Critérios de Produto (MVP)

- [ ] **10 módulos funcionais** (conforme backlog)
- [ ] **OCR extrai 80%+ dos dados** corretamente
- [ ] **Integrações Google** funcionando
- [ ] **3-5 organizações beta** usando o sistema
- [ ] **NPS ≥60** nos testes beta
- [ ] **0 bugs críticos** em produção

### 10.3. Critérios de Negócio (Pós-Lançamento)

**3 meses após lançamento:**
- 50 organizações ativas
- Taxa de retenção ≥85%
- MRR de R$ 5.000

**6 meses após lançamento:**
- 200 organizações ativas
- NPS ≥70
- MRR de R$ 30.000

---

## 📌 Próximos Passos Imediatos

1. **Semana 0 (Agora):**
   - [ ] Aprovação do backlog e arquitetura
   - [ ] Setup de ambiente (repositório, Supabase, Vercel)
   - [ ] Implementação do Design System base

2. **Sprint 1 (Semanas 1-2):**
   - [ ] Kick-off com a equipe
   - [ ] Sprint Planning detalhado
   - [ ] Início do desenvolvimento (Auth + Dashboard)

3. **Comunicação:**
   - [ ] Canal de Slack/Discord para equipe
   - [ ] Repositório de documentação (Notion/Confluence)
   - [ ] Board de projeto (GitHub Projects / Linear)

---

## 📊 Métricas de Acompanhamento

### Durante o Desenvolvimento

**Por Sprint:**
- Velocity (pontos completados)
- Bugs encontrados / resolvidos
- Code coverage (% de testes)
- Performance metrics (Lighthouse)

**Por Semana:**
- Commits / Pull Requests
- Code reviews pendentes
- Bloqueios / impedimentos

### Pós-Lançamento

**Diariamente:**
- MAU (Monthly Active Users)
- Uptime (%)
- Erros no Sentry

**Mensalmente:**
- MRR
- Churn Rate
- NPS
- Feature adoption rate

---

## 🎯 Definição de MVP Mínimo Viável

**O que ESTÁ no MVP:**
✅ Autenticação e multi-tenancy  
✅ Dashboard inteligente  
✅ CRUD de editais com OCR  
✅ Pipeline Kanban  
✅ Vault de documentos  
✅ Calendário e tarefas  
✅ Gestão de fornecedores  
✅ Gestão de cotações  
✅ Gestão de portais e contratos  
✅ Integrações Google (Calendar + Drive)  
✅ BI básico com exportação  

**O que NÃO está no MVP (Futuro):**
❌ Integração com ERPs específicos  
❌ Mobile App nativo  
❌ Marketplace de integrações  
❌ Relatórios customizáveis avançados  
❌ OCR com múltiplos providers (apenas Google Vision)  
❌ Suporte a múltiplos idiomas  
❌ Onboarding interativo  
❌ Modo offline (PWA)  

---

**Documento gerado em:** 28 de Outubro de 2025  
**Versão:** 1.0  
**Responsável:** Equipe de Produto LicitaFlow

---

## 🚀 Vamos começar!

Este plano é um guia vivo. Ajustes serão feitos conforme aprendemos durante o desenvolvimento. O importante é manter o foco no MVP, entregar valor incremental e iterar com base no feedback dos usuários.

**Próximo passo:** Aprovação e início do **Setup (Fase 0)**.

