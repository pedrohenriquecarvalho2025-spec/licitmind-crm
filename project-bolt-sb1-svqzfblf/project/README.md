# 🚀 LicitMind - Sistema de Gestão de Licitações

> Plataforma SaaS B2B completa para gestão inteligente de licitações públicas

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

---

## 📋 Sobre o Projeto

LicitMind é uma plataforma completa de gestão de licitações que oferece controle total do processo licitatório, desde a prospecção até a gestão de contratos, com foco em produtividade e organização.

### 🎯 Principais Funcionalidades

#### ✅ Gestão de Editais
- Formulário completo com tabela de itens
- Upload e gerenciamento de documentos
- Integração com Google Drive
- Busca automática de CNPJ (ReceitaWS)
- Histórico de alterações
- Anotações colaborativas
- Pipeline visual (Kanban)

#### ✅ Dashboard Inteligente
- Alertas de vencimento (documentos e credenciais)
- Agenda de disputas
- Central de lembretes
- Atividades recentes
- Métricas em tempo real

#### ✅ Gestão de Contratos
- Formulário completo com cláusulas de multa
- Simulador de penalidades
- Alertas de vencimento
- Garantia contratual
- Controle de vigência

#### ✅ Módulos Completos
- 📄 Editais
- 📊 Dashboard
- 📝 Contratos
- 📅 Calendário
- 📁 Documentos (Vault)
- 🏢 Fornecedores
- 💰 Cotações
- 🌐 Portais de Licitação
- 👥 Usuários e Permissões
- ⚙️ Configurações

---

## 🛠️ Stack Tecnológica

### Frontend
- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **TailwindCSS** - Estilização
- **Lucide React** - Ícones

### Backend
- **Supabase** - BaaS completo
  - PostgreSQL (Banco de dados)
  - Auth (Autenticação)
  - Storage (Armazenamento)
  - Realtime (Tempo real)

### Arquitetura
- **Atomic Design** - Organização de componentes
- **Vertical Slices** - Módulos independentes
- **Clean Code** - Boas práticas

---

## 🚀 Como Executar

### Pré-requisitos
```bash
Node.js 18+
npm ou pnpm
Conta no Supabase
```

### Instalação
```bash
# Clone o repositório
git clone https://github.com/pedrohenriquecarvalho2025-spec/licitmind-crm.git

# Entre no diretório
cd licitmind-crm/project-bolt-sb1-svqzfblf/project

# Instale as dependências
npm install
```

### Configuração
Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

### Executar em Desenvolvimento
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

### Build para Produção
```bash
npm run build
```

