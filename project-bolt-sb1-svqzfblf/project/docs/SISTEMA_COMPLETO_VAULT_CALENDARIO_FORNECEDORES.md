# 🚀 Sistema Completo: Vault + Calendário + Fornecedores

## ✅ Migration SQL Criada

**Arquivo:** `MIGRATION_VAULT_CALENDARIO_FORNECEDORES.sql`

---

## 📁 1. GESTÃO DE DOCUMENTOS (VAULT)

### **Tabelas Criadas:**

#### **documents**
```sql
- Informações: nome, descrição, categoria
- Arquivo: file_url, file_name, file_size, file_type
- Thumbnail: thumbnail_url
- Datas: data_emissao, data_validade
- Órgão emissor
- Tags customizadas (array)
- Status: valido, vencendo, vencido
- dias_para_vencer (calculado automaticamente)
- Associações: edital_ids (array)
- Versioning: versao, documento_anterior_id
- Compartilhamento: link_temporario, link_expira_em
```

#### **document_categories**
```sql
- Customizável por organização
- nome, descricao, icone, cor
- requer_validade (boolean)
- campos_customizados (JSONB)
```

#### **document_alerts**
```sql
- Alertas de vencimento
- dias_antes (30, 15, 7)
- enviado, enviado_em
- destinatarios (array de user_ids)
```

### **Funcionalidades:**

#### **Upload de Documentos:**
- ✅ Drag-and-drop
- ✅ Botão de upload
- ✅ Preview de PDFs
- ✅ Thumbnail automático
- ✅ Múltiplos arquivos

#### **Categorização Automática:**
**Categorias Padrão:**
- 📄 Documentos da Empresa (CNPJ, Contrato Social, Certidões)
- 🏆 Atestados de Capacidade Técnica
- 🎓 CREA, CAU, Licenças
- ⭐ Certificações ISO
- 📋 Outros (personalizável)

#### **Controle de Vencimentos:**
```javascript
// Trigger automático calcula:
- dias_para_vencer
- status (valido/vencendo/vencido)

// Alertas:
- 30 dias antes
- 15 dias antes
- 7 dias antes
- E-mail automático
- Notificação no sistema
```

#### **Dashboard de Vencimentos:**
```
┌─────────────────────────────────────┐
│ 🔴 Vencidos: 3 documentos          │
│ 🟡 Vencendo (30 dias): 5 docs      │
│ 🟢 Válidos: 45 documentos          │
└─────────────────────────────────────┘
```

#### **Banco de Atestados:**
**Filtros Avançados:**
- Por tipo de serviço/produto
- Por valor mínimo
- Por órgão contratante
- Por data
- Por tags

**Busca Rápida:**
```sql
-- Full-text search em português
-- Busca em: nome, descrição, órgão emissor
```

#### **Visualizações:**
1. **Grid de Cards**
   - Thumbnail do PDF
   - Nome do documento
   - Categoria (badge)
   - Status de validade
   - Data de vencimento

2. **Lista Detalhada**
   - Tabela com todas as informações
   - Ordenação por coluna
   - Filtros inline

3. **Timeline por Vencimento**
   - Linha do tempo visual
   - Agrupado por mês
   - Alertas visuais

#### **Ações:**
- ✅ Associar a editais
- ✅ Download individual
- ✅ Download em lote
- ✅ Compartilhar via link temporário
- ✅ Renovar documento (nova versão)
- ✅ Histórico de versões
- ✅ Deletar

---

## 📅 2. CALENDÁRIO E TAREFAS

### **Tabelas Criadas:**

#### **calendar_events**
```sql
- titulo, descricao, tipo
- data_inicio, data_fim, dia_inteiro
- Associações: edital_id, tarefa_id
- responsavel_id, participantes (array)
- Notificações: notificar_antes (array)
- Recorrência: recorrente, recorrencia_regra
- Sincronização: google_calendar_id, apple_calendar_id
- cor, tags
```

#### **tasks**
```sql
- titulo, descricao
- concluida, prioridade (alta/media/baixa)
- prazo, data_conclusao
- responsavel_id
- Associações: edital_id, documento_id
- tags (array)
- checklist (JSONB)
```

### **Funcionalidades:**

#### **Calendário Visual:**
**Visualizações:**
- 📅 Mensal (padrão)
- 📆 Semanal
- 📋 Diária
- 📊 Agenda (lista)

