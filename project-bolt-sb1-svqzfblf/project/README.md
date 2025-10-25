# 🧠 LicitMind - CRM Vertical para Gestão de Licitações

**LicitMind** é um SaaS CRM de alta performance focado exclusivamente na gestão, controle e organização do fluxo de licitações públicas e privadas no mercado brasileiro.

![Logo](https://via.placeholder.com/150x150/1E90FF/FFFFFF?text=LicitMind)

---

## 🚀 Funcionalidades Implementadas

### ✅ **Módulos Core**

#### 1. **Dashboard Inteligente**
- KPIs em tempo real (total de editais, taxa de conversão, valor total)
- Gráficos de performance mensal
- Insights de IA (simulados)
- Top 5 órgãos por número de editais
- Ações rápidas

#### 2. **Gestão de Editais**
- CRUD completo de editais
- Campos: número, órgão, objeto, modalidade, datas, valor, status
- Upload de arquivos
- Sistema de comentários
- Integração com Google Drive (estrutura)

#### 3. **Pipeline Kanban**
- Visualização Kanban completa
- Múltiplos pipelines customizáveis
- Estágios personalizados com cores
- Cards de editais com informações principais

#### 4. **Gestão de Fornecedores** 🆕
- Cadastro completo de fornecedores
- Busca por CNPJ, razão social ou nome fantasia
- Controle de status (ativo/inativo)
- Informações de contato e localização

#### 5. **Gestão de Cotações** 🆕
- Solicitações de cotação
- Controle de status (pendente, em andamento, recebida, aprovada, rejeitada)
- Vinculação com editais
- Histórico completo

#### 6. **Portal de Gestão de Portais de Licitação** 🆕
- Cadastro de portais (ComprasNet, Licitações-e, BLL, etc.)
- Controle de credenciais
- Alertas de vencimento de acesso
- Dashboard de status (ativos, vencidos, pendentes)
- Cálculo automático de dias até vencimento

#### 7. **Gestão de Contratos e Empenhos** 🆕
- Cadastro de contratos
- Controle de vigência
- Dashboard financeiro
- Alertas de vencimento (90 dias)
- Módulo de empenhos (em desenvolvimento)

#### 8. **Gestão de Documentos**
- Categorização (atestado, CREA/CAU, certidão, licença)
- Controle de validade
- Upload e armazenamento

#### 9. **Calendário e Tarefas**
- Tipos: task, meeting, deadline
- Prioridades: high, medium, low
- Vinculação com editais

#### 10. **Sistema de Notificações**
- Tipos: deadline, status_change, new_edital, system, task, document
- Centro de notificações

#### 11. **Gestão de Usuários**
- Roles: admin, gestor, analista, cliente
- Controle de acesso via AuthGuard
- Logs de atividade

#### 12. **Multi-tenancy**
- Segregação de dados por organização
- Suporte a múltiplas empresas

---

## 🛠️ Stack Tecnológica

### **Frontend**
- **React 18.3.1** com **TypeScript 5.5.3**
- **Vite 5.4.2** (build tool)
- **TailwindCSS 3.4.1** (estilização)
- **Lucide React 0.344.0** (ícones)

### **Backend/Database**
- **Supabase** (PostgreSQL + Auth + Storage)
- **@supabase/supabase-js 2.58.0**

### **Design System**
- **Paleta de Cores:**
  - Petrol (#0F4C5C) - Azul petróleo base
  - Cyan (#39A2DB) - Azul ciano inovação
  - Tech Green (#2AA876) - Verde tecnológico
  - Graphite (#2B2F36) - Grafite profundo
  - Silver (#C7D2D6) - Cinza-prata

---

## 📦 Instalação e Configuração

### **Pré-requisitos**
- Node.js 18+ 
- npm ou yarn
- Conta Supabase (para produção)

### **1. Clone o repositório**
```bash
cd project-bolt-sb1-svqzfblf/project
```

### **2. Instale as dependências**
```bash
npm install
```

### **3. Configure as variáveis de ambiente**

Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Application Mode
VITE_DEMO_MODE=false  # true para modo demo, false para produção
```

### **4. Configure o Supabase**

#### **4.1. Crie um projeto no Supabase**
1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Copie a URL e a chave anônima

#### **4.2. Execute as migrações**
Execute os arquivos SQL na ordem:
1. `supabase/migrations/20250925182552_square_wildflower.sql`
2. `supabase/migrations/20251002161434_add_documents_calendar_notifications.sql`
3. `supabase/migrations/20251022130000_add_suppliers_quotations.sql`
4. `supabase/migrations/20251022130100_add_bidding_portals.sql`
5. `supabase/migrations/20251022130200_add_contracts_commitments.sql`

Você pode executar via:
- Supabase Dashboard > SQL Editor
- Supabase CLI: `supabase db push`

### **5. Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

Acesse: `http://localhost:5173`

---

## 🗄️ Estrutura do Banco de Dados

### **Tabelas Principais**

1. **organizations** - Organizações/empresas
2. **user_profiles** - Perfis de usuários
3. **editals** - Editais de licitação
4. **suppliers** 🆕 - Fornecedores
5. **quotations** 🆕 - Cotações
6. **quotation_items** 🆕 - Itens de cotação
7. **quotation_responses** 🆕 - Respostas de fornecedores
8. **bidding_portals** 🆕 - Portais de licitação
9. **portal_access_history** 🆕 - Histórico de acessos
10. **contracts** 🆕 - Contratos
11. **contract_amendments** 🆕 - Aditivos
12. **commitments** 🆕 - Empenhos
13. **contract_measurements** 🆕 - Medições
14. **revenue_forecast** 🆕 - Previsão de receitas
15. **documents** - Documentos
16. **calendar_tasks** - Tarefas
17. **notifications** - Notificações
18. **pipelines** - Pipelines
19. **pipeline_stages** - Estágios
20. **comments** - Comentários
21. **activity_logs** - Logs de auditoria

---

## 🎯 Roadmap de Desenvolvimento

### **FASE 1 - Fundação** ✅ (Concluída)
- ✅ Configurar Supabase real
- ✅ Criar módulo de Fornecedores e Cotações
- ✅ Criar Portal de Gestão de Portais
- ✅ Criar módulo de Contratos e Empenhos

### **FASE 2 - UX e Funcionalidades Core** 🔄 (Em Progresso)
- ⏳ Implementar drag-and-drop no Pipeline
- ⏳ Desenvolver OCR para editais
- ⏳ Aprimorar Dashboard com métricas de analistas
- ⏳ Sistema de notificações em tempo real

### **FASE 3 - Inteligência** 📋 (Planejado)
- 📋 Análise de Editais com IA
- 📋 Relatórios Avançados e BI
- 📋 Recomendações inteligentes
- 📋 Pontuação de risco

### **FASE 4 - Integrações** 📋 (Planejado)
- 📋 API REST completa
- 📋 Integração Google Calendar
- 📋 Integração WhatsApp
- 📋 Integração Email (SMTP)
- 📋 Webhooks

### **FASE 5 - Customização** 📋 (Planejado)
- 📋 Campos customizados por segmento
- 📋 Templates reutilizáveis
- 📋 White-label

---

## 🔐 Autenticação e Permissões

### **Roles Disponíveis**
- **Admin** - Acesso total
- **Gestor** - Gestão de equipe e editais
- **Analista** - Operação de editais
- **Cliente** - Visualização limitada

### **Modo Demo**
O sistema possui um modo demonstração que permite testar sem configurar o Supabase:
- Defina `VITE_DEMO_MODE=true` no `.env`
- Use qualquer email/senha para login
- Dados mockados pré-carregados

---

## 📝 Scripts Disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Executa linter
```

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto é proprietário e confidencial.

---

## 📞 Suporte

Para suporte, entre em contato através de: suporte@licitmind.com.br

---

## 🎨 Créditos

**Logo:** Manta Ray com Cérebro em tons de azul - simbolizando inteligência, fluidez e adaptabilidade.

**Design System:** Inspirado em interfaces modernas de SaaS com foco em produtividade.

---

**Desenvolvido com ❤️ para revolucionar a gestão de licitações no Brasil**
