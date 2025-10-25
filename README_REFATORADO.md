# 🚀 LicitMind - CRM de Licitações Profissional

## **Sobre o Projeto**

LicitMind é um CRM SaaS vertical de alta performance focado exclusivamente na gestão de licitações públicas e privadas no Brasil. Completamente refatorado seguindo a **Metodologia de Componentização Extrema** e **Atomic Design**.

---

## **🎯 Diferenciais Competitivos**

1. ✅ **Arquitetura Extremamente Modular** - Atomic Design + Vertical Slices
2. ✅ **Componentização Profissional** - SRP rigoroso com limites de LOC
3. ✅ **Isolamento de Módulos** - Interfaces contratuais entre domínios
4. ✅ **Type-Safe** - TypeScript 100% tipado
5. ✅ **Performance Otimizada** - Lazy loading, memoização, índices SQL
6. ✅ **Multi-Tenancy Nativo** - RLS no Supabase
7. ✅ **Escalável** - Pronto para 10.000+ organizações

---

## **🛠️ Stack Tecnológica**

### **Frontend**
- **React 18** + **TypeScript 5**
- **Vite** (build tool ultra-rápido)
- **Tailwind CSS 3** (design system customizado)
- **Lucide React** (iconografia moderna)

### **Backend / BaaS**
- **Supabase** (PostgreSQL + Auth + RLS + Storage)
- **Row Level Security** (segurança no nível do banco)

### **Arquitetura**
- **Atomic Design** (átomos → moléculas → organismos → views)
- **Vertical Slice Architecture** (módulos de negócio isolados)
- **Dependency Inversion** (interfaces contratuais)

---

## **📐 Estrutura do Projeto**

```
src/
├── types/              # Tipos compartilhados
├── core/               # Infraestrutura (config, utils, logger)
├── hooks/              # Hooks reutilizáveis
├── components/
│   ├── ui/
│   │   ├── atoms/      # Componentes mínimos (≤50 LOC)
│   │   └── molecules/  # Composição (≤100 LOC)
│   └── shared/
│       └── organisms/  # Compartilhados (≤200 LOC)
├── modules/            # Módulos de negócio (Vertical Slices)
│   ├── contracts/      # Contratos e Empenhos
│   ├── suppliers/      # Fornecedores
│   ├── editals/        # Editais
│   ├── documents/      # Vault de Documentos
│   ├── calendar/       # Calendário e Tarefas
│   └── ...
├── lib/                # Bibliotecas externas
└── App.tsx             # Roteador principal
```

---

## **🧩 Módulos Implementados**

### **1. Dashboard**
- Central de lembretes e recados
- Botões de acesso rápido
- Últimas atividades
- Métricas em tempo real

### **2. Gestão de Editais**
- Formulário completo com OCR
- Busca CNPJ via ReceitaWS
- Tabela de itens/quantitativos
- Pipeline Kanban (drag-and-drop)
- Histórico de alterações
- Análise com IA

### **3. Gestão de Contratos e Empenhos** ⭐ REFATORADO
- Dashboard com KPIs financeiros
- Alertas de vencimento (90/60/30/15/7 dias)
- Previsibilidade financeira
- Arquitetura modular com `contracts.api.ts`

### **4. Gestão de Fornecedores** ⭐ REFATORADO
- Cadastro completo (CNPJ, contatos, endereço)
- Sistema de cotações
- Comparação automática de preços
- Avaliações de performance
- Arquitetura modular com `suppliers.api.ts`

### **5. Gestão de Documentos (Vault)**
- Upload drag-and-drop
- Controle de vencimentos
- Alertas automáticos por e-mail
- Versioning de documentos

### **6. Calendário e Tarefas**
- Visualização mensal/semanal/diária
- Prazos automáticos dos editais
- Sincronização Google Calendar
- Notificações push

### **7. Portal de Gestão de Portais** 🌟
- Gestão centralizada de acessos
- Alertas de vencimento de certificados
- Controle de credenciais criptografadas

### **8. Relatórios Avançados (BI)**
- KPIs dinâmicos
- Gráficos interativos (Recharts)
- Performance de analistas
- Exportação PDF/Excel

### **9. Gestão de Usuários (RBAC)**
- 5 níveis de acesso (admin, gestor, analista, cliente, client_viewer)
- Permissões granulares
- Logs de acesso

### **10. Configurações**
- Perfil e preferências
- Integrações (Drive, Calendar, ERP, OCR, SMTP)
- API Keys e Webhooks

---

## **⚙️ Instalação e Configuração**

