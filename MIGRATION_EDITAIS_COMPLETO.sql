-- Migration Completa para Sistema de Gestão de Editais

-- ============================================
-- 1. TABELA DE EDITAIS (Atualizada)
-- ============================================
CREATE TABLE IF NOT EXISTS editals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Campos Essenciais
  numero_edital TEXT NOT NULL,
  orgao_entidade TEXT NOT NULL,
  orgao_cnpj TEXT,
  objeto TEXT NOT NULL,
  modalidade TEXT NOT NULL,
  data_publicacao DATE,
  data_abertura TIMESTAMP,
  valor_estimado DECIMAL(15,2),
  status TEXT NOT NULL DEFAULT 'prospectado',
  responsavel_id UUID REFERENCES profiles(id),
  observacoes TEXT,
  necessita_visita_tecnica BOOLEAN DEFAULT FALSE,
  
  -- Documentos
  documentos JSONB DEFAULT '[]'::jsonb,
  google_drive_link TEXT,
  
  -- OCR e IA
  ocr_processado BOOLEAN DEFAULT FALSE,
  ocr_data JSONB,
  analise_ia JSONB,
  
  -- Campos Personalizados
  campos_customizados JSONB DEFAULT '{}'::jsonb,
  segmento TEXT,
  
  -- Metadata
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Kanban
  kanban_position INTEGER DEFAULT 0,
  tempo_na_etapa INTERVAL,
  data_mudanca_status TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. TABELA DE ITENS DO EDITAL
-- ============================================
CREATE TABLE IF NOT EXISTS edital_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  edital_id UUID NOT NULL REFERENCES editals(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  quantidade DECIMAL(15,3) NOT NULL,
  unidade_medida TEXT NOT NULL,
  valor_unitario DECIMAL(15,2),
  valor_total DECIMAL(15,2),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. TABELA DE ANOTAÇÕES COLABORATIVAS
-- ============================================
CREATE TABLE IF NOT EXISTS edital_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  edital_id UUID NOT NULL REFERENCES editals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. TABELA DE HISTÓRICO DE ALTERAÇÕES
-- ============================================
CREATE TABLE IF NOT EXISTS edital_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  edital_id UUID NOT NULL REFERENCES editals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id),
  action TEXT NOT NULL,
  field_changed TEXT,
  old_value TEXT,
  new_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 5. TABELA DE PARTICIPANTES DO EDITAL
-- ============================================
CREATE TABLE IF NOT EXISTS edital_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  edital_id UUID NOT NULL REFERENCES editals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'viewer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(edital_id, user_id)
);

-- ============================================
-- 6. TABELA DE CONFIGURAÇÕES DE PIPELINE
-- ============================================
CREATE TABLE IF NOT EXISTS pipeline_stages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  position INTEGER NOT NULL,
  is_final BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 7. TABELA DE CAMPOS CUSTOMIZADOS
