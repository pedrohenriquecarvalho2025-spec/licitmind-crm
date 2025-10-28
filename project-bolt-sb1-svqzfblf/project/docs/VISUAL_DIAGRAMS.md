# 📊 LicitaFlow - Diagramas Visuais

> **Representações Visuais da Arquitetura**  
> Versão: 1.0  
> Data: 28 de Outubro de 2025

---

## 📑 Índice

1. [Diagrama de Contexto do Sistema](#1-diagrama-de-contexto-do-sistema)
2. [Arquitetura de Componentes (Frontend)](#2-arquitetura-de-componentes-frontend)
3. [Vertical Slice Architecture (Backend)](#3-vertical-slice-architecture-backend)
4. [Fluxo de Dados](#4-fluxo-de-dados)
5. [Schema do Banco de Dados (ER Diagram)](#5-schema-do-banco-de-dados-er-diagram)
6. [Fluxo de Autenticação](#6-fluxo-de-autenticação)
7. [Fluxo de OCR de Editais](#7-fluxo-de-ocr-de-editais)
8. [Pipeline de Deployment](#8-pipeline-de-deployment)
9. [Roadmap de Desenvolvimento](#9-roadmap-de-desenvolvimento)

---

## 1. Diagrama de Contexto do Sistema

```mermaid
graph TB
    subgraph "USUÁRIOS"
        U1[Gestor de Licitações]
        U2[Analista de Licitações]
        U3[Visualizador]
    end

    subgraph "LICITAFLOW"
        FRONTEND[Frontend React + Vite]
        SUPABASE[Supabase Backend]
        STORAGE[Supabase Storage]
        REALTIME[Supabase Realtime]
        FUNCTIONS[Edge Functions Deno]
    end

    subgraph "INTEGRAÇÕES EXTERNAS"
        OCR[Google Cloud Vision OCR]
        RECEITA[ReceitaWS API]
        GCAL[Google Calendar API]
        GDRIVE[Google Drive API]
        SMTP[SendGrid / SMTP]
    end

    U1 --> FRONTEND
    U2 --> FRONTEND
    U3 --> FRONTEND
    
    FRONTEND --> SUPABASE
    FRONTEND --> STORAGE
    FRONTEND --> REALTIME
    FRONTEND --> FUNCTIONS
    
    FUNCTIONS --> OCR
    FUNCTIONS --> SMTP
    FRONTEND --> RECEITA
    FRONTEND --> GCAL
    FRONTEND --> GDRIVE
    
    SUPABASE --> STORAGE
    
    style FRONTEND fill:#2B4C9F,color:#fff
    style SUPABASE fill:#00D9FF,color:#000
    style OCR fill:#00E676,color:#000
```

---

## 2. Arquitetura de Componentes (Frontend)

```mermaid
graph TD
    subgraph "VIEWS (≤300 LOC)"
        V1[DashboardView]
        V2[EditalsView]
        V3[PipelineView]
        V4[VaultView]
    end

    subgraph "ORGANISMOS (≤200 LOC)"
        O1[PageHeader]
        O2[DataTable]
        O3[KanbanBoard]
        O4[RemindersCenter]
        O5[CalendarView]
    end

    subgraph "MOLÉCULAS (≤100 LOC)"
        M1[FormField]
        M2[MetricCard]
        M3[ModalBase]
        M4[SearchInput]
    end

    subgraph "ÁTOMOS (≤50 LOC)"
        A1[Button]
        A2[Input]
        A3[Badge]
        A4[Icon]
    end

    V1 --> O1
    V1 --> O2
    V1 --> O4
    
    V2 --> O1
    V2 --> O2
    
    V3 --> O1
    V3 --> O3
    
    O1 --> M1
    O1 --> A1
    
    O2 --> M4
    O2 --> A2
    O2 --> A3
    
    O3 --> M2
    O3 --> A1
    O3 --> A3
    
    M1 --> A2
    M1 --> A1
    
    M2 --> A4
    M2 --> A3
    
    style V1 fill:#7C3AED,color:#fff
    style O1 fill:#00D9FF,color:#000
    style M1 fill:#00E676,color:#000
    style A1 fill:#FF6B35,color:#fff
```

---

## 3. Vertical Slice Architecture (Backend)

```mermaid
graph LR
    subgraph "MÓDULO EDITALS"
        ET[types/]
        ES[services/ PRIVADO]
        EA[editals.api.ts PÚBLICO]
        EC[components/]
        EV[views/EditalsView]
    end

    subgraph "MÓDULO SUPPLIERS"
        ST[types/]
        SS[services/ PRIVADO]
        SA[suppliers.api.ts PÚBLICO]
        SC[components/]
        SV[views/SuppliersView]
    end

    subgraph "MÓDULO CONTRACTS"
        CT[types/]
        CS[services/ PRIVADO]
        CA[contracts.api.ts PÚBLICO]
        CC[components/]
        CV[views/ContractsView]
    end

    EV --> EA
    EA --> ES
    ES --> DB[(Supabase)]
    
    SV --> SA
    SA --> SS
    SS --> DB
    
    CV --> CA
    CA --> CS
    CS --> DB
    
    CA -.->|usa API pública| EA
    
    style EA fill:#2B4C9F,color:#fff
    style SA fill:#2B4C9F,color:#fff
    style CA fill:#2B4C9F,color:#fff
    style ES fill:#FF6B35,color:#fff
    style SS fill:#FF6B35,color:#fff
    style CS fill:#FF6B35,color:#fff
```

**Legenda:**
- 🔵 Azul = API Pública (pode ser acessada)
- 🔴 Vermelho = Service Privado (NÃO pode ser acessado)
- Linha tracejada = Comunicação entre módulos (via API)

---

## 4. Fluxo de Dados

```mermaid
sequenceDiagram
    participant U as Usuário
    participant V as View
    participant H as Hook
    participant A as API (*.api.ts)
    participant S as Service
    participant DB as Supabase

    U->>V: Clica em "Listar Editais"
    V->>H: useEditals()
    H->>A: editalsAPI.listEditals(orgId)
    A->>S: editalsService.list(orgId)
    S->>DB: SELECT * FROM editals WHERE org_id = ?
    DB-->>S: { data, error }
    S-->>A: { data, error }
    A-->>H: Edital[] | error
    H-->>V: { editais, loading, error }
    V-->>U: Exibe tabela de editais
```

---

## 5. Schema do Banco de Dados (ER Diagram)

```mermaid
erDiagram
    ORGANIZATIONS ||--o{ USERS : has
    ORGANIZATIONS ||--o{ EDITALS : owns
    ORGANIZATIONS ||--o{ SUPPLIERS : owns
    ORGANIZATIONS ||--o{ CONTRACTS : owns
    ORGANIZATIONS ||--o{ DOCUMENTS : owns
    
    USERS ||--o{ EDITALS : responsible_for
    USERS ||--o{ CALENDAR_EVENTS : assigned_to
    
    EDITALS ||--o{ EDITAL_ITEMS : contains
    EDITALS ||--o{ QUOTATIONS : has
    EDITALS ||--|{ CONTRACTS : generates
    
    SUPPLIERS ||--o{ QUOTATIONS : submits
    
    BIDDING_PORTALS }o--|| ORGANIZATIONS : belongs_to
    
    CALENDAR_EVENTS }o--|| ORGANIZATIONS : belongs_to
    
    NOTIFICATIONS }o--|| USERS : sent_to
    
    AUDIT_LOGS }o--|| ORGANIZATIONS : tracks

    ORGANIZATIONS {
        uuid id PK
        text name
        text cnpj
        text logo_url
        timestamptz created_at
    }

    USERS {
        uuid id PK
        uuid organization_id FK
        text name
        text email
        text role
        timestamptz created_at
    }

    EDITALS {
        uuid id PK
        uuid organization_id FK
        text numero
        text orgao
        text objeto
        numeric valor_estimado
        text status
        uuid responsavel_id FK
        timestamptz data_abertura
    }

    EDITAL_ITEMS {
        uuid id PK
        uuid edital_id FK
        text descricao
        numeric quantidade
        numeric valor_unitario
        numeric valor_total
    }

    SUPPLIERS {
        uuid id PK
        uuid organization_id FK
        text cnpj
        text razao_social
        text email
        numeric rating
    }

    QUOTATIONS {
        uuid id PK
        uuid edital_id FK
        uuid supplier_id FK
        numeric valor_total
        text status
    }

    CONTRACTS {
        uuid id PK
        uuid organization_id FK
        uuid edital_id FK
        text numero
        numeric valor_total
        date data_inicio_vigencia
        date data_fim_vigencia
        text status
    }

    DOCUMENTS {
        uuid id PK
        uuid organization_id FK
        text tipo
        text nome
        text arquivo_url
        date data_vencimento
    }

    BIDDING_PORTALS {
        uuid id PK
        uuid organization_id FK
        text nome
        text url
        text senha_encrypted
    }

    CALENDAR_EVENTS {
        uuid id PK
        uuid organization_id FK
        text tipo
        text titulo
        timestamptz data_inicio
        uuid atribuido_a FK
    }

    NOTIFICATIONS {
        uuid id PK
        uuid user_id FK
        text tipo
        text mensagem
        boolean lida
    }

    AUDIT_LOGS {
        uuid id PK
        uuid organization_id FK
        uuid user_id FK
        text acao
        text modulo
        timestamptz created_at
    }
```

---

## 6. Fluxo de Autenticação

```mermaid
sequenceDiagram
    participant U as Usuário
    participant L as LoginForm
    participant A as useAuth Hook
    participant S as Supabase Auth
    participant DB as Database
    participant AG as AuthGuard

    U->>L: Insere email + senha
    L->>A: signIn(email, password)
    A->>S: supabase.auth.signInWithPassword()
    S->>DB: Valida credenciais
    DB-->>S: { user, session }
    S-->>A: { user, session, error }
    
    alt Login Sucesso
        A-->>L: { user }
        L->>AG: Redirect para /dashboard
        AG->>DB: Busca dados do usuário (org, role)
        DB-->>AG: { organization, role }
        AG-->>U: Renderiza Dashboard
    else Login Falha
        A-->>L: { error }
        L-->>U: Exibe mensagem de erro
    end
```

---

## 7. Fluxo de OCR de Editais

```mermaid
sequenceDiagram
    participant U as Usuário
    participant V as EditalsView
    participant F as EditalForm
    participant A as editalsAPI
    participant EF as Edge Function (ocr-process)
    participant OCR as Google Cloud Vision
    participant DB as Supabase

    U->>V: Clica "Novo Edital"
    V->>F: Abre modal com formulário
    U->>F: Upload de PDF
    F->>A: processOCR(file)
    A->>EF: POST /functions/v1/ocr-process
    EF->>OCR: Envia PDF para análise
    OCR-->>EF: Texto extraído + coordenadas
    EF->>EF: Parsing (regex + NLP)
    EF-->>A: { numero, orgao, objeto, valor, itens[] }
    A-->>F: Dados extraídos
    F-->>U: Formulário pré-preenchido
    U->>F: Revisa e ajusta dados
    F->>A: createEdital(data)
    A->>DB: INSERT INTO editals
    DB-->>A: { edital }
    A-->>V: Edital criado
    V-->>U: Atualiza tabela
```

---

## 8. Pipeline de Deployment

```mermaid
graph LR
    subgraph "DESENVOLVIMENTO"
        DEV[Desenvolvedor]
        GIT[Git Branch]
    end

    subgraph "CI/CD (GitHub Actions)"
        CI[Build + Lint + Test]
        CD[Deploy]
    end

    subgraph "AMBIENTES"
        STG[Staging Vercel]
        PROD[Production Vercel]
    end

    subgraph "BACKEND"
        SUP_STG[Supabase Staging]
        SUP_PROD[Supabase Production]
    end

    DEV -->|git push| GIT
    GIT -->|feature/* branch| CI
    CI -->|PR aprovado| CD
    CD -->|develop branch| STG
    STG --> SUP_STG
    
    GIT -->|main branch| CD
    CD -->|manual approval| PROD
    PROD --> SUP_PROD
    
    style CI fill:#00E676,color:#000
    style CD fill:#FF6B35,color:#fff
    style PROD fill:#2B4C9F,color:#fff
```

---

## 9. Roadmap de Desenvolvimento

```mermaid
gantt
    title LicitaFlow - Roadmap de Desenvolvimento (7 meses)
    dateFormat YYYY-MM-DD
    
    section Fase 0: Setup
    Setup e Fundação       :done, setup, 2025-11-01, 1w
    
    section Fase 1: MVP Core
    Sprint 1: Auth + Dashboard     :active, s1, 2025-11-08, 2w
    Sprint 2: Dashboard + Editais  :s2, after s1, 2w
    Sprint 3: OCR                  :crit, s3, after s2, 2w
    Sprint 4: Pipeline Kanban      :s4, after s3, 2w
    Sprint 5: Vault                :s5, after s4, 2w
    Sprint 6: Calendário           :s6, after s5, 2w
    
    section Fase 2: Avançado
    Sprint 7: Fornecedores         :s7, after s6, 2w
    Sprint 8: Cotações             :s8, after s7, 2w
    Sprint 9: Portais + Contratos  :s9, after s8, 2w
    Sprint 10: Análise Avançada    :s10, after s9, 2w
    
    section Fase 3: Integrações
    Sprint 11: Google APIs         :crit, s11, after s10, 2w
    Sprint 12: Apple + SMTP        :s12, after s11, 2w
    Sprint 13: BI e Relatórios     :crit, s13, after s12, 2w
    
    section Fase 4: Lançamento
    Sprint 14: Polimento + Launch  :milestone, s14, after s13, 2w
```

**Legenda:**
- 🔴 Vermelho (crit) = Sprints críticos
- ✅ Verde (done) = Concluído
- 🟦 Azul (active) = Em andamento

---

## 🎯 Fluxo de Uso - Caso de Uso Principal

```mermaid
graph TD
    START([Usuário faz login])
    DASH[Visualiza Dashboard]
    REMINDER{Há lembretes?}
    VIEW_REM[Visualiza lembretes]
    NEW_EDITAL[Clica em 'Novo Edital']
    UPLOAD[Faz upload de PDF]
    OCR[OCR processa documento]
    REVIEW[Revisa dados extraídos]
    SAVE[Salva edital]
    KANBAN[Move para Pipeline Kanban]
    QUOTATION[Solicita cotações]
    COMPARE[Compara propostas]
    WIN[Seleciona vencedor]
    CONTRACT[Cria contrato]
    END([Processo completo])

    START --> DASH
    DASH --> REMINDER
    REMINDER -->|Sim| VIEW_REM
    REMINDER -->|Não| NEW_EDITAL
    VIEW_REM --> NEW_EDITAL
    NEW_EDITAL --> UPLOAD
    UPLOAD --> OCR
    OCR --> REVIEW
    REVIEW --> SAVE
    SAVE --> KANBAN
    KANBAN --> QUOTATION
    QUOTATION --> COMPARE
    COMPARE --> WIN
    WIN --> CONTRACT
    CONTRACT --> END

    style START fill:#2B4C9F,color:#fff
    style OCR fill:#00E676,color:#000
    style END fill:#00D9FF,color:#000
```

---

## 🔐 Fluxo de Segurança (RLS)

```mermaid
graph TD
    REQ[Request do Frontend]
    JWT{JWT Válido?}
    RLS[Row Level Security]
    ORG{Mesma organização?}
    ROLE{Role permitido?}
    DATA[Retorna dados]
    ERR[Erro 403 Forbidden]

    REQ --> JWT
    JWT -->|Sim| RLS
    JWT -->|Não| ERR
    RLS --> ORG
    ORG -->|Sim| ROLE
    ORG -->|Não| ERR
    ROLE -->|Sim| DATA
    ROLE -->|Não| ERR

    style JWT fill:#FF6B35,color:#fff
    style RLS fill:#7C3AED,color:#fff
    style DATA fill:#00E676,color:#000
    style ERR fill:#FF0000,color:#fff
```

---

## 📊 Hierarquia de Permissões (RBAC)

```mermaid
graph TD
    ADMIN[Admin]
    GESTOR[Gestor]
    ANALISTA[Analista]
    VISUALIZADOR[Visualizador]

    ADMIN -->|Todas as permissões| P1[Gerenciar usuários]
    ADMIN --> P2[Excluir qualquer registro]
    ADMIN --> P3[Configurar integrações]
    
    GESTOR -->|Herda| P2
    GESTOR --> P4[Criar/Editar editais]
    GESTOR --> P5[Aprovar cotações]
    
    ANALISTA -->|Herda| P4
    ANALISTA --> P6[Upload de documentos]
    ANALISTA --> P7[Criar tarefas]
    
    VISUALIZADOR --> P8[Visualizar dados]
    VISUALIZADOR --> P9[Exportar relatórios]

    style ADMIN fill:#FF0000,color:#fff
    style GESTOR fill:#FF6B35,color:#fff
    style ANALISTA fill:#00D9FF,color:#000
    style VISUALIZADOR fill:#00E676,color:#000
```

---

## 🎨 Estrutura de Tema (Claro/Escuro)

```mermaid
graph LR
    CTX[ThemeContext]
    TOGGLE[ThemeToggle no Header]
    LOCAL[localStorage]
    HTML[document.documentElement]
    
    TOGGLE -->|toggleTheme| CTX
    CTX -->|salva| LOCAL
    CTX -->|aplica classe| HTML
    HTML -->|dark class| CSS[Classes dark: no CSS]
    
    LOCAL -.->|ao carregar| CTX

    style CTX fill:#2B4C9F,color:#fff
    style TOGGLE fill:#00D9FF,color:#000
```

**Implementação:**
```javascript
// ThemeContext
const [theme, setTheme] = useState('light')

useEffect(() => {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  localStorage.setItem('theme', theme)
}, [theme])
```

---

## 📦 Estrutura de Componentes Reutilizáveis

```mermaid
graph TB
    subgraph "src/components/"
        UI[ui/]
        SHARED[shared/]
        LAYOUT[layout/]
        AUTH[auth/]
    end

    subgraph "ui/"
        ATOMS[atoms/]
        MOLECULES[molecules/]
        SPECIAL[Logo, SmartSearch, etc.]
    end

    subgraph "shared/"
        ORGANISMS[organisms/]
    end

    UI --> ATOMS
    UI --> MOLECULES
    UI --> SPECIAL
    SHARED --> ORGANISMS
    
    ATOMS -.->|usa| MOLECULES
    MOLECULES -.->|usa| ORGANISMS
    ORGANISMS -.->|usa| LAYOUT

    style ATOMS fill:#FF6B35,color:#fff
    style MOLECULES fill:#00E676,color:#000
    style ORGANISMS fill:#00D9FF,color:#000
    style LAYOUT fill:#2B4C9F,color:#fff
```

---

## 🔄 Ciclo de Vida de uma Feature

```mermaid
stateDiagram-v2
    [*] --> Backlog
    Backlog --> SprintPlanning
    SprintPlanning --> Development
    Development --> CodeReview
    CodeReview --> Testing
    Testing --> Staging
    Staging --> UAT
    UAT --> Production
    Production --> [*]

    Development --> CodeReview : PR criado
    CodeReview --> Development : Mudanças solicitadas
    Testing --> Development : Bug encontrado
    UAT --> Development : Feedback negativo
    Staging --> Testing : Deploy em staging
    Production --> Monitoring : Deploy em prod

    Monitoring --> HotFix : Bug crítico
    HotFix --> Production : Correção rápida
```

---

## 📈 Métricas de Performance

```mermaid
graph LR
    subgraph "CORE WEB VITALS"
        FCP[FCP < 1.5s]
        LCP[LCP < 2.5s]
        TTI[TTI < 3s]
        CLS[CLS < 0.1]
    end

    subgraph "OTIMIZAÇÕES"
        CODE[Code Splitting]
        LAZY[Lazy Loading]
        MEMO[Memoização]
        CACHE[Cache]
    end

    CODE --> FCP
    LAZY --> LCP
    MEMO --> TTI
    CACHE --> LCP

    style FCP fill:#00E676,color:#000
    style LCP fill:#00E676,color:#000
    style TTI fill:#00E676,color:#000
    style CLS fill:#00E676,color:#000
```

---

## 🗺️ Mapa de Navegação (Sitemap)

```mermaid
graph TD
    ROOT[/]
    LOGIN[/login]
    DASH[/dashboard]
    EDITALS[/editals]
    EDITAL_DETAIL[/editals/:id]
    PIPELINE[/pipeline]
    VAULT[/vault]
    CALENDAR[/calendar]
    SUPPLIERS[/suppliers]
    QUOTATIONS[/quotations]
    PORTALS[/portals]
    CONTRACTS[/contracts]
    REPORTS[/reports]
    SETTINGS[/settings]
    USERS[/users]

    ROOT --> LOGIN
    ROOT --> DASH
    DASH --> EDITALS
    DASH --> PIPELINE
    DASH --> VAULT
    DASH --> CALENDAR
    EDITALS --> EDITAL_DETAIL
    DASH --> SUPPLIERS
    DASH --> QUOTATIONS
    DASH --> PORTALS
    DASH --> CONTRACTS
    DASH --> REPORTS
    DASH --> SETTINGS
    SETTINGS --> USERS

    style DASH fill:#2B4C9F,color:#fff
    style EDITALS fill:#00D9FF,color:#000
    style PIPELINE fill:#00D9FF,color:#000
```

---

## 📌 Legenda de Cores (Consistente em Todos os Diagramas)

| Cor | Significado | Exemplo |
|-----|-------------|---------|
| 🔵 **Azul Royal** (`#2B4C9F`) | API Pública / Componentes Principais | APIs, Views |
| 🔴 **Vermelho** (`#FF6B35`) | Privado / Crítico / Hot | Services, Sprints críticas |
| 🟢 **Verde Tech** (`#00E676`) | Sucesso / Otimização / Átomos | Métricas positivas |
| 🟦 **Cyan** (`#00D9FF`) | Backend / Organismos / Info | Supabase, Organismos |
| 🟣 **Roxo Tech** (`#7C3AED`) | Views / Inovação | Views, Features avançadas |

---

**Última atualização:** 28 de Outubro de 2025  
**Versão:** 1.0

**Para visualizar os diagramas Mermaid:**
1. Use GitHub, GitLab ou Bitbucket (suporte nativo)
2. Use [Mermaid Live Editor](https://mermaid.live/)
3. Use extensões VSCode (Markdown Preview Mermaid Support)

---

**Documentação completa:** [README.md](./README.md)

