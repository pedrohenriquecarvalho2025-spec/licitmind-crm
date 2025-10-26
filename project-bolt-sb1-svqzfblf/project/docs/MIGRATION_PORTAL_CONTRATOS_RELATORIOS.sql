-- ============================================
-- MIGRATION: PORTAL + CONTRATOS + RELATÓRIOS + USUÁRIOS
-- ============================================

-- ============================================
-- 1. PORTAL DE GESTÃO
-- ============================================

-- Tabela de Portais Externos
CREATE TABLE IF NOT EXISTS external_portals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Informações do Portal
  nome TEXT NOT NULL,
  url TEXT NOT NULL,
  login_usuario TEXT NOT NULL,
  senha_criptografada TEXT NOT NULL, -- Usar pgcrypto
  
  -- Datas
  data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_ultimo_acesso TIMESTAMP,
  
  -- Metadata
  observacoes TEXT,
  ativo BOOLEAN DEFAULT TRUE,
  
  -- Audit
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. CONTRATOS E EMPENHOS
-- ============================================

-- Tabela de Contratos
CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Informações do Contrato
  numero_contrato TEXT NOT NULL,
  edital_id UUID REFERENCES editals(id) ON DELETE SET NULL,
  orgao_contratante TEXT NOT NULL,
  objeto TEXT NOT NULL,
  
  -- Valores
  valor_contrato DECIMAL(15,2) NOT NULL,
  
  -- Datas
  data_assinatura DATE NOT NULL,
  data_inicio_vigencia DATE NOT NULL,
  data_termino_vigencia DATE NOT NULL,
  
  -- Status
  status TEXT DEFAULT 'vigente', -- vigente, vencendo, vencido, rescindido
  dias_para_vencer INTEGER,
  
  -- Documentos
  contrato_pdf_url TEXT,
  
  -- Observações
  observacoes TEXT,
  
  -- Alertas
  alerta_90_dias BOOLEAN DEFAULT FALSE,
  alerta_60_dias BOOLEAN DEFAULT FALSE,
  alerta_30_dias BOOLEAN DEFAULT FALSE,
  alerta_15_dias BOOLEAN DEFAULT FALSE,
  alerta_7_dias BOOLEAN DEFAULT FALSE,
  
  -- Audit
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Empenhos
CREATE TABLE IF NOT EXISTS commitments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  
  -- Informações do Empenho
  numero_empenho TEXT NOT NULL,
  valor_empenhado DECIMAL(15,2) NOT NULL,
  data_empenho DATE NOT NULL,
  tipo TEXT NOT NULL, -- ordinario, global, estimativo
  
  -- Observações
  observacoes TEXT,
  
  -- Audit
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Previsão Financeira
CREATE TABLE IF NOT EXISTS financial_forecast (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  
  -- Previsão
  mes_referencia DATE NOT NULL,
  valor_previsto DECIMAL(15,2) NOT NULL,
  valor_realizado DECIMAL(15,2),
  
  -- Status
  status TEXT DEFAULT 'previsto', -- previsto, realizado, atrasado
  
  -- Observações
  observacoes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. RELATÓRIOS E KPIs
-- ============================================

-- Tabela de KPIs Calculados (Cache)
CREATE TABLE IF NOT EXISTS kpi_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Período
  periodo_inicio DATE NOT NULL,
  periodo_fim DATE NOT NULL,
  
  -- KPIs Gerais
  total_editais INTEGER DEFAULT 0,
  total_participacoes INTEGER DEFAULT 0,
  total_vitorias INTEGER DEFAULT 0,
  taxa_conversao DECIMAL(5,2) DEFAULT 0,
  valor_total_disputado DECIMAL(15,2) DEFAULT 0,
  valor_total_ganho DECIMAL(15,2) DEFAULT 0,
  valor_medio_edital DECIMAL(15,2) DEFAULT 0,
  
  -- Breakdown
  por_orgao JSONB DEFAULT '{}'::jsonb,
  por_modalidade JSONB DEFAULT '{}'::jsonb,
  por_status JSONB DEFAULT '{}'::jsonb,
  por_analista JSONB DEFAULT '{}'::jsonb,
  
  -- Evolução Temporal
  evolucao_temporal JSONB DEFAULT '[]'::jsonb,
  
  -- Cache
  calculado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valido_ate TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Performance de Analistas
CREATE TABLE IF NOT EXISTS analyst_performance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Período
  periodo_inicio DATE NOT NULL,
  periodo_fim DATE NOT NULL,
  
  -- Métricas
  editais_cadastrados INTEGER DEFAULT 0,
  editais_ganhos INTEGER DEFAULT 0,
  taxa_vitoria DECIMAL(5,2) DEFAULT 0,
  valor_total_ganho DECIMAL(15,2) DEFAULT 0,
  tempo_medio_por_etapa INTERVAL,
  
  -- Breakdown por Etapa
  tempo_por_etapa JSONB DEFAULT '{}'::jsonb,
  
  -- Cache
  calculado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(organization_id, user_id, periodo_inicio, periodo_fim)
);