---

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes UI
│   ├── ui/
│   │   ├── atoms/      # Componentes básicos
│   │   ├── molecules/  # Componentes compostos
│   │   └── organisms/  # Componentes complexos
│   ├── auth/           # Componentes de autenticação
│   └── layout/         # Layout e navegação
│
├── modules/            # Módulos verticais
│   ├── dashboard/      # Dashboard
│   ├── editals/        # Gestão de editais
│   ├── contracts/      # Gestão de contratos
│   ├── calendar/       # Calendário e tarefas
│   ├── documents/      # Vault de documentos
│   ├── suppliers/      # Fornecedores
│   ├── quotations/     # Cotações
│   ├── portals/        # Portais de licitação
│   ├── users/          # Usuários
│   └── settings/       # Configurações
│
├── core/               # Núcleo da aplicação
│   ├── config/         # Configurações
│   ├── services/       # Serviços globais
│   └── utils/          # Utilitários
│
├── hooks/              # Custom React Hooks
├── contexts/           # React Contexts
├── types/              # Definições de tipos
└── lib/                # Bibliotecas e integrações
```

---

## 🗄️ Banco de Dados

### Tabelas Principais
- `organizations` - Organizações/Empresas
- `user_profiles` - Perfis de usuário
- `editals` - Editais de licitação
- `edital_items` - Itens dos editais
- `contracts` - Contratos
- `contract_penalties` - Cláusulas de multa
- `documents` - Documentos (vault)
- `bidding_portals` - Portais de licitação
- `suppliers` - Fornecedores
- `quotations` - Cotações
- `calendar_events` - Eventos do calendário
- `tasks` - Tarefas
- `activity_logs` - Logs de auditoria

### Migrations
Todas as migrations estão em `supabase/migrations/`

Execute no Supabase SQL Editor:
```sql
-- Executar em ordem:
-- 1. 20250925182552_square_wildflower.sql
-- 2. 20251002161434_add_documents_calendar_notifications.sql
-- 3. 20251022130000_add_suppliers_quotations.sql
-- 4. 20251022130100_add_bidding_portals.sql
-- 5. 20251022130200_add_contracts_commitments.sql
-- 6. 20251022130300_add_pipelines_google_drive.sql
```

---

## 🔐 Autenticação e Permissões

### Níveis de Acesso
- **Admin** - Acesso total
- **Manager** - Gestão de módulos
- **Viewer** - Apenas visualização

### Permissões por Módulo
Cada módulo possui controle granular de permissões:
- `view` - Visualizar
- `create` - Criar
- `edit` - Editar
- `delete` - Excluir

---

## 🎨 Design System

### Cores Principais
```css
Brand Cyan: #39A2DB
Brand Blue: #0066CC
Tech Green: #2ECC71
Tech Orange: #E67E22
Tech Purple: #9B59B6
```

### Temas
- **Light Mode** - Tema claro
- **Dark Mode** - Tema escuro

### Componentes
Todos os componentes seguem o padrão **Atomic Design**:
- **Atoms** - Botões, inputs, badges, etc.
- **Molecules** - Cards, forms, dropdowns, etc.
- **Organisms** - Tabelas, modais, sidebars, etc.

---

## 📚 Documentação

Documentação completa disponível em `/docs`:

- `ARCHITECTURE.md` - Arquitetura do sistema
- `COMPONENT_QUICK_REFERENCE.md` - Referência de componentes
- `MODULE_IMPLEMENTATION_GUIDE.md` - Guia de implementação
- `PROGRESSO_FINAL_DESENVOLVIMENTO.md` - Status do desenvolvimento

---

## 🧪 Testes

### Executar Testes
```bash
npm run test
```

### Coverage
```bash
npm run test:coverage
```

---

## 📦 Deploy

### Opções de Deploy
- **Vercel** (Recomendado)
- **Netlify**
- **AWS Amplify**
- **Railway**

### Deploy com Vercel
```bash
npm install -g vercel
vercel
```

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 Roadmap

### ✅ Concluído
- [x] Dashboard completo
- [x] Gestão de Editais
- [x] Gestão de Contratos
- [x] Sistema de permissões
- [x] Integração Google Drive (base)
- [x] Busca de CNPJ

### 🔄 Em Desenvolvimento
- [ ] Drag-and-Drop no Pipeline
- [ ] Monitor de Validade (Documentos)
- [ ] Sistema de Notificações em tempo real
- [ ] Interface de comparação de Cotações

### 📋 Planejado
- [ ] API Pública REST
- [ ] Mobile App (React Native)
- [ ] OCR de documentos
- [ ] Análise com Machine Learning
- [ ] Integrações avançadas (Slack, Teams)

---

## 👨‍💻 Autor

**Equipe LicitMind**

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 💬 Suporte

- **Email**: suporte@licitmind.com.br
- **Documentação**: [/docs](./docs)
- **Issues**: [GitHub Issues](https://github.com/pedrohenriquecarvalho2025-spec/licitmind-crm/issues)

---

## ⭐ Star o Projeto

Se este projeto foi útil para você, considere dar uma estrela ⭐

---

**Desenvolvido com ❤️ pela equipe LicitMind**  
**Versão**: 1.0.0-beta  
**Última atualização**: Outubro 2025
