-- Tabela de Portais de Licitação
CREATE TABLE IF NOT EXISTS bidding_portals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  nome_portal VARCHAR(255) NOT NULL,
  url VARCHAR(500),
  tipo VARCHAR(50) CHECK (tipo IN ('federal', 'estadual', 'municipal', 'privado', 'outros')),
  usuario VARCHAR(255),
  senha_encrypted TEXT, -- Armazenar senha criptografada
  email_acesso VARCHAR(255),
  certificado_digital BOOLEAN DEFAULT false,
  data_cadastro DATE,
  data_ultima_atualizacao DATE,
  data_validade_acesso DATE,
  status VARCHAR(50) DEFAULT 'ativo' CHECK (status IN ('ativo', 'vencido', 'pendente_renovacao', 'inativo')),
  observacoes TEXT,
  responsavel_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  alerta_vencimento_dias INTEGER DEFAULT 30, -- Alertar X dias antes do vencimento
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Histórico de Acessos aos Portais
CREATE TABLE IF NOT EXISTS portal_access_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portal_id UUID NOT NULL REFERENCES bidding_portals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  data_acesso TIMESTAMPTZ DEFAULT NOW(),
  tipo_acao VARCHAR(50) CHECK (tipo_acao IN ('login', 'consulta', 'download', 'atualizacao_cadastro', 'renovacao')),
  sucesso BOOLEAN DEFAULT true,
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Documentos Necessários por Portal
CREATE TABLE IF NOT EXISTS portal_required_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portal_id UUID NOT NULL REFERENCES bidding_portals(id) ON DELETE CASCADE,
  nome_documento VARCHAR(255) NOT NULL,
  tipo_documento VARCHAR(100),
  obrigatorio BOOLEAN DEFAULT true,
  data_validade DATE,
  status VARCHAR(50) DEFAULT 'pendente' CHECK (status IN ('pendente', 'enviado', 'aprovado', 'vencido', 'rejeitado')),
  document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_bidding_portals_organization ON bidding_portals(organization_id);
CREATE INDEX idx_bidding_portals_status ON bidding_portals(status);
CREATE INDEX idx_bidding_portals_validade ON bidding_portals(data_validade_acesso);
CREATE INDEX idx_portal_access_history_portal ON portal_access_history(portal_id);
CREATE INDEX idx_portal_access_history_user ON portal_access_history(user_id);
CREATE INDEX idx_portal_required_documents_portal ON portal_required_documents(portal_id);

-- Triggers
CREATE TRIGGER update_bidding_portals_updated_at BEFORE UPDATE ON bidding_portals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portal_required_documents_updated_at BEFORE UPDATE ON portal_required_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function para atualizar status baseado na data de validade
CREATE OR REPLACE FUNCTION update_portal_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.data_validade_acesso IS NOT NULL THEN
    IF NEW.data_validade_acesso < CURRENT_DATE THEN
      NEW.status = 'vencido';
    ELSIF NEW.data_validade_acesso <= CURRENT_DATE + INTERVAL '1 day' * NEW.alerta_vencimento_dias THEN
      NEW.status = 'pendente_renovacao';
    ELSE
      NEW.status = 'ativo';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_portal_status BEFORE INSERT OR UPDATE ON bidding_portals
  FOR EACH ROW EXECUTE FUNCTION update_portal_status();

-- RLS Policies
ALTER TABLE bidding_portals ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_access_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_required_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view portals from their organization"
  ON bidding_portals FOR SELECT
  USING (organization_id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can manage portals in their organization"
  ON bidding_portals FOR ALL
  USING (organization_id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can view portal access history"
  ON portal_access_history FOR SELECT
  USING (portal_id IN (SELECT id FROM bidding_portals WHERE organization_id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid())));

CREATE POLICY "Users can insert portal access history"
  ON portal_access_history FOR INSERT
  WITH CHECK (portal_id IN (SELECT id FROM bidding_portals WHERE organization_id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid())));

CREATE POLICY "Users can view portal documents"
  ON portal_required_documents FOR SELECT
  USING (portal_id IN (SELECT id FROM bidding_portals WHERE organization_id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid())));

CREATE POLICY "Users can manage portal documents"
  ON portal_required_documents FOR ALL
  USING (portal_id IN (SELECT id FROM bidding_portals WHERE organization_id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid())));