-- ============================================
-- 4. GESTÃO DE USUÁRIOS E PERMISSÕES
-- ============================================

-- Atualizar tabela profiles com novos campos
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS foto_perfil_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS telefone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferencias JSONB DEFAULT '{
  "idioma": "pt-BR",
  "fuso_horario": "America/Sao_Paulo",
  "formato_data": "DD/MM/YYYY",
  "formato_moeda": "BRL",
  "tema": "light",
  "notificacoes": {
    "email": true,
    "push": true,
    "sms": false
  }
}'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ativo BOOLEAN DEFAULT TRUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ultimo_acesso TIMESTAMP;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS convite_aceito BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS convite_token TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS convite_expira_em TIMESTAMP;

-- Tabela de Histórico de Acessos
CREATE TABLE IF NOT EXISTS access_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Informações do Acesso
  ip_address TEXT,
  user_agent TEXT,
  acao TEXT, -- login, logout, view, create, update, delete
  recurso TEXT, -- editals, documents, etc
  recurso_id UUID,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Permissões Customizadas
CREATE TABLE IF NOT EXISTS custom_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Permissões
  recurso TEXT NOT NULL, -- editals, documents, suppliers, etc
  pode_criar BOOLEAN DEFAULT FALSE,
  pode_ler BOOLEAN DEFAULT TRUE,
  pode_atualizar BOOLEAN DEFAULT FALSE,
  pode_deletar BOOLEAN DEFAULT FALSE,
  
  -- Filtros
  filtros JSONB DEFAULT '{}'::jsonb, -- ex: {"edital_ids": ["uuid1", "uuid2"]}
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 5. CONFIGURAÇÕES E INTEGRAÇÕES
-- ============================================

-- Tabela de Configurações da Organização
CREATE TABLE IF NOT EXISTS organization_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Segmento
  segmento TEXT, -- engenharia, limpeza, ti, alimentos, etc
  
  -- Integrações
  google_drive_enabled BOOLEAN DEFAULT FALSE,
  google_drive_folder_id TEXT,
  google_drive_refresh_token TEXT,
  
  google_calendar_enabled BOOLEAN DEFAULT FALSE,
  google_calendar_id TEXT,
  google_calendar_refresh_token TEXT,
  
  -- OCR
  ocr_provider TEXT, -- tesseract, google_vision, ocr_space
  ocr_api_key TEXT,
  ocr_config JSONB DEFAULT '{}'::jsonb,
  
  -- E-mail
  smtp_host TEXT,
  smtp_port INTEGER,
  smtp_user TEXT,
  smtp_password TEXT,
  smtp_from TEXT,
  
  -- ERP
  erp_enabled BOOLEAN DEFAULT FALSE,
  erp_type TEXT, -- sap, totvs, oracle, senior, custom
  erp_endpoint TEXT,
  erp_api_key TEXT,
  erp_field_mapping JSONB DEFAULT '{}'::jsonb,
  
  -- Webhooks
  webhooks JSONB DEFAULT '[]'::jsonb,
  
  -- Campos Customizados por Segmento
  campos_customizados JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(organization_id)
);

-- Tabela de API Keys
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Informações da Key
  nome TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  key_prefix TEXT NOT NULL, -- Primeiros 8 caracteres para identificação
  
  -- Permissões
  permissoes JSONB DEFAULT '{}'::jsonb,
  
  -- Status
  ativa BOOLEAN DEFAULT TRUE,
  expira_em TIMESTAMP,
  
  -- Uso
  ultimo_uso TIMESTAMP,
  total_requisicoes INTEGER DEFAULT 0,
  
  -- Audit
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  revogada_em TIMESTAMP,
  revogada_por UUID REFERENCES profiles(id)
);

-- Tabela de Logs de Webhooks
CREATE TABLE IF NOT EXISTS webhook_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Informações do Webhook
  evento TEXT NOT NULL, -- edital_criado, contrato_vencendo, etc
  url TEXT NOT NULL,
  
  -- Request
  payload JSONB NOT NULL,
  headers JSONB,
  
  -- Response
  status_code INTEGER,
  response_body TEXT,
  
  -- Status
  sucesso BOOLEAN DEFAULT FALSE,
  tentativas INTEGER DEFAULT 1,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================

-- External Portals
CREATE INDEX IF NOT EXISTS idx_external_portals_org ON external_portals(organization_id);
CREATE INDEX IF NOT EXISTS idx_external_portals_ativo ON external_portals(ativo);

