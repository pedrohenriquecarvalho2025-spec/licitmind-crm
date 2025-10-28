# 📋 LicitaFlow - Backlog de Produto Completo

> **Micro SaaS para Gestão Pós-Prospecção de Licitações**  
> Versão: 1.0  
> Data: 28 de Outubro de 2025

---

## 📑 Índice

1. [Visão do Produto](#1-visão-do-produto)
2. [Personas e Jornadas](#2-personas-e-jornadas)
3. [Funcionalidades Core (MVP)](#3-funcionalidades-core-mvp)
4. [Backlog Priorizado](#4-backlog-priorizado)
5. [Critérios de Aceitação](#5-critérios-de-aceitação)
6. [Métricas de Sucesso](#6-métricas-de-sucesso)

---

## 1. Visão do Produto

### 1.1. Declaração de Visão

**Para:** Empresas que participam de licitações públicas  
**Que:** Precisam gerenciar eficientemente o fluxo de trabalho pós-prospecção de editais  
**O LicitaFlow é:** Um CRM Vertical (Micro SaaS)  
**Que:** Organiza, automatiza e otimiza todo o ciclo de gestão de editais, documentos, fornecedores, cotações, portais e contratos  
**Diferente de:** Planilhas, ERPs genéricos ou CRMs tradicionais  
**Nosso produto:** Oferece automação via OCR, controle de compliance (Vault), gestão centralizada de acessos e arquitetura API-First para integração com o ecossistema do cliente

### 1.2. Proposta de Valor

- ✅ **Automação Inteligente:** OCR para extração de dados de editais (itens, valores, prazos)
- ✅ **Compliance Simplificado:** Vault de documentos com alertas de vencimento e renovação
- ✅ **Gestão Centralizada:** Portais de licitação com credenciais criptografadas em um único lugar
- ✅ **Pipeline Visual:** Gestão Kanban de editais em andamento (formato "pasta")
- ✅ **Integrações Nativas:** Google Drive, Google/Apple Calendar, ERPs via API, SMTP
- ✅ **Análise de Documentos:** Identificação automática de riscos e oportunidades em editais
- ✅ **BI Embutido:** Relatórios e dashboards interativos para tomada de decisão

### 1.3. Objetivos de Negócio

**Curto Prazo (3 meses):**
- MVP com 5 módulos core (Dashboard, Editais, Pipeline, Calendar, Vault)
- 50 organizações ativas
- Taxa de retenção > 85%

**Médio Prazo (6-12 meses):**
- 10 módulos completos
- 500 organizações ativas
- Integrações com 3+ ERPs principais do mercado
- NPS > 70

**Longo Prazo (12-24 meses):**
- Marketplace de integrações
- Mobile app (iOS/Android)
- Certificação ISO 27001

---

## 2. Personas e Jornadas

### 2.1. Persona Primária: Gestor de Licitações

**Nome:** Mariana Silva  
**Cargo:** Coordenadora de Licitações  
**Empresa:** Médio porte (50-200 funcionários)  
**Dores:**
- Perda de prazos por falta de visibilidade
- Dificuldade em consolidar informações de múltiplos portais
- Retrabalho ao extrair dados manualmente de editais (PDFs)
- Falta de histórico e métricas para melhorar performance

**Objetivos:**
- Reduzir tempo de análise de editais em 60%
- Aumentar taxa de participação em licitações viáveis em 40%
- Ter visibilidade em tempo real do status de cada edital

**Jornada no LicitaFlow:**
1. Importa edital (PDF/link) → OCR extrai dados automaticamente
2. Visualiza análise de documento com riscos/oportunidades destacados
3. Move edital no Pipeline Kanban conforme progresso
4. Solicita cotações para fornecedores cadastrados
5. Acompanha prazos no Calendar integrado
6. Gera proposta com documentos do Vault
7. Monitora resultado e analisa métricas no Dashboard

### 2.2. Persona Secundária: Analista de Licitações

**Nome:** Carlos Mendes  
**Cargo:** Analista de Licitações Júnior  
**Dores:**
- Dificuldade em encontrar documentação necessária
- Falta de padronização nos processos
- Múltiplas senhas de portais para gerenciar

**Objetivos:**
- Acesso rápido a documentos e credenciais
- Seguir checklist padronizado
- Aprender com histórico de editais anteriores

---

## 3. Funcionalidades Core (MVP)

### 3.1. Autenticação e Organizações
- Login/Registro com email + senha
- Multi-tenancy (por organização)
- RBAC (Admin, Gestor, Analista, Visualizador)
- Perfil de usuário

### 3.2. Dashboard Inteligente
- **Lembretes Inteligentes:** Próximos 7 dias (prazos de editais, tarefas, vencimentos de documentos)
- **Links Rápidos:** Acesso direto a ações frequentes
- **Atividade Recente:** Últimas 10 ações na organização
- **Estatísticas em Tempo Real:** KPIs dinâmicos (editais ativos, taxa de sucesso, valor em pipeline)
- **Banner Informativo:** Avisos importantes com CTA

### 3.3. Gestão de Editais
- CRUD completo de editais
- Upload de PDF → **OCR automático** para extrair:
  - Número do edital
  - Órgão/Entidade
  - Objeto da licitação
  - Data de abertura
  - Valor estimado
  - Itens da licitação (tabela com código, descrição, quantidade, unidade, valor unitário)
- **Análise de Documento:** Identificação automática de:
  - Cláusulas restritivas
  - Requisitos técnicos complexos
  - Prazos críticos
  - Oportunidades (ex: itens com alta margem)
- Gestão de itens do edital (tabela editável)
- Anexos/links relacionados
- Histórico de alterações (audit log)

### 3.4. Pipeline Kanban
- Colunas customizáveis (padrão: Prospecção, Análise, Cotação, Proposta, Enviado, Resultado)
- Cards estilo "pasta" com:
  - Número do edital (destacado)
  - Órgão
  - Valor estimado
  - Prazo (com badge de urgência)
  - Avatar do responsável
- Drag & Drop entre colunas
- Filtros (órgão, responsável, valor, prazo)
- Métricas por coluna (contagem, valor total)

### 3.5. Vault de Documentos
- Upload de documentos com categorização (Certidões, Balanços, Atestados, Contratos Sociais, etc.)
- Metadados: Data de emissão, Data de vencimento, Órgão emissor, Tags
- Alertas automáticos de documentos vencidos/a vencer (30, 15, 7, 1 dia)
- Widget no Dashboard: "Documentos Expirando"
- Pesquisa full-text + filtros
- Controle de versão (upload de nova versão mantém histórico)
- Download em lote

### 3.6. Calendário e Tarefas
- Visualização mensal/semanal/diária
- Eventos sincronizados com editais (datas de abertura, recursos, assinatura)
- Tarefas manuais (checklist, atribuição, prazo, prioridade)
- **Integração com Google Calendar** (OAuth2) - sincronização bidirecional
- **Integração com Apple Calendar** (CalDAV)
- Notificações push e email para lembretes

### 3.7. Gestão de Fornecedores
- CRUD de fornecedores (CNPJ, Razão Social, Contato, Email, Telefone, Categoria)
- **Integração ReceitaWS:** Preenchimento automático ao digitar CNPJ
- Histórico de cotações por fornecedor
- Avaliação de fornecedores (1-5 estrelas + comentários)
- Documentos anexos (atestados de capacidade técnica, certidões)

### 3.8. Gestão de Cotações
- Solicitação de cotação vinculada a edital
- Envio por email para múltiplos fornecedores
- Upload de propostas recebidas
- **Tabela comparativa** de cotações (lado a lado)
- Seleção de vencedor
- Histórico de cotações

### 3.9. Gestão de Portais de Licitação
- Cadastro de portais (Nome, URL, Tipo - ComprasNet, BLL, Municipal, etc.)
- **Armazenamento seguro de credenciais** (criptografia AES-256)
- Últimos acessos registrados
- Filtros e busca
- Métricas: Total de editais obtidos por portal

### 3.10. Gestão de Contratos
- CRUD de contratos (vinculados a editais ganhos)
- Dados: Número, Objeto, Valor total, Data de início, Data de fim, Status
- Alertas de vencimento (90, 60, 30, 15 dias)
- Dashboard de contratos (valor total, contratos ativos, a vencer)
- Histórico de aditivos e reajustes

---

## 4. Backlog Priorizado

### 4.1. Epic 1: Fundação Técnica (Prioridade: P0)

#### US-001: Autenticação e Autorização
**Como** usuário  
**Quero** me registrar e fazer login com email/senha  
**Para que** eu possa acessar o sistema de forma segura

**Critérios de Aceitação:**
- [ ] Formulário de registro com validação (email único, senha ≥8 caracteres)
- [ ] Formulário de login
- [ ] Recuperação de senha via email
- [ ] Session persistente com JWT
- [ ] Logout

**Estimativa:** 5 pontos  
**Tags:** `auth`, `security`, `mvp`

---

#### US-002: Multi-Tenancy e Organizações
**Como** administrador  
**Quero** criar uma organização e convidar usuários  
**Para que** minha equipe possa colaborar de forma isolada

**Critérios de Aceitação:**
- [ ] Criação de organização no primeiro login
- [ ] Convite de usuários por email
- [ ] RLS (Row Level Security) baseado em `organization_id`
- [ ] Seleção de organização se usuário pertence a múltiplas

**Estimativa:** 8 pontos  
**Tags:** `multi-tenancy`, `security`, `mvp`

---

#### US-003: RBAC (Controle de Acesso Baseado em Funções)
**Como** administrador  
**Quero** atribuir funções (Admin, Gestor, Analista, Visualizador) aos usuários  
**Para que** eu possa controlar o que cada um pode fazer

**Critérios de Aceitação:**
- [ ] Tabela `users` com campo `role`
- [ ] Policies no Supabase para cada nível de acesso
- [ ] Tela de gestão de usuários (Admin apenas)
- [ ] Middleware no frontend verificando permissões

**Estimativa:** 13 pontos  
**Tags:** `security`, `rbac`, `mvp`

---

#### US-004: Tema Claro/Escuro
**Como** usuário  
**Quero** alternar entre modo claro e escuro  
**Para que** eu possa usar o sistema confortavelmente em diferentes ambientes

**Critérios de Aceitação:**
- [ ] Toggle no Header (ícone Sol/Lua)
- [ ] Persistência da preferência no localStorage
- [ ] Classes `dark:` aplicadas consistentemente
- [ ] Transição suave entre temas

**Estimativa:** 3 pontos  
**Tags:** `ui`, `theme`, `mvp`

---

### 4.2. Epic 2: Dashboard Inteligente (Prioridade: P0)

#### US-005: Dashboard - Lembretes Inteligentes
**Como** usuário  
**Quero** ver os próximos eventos/tarefas dos próximos 7 dias  
**Para que** eu não perca prazos importantes

**Critérios de Aceitação:**
- [ ] Widget "Próximos Lembretes" (top 5)
- [ ] Agrupamento por data (Hoje, Amanhã, Esta Semana)
- [ ] Ícones por tipo (edital, tarefa, documento)
- [ ] Clique abre modal/view relevante
- [ ] Badge de urgência (vermelho < 2 dias)

**Estimativa:** 8 pontos  
**Tags:** `dashboard`, `widget`, `mvp`  
**Componentes:** `RemindersCenter`, `Icon`, `Badge`, `Text`, `Button`

---

#### US-006: Dashboard - Links Rápidos
**Como** usuário  
**Quero** acessar ações frequentes com um clique  
**Para que** eu ganhe produtividade

**Critérios de Aceitação:**
- [ ] Grid 2x3 de cards clicáveis
- [ ] Ações: "Novo Edital", "Nova Cotação", "Upload Documento", "Calendário", "Fornecedores", "Portais"
- [ ] Ícones + título + descrição curta
- [ ] Hover com animação

**Estimativa:** 5 pontos  
**Tags:** `dashboard`, `widget`, `mvp`  
**Componentes:** `QuickLinksGrid`, `QuickActionCard`, `Icon`, `Text`, `Button`

---

#### US-007: Dashboard - Atividade Recente
**Como** usuário  
**Quero** ver as últimas ações da equipe  
**Para que** eu tenha visibilidade do que está acontecendo

**Critérios de Aceitação:**
- [ ] Feed das últimas 10 ações (edital criado, documento enviado, cotação recebida, etc.)
- [ ] Avatar do usuário + timestamp relativo ("há 5 minutos")
- [ ] Clique abre detalhes da ação
- [ ] Atualização em tempo real (Supabase Realtime)

**Estimativa:** 8 pontos  
**Tags:** `dashboard`, `widget`, `realtime`, `mvp`  
**Componentes:** `RecentActivityFeed`, `Icon`, `Text`, `Badge`

---

#### US-008: Dashboard - Estatísticas em Tempo Real
**Como** gestor  
**Quero** ver KPIs atualizados em tempo real  
**Para que** eu possa tomar decisões baseadas em dados

**Critérios de Aceitação:**
- [ ] 4 cards de métricas: "Editais Ativos", "Taxa de Sucesso (%)", "Valor em Pipeline", "Contratos Vigentes"
- [ ] Ícone + valor + variação (↑↓) vs. período anterior
- [ ] Animação de contagem (count-up)
- [ ] Tooltip com detalhes

**Estimativa:** 8 pontos  
**Tags:** `dashboard`, `kpi`, `mvp`  
**Componentes:** `LiveStats`, `MetricCard`, `Icon`, `Text`, `Badge`

---

#### US-009: Dashboard - Banner Informativo
**Como** administrador do sistema  
**Quero** exibir avisos importantes para os usuários  
**Para que** eu possa comunicar novidades, manutenções ou alertas

**Critérios de Aceitação:**
- [ ] Banner dismissível (pode ser fechado)
- [ ] Tipos: info, warning, success, error
- [ ] CTA (call-to-action) opcional
- [ ] Persistência do estado (não exibir após fechado)

**Estimativa:** 3 pontos  
**Tags:** `dashboard`, `widget`, `mvp`  
**Componentes:** `InfoBanner`, `Icon`, `Text`, `Button`

---

### 4.3. Epic 3: Gestão de Editais (Prioridade: P0)

#### US-010: CRUD de Editais
**Como** analista  
**Quero** cadastrar, visualizar, editar e excluir editais  
**Para que** eu possa gerenciar as licitações

**Critérios de Aceitação:**
- [ ] Tabela listando editais com filtros (número, órgão, status, prazo)
- [ ] Formulário de criação/edição com validação
- [ ] Modal de detalhes com todas as informações
- [ ] Confirmação para exclusão
- [ ] Paginação e ordenação

**Estimativa:** 13 pontos  
**Tags:** `editals`, `crud`, `mvp`  
**Componentes:** `DataTable`, `PageHeader`, `FilterBar`, `ModalBase`, `FormField`, `Input`, `Select`, `Button`, `EmptyState`

---

#### US-011: Upload de Edital com OCR
**Como** analista  
**Quero** fazer upload de um PDF de edital e extrair dados automaticamente  
**Para que** eu economize tempo na digitação manual

**Critérios de Aceitação:**
- [ ] Drag & Drop de PDF (ou seleção de arquivo)
- [ ] Spinner durante processamento
- [ ] OCR extrai: número, órgão, objeto, data de abertura, valor estimado
- [ ] Formulário pré-preenchido com dados extraídos (editável)
- [ ] Tabela de itens extraída automaticamente
- [ ] Fallback: Se OCR falhar, permitir entrada manual com mensagem de alerta

**Estimativa:** 21 pontos  
**Tags:** `editals`, `ocr`, `automation`, `mvp`  
**Componentes:** `DocumentUploader`, `Spinner`, `FormField`, `Input`, `Button`, `ModalBase`

---

#### US-012: Gestão de Itens do Edital
**Como** analista  
**Quero** visualizar e editar os itens extraídos do edital  
**Para que** eu possa corrigir erros ou adicionar informações

**Critérios de Aceitação:**
- [ ] Tabela editável inline (código, descrição, quantidade, unidade, valor unitário)
- [ ] Adicionar/remover linhas
- [ ] Cálculo automático do valor total por item (quantidade × valor unitário)
- [ ] Validação de campos obrigatórios
- [ ] Salvar alterações

**Estimativa:** 13 pontos  
**Tags:** `editals`, `items`, `mvp`  
**Componentes:** `ItemTable`, `Input`, `Button`, `Icon`

---

#### US-013: Análise Automática de Documento
**Como** gestor  
**Quero** visualizar uma análise automática do edital  
**Para que** eu identifique riscos e oportunidades rapidamente

**Critérios de Aceitação:**
- [ ] Seção "Análise de Documento" no modal de detalhes
- [ ] Identificação automática de:
  - Cláusulas restritivas (ex: "apenas empresas locais")
  - Requisitos técnicos complexos
  - Prazos críticos (<7 dias)
  - Oportunidades (ex: valor alto, baixa concorrência estimada)
- [ ] Badges de classificação (Risco Alto/Médio/Baixo, Oportunidade Alta/Média/Baixa)
- [ ] Lista de insights com ícones

**Estimativa:** 21 pontos  
**Tags:** `editals`, `analysis`, `automation`, `mvp`  
**Componentes:** `DocumentAnalysisPanel`, `Badge`, `Icon`, `Text`, `InfoBanner`

---

#### US-014: Histórico de Alterações (Audit Log)
**Como** gestor  
**Quero** ver o histórico de alterações de um edital  
**Para que** eu possa auditar e entender o que foi feito

**Critérios de Aceitação:**
- [ ] Timeline de alterações (usuário, data, campo alterado, valor anterior, valor novo)
- [ ] Ícones por tipo de ação (criação, edição, exclusão)
- [ ] Filtro por usuário e período

**Estimativa:** 13 pontos  
**Tags:** `editals`, `audit`, `mvp`  
**Componentes:** `AuditLog`, `Icon`, `Text`, `Badge`

---

### 4.4. Epic 4: Pipeline Kanban (Prioridade: P0)

#### US-015: Visualização Kanban de Editais
**Como** gestor  
**Quero** visualizar editais em um quadro Kanban  
**Para que** eu tenha visão clara do fluxo de trabalho

**Critérios de Aceitação:**
- [ ] Colunas: Prospecção, Análise, Cotação, Proposta, Enviado, Resultado
- [ ] Cards estilo "pasta" com: número, órgão, valor, prazo, avatar do responsável
- [ ] Badge de urgência (vermelho se prazo < 3 dias)
- [ ] Contagem e valor total por coluna
- [ ] Scroll horizontal se não couber na tela

**Estimativa:** 13 pontos  
**Tags:** `pipeline`, `kanban`, `mvp`  
**Componentes:** `KanbanBoard`, `KanbanColumn`, `KanbanCard`, `Badge`, `Icon`, `Text`

---

#### US-016: Drag & Drop entre Colunas
**Como** analista  
**Quero** arrastar e soltar cards entre colunas  
**Para que** eu possa atualizar o status rapidamente

**Critérios de Aceitação:**
- [ ] Drag & Drop funcional (biblioteca `@dnd-kit/core`)
- [ ] Indicador visual durante o arrasto
- [ ] Atualização do status no banco de dados
- [ ] Animação suave
- [ ] Funciona em touch devices

**Estimativa:** 13 pontos  
**Tags:** `pipeline`, `kanban`, `dnd`, `mvp`  
**Componentes:** `KanbanBoard`, `KanbanColumn`, `KanbanCard`

---

#### US-017: Filtros no Pipeline
**Como** gestor  
**Quero** filtrar editais no pipeline por órgão, responsável, valor e prazo  
**Para que** eu possa focar no que é relevante

**Critérios de Aceitação:**
- [ ] Barra de filtros acima do Kanban
- [ ] Filtros: órgão (autocomplete), responsável (dropdown), valor (range), prazo (range de datas)
- [ ] Aplicação em tempo real
- [ ] Botão "Limpar filtros"

**Estimativa:** 8 pontos  
**Tags:** `pipeline`, `filters`, `mvp`  
**Componentes:** `FilterBar`, `Select`, `Input`, `Button`

---

#### US-018: Métricas por Coluna
**Como** gestor  
**Quero** ver métricas agregadas por coluna  
**Para que** eu possa identificar gargalos

**Critérios de Aceitação:**
- [ ] Cada coluna exibe: Quantidade de cards + Valor total
- [ ] Atualização em tempo real ao mover cards
- [ ] Destaque visual para colunas com muitos cards

**Estimativa:** 5 pontos  
**Tags:** `pipeline`, `metrics`, `mvp`  
**Componentes:** `KanbanColumn`, `Text`, `Badge`

---

### 4.5. Epic 5: Vault de Documentos (Prioridade: P0)

#### US-019: CRUD de Documentos
**Como** analista  
**Quero** fazer upload, visualizar, editar metadados e excluir documentos  
**Para que** eu possa manter minha documentação organizada

**Critérios de Aceitação:**
- [ ] Upload de arquivos (PDF, DOC, XLSX, JPG, PNG) até 10MB
- [ ] Metadados: Tipo (Certidão, Balanço, Atestado, etc.), Data de emissão, Data de vencimento, Órgão emissor, Tags
- [ ] Tabela listando documentos com filtros
- [ ] Preview de PDFs no modal
- [ ] Download individual
- [ ] Exclusão com confirmação

**Estimativa:** 13 pontos  
**Tags:** `vault`, `documents`, `mvp`  
**Componentes:** `DataTable`, `PageHeader`, `FilterBar`, `DocumentUploader`, `ModalBase`, `FormField`, `Input`, `Select`, `Button`

---

#### US-020: Alertas de Vencimento de Documentos
**Como** analista  
**Quero** ser notificado quando documentos estiverem vencidos ou próximos de vencer  
**Para que** eu possa renovar a tempo

**Critérios de Aceitação:**
- [ ] Notificação por email em 30, 15, 7, 1 dia antes do vencimento
- [ ] Widget no Dashboard: "Documentos Expirando" (top 5)
- [ ] Badge vermelho no menu lateral "Vault" se houver documentos vencidos
- [ ] Filtro "Vencidos" e "A Vencer" na tabela

**Estimativa:** 13 pontos  
**Tags:** `vault`, `notifications`, `mvp`  
**Componentes:** `ExpiringDocumentsWidget`, `Badge`, `Icon`, `Text`, `Button`

---

#### US-021: Controle de Versão de Documentos
**Como** analista  
**Quero** fazer upload de novas versões de documentos mantendo o histórico  
**Para que** eu possa rastrear alterações

**Critérios de Aceitação:**
- [ ] Botão "Upload Nova Versão" em documentos existentes
- [ ] Histórico de versões (v1, v2, v3...) com data e usuário
- [ ] Download de versões anteriores
- [ ] Marcar versão atual

**Estimativa:** 8 pontos  
**Tags:** `vault`, `versioning`, `mvp`  
**Componentes:** `DocumentVersionHistory`, `Button`, `Text`, `Icon`

---

#### US-022: Pesquisa Full-Text e Filtros
**Como** analista  
**Quero** pesquisar documentos por nome, tipo, tags ou conteúdo  
**Para que** eu encontre rapidamente o que preciso

**Critérios de Aceitação:**
- [ ] Barra de busca com pesquisa full-text (PostgreSQL `tsvector`)
- [ ] Filtros: Tipo, Data de emissão (range), Data de vencimento (range), Tags (multiselect)
- [ ] Highlight nos resultados
- [ ] Ordenação por relevância

**Estimativa:** 13 pontos  
**Tags:** `vault`, `search`, `mvp`  
**Componentes:** `SearchInput`, `FilterBar`, `DataTable`

---

### 4.6. Epic 6: Calendário e Tarefas (Prioridade: P0)

#### US-023: Calendário de Eventos e Tarefas
**Como** usuário  
**Quero** visualizar todos os eventos e tarefas em um calendário  
**Para que** eu tenha visão temporal do meu trabalho

**Critérios de Aceitação:**
- [ ] Visualização mensal, semanal, diária
- [ ] Eventos automáticos: Datas de abertura de editais, recursos, assinaturas de contratos
- [ ] Tarefas manuais: Criadas pelo usuário
- [ ] Cores diferentes por tipo
- [ ] Clique abre modal de detalhes
- [ ] Navegação entre períodos

**Estimativa:** 13 pontos  
**Tags:** `calendar`, `tasks`, `mvp`  
**Componentes:** `CalendarView`, `ModalBase`, `Button`, `Icon`, `Badge`

---

#### US-024: CRUD de Tarefas Manuais
**Como** usuário  
**Quero** criar, editar e excluir tarefas  
**Para que** eu possa gerenciar meu trabalho

**Critérios de Aceitação:**
- [ ] Formulário: Título, Descrição, Data/Hora, Prioridade (Alta/Média/Baixa), Atribuído a, Checklist (opcional)
- [ ] Tarefas aparecem no calendário
- [ ] Lista de tarefas (view alternativa ao calendário)
- [ ] Marcar como concluída
- [ ] Notificação antes do prazo

**Estimativa:** 13 pontos  
**Tags:** `calendar`, `tasks`, `mvp`  
**Componentes:** `TaskForm`, `TaskItem`, `ModalBase`, `FormField`, `Input`, `Select`, `Button`, `Checkbox`

---

#### US-025: Integração com Google Calendar
**Como** usuário  
**Quero** sincronizar eventos com meu Google Calendar  
**Para que** eu veja tudo em um só lugar

**Critérios de Aceitação:**
- [ ] Botão "Conectar Google Calendar" nas configurações
- [ ] OAuth2 authentication flow
- [ ] Sincronização bidirecional (LicitaFlow ↔ Google)
- [ ] Eventos criados no LicitaFlow aparecem no Google Calendar
- [ ] Eventos criados no Google Calendar (com tag específica) aparecem no LicitaFlow
- [ ] Desconectar a qualquer momento

**Estimativa:** 21 pontos  
**Tags:** `calendar`, `integration`, `google`, `mvp`  
**Componentes:** `IntegrationSettings`, `Button`, `Spinner`

---

#### US-026: Integração com Apple Calendar (CalDAV)
**Como** usuário Apple  
**Quero** sincronizar eventos com meu Apple Calendar  
**Para que** eu veja tudo em um só lugar

**Critérios de Aceitação:**
- [ ] Formulário de configuração CalDAV (servidor, usuário, senha)
- [ ] Sincronização bidirecional
- [ ] Instruções claras para configurar

**Estimativa:** 21 pontos  
**Tags:** `calendar`, `integration`, `apple`, `mvp`  
**Componentes:** `IntegrationSettings`, `FormField`, `Input`, `Button`

---

### 4.7. Epic 7: Gestão de Fornecedores (Prioridade: P1)

#### US-027: CRUD de Fornecedores
**Como** analista  
**Quero** cadastrar, visualizar, editar e excluir fornecedores  
**Para que** eu possa gerenciar minha rede de fornecedores

**Critérios de Aceitação:**
- [ ] Formulário: CNPJ, Razão Social, Nome Fantasia, Contato, Email, Telefone, Endereço, Categoria (tags), Site
- [ ] Tabela com filtros e busca
- [ ] Modal de detalhes
- [ ] Exclusão com confirmação

**Estimativa:** 8 pontos  
**Tags:** `suppliers`, `crud`, `mvp`  
**Componentes:** `PageHeader`, `SearchInput`, `DataTable`, `SupplierForm`, `ModalBase`, `FormField`, `Input`, `Button`

---

#### US-028: Integração ReceitaWS (Busca por CNPJ)
**Como** analista  
**Quero** buscar dados do fornecedor automaticamente ao digitar o CNPJ  
**Para que** eu economize tempo

**Critérios de Aceitação:**
- [ ] Ao sair do campo CNPJ (blur), fazer request para ReceitaWS
- [ ] Preencher automaticamente: Razão Social, Nome Fantasia, Endereço
- [ ] Mensagem de erro se CNPJ inválido ou não encontrado
- [ ] Permitir edição manual dos campos

**Estimativa:** 8 pontos  
**Tags:** `suppliers`, `integration`, `receita`, `mvp`  
**Componentes:** `SupplierForm`, `Input`, `Spinner`, `FormField`

---

#### US-029: Histórico de Cotações por Fornecedor
**Como** gestor  
**Quero** ver o histórico de cotações de um fornecedor  
**Para que** eu possa avaliar seu desempenho

**Critérios de Aceitação:**
- [ ] Aba "Histórico" no modal de detalhes do fornecedor
- [ ] Tabela: Edital, Data, Valor cotado, Selecionado (Sim/Não)
- [ ] Métricas: Total de cotações, Taxa de seleção (%)

**Estimativa:** 8 pontos  
**Tags:** `suppliers`, `quotations`, `p1`  
**Componentes:** `DataTable`, `Text`, `MetricCard`

---

#### US-030: Avaliação de Fornecedores
**Como** gestor  
**Quero** avaliar fornecedores com notas e comentários  
**Para que** eu possa tomar decisões futuras baseadas em experiências passadas

**Critérios de Aceitação:**
- [ ] Sistema de estrelas (1-5) por fornecedor
- [ ] Campo de comentários
- [ ] Exibir média de avaliação no card do fornecedor
- [ ] Histórico de avaliações

**Estimativa:** 5 pontos  
**Tags:** `suppliers`, `rating`, `p1`  
**Componentes:** `RatingStars`, `Input`, `Text`, `Button`

---

### 4.8. Epic 8: Gestão de Cotações (Prioridade: P1)

#### US-031: Solicitação de Cotação
**Como** analista  
**Quero** enviar solicitação de cotação para múltiplos fornecedores  
**Para que** eu possa comparar propostas

**Critérios de Aceitação:**
- [ ] Vincular cotação a um edital
- [ ] Selecionar fornecedores (multiselect com busca)
- [ ] Template de email personalizável
- [ ] Anexar edital e itens
- [ ] Envio em massa
- [ ] Status de envio por fornecedor

**Estimativa:** 13 pontos  
**Tags:** `quotations`, `email`, `p1`  
**Componentes:** `QuotationForm`, `Select`, `Input`, `Button`, `ModalBase`

---

#### US-032: Upload de Propostas Recebidas
**Como** analista  
**Quero** fazer upload das propostas recebidas dos fornecedores  
**Para que** eu possa analisá-las

**Critérios de Aceitação:**
- [ ] Upload de PDF/Excel por fornecedor
- [ ] Campos: Fornecedor, Valor total, Prazo de entrega, Condições de pagamento, Observações
- [ ] Tabela listando propostas recebidas

**Estimativa:** 8 pontos  
**Tags:** `quotations`, `p1`  
**Componentes:** `DocumentUploader`, `FormField`, `Input`, `Button`, `DataTable`

---

#### US-033: Tabela Comparativa de Cotações
**Como** gestor  
**Quero** visualizar propostas lado a lado em uma tabela comparativa  
**Para que** eu possa tomar decisão informada

**Critérios de Aceitação:**
- [ ] Colunas: Fornecedor A, Fornecedor B, Fornecedor C...
- [ ] Linhas: Valor total, Prazo, Condições, Avaliação do fornecedor
- [ ] Highlight automático do melhor valor
- [ ] Botão "Selecionar" por fornecedor

**Estimativa:** 13 pontos  
**Tags:** `quotations`, `comparison`, `p1`  
**Componentes:** `QuotationComparisonTable`, `Badge`, `Button`, `Text`

---

#### US-034: Seleção de Vencedor
**Como** gestor  
**Quero** marcar um fornecedor como vencedor da cotação  
**Para que** o sistema registre essa decisão

**Critérios de Aceitação:**
- [ ] Botão "Selecionar Vencedor" na tabela comparativa
- [ ] Confirmação
- [ ] Badge "Vencedor" no card do fornecedor
- [ ] Atualização automática do status do edital para "Proposta em Elaboração"

**Estimativa:** 5 pontos  
**Tags:** `quotations`, `p1`  
**Componentes:** `ConfirmDialog`, `Badge`, `Button`

---

### 4.9. Epic 9: Gestão de Portais (Prioridade: P1)

#### US-035: CRUD de Portais de Licitação
**Como** analista  
**Quero** cadastrar, visualizar, editar e excluir portais de licitação  
**Para que** eu possa gerenciar meus acessos

**Critérios de Aceitação:**
- [ ] Formulário: Nome, URL, Tipo (ComprasNet, BLL, Municipal, etc.), Usuário, Senha, Observações
- [ ] **Criptografia AES-256 da senha** antes de salvar no banco
- [ ] Tabela com filtros (tipo, nome)
- [ ] Botão "Copiar Senha" (decriptografia no frontend)
- [ ] Botão "Abrir Portal" (abre URL em nova aba)

**Estimativa:** 13 pontos  
**Tags:** `portals`, `security`, `p1`  
**Componentes:** `PageHeader`, `SearchInput`, `PortalCard`, `PortalForm`, `ModalBase`, `FormField`, `Input`, `Select`, `Button`

---

#### US-036: Registro de Últimos Acessos
**Como** analista  
**Quero** que o sistema registre quando acessei cada portal  
**Para que** eu possa me organizar

**Critérios de Aceitação:**
- [ ] Ao clicar em "Abrir Portal", registrar timestamp do acesso
- [ ] Exibir "Último acesso: há 2 dias" no card do portal
- [ ] Highlight em portais não acessados há mais de 30 dias

**Estimativa:** 5 pontos  
**Tags:** `portals`, `tracking`, `p1`  
**Componentes:** `PortalCard`, `Text`, `Badge`

---

#### US-037: Métricas de Portais
**Como** gestor  
**Quero** ver quantos editais obtive por portal  
**Para que** eu possa avaliar quais são mais relevantes

**Critérios de Aceitação:**
- [ ] Card de métrica: "Total de Editais" por portal
- [ ] Ranking de portais por volume
- [ ] Gráfico de pizza (opcional)

**Estimativa:** 8 pontos  
**Tags:** `portals`, `metrics`, `p1`  
**Componentes:** `MetricCard`, `Text`

---

### 4.10. Epic 10: Gestão de Contratos (Prioridade: P1)

#### US-038: CRUD de Contratos
**Como** gestor  
**Quero** cadastrar, visualizar, editar e excluir contratos  
**Para que** eu possa gerenciar contratos assinados

**Critérios de Aceitação:**
- [ ] Vincular contrato a edital ganho
- [ ] Formulário: Número, Objeto, Valor total, Data de início, Data de fim, Status (Ativo, Encerrado, Suspenso), Órgão contratante
- [ ] Tabela com filtros
- [ ] Modal de detalhes

**Estimativa:** 13 pontos  
**Tags:** `contracts`, `crud`, `p1`  
**Componentes:** `PageHeader`, `DataTable`, `ContractForm`, `ModalBase`, `FormField`, `Input`, `Select`, `Button`

---

#### US-039: Alertas de Vencimento de Contratos
**Como** gestor  
**Quero** ser alertado quando contratos estiverem próximos de vencer  
**Para que** eu possa renovar ou encerrar a tempo

**Critérios de Aceitação:**
- [ ] Notificação por email em 90, 60, 30, 15 dias antes do vencimento
- [ ] Widget no Dashboard: "Contratos a Vencer"
- [ ] Badge no menu lateral "Contratos"

**Estimativa:** 8 pontos  
**Tags:** `contracts`, `notifications`, `p1`  
**Componentes:** `ExpiringContractsWidget`, `Badge`, `Icon`, `Text`

---

#### US-040: Dashboard de Contratos
**Como** gestor  
**Quero** ver métricas agregadas de contratos  
**Para que** eu tenha visão estratégica

**Critérios de Aceitação:**
- [ ] Cards de KPIs: Valor total contratado, Contratos ativos, Contratos a vencer (90 dias), Contratos encerrados este ano
- [ ] Gráfico de evolução de valor ao longo do tempo
- [ ] Top 5 contratos por valor

**Estimativa:** 13 pontos  
**Tags:** `contracts`, `dashboard`, `kpi`, `p1`  
**Componentes:** `MetricCard`, `ChartLine`, `DataTable`

---

#### US-041: Histórico de Aditivos e Reajustes
**Como** gestor  
**Quero** registrar aditivos e reajustes de contratos  
**Para que** eu tenha histórico completo

**Critérios de Aceitação:**
- [ ] Aba "Histórico" no modal de detalhes do contrato
- [ ] Tabela: Tipo (Aditivo de Prazo, Aditivo de Valor, Reajuste), Data, Valor, Observações
- [ ] Botão "Adicionar Aditivo/Reajuste"
- [ ] Cálculo automático do valor atualizado

**Estimativa:** 8 pontos  
**Tags:** `contracts`, `history`, `p1`  
**Componentes:** `DataTable`, `ModalBase`, `FormField`, `Input`, `Button`

---

### 4.11. Epic 11: Relatórios e BI (Prioridade: P2)

#### US-042: Dashboard de BI
**Como** gestor  
**Quero** visualizar KPIs e gráficos interativos  
**Para que** eu possa analisar o desempenho da equipe

**Critérios de Aceitação:**
- [ ] Gráficos: Taxa de sucesso ao longo do tempo, Valor médio de editais ganhos, Distribuição por órgão, Tempo médio de processamento por etapa
- [ ] Filtros: Período (mês, trimestre, ano), Órgão, Responsável
- [ ] Cards de KPIs principais
- [ ] Atualização em tempo real

**Estimativa:** 21 pontos  
**Tags:** `reports`, `bi`, `charts`, `p2`  
**Componentes:** `PageHeader`, `FilterBar`, `MetricCard`, `ChartLine`, `ChartBar`, `ChartPie`

---

#### US-043: Exportação de Relatórios
**Como** gestor  
**Quero** exportar relatórios em PDF, Excel e CSV  
**Para que** eu possa compartilhar ou arquivar

**Critérios de Aceitação:**
- [ ] Botão "Exportar" com dropdown (PDF, Excel, CSV)
- [ ] PDF: Formatado com logo, tabelas e gráficos
- [ ] Excel: Dados tabulares com formatação
- [ ] CSV: Dados brutos

**Estimativa:** 13 pontos  
**Tags:** `reports`, `export`, `p2`  
**Componentes:** `Dropdown`, `Button`, `Spinner`

---

#### US-044: Relatórios Customizáveis
**Como** gestor avançado  
**Quero** criar relatórios customizados selecionando métricas e filtros  
**Para que** eu possa analisar dados de forma flexível

**Critérios de Aceitação:**
- [ ] Builder de relatórios: Selecionar tabela, campos, filtros, agregações, ordenação
- [ ] Preview em tempo real
- [ ] Salvar relatório customizado
- [ ] Compartilhar com equipe

**Estimativa:** 34 pontos  
**Tags:** `reports`, `custom`, `advanced`, `p2`  
**Componentes:** `ReportBuilder`, `Select`, `FormField`, `Button`, `DataTable`, `ChartLine`

---

### 4.12. Epic 12: Gestão de Usuários e Permissões (Prioridade: P2)

#### US-045: Gestão de Usuários (Admin)
**Como** administrador  
**Quero** listar, convidar, editar e remover usuários da organização  
**Para que** eu possa gerenciar o acesso

**Critérios de Aceitação:**
- [ ] Tabela de usuários com: Nome, Email, Função (Role), Status (Ativo/Inativo), Último acesso
- [ ] Botão "Convidar Usuário" (envia email)
- [ ] Editar função de usuário
- [ ] Desativar/reativar usuário
- [ ] Remover usuário (confirmação)

**Estimativa:** 13 pontos  
**Tags:** `users`, `admin`, `rbac`, `p2`  
**Componentes:** `PageHeader`, `DataTable`, `UserForm`, `ModalBase`, `FormField`, `Input`, `Select`, `Button`, `Badge`

---

#### US-046: Logs de Auditoria (Admin)
**Como** administrador  
**Quero** ver logs de ações críticas dos usuários  
**Para que** eu possa auditar o sistema

**Critérios de Aceitação:**
- [ ] Tabela de logs: Usuário, Ação, Módulo, Data/Hora, IP
- [ ] Filtros: Usuário, Módulo, Período
- [ ] Ações registradas: Login, Criação/Edição/Exclusão de registros, Exportações
- [ ] Exportação de logs

**Estimativa:** 13 pontos  
**Tags:** `users`, `audit`, `security`, `p2`  
**Componentes:** `PageHeader`, `FilterBar`, `DataTable`, `Button`

---

#### US-047: Permissões Granulares (Futuro)
**Como** administrador  
**Quero** definir permissões granulares por módulo e ação  
**Para que** eu tenha controle fino de acesso

**Critérios de Aceitação:**
- [ ] Matrix de permissões: Módulo × Ação (Visualizar, Criar, Editar, Excluir)
- [ ] Aplicar por função ou por usuário individual
- [ ] Templates de permissões comuns

**Estimativa:** 34 pontos  
**Tags:** `users`, `rbac`, `advanced`, `future`  
**Componentes:** `PermissionMatrix`, `Checkbox`, `Select`, `Button`

---

### 4.13. Epic 13: Notificações e Comunicação (Prioridade: P2)

#### US-048: Centro de Notificações
**Como** usuário  
**Quero** ver todas as minhas notificações em um só lugar  
**Para que** eu não perca informações importantes

**Critérios de Aceitação:**
- [ ] Ícone de sino no Header com badge de contagem
- [ ] Modal de notificações com lista
- [ ] Tipos: Lembrete de prazo, Documento vencendo, Nova cotação recebida, Usuário mencionado, etc.
- [ ] Marcar como lida
- [ ] Marcar todas como lidas
- [ ] Limpar notificações antigas

**Estimativa:** 13 pontos  
**Tags:** `notifications`, `p2`  
**Componentes:** `NotificationCenter`, `ModalBase`, `NotificationItem`, `Icon`, `Badge`, `Button`, `Text`

---

#### US-049: Notificações em Tempo Real
**Como** usuário  
**Quero** receber notificações em tempo real sem recarregar a página  
**Para que** eu fique atualizado instantaneamente

**Critérios de Aceitação:**
- [ ] Integração com Supabase Realtime
- [ ] Toast notification aparece no canto da tela
- [ ] Som (opcional, configurável)
- [ ] Clique no toast abre detalhes

**Estimativa:** 13 pontos  
**Tags:** `notifications`, `realtime`, `p2`  
**Componentes:** `ToastNotification`, `Icon`, `Text`

---

#### US-050: Preferências de Notificação
**Como** usuário  
**Quero** configurar quais notificações quero receber (email, push, nenhuma)  
**Para que** eu não seja sobrecarregado

**Critérios de Aceitação:**
- [ ] Seção "Notificações" nas configurações
- [ ] Checkboxes por tipo de notificação
- [ ] Opções: Email, Push (no sistema), Ambos, Nenhuma
- [ ] Salvar preferências

**Estimativa:** 8 pontos  
**Tags:** `notifications`, `settings`, `p2`  
**Componentes:** `FormField`, `Checkbox`, `Button`

---

### 4.14. Epic 14: Configurações e Integrações (Prioridade: P2)

#### US-051: Configurações de Organização
**Como** administrador  
**Quero** configurar dados da minha organização  
**Para que** o sistema reflita minha identidade

**Critérios de Aceitação:**
- [ ] Formulário: Nome da organização, CNPJ, Logo, Endereço, Telefone, Email de contato
- [ ] Upload de logo (PNG/JPG até 2MB)
- [ ] Salvar alterações

**Estimativa:** 8 pontos  
**Tags:** `settings`, `organization`, `p2`  
**Componentes:** `PageHeader`, `FormField`, `Input`, `Button`, `ImageUploader`

---

#### US-052: Integração com Google Drive
**Como** usuário  
**Quero** conectar meu Google Drive  
**Para que** eu possa salvar documentos automaticamente

**Critérios de Aceitação:**
- [ ] Botão "Conectar Google Drive" nas configurações
- [ ] OAuth2 authentication flow
- [ ] Selecionar pasta de destino
- [ ] Documentos do Vault são copiados automaticamente
- [ ] Desconectar a qualquer momento

**Estimativa:** 21 ponts  
**Tags:** `settings`, `integration`, `google`, `p2`  
**Componentes:** `IntegrationSettings`, `Button`, `Select`, `Spinner`

---

#### US-053: Integração com ERP (API)
**Como** administrador  
**Quero** integrar o LicitaFlow com meu ERP  
**Para que** dados fluam automaticamente

**Critérios de Aceitação:**
- [ ] Formulário: URL da API, API Key, Mapeamento de campos
- [ ] Teste de conexão
- [ ] Sincronização de: Fornecedores, Itens, Contratos
- [ ] Logs de sincronização
- [ ] Configurar frequência (manual, diária, semanal)

**Estimativa:** 34 pontos  
**Tags:** `settings`, `integration`, `erp`, `api`, `p2`  
**Componentes:** `IntegrationSettings`, `FormField`, `Input`, `Button`, `DataTable`

---

#### US-054: Configuração SMTP para Emails
**Como** administrador  
**Quero** configurar um servidor SMTP próprio  
**Para que** emails sejam enviados do meu domínio

**Critérios de Aceitação:**
- [ ] Formulário: Host, Porta, Usuário, Senha, TLS/SSL, Email remetente, Nome remetente
- [ ] Teste de envio
- [ ] Fallback para SMTP padrão se configuração falhar

**Estimativa:** 13 pontos  
**Tags:** `settings`, `smtp`, `email`, `p2`  
**Componentes:** `FormField`, `Input`, `Select`, `Button`, `Spinner`

---

#### US-055: Configuração de OCR (Provider)
**Como** administrador  
**Quero** escolher o provedor de OCR (Tesseract local, Google Vision, AWS Textract)  
**Para que** eu possa otimizar custo vs. qualidade

**Critérios de Aceitação:**
- [ ] Dropdown: Tesseract (grátis), Google Vision (API Key), AWS Textract (API Key)
- [ ] Configurar credenciais
- [ ] Teste de extração
- [ ] Estatísticas de uso

**Estimativa:** 21 pontos  
**Tags:** `settings`, `ocr`, `integration`, `p2`  
**Componentes:** `Select`, `FormField`, `Input`, `Button`, `Spinner`

---

### 4.15. Epic 15: Melhorias de UX e Performance (Prioridade: P3)

#### US-056: Busca Global (Spotlight)
**Como** usuário  
**Quero** buscar qualquer item no sistema com um atalho de teclado  
**Para que** eu navegue mais rapidamente

**Critérios de Aceitação:**
- [ ] Atalho: Ctrl+K (ou Cmd+K no Mac)
- [ ] Modal de busca com input autofocus
- [ ] Busca em: Editais, Fornecedores, Documentos, Portais, Contratos, Tarefas
- [ ] Resultados agrupados por tipo
- [ ] Navegação por teclado (setas) e Enter para abrir
- [ ] Highlight nos resultados

**Estimativa:** 21 pontos  
**Tags:** `ux`, `search`, `p3`  
**Componentes:** `SpotlightSearch`, `ModalBase`, `SearchInput`, `Icon`, `Text`

---

#### US-057: Modo Offline (Service Worker)
**Como** usuário  
**Quero** visualizar dados em cache quando estiver offline  
**Para que** eu não seja bloqueado

**Critérios de Aceitação:**
- [ ] Service Worker com estratégia Cache-First para assets
- [ ] Cache de dados lidos recentemente (IndexedDB)
- [ ] Banner indicando "Modo Offline" quando sem internet
- [ ] Fila de ações para sincronizar quando voltar online

**Estimativa:** 34 pontos  
**Tags:** `ux`, `performance`, `pwa`, `p3`

---

#### US-058: Onboarding Interativo
**Como** novo usuário  
**Quero** ser guiado pelos recursos principais na primeira vez  
**Para que** eu aprenda a usar o sistema rapidamente

**Critérios de Aceitação:**
- [ ] Tour guiado com highlights e tooltips
- [ ] Etapas: 1) Dashboard, 2) Criar Edital, 3) Pipeline, 4) Vault, 5) Calendário
- [ ] Botão "Pular Tour"
- [ ] Marca como concluído (não exibe novamente)

**Estimativa:** 13 pontos  
**Tags:** `ux`, `onboarding`, `p3`  
**Componentes:** `OnboardingTour`, `ModalBase`, `Button`, `Text`

---

#### US-059: Atalhos de Teclado
**Como** usuário avançado  
**Quero** usar atalhos de teclado para ações comuns  
**Para que** eu seja mais produtivo

**Critérios de Aceitação:**
- [ ] Atalhos: N (novo edital), C (calendário), V (vault), P (pipeline), S (busca global), ? (ajuda)
- [ ] Modal de ajuda listando todos os atalhos
- [ ] Feedback visual ao usar atalho

**Estimativa:** 8 pontos  
**Tags:** `ux`, `keyboard`, `p3`  
**Componentes:** `KeyboardShortcutsHelp`, `ModalBase`, `Text`

---

#### US-060: Lazy Loading e Code Splitting
**Como** usuário  
**Quero** que o sistema carregue rapidamente  
**Para que** eu tenha boa experiência

**Critérios de Aceitação:**
- [ ] Lazy loading de rotas (React.lazy + Suspense)
- [ ] Code splitting por módulo
- [ ] Skeleton loaders enquanto carrega
- [ ] Métricas: FCP < 1.5s, TTI < 3s, LCP < 2.5s

**Estimativa:** 13 pontos  
**Tags:** `performance`, `optimization`, `p3`

---

## 5. Critérios de Aceitação Globais

Todas as User Stories devem atender:

### 5.1. Funcionalidade
- ✅ Funciona conforme especificado
- ✅ Validações de entrada implementadas
- ✅ Mensagens de erro/sucesso claras

### 5.2. Código
- ✅ 100% TypeScript (sem `any`, exceto casos justificados)
- ✅ Componentes seguem limites de LOC (Átomos ≤50, Moléculas ≤100, Organismos ≤200, Views ≤300)
- ✅ Uso de `React.memo`, `useCallback`, `useMemo` onde apropriado
- ✅ Arquitetura Vertical Slice respeitada (comunicação apenas via `*.api.ts`)
- ✅ Testes unitários (cobertura ≥70%)

### 5.3. UI/UX
- ✅ Responsivo (mobile, tablet, desktop)
- ✅ Acessível (WCAG 2.1 AA)
- ✅ Tema claro/escuro funcionando
- ✅ Animações suaves (transições ≤300ms)
- ✅ Loading states e feedback visual

### 5.4. Segurança
- ✅ RLS ativado em tabelas do Supabase
- ✅ Validações no backend (Supabase Functions se necessário)
- ✅ Dados sensíveis criptografados (senhas, API keys)
- ✅ HTTPS obrigatório em produção

### 5.5. Performance
- ✅ Queries otimizadas (índices, joins eficientes)
- ✅ Paginação em listagens longas (≥50 itens)
- ✅ Debounce em buscas
- ✅ Lazy loading de imagens e componentes pesados

---

## 6. Métricas de Sucesso

### 6.1. Métricas de Produto (KPIs)

| Métrica | Meta MVP | Meta 6 meses | Meta 12 meses |
|---------|----------|--------------|---------------|
| **Organizações Ativas** | 50 | 200 | 500 |
| **Usuários Ativos Mensais (MAU)** | 150 | 600 | 1.500 |
| **Taxa de Retenção (30 dias)** | ≥85% | ≥88% | ≥90% |
| **NPS (Net Promoter Score)** | ≥60 | ≥70 | ≥75 |
| **Editais Processados/mês** | 500 | 2.000 | 5.000 |
| **Taxa de Conversão Trial → Pago** | ≥20% | ≥30% | ≥40% |

### 6.2. Métricas Técnicas

| Métrica | Meta |
|---------|------|
| **First Contentful Paint (FCP)** | < 1.5s |
| **Time to Interactive (TTI)** | < 3s |
| **Largest Contentful Paint (LCP)** | < 2.5s |
| **Cumulative Layout Shift (CLS)** | < 0.1 |
| **Cobertura de Testes** | ≥70% |
| **Bugs Críticos em Produção** | 0 |
| **Uptime** | ≥99.5% |

### 6.3. Métricas de Negócio

| Métrica | Meta MVP | Meta 6 meses |
|---------|----------|--------------|
| **MRR (Monthly Recurring Revenue)** | R$ 5.000 | R$ 30.000 |
| **CAC (Customer Acquisition Cost)** | < R$ 200 | < R$ 150 |
| **LTV (Lifetime Value)** | > R$ 2.000 | > R$ 5.000 |
| **Churn Rate Mensal** | < 5% | < 3% |

---

## 📌 Próximos Passos

1. **Revisão do Backlog:** Validar prioridades com stakeholders
2. **Arquitetura Detalhada:** Documentar design técnico (veja `LICITA_FLOW_ARCHITECTURE.md`)
3. **Design System:** Catalogar componentes e criar Storybook (veja `LICITA_FLOW_DESIGN_SYSTEM.md`)
4. **Sprint Planning:** Dividir Epics em Sprints de 2 semanas
5. **Kick-off:** Iniciar desenvolvimento do MVP

---

**Documento gerado em:** 28 de Outubro de 2025  
**Versão:** 1.0  
**Responsável:** Equipe de Produto LicitaFlow

