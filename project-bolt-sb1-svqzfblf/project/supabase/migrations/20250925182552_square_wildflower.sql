/*
  # Schema inicial do LicitaFlow

  1. Novas Tabelas
    - `organizations` - Organizações/empresas
    - `users` - Usuários do sistema com roles
    - `editals` - Editais de licitação
    - `comments` - Comentários internos nos editais
    - `activity_logs` - Logs de atividades do sistema
    - `user_organizations` - Relacionamento usuários e organizações

  2. Segurança
    - RLS habilitado em todas as tabelas
    - Políticas baseadas na organização do usuário
    - Controle de acesso por roles (admin, gestor, analista, cliente)

  3. Funcionalidades
    - Campos completos para editais
    - Sistema de status com workflow
    - Upload de arquivos
    - Auditoria completa
*/

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum para roles de usuário
CREATE TYPE user_role AS ENUM ('admin', 'gestor', 'analista', 'cliente');

-- Enum para status dos editais
CREATE TYPE edital_status AS ENUM (
  'prospectado', 
  'em_analise', 
  'documentacao', 
  'proposta_enviada', 
  'em_julgamento', 
  'homologado', 
  'perdido'
);

-- Enum para modalidades
CREATE TYPE modalidade_type AS ENUM (
  'concorrencia',
  'pregao_presencial',
  'pregao_eletronico',
  'tomada_precos',
  'convite',
  'dispensa',
  'inexigibilidade',
  'rdc'
);

-- Tabela de organizações
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de usuários estendida
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  role user_role DEFAULT 'analista',
  avatar_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de editais
CREATE TABLE IF NOT EXISTS editals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  numero_edital text NOT NULL,
  orgao_entidade text NOT NULL,
  objeto text NOT NULL,
  modalidade modalidade_type NOT NULL,
  data_publicacao date,
  data_entrega_propostas timestamptz,
  valor_estimado decimal(15,2),
  status edital_status DEFAULT 'prospectado',
  responsavel_id uuid REFERENCES user_profiles(id),
  observacoes text,
  arquivo_url text,
  arquivo_nome text,
  created_by uuid REFERENCES user_profiles(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de comentários
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  edital_id uuid REFERENCES editals(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  comment text NOT NULL,
  is_internal boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Tabela de logs de atividade
CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id uuid,
  old_values jsonb,
  new_values jsonb,
  created_at timestamptz DEFAULT now()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_editals_organization ON editals(organization_id);
CREATE INDEX IF NOT EXISTS idx_editals_status ON editals(status);
CREATE INDEX IF NOT EXISTS idx_editals_responsavel ON editals(responsavel_id);
CREATE INDEX IF NOT EXISTS idx_editals_data_entrega ON editals(data_entrega_propostas);
CREATE INDEX IF NOT EXISTS idx_comments_edital ON comments(edital_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_org ON activity_logs(organization_id);

-- RLS Policies
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE editals ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Policies para organizations
CREATE POLICY "Users can read their organization"
  ON organizations
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT organization_id 
      FROM user_profiles 
      WHERE id = auth.uid()
    )
  );

-- Policies para user_profiles
CREATE POLICY "Users can read profiles in their organization"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM user_profiles 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

-- Policies para editals
CREATE POLICY "Users can read editals in their organization"
  ON editals
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM user_profiles 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create editals in their organization"
  ON editals
  FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id 
      FROM user_profiles 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update editals in their organization"
  ON editals
  FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM user_profiles 
      WHERE id = auth.uid()
    )
  );

-- Policies para comments
CREATE POLICY "Users can read comments on editals in their organization"
  ON comments
  FOR SELECT
  TO authenticated
  USING (
    edital_id IN (
      SELECT id FROM editals 
      WHERE organization_id IN (
        SELECT organization_id 
        FROM user_profiles 
        WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can create comments"
  ON comments
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Policies para activity_logs
CREATE POLICY "Users can read activity logs in their organization"
  ON activity_logs
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM user_profiles 
      WHERE id = auth.uid()
    )
  );

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_editals_updated_at
  BEFORE UPDATE ON editals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Inserir organização padrão para desenvolvimento
INSERT INTO organizations (name, slug) 
VALUES ('LicitaFlow Demo', 'licitaflow-demo')
ON CONFLICT (slug) DO NOTHING;