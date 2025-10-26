-- ============================================
-- MIGRATION: VAULT + CALENDÁRIO + FORNECEDORES
-- ============================================

-- ============================================
-- 1. GESTÃO DE DOCUMENTOS (VAULT)
-- ============================================

-- Tabela de Documentos
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Informações do Documento
  nome TEXT NOT NULL,
  descricao TEXT,
  categoria TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  file_type TEXT,
  thumbnail_url TEXT,
  
  -- Datas
  data_emissao DATE,
  data_validade DATE,
  orgao_emissor TEXT,
  
  -- Tags e Metadados
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Controle de Vencimento
  status TEXT DEFAULT 'valido', -- valido, vencendo, vencido
  dias_para_vencer INTEGER,
  alerta_enviado BOOLEAN DEFAULT FALSE,
  
  -- Associações
  edital_ids UUID[] DEFAULT '{}',
  
  -- Versioning
  versao INTEGER DEFAULT 1,
  documento_anterior_id UUID REFERENCES documents(id),
  
  -- Compartilhamento
  link_temporario TEXT,
  link_expira_em TIMESTAMP,
  
  -- Audit
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Categorias de Documentos (Customizável)
CREATE TABLE IF NOT EXISTS document_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  descricao TEXT,
  icone TEXT,
  cor TEXT,
  requer_validade BOOLEAN DEFAULT FALSE,
  campos_customizados JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Alertas de Vencimento
CREATE TABLE IF NOT EXISTS document_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  dias_antes INTEGER NOT NULL,
  enviado BOOLEAN DEFAULT FALSE,
  enviado_em TIMESTAMP,
  destinatarios UUID[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. CALENDÁRIO E TAREFAS
-- ============================================

-- Tabela de Eventos do Calendário
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Informações do Evento
  titulo TEXT NOT NULL,
  descricao TEXT,
  tipo TEXT NOT NULL, -- edital, tarefa, reuniao, outro
  
  -- Datas
  data_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
  data_fim TIMESTAMP WITH TIME ZONE,
  dia_inteiro BOOLEAN DEFAULT FALSE,
  
  -- Associações
  edital_id UUID REFERENCES editals(id) ON DELETE CASCADE,
  tarefa_id UUID,
  
  -- Responsável
  responsavel_id UUID REFERENCES profiles(id),
  participantes UUID[] DEFAULT '{}',
  
  -- Notificações
  notificar_antes INTEGER[], -- [30, 15, 7] dias/minutos
  notificacoes_enviadas JSONB DEFAULT '[]'::jsonb,
  
  -- Recorrência
  recorrente BOOLEAN DEFAULT FALSE,
  recorrencia_regra TEXT, -- RRULE format
  
  -- Sincronização Externa
  google_calendar_id TEXT,
  apple_calendar_id TEXT,
  sincronizado BOOLEAN DEFAULT FALSE,
  ultima_sincronizacao TIMESTAMP,
  
  -- Metadata
  cor TEXT,
  tags TEXT[] DEFAULT '{}',
  
  -- Audit
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Tarefas
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Informações da Tarefa
  titulo TEXT NOT NULL,
  descricao TEXT,
  
  -- Status e Prioridade
  concluida BOOLEAN DEFAULT FALSE,
  prioridade TEXT DEFAULT 'media', -- alta, media, baixa
  
  -- Datas
  prazo TIMESTAMP WITH TIME ZONE,
  data_conclusao TIMESTAMP,
  
  -- Responsável
  responsavel_id UUID REFERENCES profiles(id),
  
  -- Associações
  edital_id UUID REFERENCES editals(id) ON DELETE SET NULL,
  documento_id UUID REFERENCES documents(id) ON DELETE SET NULL,
  
  -- Tags
  tags TEXT[] DEFAULT '{}',
  
  -- Checklist
  checklist JSONB DEFAULT '[]'::jsonb,
  
  -- Audit
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. GESTÃO DE FORNECEDORES
-- ============================================

-- Tabela de Fornecedores
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Dados Básicos
  cnpj TEXT NOT NULL,
  razao_social TEXT NOT NULL,
  nome_fantasia TEXT,
  
  -- Endereço (auto-preenchido via ReceitaWS)
  logradouro TEXT,
  numero TEXT,
  complemento TEXT,
  bairro TEXT,
  cidade TEXT,
  uf TEXT,
  cep TEXT,
  
  -- Contato
  telefone TEXT,
  email TEXT,
  pessoa_contato TEXT,
  site TEXT,
  
  -- Observações
  observacoes TEXT,
  
  -- Catálogo
  catalogo_url TEXT,
  
  -- Métricas
  total_cotacoes INTEGER DEFAULT 0,
  total_cotacoes_respondidas INTEGER DEFAULT 0,
  taxa_resposta DECIMAL(5,2) DEFAULT 0,
  tempo_medio_resposta INTERVAL,
  valor_total_negociado DECIMAL(15,2) DEFAULT 0,
  avaliacao_media DECIMAL(3,2),
  
  -- Status
  ativo BOOLEAN DEFAULT TRUE,
  
  -- Integração ERP
  erp_id TEXT,
  erp_sync_at TIMESTAMP,
  
  -- Audit
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(organization_id, cnpj)
);

