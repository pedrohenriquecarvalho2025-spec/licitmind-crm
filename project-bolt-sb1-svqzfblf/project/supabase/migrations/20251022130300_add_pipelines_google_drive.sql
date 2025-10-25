-- Tabela de Pipelines
CREATE TABLE IF NOT EXISTS pipelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT false,
  created_by UUID NOT NULL REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, name)
);

-- Tabela de Estágios do Pipeline
CREATE TABLE IF NOT EXISTS pipeline_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_id UUID NOT NULL REFERENCES pipelines(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(50) NOT NULL DEFAULT 'bg-gray-200',
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(pipeline_id, order_index)
);

-- Tabela de Integração com Google Drive
CREATE TABLE IF NOT EXISTS google_drive_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  edital_id UUID NOT NULL REFERENCES editals(id) ON DELETE CASCADE,
  folder_id VARCHAR(255) NOT NULL,
  folder_name VARCHAR(255) NOT NULL,
  folder_url TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(edital_id)
);

-- Índices
CREATE INDEX idx_pipelines_organization ON pipelines(organization_id);
CREATE INDEX idx_pipelines_default ON pipelines(is_default);
CREATE INDEX idx_pipeline_stages_pipeline ON pipeline_stages(pipeline_id);
CREATE INDEX idx_pipeline_stages_order ON pipeline_stages(order_index);
CREATE INDEX idx_google_drive_folders_edital ON google_drive_folders(edital_id);

-- Triggers
CREATE TRIGGER update_pipelines_updated_at BEFORE UPDATE ON pipelines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pipeline_stages_updated_at BEFORE UPDATE ON pipeline_stages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE pipelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE google_drive_folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view pipelines from their organization"
  ON pipelines FOR SELECT
  USING (organization_id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Managers can manage pipelines"
  ON pipelines FOR ALL
  USING (organization_id IN (
    SELECT organization_id FROM user_profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'gestor')
  ));

CREATE POLICY "Users can view pipeline stages"
  ON pipeline_stages FOR SELECT
  USING (pipeline_id IN (
    SELECT id FROM pipelines 
    WHERE organization_id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid())
  ));

CREATE POLICY "Managers can manage pipeline stages"
  ON pipeline_stages FOR ALL
  USING (pipeline_id IN (
    SELECT id FROM pipelines 
    WHERE organization_id IN (
      SELECT organization_id FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'gestor')
    )
  ));

CREATE POLICY "Users can view google drive folders"
  ON google_drive_folders FOR SELECT
  USING (edital_id IN (
    SELECT id FROM editals 
    WHERE organization_id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid())
  ));

CREATE POLICY "Users can manage google drive folders"
  ON google_drive_folders FOR ALL
  USING (edital_id IN (
    SELECT id FROM editals 
    WHERE organization_id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid())
  ));

-- Função para criar pipeline padrão quando um usuário for criado
CREATE OR REPLACE FUNCTION create_default_pipeline_for_org()
RETURNS TRIGGER AS $$
BEGIN
  -- Criar pipeline padrão se não existir
  IF NOT EXISTS (
    SELECT 1 FROM pipelines 
    WHERE organization_id = NEW.organization_id 
    AND is_default = true
  ) THEN
    INSERT INTO pipelines (organization_id, name, description, is_default, created_by)
    VALUES (
      NEW.organization_id,
      'Pipeline Padrão',
      'Pipeline padrão para gestão de editais',
      true,
      NEW.id
    );
    
    -- Inserir estágios padrão
    INSERT INTO pipeline_stages (pipeline_id, name, color, order_index)
    SELECT 
      p.id,
      stage.name,
      stage.color,
      stage.order_index
    FROM pipelines p
    CROSS JOIN (
      VALUES 
        ('Prospectados', 'bg-gray-200', 1),
        ('Em Análise', 'bg-blue-200', 2),
        ('Documentação', 'bg-yellow-200', 3),
        ('Proposta Enviada', 'bg-purple-200', 4),
        ('Em Julgamento', 'bg-orange-200', 5),
        ('Homologados', 'bg-green-200', 6),
        ('Perdidos', 'bg-red-200', 7)
    ) AS stage(name, color, order_index)
    WHERE p.organization_id = NEW.organization_id
    AND p.is_default = true;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para criar pipeline quando usuário for criado
CREATE TRIGGER create_pipeline_on_user_insert
  AFTER INSERT ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_default_pipeline_for_org();