-- Contracts
CREATE INDEX IF NOT EXISTS idx_contracts_org ON contracts(organization_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);
CREATE INDEX IF NOT EXISTS idx_contracts_vigencia ON contracts(data_termino_vigencia);
CREATE INDEX IF NOT EXISTS idx_contracts_edital ON contracts(edital_id);

-- Commitments
CREATE INDEX IF NOT EXISTS idx_commitments_contract ON commitments(contract_id);
CREATE INDEX IF NOT EXISTS idx_commitments_data ON commitments(data_empenho);

-- Financial Forecast
CREATE INDEX IF NOT EXISTS idx_financial_forecast_contract ON financial_forecast(contract_id);
CREATE INDEX IF NOT EXISTS idx_financial_forecast_mes ON financial_forecast(mes_referencia);

-- KPI Cache
CREATE INDEX IF NOT EXISTS idx_kpi_cache_org ON kpi_cache(organization_id);
CREATE INDEX IF NOT EXISTS idx_kpi_cache_periodo ON kpi_cache(periodo_inicio, periodo_fim);

-- Analyst Performance
CREATE INDEX IF NOT EXISTS idx_analyst_performance_user ON analyst_performance(user_id);
CREATE INDEX IF NOT EXISTS idx_analyst_performance_periodo ON analyst_performance(periodo_inicio, periodo_fim);

-- Access Logs
CREATE INDEX IF NOT EXISTS idx_access_logs_user ON access_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_access_logs_created ON access_logs(created_at DESC);

-- API Keys
CREATE INDEX IF NOT EXISTS idx_api_keys_org ON api_keys(organization_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_ativa ON api_keys(ativa);

-- ============================================
-- RLS POLICIES
-- ============================================

-- External Portals
ALTER TABLE external_portals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view portals from their organization"
  ON external_portals FOR SELECT
  USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can manage portals"
  ON external_portals FOR ALL
  USING (organization_id IN (
    SELECT organization_id FROM profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'gestor')
  ));

-- Contracts
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view contracts from their organization"
  ON contracts FOR SELECT
  USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can manage contracts in their organization"
  ON contracts FOR ALL
  USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- Commitments
ALTER TABLE commitments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view commitments from their organization"
  ON commitments FOR SELECT
  USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can manage commitments in their organization"
  ON commitments FOR ALL
  USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- Financial Forecast
ALTER TABLE financial_forecast ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view forecast from their organization"
  ON financial_forecast FOR SELECT
  USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can manage forecast"
  ON financial_forecast FOR ALL
  USING (organization_id IN (
    SELECT organization_id FROM profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'gestor')
  ));

-- KPI Cache
ALTER TABLE kpi_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view KPIs from their organization"
  ON kpi_cache FOR SELECT
  USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- Analyst Performance
ALTER TABLE analyst_performance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own performance"
  ON analyst_performance FOR SELECT
  USING (
    user_id = auth.uid() OR
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'gestor')
    )
  );

-- Access Logs
ALTER TABLE access_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own access logs"
  ON access_logs FOR SELECT
  USING (
    user_id = auth.uid() OR
    user_id IN (
      SELECT id FROM profiles 
      WHERE organization_id IN (
        SELECT organization_id FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
      )
    )
  );

