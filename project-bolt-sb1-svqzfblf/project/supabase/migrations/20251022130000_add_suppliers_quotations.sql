-- Tabela de Fornecedores
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  cnpj VARCHAR(18) NOT NULL,
  razao_social VARCHAR(255) NOT NULL,
  nome_fantasia VARCHAR(255),
  email VARCHAR(255),
  telefone VARCHAR(20),
  endereco TEXT,
  cidade VARCHAR(100),
  estado VARCHAR(2),
  cep VARCHAR(10),
  contato_principal VARCHAR(255),
  observacoes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, cnpj)
);

-- Tabela de Produtos/Serviços do Fornecedor
CREATE TABLE IF NOT EXISTS supplier_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  categoria VARCHAR(100),
  unidade_medida VARCHAR(50),
  preco_referencia DECIMAL(15,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Cotações
CREATE TABLE IF NOT EXISTS quotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  edital_id UUID REFERENCES editals(id) ON DELETE SET NULL,
  numero_cotacao VARCHAR(50) NOT NULL,
  descricao TEXT,
  data_solicitacao DATE NOT NULL,
  data_limite_resposta DATE,
  status VARCHAR(50) DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_andamento', 'recebida', 'aprovada', 'rejeitada', 'cancelada')),
  observacoes TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, numero_cotacao)
);

-- Tabela de Itens da Cotação
CREATE TABLE IF NOT EXISTS quotation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id UUID NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
  descricao VARCHAR(255) NOT NULL,
  quantidade DECIMAL(15,3) NOT NULL,
  unidade_medida VARCHAR(50),
  especificacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Respostas de Fornecedores
CREATE TABLE IF NOT EXISTS quotation_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id UUID NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  data_resposta DATE,
  prazo_entrega_dias INTEGER,
  condicoes_pagamento TEXT,
  validade_proposta_dias INTEGER,
  observacoes TEXT,
  status VARCHAR(50) DEFAULT 'pendente' CHECK (status IN ('pendente', 'enviada', 'aprovada', 'rejeitada')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(quotation_id, supplier_id)
);

-- Tabela de Itens da Resposta
CREATE TABLE IF NOT EXISTS quotation_response_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id UUID NOT NULL REFERENCES quotation_responses(id) ON DELETE CASCADE,
  quotation_item_id UUID NOT NULL REFERENCES quotation_items(id) ON DELETE CASCADE,
  preco_unitario DECIMAL(15,2) NOT NULL,
  preco_total DECIMAL(15,2) NOT NULL,
  marca VARCHAR(100),
  modelo VARCHAR(100),
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_suppliers_organization ON suppliers(organization_id);
CREATE INDEX idx_suppliers_cnpj ON suppliers(cnpj);
CREATE INDEX idx_supplier_products_supplier ON supplier_products(supplier_id);
CREATE INDEX idx_quotations_organization ON quotations(organization_id);
CREATE INDEX idx_quotations_edital ON quotations(edital_id);
CREATE INDEX idx_quotation_items_quotation ON quotation_items(quotation_id);
CREATE INDEX idx_quotation_responses_quotation ON quotation_responses(quotation_id);
CREATE INDEX idx_quotation_responses_supplier ON quotation_responses(supplier_id);
CREATE INDEX idx_quotation_response_items_response ON quotation_response_items(response_id);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_supplier_products_updated_at BEFORE UPDATE ON supplier_products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotations_updated_at BEFORE UPDATE ON quotations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotation_items_updated_at BEFORE UPDATE ON quotation_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotation_responses_updated_at BEFORE UPDATE ON quotation_responses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotation_response_items_updated_at BEFORE UPDATE ON quotation_response_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_response_items ENABLE ROW LEVEL SECURITY;

-- Policies para suppliers
CREATE POLICY "Users can view suppliers from their organization"
  ON suppliers FOR SELECT
  USING (organization_id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can insert suppliers in their organization"
  ON suppliers FOR INSERT
  WITH CHECK (organization_id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update suppliers in their organization"
  ON suppliers FOR UPDATE
  USING (organization_id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can delete suppliers in their organization"
  ON suppliers FOR DELETE
  USING (organization_id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid()));

-- Policies similares para outras tabelas
CREATE POLICY "Users can view supplier products" ON supplier_products FOR SELECT
  USING (supplier_id IN (SELECT id FROM suppliers WHERE organization_id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid())));

CREATE POLICY "Users can manage supplier products" ON supplier_products FOR ALL
  USING (supplier_id IN (SELECT id FROM suppliers WHERE organization_id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid())));

CREATE POLICY "Users can view quotations from their organization" ON quotations FOR SELECT
  USING (organization_id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can manage quotations in their organization" ON quotations FOR ALL
  USING (organization_id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can view quotation items" ON quotation_items FOR SELECT
  USING (quotation_id IN (SELECT id FROM quotations WHERE organization_id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid())));

CREATE POLICY "Users can manage quotation items" ON quotation_items FOR ALL
  USING (quotation_id IN (SELECT id FROM quotations WHERE organization_id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid())));

CREATE POLICY "Users can view quotation responses" ON quotation_responses FOR SELECT
  USING (quotation_id IN (SELECT id FROM quotations WHERE organization_id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid())));

CREATE POLICY "Users can manage quotation responses" ON quotation_responses FOR ALL
  USING (quotation_id IN (SELECT id FROM quotations WHERE organization_id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid())));

CREATE POLICY "Users can view response items" ON quotation_response_items FOR SELECT
  USING (response_id IN (SELECT id FROM quotation_responses WHERE quotation_id IN (SELECT id FROM quotations WHERE organization_id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid()))));

CREATE POLICY "Users can manage response items" ON quotation_response_items FOR ALL
  USING (response_id IN (SELECT id FROM quotation_responses WHERE quotation_id IN (SELECT id FROM quotations WHERE organization_id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid()))));
