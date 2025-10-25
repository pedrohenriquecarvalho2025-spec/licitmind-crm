// Mock data for demonstration purposes
export const mockUser = {
  id: 'demo-user-123',
  email: 'demo@licitaflow.com',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export const mockProfile = {
  id: 'demo-user-123',
  organization_id: 'demo-org-123',
  email: 'demo@licitaflow.com',
  full_name: 'Usuário Demonstração',
  role: 'admin' as const,
  avatar_url: null,
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export const mockOrganization = {
  id: 'demo-org-123',
  name: 'Empresa Demonstração Ltda',
  slug: 'empresa-demo',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export const mockUsers = [
  {
    id: 'demo-user-123',
    full_name: 'Usuário Demonstração',
  },
  {
    id: 'demo-user-456',
    full_name: 'Ana Silva',
  },
  {
    id: 'demo-user-789',
    full_name: 'Carlos Santos',
  },
]

export const mockEditals = [
  {
    id: 'edital-001',
    organization_id: 'demo-org-123',
    numero_edital: '001/2024',
    orgao_entidade: 'Prefeitura Municipal de São Paulo',
    objeto: 'Contratação de empresa especializada em desenvolvimento de software para modernização do sistema de gestão municipal',
    modalidade: 'pregao_eletronico' as const,
    data_publicacao: '2024-01-15',
    data_entrega_propostas: '2024-02-15T14:00:00.000Z',
    valor_estimado: 850000,
    status: 'em_analise' as const,
    responsavel_id: 'demo-user-456',
    observacoes: 'Edital com grande potencial. Empresa tem experiência na área.',
    arquivo_url: null,
    arquivo_nome: null,
    created_by: 'demo-user-123',
    created_at: '2024-01-10T10:00:00.000Z',
    updated_at: '2024-01-10T10:00:00.000Z',
    responsavel: { full_name: 'Ana Silva' }
  },
  {
    id: 'edital-002',
    organization_id: 'demo-org-123',
    numero_edital: '002/2024',
    orgao_entidade: 'Governo do Estado de São Paulo',
    objeto: 'Fornecimento de equipamentos de informática para escolas estaduais',
    modalidade: 'concorrencia' as const,
    data_publicacao: '2024-01-20',
    data_entrega_propostas: '2024-03-01T16:00:00.000Z',
    valor_estimado: 2500000,
    status: 'proposta_enviada' as const,
    responsavel_id: 'demo-user-789',
    observacoes: 'Proposta enviada com desconto competitivo.',
    arquivo_url: null,
    arquivo_nome: null,
    created_by: 'demo-user-123',
    created_at: '2024-01-18T09:30:00.000Z',
    updated_at: '2024-01-25T14:20:00.000Z',
    responsavel: { full_name: 'Carlos Santos' }
  },
  {
    id: 'edital-003',
    organization_id: 'demo-org-123',
    numero_edital: '003/2024',
    orgao_entidade: 'Ministério da Saúde',
    objeto: 'Desenvolvimento de sistema de gestão hospitalar integrado',
    modalidade: 'pregao_eletronico' as const,
    data_publicacao: '2024-02-01',
    data_entrega_propostas: '2024-02-28T10:00:00.000Z',
    valor_estimado: 1200000,
    status: 'homologado' as const,
    responsavel_id: 'demo-user-456',
    observacoes: 'Projeto homologado! Início previsto para março.',
    arquivo_url: null,
    arquivo_nome: null,
    created_by: 'demo-user-123',
    created_at: '2024-01-28T11:15:00.000Z',
    updated_at: '2024-02-20T16:45:00.000Z',
    responsavel: { full_name: 'Ana Silva' }
  },
  {
    id: 'edital-004',
    organization_id: 'demo-org-123',
    numero_edital: '004/2024',
    orgao_entidade: 'DETRAN-SP',
    objeto: 'Modernização do sistema de licenciamento veicular',
    modalidade: 'pregao_eletronico' as const,
    data_publicacao: '2024-02-10',
    data_entrega_propostas: '2024-03-15T15:30:00.000Z',
    valor_estimado: 750000,
    status: 'documentacao' as const,
    responsavel_id: 'demo-user-789',
    observacoes: 'Aguardando documentação complementar.',
    arquivo_url: null,
    arquivo_nome: null,
    created_by: 'demo-user-123',
    created_at: '2024-02-08T13:20:00.000Z',
    updated_at: '2024-02-12T09:10:00.000Z',
    responsavel: { full_name: 'Carlos Santos' }
  },
  {
    id: 'edital-005',
    organization_id: 'demo-org-123',
    numero_edital: '005/2024',
    orgao_entidade: 'Tribunal de Justiça de SP',
    objeto: 'Sistema de gestão processual digital',
    modalidade: 'concorrencia' as const,
    data_publicacao: '2024-02-15',
    data_entrega_propostas: '2024-04-01T12:00:00.000Z',
    valor_estimado: 3200000,
    status: 'prospectado' as const,
    responsavel_id: null,
    observacoes: 'Edital de grande porte. Necessária análise detalhada.',
    arquivo_url: null,
    arquivo_nome: null,
    created_by: 'demo-user-123',
    created_at: '2024-02-13T14:30:00.000Z',
    updated_at: '2024-02-13T14:30:00.000Z',
    responsavel: null
  },
  {
    id: 'edital-006',
    organization_id: 'demo-org-123',
    numero_edital: '006/2024',
    orgao_entidade: 'Receita Federal',
    objeto: 'Desenvolvimento de módulo de inteligência artificial para análise fiscal',
    modalidade: 'pregao_eletronico' as const,
    data_publicacao: '2024-01-05',
    data_entrega_propostas: '2024-01-25T17:00:00.000Z',
    valor_estimado: 950000,
    status: 'perdido' as const,
    responsavel_id: 'demo-user-456',
    observacoes: 'Perdemos por diferença mínima de preço.',
    arquivo_url: null,
    arquivo_nome: null,
    created_by: 'demo-user-123',
    created_at: '2024-01-03T08:45:00.000Z',
    updated_at: '2024-01-30T11:20:00.000Z',
    responsavel: { full_name: 'Ana Silva' }
  }
]

export const mockPipelines = [
  {
    id: 'pipeline-default',
    organization_id: 'demo-org-123',
    name: 'Pipeline Padrão',
    description: 'Pipeline padrão para licitações',
    is_default: true,
    created_by: 'demo-user-123',
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'pipeline-obras',
    organization_id: 'demo-org-123',
    name: 'Pipeline Obras',
    description: 'Pipeline específico para licitações de obras',
    is_default: false,
    created_by: 'demo-user-123',
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
  }
]

export const mockPipelineStages = [
  // Pipeline Padrão
  { id: 'stage-1', pipeline_id: 'pipeline-default', name: 'Prospectados', color: 'bg-gray-50 border-gray-200', order_index: 1, created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: 'stage-2', pipeline_id: 'pipeline-default', name: 'Em Análise', color: 'bg-blue-50 border-blue-200', order_index: 2, created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: 'stage-3', pipeline_id: 'pipeline-default', name: 'Documentação', color: 'bg-yellow-50 border-yellow-200', order_index: 3, created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: 'stage-4', pipeline_id: 'pipeline-default', name: 'Proposta Enviada', color: 'bg-purple-50 border-purple-200', order_index: 4, created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: 'stage-5', pipeline_id: 'pipeline-default', name: 'Em Julgamento', color: 'bg-orange-50 border-orange-200', order_index: 5, created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: 'stage-6', pipeline_id: 'pipeline-default', name: 'Homologados', color: 'bg-green-50 border-green-200', order_index: 6, created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: 'stage-7', pipeline_id: 'pipeline-default', name: 'Perdidos', color: 'bg-red-50 border-red-200', order_index: 7, created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  
  // Pipeline Obras
  { id: 'stage-obras-1', pipeline_id: 'pipeline-obras', name: 'Identificação', color: 'bg-indigo-50 border-indigo-200', order_index: 1, created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: 'stage-obras-2', pipeline_id: 'pipeline-obras', name: 'Orçamento', color: 'bg-cyan-50 border-cyan-200', order_index: 2, created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: 'stage-obras-3', pipeline_id: 'pipeline-obras', name: 'Projeto Técnico', color: 'bg-teal-50 border-teal-200', order_index: 3, created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: 'stage-obras-4', pipeline_id: 'pipeline-obras', name: 'Habilitação', color: 'bg-lime-50 border-lime-200', order_index: 4, created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: 'stage-obras-5', pipeline_id: 'pipeline-obras', name: 'Proposta Final', color: 'bg-emerald-50 border-emerald-200', order_index: 5, created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: 'stage-obras-6', pipeline_id: 'pipeline-obras', name: 'Contratado', color: 'bg-green-50 border-green-200', order_index: 6, created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
]

export const mockGoogleDriveFolders = [
  {
    id: 'drive-1',
    edital_id: 'edital-001',
    folder_id: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    folder_name: 'Edital 001/2024 - Prefeitura SP',
    folder_url: 'https://drive.google.com/drive/folders/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    created_by: 'demo-user-123',
    created_at: '2024-01-10T10:00:00.000Z',
  },
  {
    id: 'drive-2',
    edital_id: 'edital-003',
    folder_id: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    folder_name: 'Edital 003/2024 - Ministério Saúde',
    folder_url: 'https://drive.google.com/drive/folders/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    created_by: 'demo-user-123',
    created_at: '2024-01-28T11:15:00.000Z',
  }
]