-- ============================================
CREATE TABLE IF NOT EXISTS custom_fields (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  field_type TEXT NOT NULL,
  field_options JSONB,
  segmento TEXT,
  required BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_editals_org ON editals(organization_id);
CREATE INDEX IF NOT EXISTS idx_editals_status ON editals(status);
CREATE INDEX IF NOT EXISTS idx_editals_responsavel ON editals(responsavel_id);
CREATE INDEX IF NOT EXISTS idx_editals_data_abertura ON editals(data_abertura);
CREATE INDEX IF NOT EXISTS idx_editals_created_at ON editals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_edital_items_edital ON edital_items(edital_id);
CREATE INDEX IF NOT EXISTS idx_edital_notes_edital ON edital_notes(edital_id);
CREATE INDEX IF NOT EXISTS idx_edital_history_edital ON edital_history(edital_id);
CREATE INDEX IF NOT EXISTS idx_edital_participants_edital ON edital_participants(edital_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_stages_org ON pipeline_stages(organization_id);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_editals_search ON editals USING gin(to_tsvector('portuguese', 
  coalesce(numero_edital, '') || ' ' || 
  coalesce(orgao_entidade, '') || ' ' || 
  coalesce(objeto, '')
));

-- ============================================
-- RLS POLICIES - EDITALS
-- ============================================
ALTER TABLE editals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view editals from their organization"
  ON editals FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create editals in their organization"
  ON editals FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update editals in their organization"
  ON editals FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete editals in their organization"
  ON editals FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

-- ============================================
-- RLS POLICIES - EDITAL ITEMS
-- ============================================
ALTER TABLE edital_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view items from their organization editals"
  ON edital_items FOR SELECT
  USING (
    edital_id IN (
      SELECT id FROM editals WHERE organization_id IN (
        SELECT organization_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can manage items from their organization editals"
  ON edital_items FOR ALL
  USING (
    edital_id IN (
      SELECT id FROM editals WHERE organization_id IN (
        SELECT organization_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

-- ============================================
-- RLS POLICIES - EDITAL NOTES
-- ============================================
ALTER TABLE edital_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view notes from their organization editals"
  ON edital_notes FOR SELECT
  USING (
    edital_id IN (
      SELECT id FROM editals WHERE organization_id IN (
        SELECT organization_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can manage notes from their organization editals"
  ON edital_notes FOR ALL
  USING (
    edital_id IN (
      SELECT id FROM editals WHERE organization_id IN (
        SELECT organization_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

-- ============================================
-- RLS POLICIES - EDITAL HISTORY
-- ============================================
ALTER TABLE edital_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view history from their organization editals"
  ON edital_history FOR SELECT
  USING (
    edital_id IN (
      SELECT id FROM editals WHERE organization_id IN (
        SELECT organization_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

-- ============================================
-- RLS POLICIES - EDITAL PARTICIPANTS
-- ============================================
ALTER TABLE edital_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view participants from their organization editals"
  ON edital_participants FOR SELECT
  USING (
    edital_id IN (
      SELECT id FROM editals WHERE organization_id IN (
        SELECT organization_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can manage participants from their organization editals"
  ON edital_participants FOR ALL
  USING (
    edital_id IN (
      SELECT id FROM editals WHERE organization_id IN (
        SELECT organization_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

-- ============================================
-- RLS POLICIES - PIPELINE STAGES
-- ============================================
ALTER TABLE pipeline_stages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view pipeline stages from their organization"
  ON pipeline_stages FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage pipeline stages"
  ON pipeline_stages FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'gestor')
    )
  );

-- ============================================
-- RLS POLICIES - CUSTOM FIELDS
-- ============================================
ALTER TABLE custom_fields ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view custom fields from their organization"
  ON custom_fields FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage custom fields"
  ON custom_fields FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'gestor')
    )
  );

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger para updated_at em editals
CREATE TRIGGER update_editals_updated_at
  BEFORE UPDATE ON editals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para updated_at em edital_items
CREATE TRIGGER update_edital_items_updated_at
  BEFORE UPDATE ON edital_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para updated_at em edital_notes
CREATE TRIGGER update_edital_notes_updated_at
  BEFORE UPDATE ON edital_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para updated_at em pipeline_stages
CREATE TRIGGER update_pipeline_stages_updated_at
  BEFORE UPDATE ON pipeline_stages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para registrar histórico de mudanças
CREATE OR REPLACE FUNCTION log_edital_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    -- Log status changes
    IF OLD.status IS DISTINCT FROM NEW.status THEN
      INSERT INTO edital_history (edital_id, user_id, action, field_changed, old_value, new_value)
      VALUES (NEW.id, auth.uid(), 'update', 'status', OLD.status, NEW.status);
      
      -- Update tempo_na_etapa
      NEW.tempo_na_etapa = NOW() - OLD.data_mudanca_status;
      NEW.data_mudanca_status = NOW();
    END IF;
    
    -- Log other important changes
    IF OLD.responsavel_id IS DISTINCT FROM NEW.responsavel_id THEN
      INSERT INTO edital_history (edital_id, user_id, action, field_changed, old_value, new_value)
      VALUES (NEW.id, auth.uid(), 'update', 'responsavel_id', OLD.responsavel_id::text, NEW.responsavel_id::text);
    END IF;
    
    IF OLD.valor_estimado IS DISTINCT FROM NEW.valor_estimado THEN
      INSERT INTO edital_history (edital_id, user_id, action, field_changed, old_value, new_value)
      VALUES (NEW.id, auth.uid(), 'update', 'valor_estimado', OLD.valor_estimado::text, NEW.valor_estimado::text);
    END IF;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO edital_history (edital_id, user_id, action)
    VALUES (NEW.id, auth.uid(), 'create');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER log_edital_changes_trigger
  AFTER INSERT OR UPDATE ON editals
  FOR EACH ROW
  EXECUTE FUNCTION log_edital_changes();

-- ============================================
-- DADOS INICIAIS - PIPELINE STAGES PADRÃO
-- ============================================
-- Nota: Inserir manualmente após criar a organização
-- ou criar função para inicializar pipeline padrão

-- ============================================
-- FUNÇÕES ÚTEIS
-- ============================================

-- Função para busca full-text
CREATE OR REPLACE FUNCTION search_editals(
  search_query TEXT,
  org_id UUID
)
RETURNS TABLE (
  id UUID,
  numero_edital TEXT,
  orgao_entidade TEXT,
  objeto TEXT,
  status TEXT,
  valor_estimado DECIMAL,
  data_abertura TIMESTAMP,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id,
    e.numero_edital,
    e.orgao_entidade,
    e.objeto,
    e.status,
    e.valor_estimado,
    e.data_abertura,
    ts_rank(
      to_tsvector('portuguese', 
        coalesce(e.numero_edital, '') || ' ' || 
        coalesce(e.orgao_entidade, '') || ' ' || 
        coalesce(e.objeto, '')
      ),
      plainto_tsquery('portuguese', search_query)
    ) as rank
  FROM editals e
  WHERE e.organization_id = org_id
    AND to_tsvector('portuguese', 
      coalesce(e.numero_edital, '') || ' ' || 
      coalesce(e.orgao_entidade, '') || ' ' || 
      coalesce(e.objeto, '')
    ) @@ plainto_tsquery('portuguese', search_query)
  ORDER BY rank DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para calcular métricas do pipeline
CREATE OR REPLACE FUNCTION get_pipeline_metrics(org_id UUID)
RETURNS TABLE (
  status TEXT,
  count BIGINT,
  total_value DECIMAL,
  avg_time_in_stage INTERVAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.status,
    COUNT(*)::BIGINT as count,
    SUM(e.valor_estimado) as total_value,
    AVG(e.tempo_na_etapa) as avg_time_in_stage
  FROM editals e
  WHERE e.organization_id = org_id
  GROUP BY e.status;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