-- Organization Settings
ALTER TABLE organization_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view settings from their organization"
  ON organization_settings FOR SELECT
  USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can manage settings"
  ON organization_settings FOR ALL
  USING (organization_id IN (
    SELECT organization_id FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- API Keys
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage API keys"
  ON api_keys FOR ALL
  USING (organization_id IN (
    SELECT organization_id FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- ============================================
-- TRIGGERS
-- ============================================

-- Atualizar status de contrato baseado na vigência
CREATE OR REPLACE FUNCTION update_contract_status()
RETURNS TRIGGER AS $$
BEGIN
  NEW.dias_para_vencer = (NEW.data_termino_vigencia - CURRENT_DATE);
  
  IF NEW.dias_para_vencer < 0 THEN
    NEW.status = 'vencido';
  ELSIF NEW.dias_para_vencer <= 90 THEN
    NEW.status = 'vencendo';
  ELSE
    NEW.status = 'vigente';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_contract_status_trigger
  BEFORE INSERT OR UPDATE ON contracts
  FOR EACH ROW
  EXECUTE FUNCTION update_contract_status();

-- Registrar acesso do usuário
CREATE OR REPLACE FUNCTION log_user_access()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET ultimo_acesso = NOW()
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_user_access_trigger
  AFTER INSERT ON access_logs
  FOR EACH ROW
  EXECUTE FUNCTION log_user_access();

-- Triggers para updated_at
CREATE TRIGGER update_external_portals_updated_at
  BEFORE UPDATE ON external_portals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contracts_updated_at
  BEFORE UPDATE ON contracts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_commitments_updated_at
  BEFORE UPDATE ON commitments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organization_settings_updated_at
  BEFORE UPDATE ON organization_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNÇÕES ÚTEIS
-- ============================================

-- Função para calcular KPIs
CREATE OR REPLACE FUNCTION calculate_kpis(
  org_id UUID,
  start_date DATE,
  end_date DATE
)
RETURNS TABLE (
  total_editais BIGINT,
  total_participacoes BIGINT,
  total_vitorias BIGINT,
  taxa_conversao DECIMAL,
  valor_total_disputado DECIMAL,
  valor_total_ganho DECIMAL,
  valor_medio_edital DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_editais,
    COUNT(*) FILTER (WHERE status IN ('proposta_enviada', 'em_julgamento', 'homologado', 'perdido'))::BIGINT as total_participacoes,
    COUNT(*) FILTER (WHERE status = 'homologado')::BIGINT as total_vitorias,
    CASE 
      WHEN COUNT(*) FILTER (WHERE status IN ('proposta_enviada', 'em_julgamento', 'homologado', 'perdido')) > 0 
      THEN (COUNT(*) FILTER (WHERE status = 'homologado')::DECIMAL / COUNT(*) FILTER (WHERE status IN ('proposta_enviada', 'em_julgamento', 'homologado', 'perdido')) * 100)
      ELSE 0 
    END as taxa_conversao,
    COALESCE(SUM(valor_estimado) FILTER (WHERE status IN ('proposta_enviada', 'em_julgamento', 'homologado', 'perdido')), 0) as valor_total_disputado,
    COALESCE(SUM(valor_estimado) FILTER (WHERE status = 'homologado'), 0) as valor_total_ganho,
    COALESCE(AVG(valor_estimado), 0) as valor_medio_edital
  FROM editals
  WHERE organization_id = org_id
    AND created_at BETWEEN start_date AND end_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para obter contratos vencendo
CREATE OR REPLACE FUNCTION get_expiring_contracts(
  org_id UUID,
  days_ahead INTEGER DEFAULT 90
)
RETURNS TABLE (
  id UUID,
  numero_contrato TEXT,
  orgao_contratante TEXT,
  valor_contrato DECIMAL,
  data_termino_vigencia DATE,
  dias_para_vencer INTEGER,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.numero_contrato,
    c.orgao_contratante,
    c.valor_contrato,
    c.data_termino_vigencia,
    c.dias_para_vencer,
    c.status
  FROM contracts c
  WHERE c.organization_id = org_id
    AND c.dias_para_vencer <= days_ahead
    AND c.dias_para_vencer >= 0
    AND c.status != 'rescindido'
  ORDER BY c.dias_para_vencer ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para calcular previsão financeira
CREATE OR REPLACE FUNCTION calculate_financial_forecast(
  org_id UUID,
  months_ahead INTEGER DEFAULT 12
)
RETURNS TABLE (
  mes DATE,
  valor_previsto DECIMAL,
  valor_realizado DECIMAL,
  contratos_ativos INTEGER
) AS $$
BEGIN
  RETURN QUERY
  WITH meses AS (
    SELECT generate_series(
      DATE_TRUNC('month', CURRENT_DATE),
      DATE_TRUNC('month', CURRENT_DATE) + (months_ahead || ' months')::INTERVAL,
      '1 month'::INTERVAL
    )::DATE as mes
  )
  SELECT 
    m.mes,
    COALESCE(SUM(ff.valor_previsto), 0) as valor_previsto,
    COALESCE(SUM(ff.valor_realizado), 0) as valor_realizado,
    COUNT(DISTINCT c.id)::INTEGER as contratos_ativos
  FROM meses m
  LEFT JOIN financial_forecast ff ON DATE_TRUNC('month', ff.mes_referencia) = m.mes
    AND ff.organization_id = org_id
  LEFT JOIN contracts c ON c.id = ff.contract_id
    AND c.data_inicio_vigencia <= m.mes
    AND c.data_termino_vigencia >= m.mes
    AND c.status = 'vigente'
  GROUP BY m.mes
  ORDER BY m.mes;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para criptografar senha de portal
CREATE OR REPLACE FUNCTION encrypt_portal_password(password TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN encode(digest(password, 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para gerar API Key
CREATE OR REPLACE FUNCTION generate_api_key()
RETURNS TEXT AS $$
DECLARE
  key TEXT;
BEGIN
  key := 'lm_' || encode(gen_random_bytes(32), 'hex');
  RETURN key;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