-- Tabela de Produtos dos Fornecedores
CREATE TABLE IF NOT EXISTS supplier_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  
  -- Informações do Produto
  nome TEXT NOT NULL,
  codigo TEXT,
  categoria TEXT,
  unidade TEXT,
  preco_medio DECIMAL(15,2),
  
  -- Metadata
  descricao TEXT,
  especificacoes JSONB DEFAULT '{}'::jsonb,
  
  -- Integração ERP
  erp_id TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Cotações
CREATE TABLE IF NOT EXISTS quotations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Informações da Cotação
  titulo TEXT NOT NULL,
  descricao TEXT,
  numero TEXT, -- Gerado automaticamente
  
  -- Status
  status TEXT DEFAULT 'rascunho', -- rascunho, enviada, em_analise, finalizada, cancelada
  
  -- Datas
  prazo_resposta TIMESTAMP WITH TIME ZONE,
  data_envio TIMESTAMP,
  data_finalizacao TIMESTAMP,
  
  -- Fornecedor Vencedor
  fornecedor_vencedor_id UUID REFERENCES suppliers(id),
  valor_total_vencedor DECIMAL(15,2),
  
  -- Associações
  edital_id UUID REFERENCES editals(id) ON DELETE SET NULL,
  
  -- Template
  is_template BOOLEAN DEFAULT FALSE,
  template_nome TEXT,
  
  -- Observações
  observacoes TEXT,
  
  -- Integração ERP
  erp_id TEXT,
  exportado_erp BOOLEAN DEFAULT FALSE,
  exportado_erp_em TIMESTAMP,
  
  -- Audit
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Itens da Cotação
CREATE TABLE IF NOT EXISTS quotation_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quotation_id UUID NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
  
  -- Informações do Item
  descricao TEXT NOT NULL,
  quantidade DECIMAL(15,3) NOT NULL,
  unidade TEXT NOT NULL,
  
  -- Especificações
  especificacoes TEXT,
  
  -- Ordem
  posicao INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Respostas de Cotação
CREATE TABLE IF NOT EXISTS quotation_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quotation_id UUID NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  
  -- Status
  status TEXT DEFAULT 'pendente', -- pendente, respondida, recusada
  
  -- Datas
  data_resposta TIMESTAMP,
  
  -- Valores
  valor_total DECIMAL(15,2),
  prazo_entrega INTEGER, -- dias
  condicoes_pagamento TEXT,
  
  -- Observações
  observacoes TEXT,
  
  -- Anexos
  anexos JSONB DEFAULT '[]'::jsonb,
  
  -- Vencedor
  selecionado BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(quotation_id, supplier_id)
);

-- Tabela de Itens da Resposta de Cotação
CREATE TABLE IF NOT EXISTS quotation_response_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quotation_response_id UUID NOT NULL REFERENCES quotation_responses(id) ON DELETE CASCADE,
  quotation_item_id UUID NOT NULL REFERENCES quotation_items(id) ON DELETE CASCADE,
  
  -- Preços
  preco_unitario DECIMAL(15,2) NOT NULL,
  preco_total DECIMAL(15,2) NOT NULL,
  
  -- Informações Adicionais
  marca TEXT,
  modelo TEXT,
  observacoes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Avaliações de Fornecedores
CREATE TABLE IF NOT EXISTS supplier_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  quotation_id UUID REFERENCES quotations(id) ON DELETE SET NULL,
  
  -- Avaliação
  nota DECIMAL(3,2) NOT NULL CHECK (nota >= 0 AND nota <= 5),
  
  -- Critérios
  qualidade DECIMAL(3,2),
  prazo DECIMAL(3,2),
  atendimento DECIMAL(3,2),
  preco DECIMAL(3,2),
  
  -- Comentário
  comentario TEXT,
  
  -- Audit
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Configurações de Integração ERP
CREATE TABLE IF NOT EXISTS erp_integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Configurações
  erp_nome TEXT NOT NULL,
  api_endpoint TEXT NOT NULL,
  api_key TEXT,
  api_secret TEXT,
  
  -- Mapeamento de Campos
  field_mapping JSONB DEFAULT '{}'::jsonb,
  
  -- Status
  ativo BOOLEAN DEFAULT TRUE,
  ultima_sincronizacao TIMESTAMP,
  
  -- Audit
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(organization_id)
);

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================