**Prazos Automáticos dos Editais:**
```javascript
// Sincronização automática:
- Data de abertura
- Data de entrega de propostas
- Data de julgamento
- Data de visitas técnicas
- Outros marcos importantes
```

**Cores por Tipo:**
- 🔵 Edital (azul)
- 🟢 Tarefa (verde)
- 🟣 Reunião (roxo)
- 🟡 Outro (amarelo)

#### **Lista de Tarefas:**
```
┌─────────────────────────────────────┐
│ ☑️ Preparar documentação Edital 001│
│    🔴 Alta | ⏰ Amanhã | 👤 João   │
│                                     │
│ ☐ Solicitar certidões               │
│    🟡 Média | ⏰ 3 dias | 👤 Maria │
│                                     │
│ ☐ Enviar proposta                   │
│    🔴 Alta | ⏰ Hoje | 👤 Pedro    │
└─────────────────────────────────────┘
```

**Campos:**
- ✅ Título
- ✅ Descrição
- ✅ Checkbox de conclusão
- ✅ Prioridade (alta, média, baixa)
- ✅ Prazo
- ✅ Responsável
- ✅ Tags
- ✅ Checklist interno
- ✅ Associação com edital/documento

#### **Notificações:**
```javascript
// Push notifications no sistema
// E-mails automáticos
// Lembretes configuráveis

// Exemplo:
notificar_antes: [30, 15, 7] // dias
// ou
notificar_antes: [60, 30, 15] // minutos (para eventos do dia)
```

#### **Integração Google Calendar:**
```javascript
// OAuth2 Authentication
// Sincronização bidirecional (CRUD)

// Eventos criados no LicitMind → Google Calendar
// Eventos criados no Google Calendar → LicitMind

// Campos sincronizados:
- Título
- Descrição
- Data/hora início
- Data/hora fim
- Participantes
- Localização
```

#### **Integração Apple Calendar:**
```javascript
// iCloud Calendar API
// CalDAV protocol
// Sincronização similar ao Google
```

---

## 🏢 3. GESTÃO DE FORNECEDORES

### **Tabelas Criadas:**

#### **suppliers**
```sql
- CNPJ (com busca ReceitaWS)
- razao_social, nome_fantasia
- Endereço completo (auto-preenchido)
- Contato: telefone, email, pessoa_contato, site
- observacoes
- catalogo_url
- Métricas: total_cotacoes, taxa_resposta, tempo_medio_resposta
- valor_total_negociado, avaliacao_media
- ativo (boolean)
- Integração ERP: erp_id, erp_sync_at
```

#### **supplier_products**
```sql
- nome, codigo, categoria
- unidade, preco_medio
- descricao, especificacoes (JSONB)
- erp_id
```

#### **quotations**
```sql
- titulo, descricao, numero (auto-gerado)
- status: rascunho, enviada, em_analise, finalizada
- prazo_resposta, data_envio, data_finalizacao
- fornecedor_vencedor_id, valor_total_vencedor
- edital_id (associação)
- is_template, template_nome
- Integração ERP: erp_id, exportado_erp
```

#### **quotation_items**
```sql
- descricao, quantidade, unidade
- especificacoes
- posicao (ordem)
```

#### **quotation_responses**
```sql
- quotation_id, supplier_id
- status: pendente, respondida, recusada
- data_resposta
- valor_total, prazo_entrega, condicoes_pagamento
- observacoes, anexos (JSONB)
- selecionado (vencedor)
```

#### **quotation_response_items**
```sql
- quotation_response_id, quotation_item_id
- preco_unitario, preco_total
- marca, modelo, observacoes
```

#### **supplier_reviews**
```sql
- supplier_id, quotation_id
- nota (0-5)
- Critérios: qualidade, prazo, atendimento, preco
- comentario
```

#### **erp_integrations**
```sql
- erp_nome, api_endpoint
- api_key, api_secret
- field_mapping (JSONB)
- ativo, ultima_sincronizacao
```

### **Funcionalidades:**

#### **Cadastro de Fornecedores:**
```javascript
// Ao digitar CNPJ:
1. Validar formato
2. Buscar ReceitaWS
3. Auto-preencher:
   - Razão social
   - Nome fantasia
   - Endereço completo
   - Telefone
   - Email (se disponível)
4. Usuário confirma/edita
5. Salvar
```

