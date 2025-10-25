# 📋 Instruções de Migração para Supabase - LicitMind

## 🎯 Ordem de Execução dos Arquivos SQL

Execute os arquivos SQL **EXATAMENTE** nesta ordem no SQL Editor do Supabase:

### **1️⃣ PRIMEIRO: Schema Base e Autenticação**
📁 **Arquivo:** `20250925182552_square_wildflower.sql`
- ✅ Cria extensões necessárias
- ✅ Define ENUMs (roles, status, modalidades)
- ✅ Cria tabelas base: `organizations`, `user_profiles`, `editals`, `comments`, `activity_logs`
- ✅ Configura RLS (Row Level Security)
- ✅ Cria políticas de acesso
- ✅ Insere organização demo

**⚠️ IMPORTANTE:** Este é o arquivo MAIS CRÍTICO. Sem ele, nada funciona!

---

### **2️⃣ SEGUNDO: Documentos, Calendário e Notificações**
📁 **Arquivo:** `20251002161434_add_documents_calendar_notifications.sql`
- ✅ Tabela `documents` - Sistema de documentos
- ✅ Tabela `calendar_tasks` - Calendário e tarefas
- ✅ Tabela `notifications` - Sistema de notificações
- ✅ Funções automáticas para atualizar status de documentos
- ✅ Funções para notificar prazos próximos

---

### **3️⃣ TERCEIRO: Fornecedores e Cotações**
📁 **Arquivo:** `20251022130000_add_suppliers_quotations.sql`
- ✅ Tabela `suppliers` - Cadastro de fornecedores
- ✅ Tabela `supplier_products` - Produtos/serviços dos fornecedores
- ✅ Tabela `quotations` - Cotações
- ✅ Tabela `quotation_items` - Itens da cotação
- ✅ Tabela `quotation_responses` - Respostas dos fornecedores
- ✅ Tabela `quotation_response_items` - Itens das respostas

---

### **4️⃣ QUARTO: Portais de Licitação**
📁 **Arquivo:** `20251022130100_add_bidding_portals.sql`
- ✅ Tabela `bidding_portals` - Cadastro de portais
- ✅ Tabela `portal_access_history` - Histórico de acessos
- ✅ Tabela `portal_required_documents` - Documentos necessários por portal
- ✅ Função automática para atualizar status baseado em vencimento

---

### **5️⃣ QUINTO: Contratos e Empenhos**
📁 **Arquivo:** `20251022130200_add_contracts_commitments.sql`
- ✅ Tabela `contracts` - Gestão de contratos
- ✅ Tabela `contract_amendments` - Aditivos de contrato
- ✅ Tabela `commitments` - Empenhos
- ✅ Tabela `contract_measurements` - Medições/Faturas
- ✅ Tabela `revenue_forecast` - Previsão de receitas
- ✅ Função automática para encerrar contratos vencidos

---

### **6️⃣ SEXTO: Pipelines e Google Drive**
📁 **Arquivo:** `20251022130300_add_pipelines_google_drive.sql`
- ✅ Tabela `pipelines` - Pipelines personalizados
- ✅ Tabela `pipeline_stages` - Estágios do pipeline
- ✅ Tabela `google_drive_folders` - Integração com Google Drive
- ✅ Insere pipeline padrão com 7 estágios

---

## 🚀 Passo a Passo para Executar

### **Opção 1: Via Dashboard do Supabase (Recomendado)**

1. **Acesse seu projeto no Supabase**
   - Vá para: https://supabase.com/dashboard
   - Selecione seu projeto

2. **Abra o SQL Editor**
   - No menu lateral, clique em `SQL Editor`
   - Clique em `New Query`

3. **Execute cada arquivo na ordem**
   - Copie TODO o conteúdo do arquivo 1
   - Cole no SQL Editor
   - Clique em `Run` (ou Ctrl+Enter)
   - ✅ Aguarde a confirmação de sucesso
   - Repita para os arquivos 2, 3, 4, 5 e 6

4. **Verifique se tudo foi criado**
   ```sql
   -- Execute este comando para verificar todas as tabelas
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public' 
   ORDER BY table_name;
   ```

---

### **Opção 2: Via Supabase CLI**

```bash
# 1. Instalar Supabase CLI (se ainda não tiver)
npm install -g supabase

# 2. Fazer login
supabase login

# 3. Linkar seu projeto
supabase link --project-ref SEU_PROJECT_REF

# 4. Aplicar todas as migrações
supabase db push

# 5. Verificar status
supabase db diff
```

---

