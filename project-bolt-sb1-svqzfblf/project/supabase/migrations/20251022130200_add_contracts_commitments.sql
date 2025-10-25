-- Tabela de Contratos
CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  edital_id UUID REFERENCES editals(id) ON DELETE SET NULL,
  numero_contrato VARCHAR(100) NOT NULL,
  objeto TEXT NOT NULL,
  contratante VARCHAR(255) NOT NULL,
  valor_total DECIMAL(15,2) NOT NULL,
  data_assinatura DATE NOT NULL,
  data_inicio_vigencia DATE NOT NULL,
  data_fim_vigencia DATE NOT NULL,
  prazo_execucao_dias INTEGER,
  status VARCHAR(50) DEFAULT 'ativo' CHECK (status IN ('em_elaboracao', 'ativo', 'suspenso', 'encerrado', 'rescindido')),
  tipo_contrato VARCHAR(50) CHECK (tipo_contrato IN ('fornecimento', 'servico', 'obra', 'concessao', 'outros')),
  modalidade_pagamento VARCHAR(50),
  garantia_contratual DECIMAL(15,2),
  tipo_garantia VARCHAR(50) CHECK (tipo_garantia IN ('caucao', 'seguro_garantia', 'fianca_bancaria', 'nenhuma')),
  observacoes TEXT,
  arquivo_url TEXT,
  arquivo_nome VARCHAR(255),
  responsavel_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, numero_contrato)
);

-- Tabela de Aditivos de Contrato
CREATE TABLE IF NOT EXISTS contract_amendments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  numero_aditivo VARCHAR(50) NOT NULL,
  tipo VARCHAR(50) CHECK (tipo IN ('prazo', 'valor', 'escopo', 'misto')),
  data_aditivo DATE NOT NULL,
  valor_aditado DECIMAL(15,2),
  prazo_adicional_dias INTEGER,
  descricao TEXT NOT NULL,
  justificativa TEXT,
  arquivo_url TEXT,
  arquivo_nome VARCHAR(255),
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Empenhos
CREATE TABLE IF NOT EXISTS commitments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  contract_id UUID REFERENCES contracts(id) ON DELETE SET NULL,
  numero_empenho VARCHAR(100) NOT NULL,
  tipo_empenho VARCHAR(50) CHECK (tipo_empenho IN ('ordinario', 'estimativo', 'global')),
  data_empenho DATE NOT NULL,
  valor_empenhado DECIMAL(15,2) NOT NULL,
  valor_liquidado DECIMAL(15,2) DEFAULT 0,
  valor_pago DECIMAL(15,2) DEFAULT 0,
  saldo DECIMAL(15,2) GENERATED ALWAYS AS (valor_empenhado - valor_pago) STORED,
  dotacao_orcamentaria VARCHAR(100),
  fonte_recurso VARCHAR(100),
  status VARCHAR(50) DEFAULT 'empenhado' CHECK (status IN ('empenhado', 'liquidado', 'pago', 'cancelado', 'anulado')),
  observacoes TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, numero_empenho)
);

-- Tabela de Medições/Faturas
CREATE TABLE IF NOT EXISTS contract_measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  commitment_id UUID REFERENCES commitments(id) ON DELETE SET NULL,
  numero_medicao VARCHAR(50) NOT NULL,
  periodo_inicio DATE NOT NULL,
  periodo_fim DATE NOT NULL,
  data_medicao DATE NOT NULL,
  valor_medicao DECIMAL(15,2) NOT NULL,
  percentual_executado DECIMAL(5,2),
  status VARCHAR(50) DEFAULT 'em_analise' CHECK (status IN ('em_analise', 'aprovada', 'rejeitada', 'paga')),
  data_aprovacao DATE,
  data_pagamento DATE,
  observacoes TEXT,
  arquivo_url TEXT,
  arquivo_nome VARCHAR(255),
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Previsão de Receitas
CREATE TABLE IF NOT EXISTS revenue_forecast (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  mes_referencia DATE NOT NULL,
  valor_previsto DECIMAL(15,2) NOT NULL,
  valor_realizado DECIMAL(15,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'previsto' CHECK (status IN ('previsto', 'realizado', 'cancelado')),
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_contracts_organization ON contracts(organization_id);
CREATE INDEX idx_contracts_edital ON contracts(edital_id);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_vigencia ON contracts(data_fim_vigencia);
CREATE INDEX idx_contract_amendments_contract ON contract_amendments(contract_id);
CREATE INDEX idx_commitments_organization ON commitments(organization_id);
CREATE INDEX idx_commitments_contract ON commitments(contract_id);
CREATE INDEX idx_commitments_status ON commitments(status);
CREATE INDEX idx_contract_measurements_contract ON contract_measurements(contract_id);
CREATE INDEX idx_contract_measurements_commitment ON contract_measurements(commitment_id);
CREATE INDEX idx_revenue_forecast_organization ON revenue_forecast(organization_id);
CREATE INDEX idx_revenue_forecast_contract ON revenue_forecast(contract_id);
CREATE INDEX idx_revenue_forecast_mes ON revenue_forecast(mes_referencia);

-- Triggers
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contract_amendments_updated_at BEFORE UPDATE ON contract_amendments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_commitments_updated_at BEFORE UPDATE ON commitments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contract_measurements_updated_at BEFORE UPDATE ON contract_measurements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_revenue_forecast_updated_at BEFORE UPDATE ON revenue_forecast
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function para atualizar status do contrato baseado na vigência
CREATE OR REPLACE FUNCTION update_contract_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.data_fim_vigencia < CURRENT_DATE AND NEW.status = 'ativo' THEN
    NEW.status = 'encerrado';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_contract_status BEFORE INSERT OR UPDATE ON contracts
  FOR EACH ROW EXECUTE FUNCTION update_contract_status();

-- RLS Policies
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_amendments ENABLE ROW LEVEL SECURITY;
ALTER TABLE commitments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_forecast ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view contracts from their organization"
  ON contracts FOR SELECT
  USING (organization_id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can manage contracts in their organization"
  ON contracts FOR ALL
  USING (organization_id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can view contract amendments"
  ON contract_amendments FOR SELECT
  USING (contract_id IN (SELECT id FROM contracts WHERE organization_id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid())));

CREATE POLICY "Users can manage contract amendments"
  ON contract_amendments FOR ALL
  USING (contract_id IN (SELECT id FROM contracts WHERE organization_id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid())));

CREATE POLICY "Users can view commitments from their organization"
  ON commitments FOR SELECT
  USING (organization_id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can manage commitments in their organization"
  ON commitments FOR ALL
  USING (organization_id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can view contract measurements"
  ON contract_measurements FOR SELECT
  USING (contract_id IN (SELECT id FROM contracts WHERE organization_id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid())));

CREATE POLICY "Users can manage contract measurements"
  ON contract_measurements FOR ALL
  USING (contract_id IN (SELECT id FROM contracts WHERE organization_id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid())));

CREATE POLICY "Users can view revenue forecast from their organization"
  ON revenue_forecast FOR SELECT
  USING (organization_id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can manage revenue forecast in their organization"
  ON revenue_forecast FOR ALL
  USING (organization_id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid()));