#### **Produtos/Serviços Ofertados:**
```
┌─────────────────────────────────────────────┐
│ Produto          | Código | Categoria | Un │
├─────────────────────────────────────────────┤
│ Notebook Dell    | NB001  | TI        | UN │
│ Mouse Logitech   | MS002  | TI        | UN │
│ [+ Adicionar Produto]                       │
└─────────────────────────────────────────────┘

Upload de Catálogo (PDF): [📎 Escolher arquivo]
```

#### **Sistema de Cotações:**

**Criar Cotação:**
```
┌─────────────────────────────────────┐
│ Título: Equipamentos de TI          │
│ Descrição: Notebooks e periféricos  │
│                                     │
│ ITENS:                              │
│ 1. Notebook i7 | 10 | UN            │
│ 2. Mouse USB   | 20 | UN            │
│ [+ Adicionar Item]                  │
│                                     │
│ FORNECEDORES:                       │
│ ☑️ Dell Brasil                      │
│ ☑️ HP Computadores                  │
│ ☑️ Lenovo                           │
│                                     │
│ Prazo Resposta: 15/12/2025          │
│                                     │
│ [Salvar Rascunho] [Enviar Cotação] │
└─────────────────────────────────────┘
```

**Templates de Cotação:**
```javascript
// Salvar cotação como template
// Reutilizar com um clique
// Editar antes de enviar

// Exemplo:
Template: "Equipamentos de TI Mensais"
- Itens pré-definidos
- Fornecedores pré-selecionados
- Descrição padrão
```

**Comparação de Cotações:**
```
┌──────────────────────────────────────────────────────┐
│ Item          │ Dell      │ HP        │ Lenovo     │
├──────────────────────────────────────────────────────┤
│ Notebook i7   │ R$ 4.500  │ R$ 4.200✓ │ R$ 4.800   │
│ Mouse USB     │ R$ 50     │ R$ 55     │ R$ 45✓     │
├──────────────────────────────────────────────────────┤
│ TOTAL         │ R$ 45.500 │ R$ 42.550✓│ R$ 48.900  │
└──────────────────────────────────────────────────────┘

✓ = Melhor preço

[Exportar Excel] [Exportar PDF] [Aprovar Vencedor]
```

**Função SQL:**
```sql
-- compare_quotations(quotation_uuid)
-- Retorna comparação lado a lado
-- Marca melhor preço por item
```

#### **Dashboard de Fornecedores:**
```
┌─────────────────────────────────────┐
│ 📊 Métricas Gerais                  │
├─────────────────────────────────────┤
│ Total Fornecedores: 45              │
│ Fornecedores Ativos: 42             │
│ Cotações Enviadas: 128              │
│ Taxa Resposta Média: 85%            │
│ Tempo Médio Resposta: 3 dias        │
│ Valor Total Negociado: R$ 2.5M      │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 🏆 Top 5 Fornecedores               │
├─────────────────────────────────────┤
│ 1. Dell Brasil - R$ 500k            │
│ 2. HP Computadores - R$ 450k        │
│ 3. Lenovo - R$ 400k                 │
│ 4. Microsoft - R$ 350k              │
│ 5. Oracle - R$ 300k                 │
└─────────────────────────────────────┘
```

#### **Relatórios de Performance:**
```javascript
// Por Fornecedor:
- Histórico completo de cotações
- Gráfico de preços ao longo do tempo
- Taxa de resposta
- Tempo médio de resposta
- Confiabilidade (entregas no prazo)
- Avaliação média (0-5 estrelas)
- Comentários de avaliações
```

#### **Integração com ERP:**
```javascript
// Configuração:
{
  erp_nome: "SAP",
  api_endpoint: "https://api.sap.com/v1",
  api_key: "xxx",
  api_secret: "yyy",
  field_mapping: {
    "cnpj": "supplier_tax_id",
    "razao_social": "supplier_name",
    "valor_total": "total_amount"
  }
}

// Funcionalidades:
1. Importar fornecedores do ERP
2. Sincronizar produtos e preços
3. Exportar cotações aprovadas
4. Atualizar status de pedidos
5. Sincronização automática (cron job)
```

**Endpoints da API:**
```javascript
// GET /api/erp/suppliers
// Importar fornecedores

// POST /api/erp/quotations
// Exportar cotação aprovada

// GET /api/erp/products/:supplier_id
// Buscar produtos do fornecedor

// PUT /api/erp/sync
// Sincronização manual
```