-- Documents
CREATE INDEX IF NOT EXISTS idx_documents_org ON documents(organization_id);
CREATE INDEX IF NOT EXISTS idx_documents_categoria ON documents(categoria);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_validade ON documents(data_validade);
CREATE INDEX IF NOT EXISTS idx_documents_tags ON documents USING gin(tags);

-- Calendar Events
CREATE INDEX IF NOT EXISTS idx_calendar_events_org ON calendar_events(organization_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_data_inicio ON calendar_events(data_inicio);
CREATE INDEX IF NOT EXISTS idx_calendar_events_responsavel ON calendar_events(responsavel_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_edital ON calendar_events(edital_id);

-- Tasks
CREATE INDEX IF NOT EXISTS idx_tasks_org ON tasks(organization_id);
CREATE INDEX IF NOT EXISTS idx_tasks_responsavel ON tasks(responsavel_id);
CREATE INDEX IF NOT EXISTS idx_tasks_prazo ON tasks(prazo);
CREATE INDEX IF NOT EXISTS idx_tasks_concluida ON tasks(concluida);

-- Suppliers
CREATE INDEX IF NOT EXISTS idx_suppliers_org ON suppliers(organization_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_cnpj ON suppliers(cnpj);
CREATE INDEX IF NOT EXISTS idx_suppliers_ativo ON suppliers(ativo);

-- Quotations
CREATE INDEX IF NOT EXISTS idx_quotations_org ON quotations(organization_id);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON quotations(status);
CREATE INDEX IF NOT EXISTS idx_quotations_edital ON quotations(edital_id);

-- Full-text search para documentos
CREATE INDEX IF NOT EXISTS idx_documents_search ON documents USING gin(to_tsvector('portuguese', 
  coalesce(nome, '') || ' ' || 
  coalesce(descricao, '') || ' ' || 
  coalesce(orgao_emissor, '')
));

-- Full-text search para fornecedores
CREATE INDEX IF NOT EXISTS idx_suppliers_search ON suppliers USING gin(to_tsvector('portuguese', 
  coalesce(razao_social, '') || ' ' || 
  coalesce(nome_fantasia, '') || ' ' || 
  coalesce(cnpj, '')
));

-- ============================================
-- RLS POLICIES
-- ============================================

-- Documents
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view documents from their organization"
  ON documents FOR SELECT
  USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can manage documents in their organization"
  ON documents FOR ALL
  USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- Document Categories
ALTER TABLE document_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view categories from their organization"
  ON document_categories FOR SELECT
  USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can manage categories"
  ON document_categories FOR ALL
  USING (organization_id IN (
    SELECT organization_id FROM profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'gestor')
  ));

-- Calendar Events
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view events from their organization"
  ON calendar_events FOR SELECT
  USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can manage events in their organization"
  ON calendar_events FOR ALL
  USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- Tasks
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view tasks from their organization"
  ON tasks FOR SELECT
  USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can manage tasks in their organization"
  ON tasks FOR ALL
  USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- Suppliers
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view suppliers from their organization"
  ON suppliers FOR SELECT
  USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can manage suppliers in their organization"
  ON suppliers FOR ALL
  USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- Supplier Products
ALTER TABLE supplier_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view products from their organization suppliers"
  ON supplier_products FOR SELECT
  USING (supplier_id IN (
    SELECT id FROM suppliers WHERE organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  ));

CREATE POLICY "Users can manage products from their organization suppliers"
  ON supplier_products FOR ALL
  USING (supplier_id IN (
    SELECT id FROM suppliers WHERE organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  ));

-- Quotations
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view quotations from their organization"
  ON quotations FOR SELECT
  USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can manage quotations in their organization"
  ON quotations FOR ALL
  USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- Quotation Items, Responses, etc. (similar policies)
ALTER TABLE quotation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_response_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_reviews ENABLE ROW LEVEL SECURITY;

-- ============================================
-- TRIGGERS
-- ============================================

-- Atualizar status de documento baseado na validade
CREATE OR REPLACE FUNCTION update_document_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.data_validade IS NOT NULL THEN
    NEW.dias_para_vencer = (NEW.data_validade - CURRENT_DATE);
    
    IF NEW.dias_para_vencer < 0 THEN
      NEW.status = 'vencido';
    ELSIF NEW.dias_para_vencer <= 30 THEN
      NEW.status = 'vencendo';
    ELSE
      NEW.status = 'valido';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_document_status_trigger
  BEFORE INSERT OR UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_document_status();

-- Atualizar métricas do fornecedor
CREATE OR REPLACE FUNCTION update_supplier_metrics()
RETURNS TRIGGER AS $$
DECLARE
  supplier_rec RECORD;
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    -- Atualizar métricas do fornecedor
    UPDATE suppliers s
    SET 
      total_cotacoes = (
        SELECT COUNT(*) FROM quotation_responses qr
        WHERE qr.supplier_id = s.id
      ),
      total_cotacoes_respondidas = (
        SELECT COUNT(*) FROM quotation_responses qr
        WHERE qr.supplier_id = s.id AND qr.status = 'respondida'
      ),
      taxa_resposta = (
        SELECT CASE 
          WHEN COUNT(*) > 0 THEN 
            (COUNT(*) FILTER (WHERE status = 'respondida')::DECIMAL / COUNT(*) * 100)
          ELSE 0 
        END
        FROM quotation_responses qr
        WHERE qr.supplier_id = s.id
      ),
      avaliacao_media = (
        SELECT AVG(nota) FROM supplier_reviews sr
        WHERE sr.supplier_id = s.id
      )
    WHERE s.id = NEW.supplier_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_supplier_metrics_trigger
  AFTER INSERT OR UPDATE ON quotation_responses
  FOR EACH ROW
  EXECUTE FUNCTION update_supplier_metrics();

-- Triggers para updated_at
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calendar_events_updated_at
  BEFORE UPDATE ON calendar_events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at
  BEFORE UPDATE ON suppliers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotations_updated_at
  BEFORE UPDATE ON quotations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNÇÕES ÚTEIS
-- ============================================

-- Função para verificar documentos vencendo
CREATE OR REPLACE FUNCTION get_expiring_documents(org_id UUID, days_ahead INTEGER DEFAULT 30)
RETURNS TABLE (
  id UUID,
  nome TEXT,
  categoria TEXT,
  data_validade DATE,
  dias_para_vencer INTEGER,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id,
    d.nome,
    d.categoria,
    d.data_validade,
    d.dias_para_vencer,
    d.status
  FROM documents d
  WHERE d.organization_id = org_id
    AND d.data_validade IS NOT NULL
    AND d.dias_para_vencer <= days_ahead
    AND d.dias_para_vencer >= 0
  ORDER BY d.dias_para_vencer ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para comparar cotações
CREATE OR REPLACE FUNCTION compare_quotations(quotation_uuid UUID)
RETURNS TABLE (
  item_descricao TEXT,
  supplier_name TEXT,
  preco_unitario DECIMAL,
  preco_total DECIMAL,
  is_best_price BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  WITH item_prices AS (
    SELECT 
      qi.descricao,
      s.razao_social,
      qri.preco_unitario,
      qri.preco_total,
      qi.id as item_id,
      ROW_NUMBER() OVER (PARTITION BY qi.id ORDER BY qri.preco_total ASC) as price_rank
    FROM quotation_items qi
    JOIN quotation_response_items qri ON qri.quotation_item_id = qi.id
    JOIN quotation_responses qr ON qr.id = qri.quotation_response_id
    JOIN suppliers s ON s.id = qr.supplier_id
    WHERE qi.quotation_id = quotation_uuid
      AND qr.status = 'respondida'
  )
  SELECT 
    descricao,
    razao_social,
    preco_unitario,
    preco_total,
    (price_rank = 1) as is_best_price
  FROM item_prices
  ORDER BY item_id, price_rank;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para gerar número de cotação
CREATE OR REPLACE FUNCTION generate_quotation_number(org_id UUID)
RETURNS TEXT AS $$
DECLARE
  year_suffix TEXT;
  sequence_num INTEGER;
  quotation_number TEXT;
BEGIN
  year_suffix := TO_CHAR(CURRENT_DATE, 'YY');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(numero FROM '\d+') AS INTEGER)), 0) + 1
  INTO sequence_num
  FROM quotations
  WHERE organization_id = org_id
    AND numero LIKE 'COT-' || year_suffix || '-%';
  
  quotation_number := 'COT-' || year_suffix || '-' || LPAD(sequence_num::TEXT, 4, '0');
  
  RETURN quotation_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