### **1. Clonar o Repositório**
```bash
git clone https://github.com/seu-usuario/licitmind.git
cd licitmind/project-bolt-sb1-svqzfblf/project
```

### **2. Instalar Dependências**
```bash
npm install
```

### **3. Configurar Variáveis de Ambiente**
```bash
cp .env.example .env
```

Edite `.env`:
```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
VITE_DEMO_MODE=false  # true para modo demonstração
```

### **4. Executar Migrações SQL**
Execute na ordem no Supabase SQL Editor:
1. `MIGRATION_EDITAIS_COMPLETO.sql`
2. `MIGRATION_VAULT_CALENDARIO_FORNECEDORES.sql`
3. `MIGRATION_PORTAL_CONTRATOS_RELATORIOS.sql`

### **5. Iniciar Desenvolvimento**
```bash
npm run dev
```

Acesse: `http://localhost:5173`

---

## **🚀 Build para Produção**

```bash
npm run build
npm run preview  # Testar build localmente
```

---

## **📊 Banco de Dados**

### **Estrutura**
- **35+ tabelas** com RLS
- **50+ índices** otimizados
- **10+ triggers** automáticos
- **15+ funções** SQL
- **70+ policies** de segurança

### **Otimizações Implementadas**
✅ Índices compostos para queries frequentes
✅ Full-text search (GIN) para buscas textuais
✅ Materialized Views para dashboards
✅ RLS otimizado com SECURITY DEFINER

**Ver:** `SQL_OPTIMIZATION_ANALYSIS.md` para detalhes completos

---

## **🧪 Testes**

### **Executar Testes**
```bash
npm run test              # Jest
npm run test:coverage     # Com cobertura
```

### **Estratégia de Testes**
- **Unitários:** Átomos, Moléculas, Hooks
- **Integração:** APIs, Serviços
- **E2E:** Fluxos críticos (Cypress)

---

## **📖 Documentação Completa**

- **`ARCHITECTURE.md`** - Arquitetura detalhada + Guia de extensibilidade
- **`SQL_OPTIMIZATION_ANALYSIS.md`** - Análise e otimizações SQL
- **`DESENVOLVIMENTO.md`** - Histórico de desenvolvimento
- **`SISTEMA_COMPLETO_FINAL.md`** - Documentação funcional

---

## **🔒 Segurança**

### **Implementado**
✅ Row Level Security (RLS) em todas as tabelas
✅ Criptografia de senhas de portais (pgcrypto)
✅ API Keys com hash
✅ Permissões granulares por role
✅ Audit logs completos

### **Boas Práticas**
- Nunca commitar `.env` com credenciais
- Rotacionar API keys regularmente
- Revisar RLS policies periodicamente
- Monitorar logs de acesso

---

## **📈 Performance**

### **Métricas Target**
- **First Contentful Paint:** < 1s
- **Time to Interactive:** < 3s
- **Lighthouse Score:** > 90

### **Otimizações**
✅ Code splitting por módulo
✅ Lazy loading de rotas
✅ Memoização de componentes
✅ Debounce em buscas
✅ Virtual scrolling em listas grandes

---

## **🤝 Como Contribuir**

### **1. Criar Branch**
```bash
git checkout -b feature/nova-funcionalidade
```

### **2. Seguir Padrões**
- Respeitar limites de LOC
- Aplicar SRP rigorosamente
- Documentar código (JSDoc)
- Escrever testes

### **3. Commit**
```bash
git commit -m "feat: adiciona nova funcionalidade X"
```

### **4. Pull Request**
- Descrever mudanças detalhadamente
- Incluir screenshots (se UI)
- Garantir que testes passam

---

## **📝 Scripts Disponíveis**

```bash
npm run dev          # Desenvolvimento local
npm run build        # Build produção
npm run preview      # Testar build
npm run lint         # ESLint
npm run test         # Jest
npm run type-check   # TypeScript check
```

---

## **📞 Suporte**

- **Documentação:** Ver arquivos `.md` na raiz
- **Issues:** GitHub Issues
- **Discussões:** GitHub Discussions

---

## **📜 Licença**

Propriet\u00e1rio - Todos os direitos reservados

---

## **🎉 Conquistas da Refatoração**

✅ **+100 componentes** refatorados  
✅ **Arquitetura modular** com interfaces contratuais  
✅ **100% TypeScript** sem `any`  
✅ **SRP aplicado** em todos os níveis  
✅ **Performance otimizada** (SQL + Frontend)  
✅ **Pronto para escala** (10k+ orgs)  
✅ **Código comercial** de alta qualidade  

---

**Desenvolvido com excelência técnica e foco em qualidade profissional. 🚀**