---

## 🔧 Funções SQL Úteis

### **1. get_expiring_documents()**
```sql
-- Retorna documentos vencendo em X dias
SELECT * FROM get_expiring_documents(
  'org_uuid', 
  30 -- dias
);

-- Retorna:
- id, nome, categoria
- data_validade, dias_para_vencer
- status
```

### **2. compare_quotations()**
```sql
-- Compara respostas de cotação
SELECT * FROM compare_quotations('quotation_uuid');

-- Retorna:
- item_descricao
- supplier_name
- preco_unitario, preco_total
- is_best_price (boolean)
```

### **3. generate_quotation_number()**
```sql
-- Gera número automático
SELECT generate_quotation_number('org_uuid');

-- Retorna: COT-25-0001
-- Formato: COT-{ANO}-{SEQUENCIAL}
```

---

## 🎯 Triggers Automáticos

### **1. update_document_status()**
```sql
-- Atualiza automaticamente:
- dias_para_vencer
- status (valido/vencendo/vencido)

-- Executa em INSERT e UPDATE
```

### **2. update_supplier_metrics()**
```sql
-- Atualiza métricas do fornecedor:
- total_cotacoes
- total_cotacoes_respondidas
- taxa_resposta
- avaliacao_media

-- Executa quando quotation_response é criada/atualizada
```

---

## 📱 Componentes React a Criar

### **Vault:**
1. `DocumentVault.tsx` - Tela principal
2. `DocumentUpload.tsx` - Upload drag-drop
3. `DocumentCard.tsx` - Card com thumbnail
4. `DocumentFilters.tsx` - Filtros avançados
5. `ExpiringDocuments.tsx` - Dashboard vencimentos
6. `DocumentTimeline.tsx` - Timeline visual

### **Calendário:**
1. `Calendar.tsx` - Calendário principal
2. `CalendarEvent.tsx` - Card de evento
3. `TaskList.tsx` - Lista de tarefas
4. `TaskForm.tsx` - Criar/editar tarefa
5. `GoogleCalendarSync.tsx` - Sincronização
6. `NotificationSettings.tsx` - Configurar alertas

### **Fornecedores:**
1. `SuppliersList.tsx` - Lista de fornecedores
2. `SupplierForm.tsx` - Cadastro (com ReceitaWS)
3. `SupplierProducts.tsx` - Produtos do fornecedor
4. `QuotationForm.tsx` - Criar cotação
5. `QuotationComparison.tsx` - Comparar respostas
6. `SupplierDashboard.tsx` - Métricas
7. `ERPIntegration.tsx` - Configurar ERP

---

## ✅ Próximos Passos

### **1. Executar Migration:**
```bash
1. Abrir Supabase SQL Editor
2. Colar MIGRATION_VAULT_CALENDARIO_FORNECEDORES.sql
3. Executar (Run)
4. Verificar 15+ tabelas criadas
```

### **2. Implementar Componentes:**
- Vault com upload e vencimentos
- Calendário com sincronização
- Fornecedores com cotações

### **3. Integrações:**
- ReceitaWS (CNPJ)
- Google Calendar API
- Apple Calendar (CalDAV)
- ERP (API REST)

---

## 🎯 Diferenciais Competitivos

### **vs Sistemas Tradicionais:**
- ✅ **Vault Inteligente** - Alertas automáticos de vencimento
- ✅ **Calendário Sincronizado** - Google + Apple
- ✅ **Cotações Comparativas** - Lado a lado automático
- ✅ **Integração ERP** - Bidirecional
- ✅ **ReceitaWS** - Auto-preenchimento CNPJ
- ✅ **Métricas Automáticas** - Performance de fornecedores
- ✅ **Templates** - Cotações recorrentes
- ✅ **Full-text Search** - Busca inteligente

---

## ✅ Status Final

**MIGRATION COMPLETA!** 🎉

### **Tabelas Criadas:**
- ✅ 4 tabelas Vault
- ✅ 2 tabelas Calendário
- ✅ 9 tabelas Fornecedores
- ✅ **Total: 15 tabelas**

### **Funcionalidades:**
- ✅ RLS Policies completas
- ✅ Índices otimizados
- ✅ Triggers automáticos
- ✅ Funções úteis
- ✅ Full-text search

**Próximo:** Implementar componentes React! 🚀