## 📊 Estrutura Completa do Banco

Após executar todos os arquivos, você terá:

### **Tabelas Principais (21 tabelas)**
1. ✅ `organizations` - Organizações
2. ✅ `user_profiles` - Perfis de usuários
3. ✅ `editals` - Editais
4. ✅ `comments` - Comentários
5. ✅ `activity_logs` - Logs de atividade
6. ✅ `documents` - Documentos
7. ✅ `calendar_tasks` - Tarefas do calendário
8. ✅ `notifications` - Notificações
9. ✅ `suppliers` - Fornecedores
10. ✅ `supplier_products` - Produtos dos fornecedores
11. ✅ `quotations` - Cotações
12. ✅ `quotation_items` - Itens de cotação
13. ✅ `quotation_responses` - Respostas de cotação
14. ✅ `quotation_response_items` - Itens das respostas
15. ✅ `bidding_portals` - Portais de licitação
16. ✅ `portal_access_history` - Histórico de acessos
17. ✅ `portal_required_documents` - Documentos dos portais
18. ✅ `contracts` - Contratos
19. ✅ `contract_amendments` - Aditivos
20. ✅ `commitments` - Empenhos
21. ✅ `contract_measurements` - Medições
22. ✅ `revenue_forecast` - Previsão de receitas
23. ✅ `pipelines` - Pipelines
24. ✅ `pipeline_stages` - Estágios do pipeline
25. ✅ `google_drive_folders` - Pastas do Google Drive

---

## 🔐 Configuração de Segurança (RLS)

Todas as tabelas têm **Row Level Security (RLS)** habilitado com políticas baseadas em:
- ✅ Organização do usuário
- ✅ Role do usuário (admin, gestor, analista, cliente)
- ✅ Propriedade dos recursos

---

## 🎨 Dados Iniciais Criados

Após a migração, você terá:
- ✅ 1 organização demo: "LicitaFlow Demo"
- ✅ 1 pipeline padrão com 7 estágios
- ✅ Funções automáticas configuradas

---

## ⚙️ Configurar Variáveis de Ambiente

Após a migração, configure seu arquivo `.env`:

```env
VITE_SUPABASE_URL=https://SEU_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_ANON_KEY
```

**Como obter as credenciais:**
1. Vá para Settings > API no dashboard do Supabase
2. Copie a `Project URL` e `anon public key`

---

## 🧪 Testar a Migração

Execute estes comandos SQL para verificar:

```sql
-- 1. Verificar tabelas criadas
SELECT COUNT(*) as total_tabelas 
FROM information_schema.tables 
WHERE table_schema = 'public';
-- Deve retornar 25

-- 2. Verificar organização demo
SELECT * FROM organizations;

-- 3. Verificar pipeline padrão
SELECT p.*, COUNT(ps.id) as total_stages
FROM pipelines p
LEFT JOIN pipeline_stages ps ON ps.pipeline_id = p.id
WHERE p.is_default = true
GROUP BY p.id;
-- Deve retornar 1 pipeline com 7 estágios

-- 4. Verificar RLS
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = true;
-- Todas as tabelas devem ter RLS habilitado
```

---

## 🐛 Solução de Problemas

### **Erro: "relation already exists"**
- ✅ Significa que a tabela já foi criada
- ✅ Você pode pular esse arquivo ou executar um DROP TABLE antes

### **Erro: "permission denied"**
- ✅ Verifique se você está logado como proprietário do projeto
- ✅ Use o SQL Editor do dashboard (não o psql direto)

### **Erro: "function does not exist"**
- ✅ Execute o arquivo 1 primeiro (cria a função `update_updated_at_column`)

### **Erro: "foreign key constraint"**
- ✅ Respeite a ordem dos arquivos
- ✅ Não pule nenhum arquivo

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs no Supabase Dashboard > Logs
2. Execute o comando de verificação de tabelas
3. Revise se executou todos os arquivos na ordem correta

---

## ✅ Checklist Final

Antes de iniciar o sistema, confirme:

- [ ] Todos os 6 arquivos SQL foram executados
- [ ] 25 tabelas foram criadas
- [ ] RLS está habilitado em todas as tabelas
- [ ] Pipeline padrão foi criado
- [ ] Organização demo existe
- [ ] Variáveis de ambiente configuradas no `.env`
- [ ] Aplicação conecta com sucesso ao Supabase

---

## 🎉 Pronto!

Após seguir todos os passos, seu banco de dados Supabase estará 100% configurado e pronto para uso com o LicitMind CRM! 🚀
