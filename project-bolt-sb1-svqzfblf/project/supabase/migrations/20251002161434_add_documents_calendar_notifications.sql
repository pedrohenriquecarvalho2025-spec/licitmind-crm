/*
  # Sistema de Documentos, Calendário e Notificações

  1. Novas Tabelas
    - `documents`
      - `id` (uuid, primary key)
      - `organization_id` (uuid, foreign key)
      - `name` (text) - Nome do documento
      - `type` (text) - Tipo do documento
      - `category` (text) - Categoria
      - `file_url` (text) - URL do arquivo no storage
      - `file_path` (text) - Path no storage
      - `expiry_date` (timestamptz, nullable) - Data de vencimento
      - `status` (text) - valid, expiring, expired
      - `size` (bigint) - Tamanho em bytes
      - `mime_type` (text) - Tipo MIME do arquivo
      - `uploaded_by` (uuid, foreign key) - Usuário que fez upload
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `calendar_tasks`
      - `id` (uuid, primary key)
      - `organization_id` (uuid, foreign key)
      - `title` (text) - Título da tarefa
      - `description` (text, nullable) - Descrição
      - `task_date` (date) - Data da tarefa
      - `task_time` (time, nullable) - Hora da tarefa
      - `type` (text) - task, meeting, deadline
      - `priority` (text) - high, medium, low
      - `status` (text) - pending, completed, cancelled
      - `edital_id` (uuid, nullable, foreign key) - Relacionado a edital
      - `assigned_to` (uuid, nullable, foreign key) - Usuário responsável
      - `created_by` (uuid, foreign key)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `notifications`
      - `id` (uuid, primary key)
      - `organization_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key) - Usuário destinatário
      - `type` (text) - deadline, status_change, new_edital, system
      - `title` (text) - Título da notificação
      - `message` (text) - Mensagem
      - `edital_id` (uuid, nullable, foreign key)
      - `task_id` (uuid, nullable, foreign key)
      - `read` (boolean) - Se foi lida
      - `created_at` (timestamptz)

  2. Segurança
    - Habilitar RLS em todas as tabelas
    - Políticas de acesso baseadas em organização
    - Políticas específicas para cada tipo de usuário
*/

-- Tabela de Documentos
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('atestado', 'crea_cau', 'certidao', 'licenca', 'outros')),
  category text NOT NULL,
  file_url text NOT NULL,
  file_path text NOT NULL,
  expiry_date timestamptz,
  status text NOT NULL DEFAULT 'valid' CHECK (status IN ('valid', 'expiring', 'expired')),
  size bigint NOT NULL DEFAULT 0,
  mime_type text NOT NULL,
  uploaded_by uuid NOT NULL REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view organization documents"
  ON documents FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert organization documents"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update organization documents"
  ON documents FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Managers can delete documents"
  ON documents FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'gestor')
    )
  );

CREATE INDEX IF NOT EXISTS idx_documents_organization ON documents(organization_id);
CREATE INDEX IF NOT EXISTS idx_documents_expiry ON documents(expiry_date);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);

-- Tabela de Tarefas do Calendário
CREATE TABLE IF NOT EXISTS calendar_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  task_date date NOT NULL,
  task_time time,
  type text NOT NULL DEFAULT 'task' CHECK (type IN ('task', 'meeting', 'deadline')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  edital_id uuid REFERENCES editals(id) ON DELETE CASCADE,
  assigned_to uuid REFERENCES user_profiles(id),
  created_by uuid NOT NULL REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE calendar_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view organization tasks"
  ON calendar_tasks FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create tasks"
  ON calendar_tasks FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update their tasks"
  ON calendar_tasks FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their tasks"
  ON calendar_tasks FOR DELETE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    organization_id IN (
      SELECT organization_id FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'gestor')
    )
  );

CREATE INDEX IF NOT EXISTS idx_calendar_tasks_organization ON calendar_tasks(organization_id);
CREATE INDEX IF NOT EXISTS idx_calendar_tasks_date ON calendar_tasks(task_date);
CREATE INDEX IF NOT EXISTS idx_calendar_tasks_assigned ON calendar_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_calendar_tasks_edital ON calendar_tasks(edital_id);

-- Tabela de Notificações
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('deadline', 'status_change', 'new_edital', 'system', 'task', 'document')),
  title text NOT NULL,
  message text NOT NULL,
  edital_id uuid REFERENCES editals(id) ON DELETE CASCADE,
  task_id uuid REFERENCES calendar_tasks(id) ON DELETE CASCADE,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update their notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their notifications"
  ON notifications FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at);

-- Função para atualizar status de documentos baseado na data de vencimento
CREATE OR REPLACE FUNCTION update_document_status()
RETURNS void AS $$
BEGIN
  UPDATE documents
  SET status = CASE
    WHEN expiry_date IS NULL THEN 'valid'
    WHEN expiry_date < now() THEN 'expired'
    WHEN expiry_date < now() + interval '30 days' THEN 'expiring'
    ELSE 'valid'
  END,
  updated_at = now()
  WHERE expiry_date IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

-- Função para criar notificação automática de prazo próximo
CREATE OR REPLACE FUNCTION notify_upcoming_deadlines()
RETURNS void AS $$
DECLARE
  edital_record RECORD;
BEGIN
  FOR edital_record IN 
    SELECT e.*, up.id as user_id
    FROM editals e
    JOIN user_profiles up ON e.organization_id = up.organization_id
    WHERE e.data_entrega_propostas IS NOT NULL
    AND e.data_entrega_propostas > now()
    AND e.data_entrega_propostas < now() + interval '7 days'
    AND e.status NOT IN ('homologado', 'perdido')
  LOOP
    INSERT INTO notifications (
      organization_id,
      user_id,
      type,
      title,
      message,
      edital_id
    )
    VALUES (
      edital_record.organization_id,
      edital_record.user_id,
      'deadline',
      'Prazo próximo',
      'O edital ' || edital_record.numero_edital || ' vence em breve',
      edital_record.id
    )
    ON CONFLICT DO NOTHING;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
