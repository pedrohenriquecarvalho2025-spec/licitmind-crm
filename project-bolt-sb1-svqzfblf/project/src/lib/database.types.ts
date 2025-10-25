export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          organization_id: string | null
          email: string
          full_name: string
          role: 'admin' | 'gestor' | 'analista' | 'cliente'
          avatar_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          organization_id?: string | null
          email: string
          full_name: string
          role?: 'admin' | 'gestor' | 'analista' | 'cliente'
          avatar_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string | null
          email?: string
          full_name?: string
          role?: 'admin' | 'gestor' | 'analista' | 'cliente'
          avatar_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      editals: {
        Row: {
          id: string
          organization_id: string
          numero_edital: string
          orgao_entidade: string
          objeto: string
          modalidade: 'concorrencia' | 'pregao_presencial' | 'pregao_eletronico' | 'tomada_precos' | 'convite' | 'dispensa' | 'inexigibilidade' | 'rdc'
          data_publicacao: string | null
          data_entrega_propostas: string | null
          valor_estimado: number | null
          status: 'prospectado' | 'em_analise' | 'documentacao' | 'proposta_enviada' | 'em_julgamento' | 'homologado' | 'perdido'
          responsavel_id: string | null
          observacoes: string | null
          arquivo_url: string | null
          arquivo_nome: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          numero_edital: string
          orgao_entidade: string
          objeto: string
          modalidade: 'concorrencia' | 'pregao_presencial' | 'pregao_eletronico' | 'tomada_precos' | 'convite' | 'dispensa' | 'inexigibilidade' | 'rdc'
          data_publicacao?: string | null
          data_entrega_propostas?: string | null
          valor_estimado?: number | null
          status?: 'prospectado' | 'em_analise' | 'documentacao' | 'proposta_enviada' | 'em_julgamento' | 'homologado' | 'perdido'
          responsavel_id?: string | null
          observacoes?: string | null
          arquivo_url?: string | null
          arquivo_nome?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          numero_edital?: string
          orgao_entidade?: string
          objeto?: string
          modalidade?: 'concorrencia' | 'pregao_presencial' | 'pregao_eletronico' | 'tomada_precos' | 'convite' | 'dispensa' | 'inexigibilidade' | 'rdc'
          data_publicacao?: string | null
          data_entrega_propostas?: string | null
          valor_estimado?: number | null
          status?: 'prospectado' | 'em_analise' | 'documentacao' | 'proposta_enviada' | 'em_julgamento' | 'homologado' | 'perdido'
          responsavel_id?: string | null
          observacoes?: string | null
          arquivo_url?: string | null
          arquivo_nome?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          edital_id: string
          user_id: string
          comment: string
          is_internal: boolean
          created_at: string
        }
        Insert: {
          id?: string
          edital_id: string
          user_id: string
          comment: string
          is_internal?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          edital_id?: string
          user_id?: string
          comment?: string
          is_internal?: boolean
          created_at?: string
        }
      }
      activity_logs: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          action: string
          resource_type: string
          resource_id: string | null
          old_values: Record<string, any> | null
          new_values: Record<string, any> | null
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          action: string
          resource_type: string
          resource_id?: string | null
          old_values?: Record<string, any> | null
          new_values?: Record<string, any> | null
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          action?: string
          resource_type?: string
          resource_id?: string | null
          old_values?: Record<string, any> | null
          new_values?: Record<string, any> | null
          created_at?: string
        }
      }
      pipelines: {
        Row: {
          id: string
          organization_id: string
          name: string
          description: string | null
          is_default: boolean
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          description?: string | null
          is_default?: boolean
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          description?: string | null
          is_default?: boolean
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      pipeline_stages: {
        Row: {
          id: string
          pipeline_id: string
          name: string
          color: string
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          pipeline_id: string
          name: string
          color: string
          order_index: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          pipeline_id?: string
          name?: string
          color?: string
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      google_drive_folders: {
        Row: {
          id: string
          edital_id: string
          folder_id: string
          folder_name: string
          folder_url: string
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          edital_id: string
          folder_id: string
          folder_name: string
          folder_url: string
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          edital_id?: string
          folder_id?: string
          folder_name?: string
          folder_url?: string
          created_by?: string
          created_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          organization_id: string
          name: string
          type: 'atestado' | 'crea_cau' | 'certidao' | 'licenca' | 'outros'
          category: string
          file_url: string
          file_path: string
          expiry_date: string | null
          status: 'valid' | 'expiring' | 'expired'
          size: number
          mime_type: string
          uploaded_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          type: 'atestado' | 'crea_cau' | 'certidao' | 'licenca' | 'outros'
          category: string
          file_url: string
          file_path: string
          expiry_date?: string | null
          status?: 'valid' | 'expiring' | 'expired'
          size: number
          mime_type: string
          uploaded_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          type?: 'atestado' | 'crea_cau' | 'certidao' | 'licenca' | 'outros'
          category?: string
          file_url?: string
          file_path?: string
          expiry_date?: string | null
          status?: 'valid' | 'expiring' | 'expired'
          size?: number
          mime_type?: string
          uploaded_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      calendar_tasks: {
        Row: {
          id: string
          organization_id: string
          title: string
          description: string | null
          task_date: string
          task_time: string | null
          type: 'task' | 'meeting' | 'deadline'
          priority: 'high' | 'medium' | 'low'
          status: 'pending' | 'completed' | 'cancelled'
          edital_id: string | null
          assigned_to: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          title: string
          description?: string | null
          task_date: string
          task_time?: string | null
          type?: 'task' | 'meeting' | 'deadline'
          priority?: 'high' | 'medium' | 'low'
          status?: 'pending' | 'completed' | 'cancelled'
          edital_id?: string | null
          assigned_to?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          title?: string
          description?: string | null
          task_date?: string
          task_time?: string | null
          type?: 'task' | 'meeting' | 'deadline'
          priority?: 'high' | 'medium' | 'low'
          status?: 'pending' | 'completed' | 'cancelled'
          edital_id?: string | null
          assigned_to?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          type: 'deadline' | 'status_change' | 'new_edital' | 'system' | 'task' | 'document'
          title: string
          message: string
          edital_id: string | null
          task_id: string | null
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          type: 'deadline' | 'status_change' | 'new_edital' | 'system' | 'task' | 'document'
          title: string
          message: string
          edital_id?: string | null
          task_id?: string | null
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          type?: 'deadline' | 'status_change' | 'new_edital' | 'system' | 'task' | 'document'
          title?: string
          message?: string
          edital_id?: string | null
          task_id?: string | null
          read?: boolean
          created_at?: string
        }
      }
      suppliers: {
        Row: {
          id: string
          organization_id: string
          cnpj: string
          razao_social: string
          nome_fantasia: string | null
          email: string | null
          telefone: string | null
          endereco: string | null
          cidade: string | null
          estado: string | null
          cep: string | null
          contato_principal: string | null
          observacoes: string | null
          is_active: boolean
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          cnpj: string
          razao_social: string
          nome_fantasia?: string | null
          email?: string | null
          telefone?: string | null
          endereco?: string | null
          cidade?: string | null
          estado?: string | null
          cep?: string | null
          contato_principal?: string | null
          observacoes?: string | null
          is_active?: boolean
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          cnpj?: string
          razao_social?: string
          nome_fantasia?: string | null
          email?: string | null
          telefone?: string | null
          endereco?: string | null
          cidade?: string | null
          estado?: string | null
          cep?: string | null
          contato_principal?: string | null
          observacoes?: string | null
          is_active?: boolean
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      quotations: {
        Row: {
          id: string
          organization_id: string
          edital_id: string | null
          numero_cotacao: string
          descricao: string | null
          data_solicitacao: string
          data_limite_resposta: string | null
          status: 'pendente' | 'em_andamento' | 'recebida' | 'aprovada' | 'rejeitada' | 'cancelada'
          observacoes: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          edital_id?: string | null
          numero_cotacao: string
          descricao?: string | null
          data_solicitacao: string
          data_limite_resposta?: string | null
          status?: 'pendente' | 'em_andamento' | 'recebida' | 'aprovada' | 'rejeitada' | 'cancelada'
          observacoes?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          edital_id?: string | null
          numero_cotacao?: string
          descricao?: string | null
          data_solicitacao?: string
          data_limite_resposta?: string | null
          status?: 'pendente' | 'em_andamento' | 'recebida' | 'aprovada' | 'rejeitada' | 'cancelada'
          observacoes?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      bidding_portals: {
        Row: {
          id: string
          organization_id: string
          nome_portal: string
          url: string | null
          tipo: 'federal' | 'estadual' | 'municipal' | 'privado' | 'outros' | null
          usuario: string | null
          senha_encrypted: string | null
          email_acesso: string | null
          certificado_digital: boolean
          data_cadastro: string | null
          data_ultima_atualizacao: string | null
          data_validade_acesso: string | null
          status: 'ativo' | 'vencido' | 'pendente_renovacao' | 'inativo'
          observacoes: string | null
          responsavel_id: string | null
          alerta_vencimento_dias: number
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          nome_portal: string
          url?: string | null
          tipo?: 'federal' | 'estadual' | 'municipal' | 'privado' | 'outros' | null
          usuario?: string | null
          senha_encrypted?: string | null
          email_acesso?: string | null
          certificado_digital?: boolean
          data_cadastro?: string | null
          data_ultima_atualizacao?: string | null
          data_validade_acesso?: string | null
          status?: 'ativo' | 'vencido' | 'pendente_renovacao' | 'inativo'
          observacoes?: string | null
          responsavel_id?: string | null
          alerta_vencimento_dias?: number
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          nome_portal?: string
          url?: string | null
          tipo?: 'federal' | 'estadual' | 'municipal' | 'privado' | 'outros' | null
          usuario?: string | null
          senha_encrypted?: string | null
          email_acesso?: string | null
          certificado_digital?: boolean
          data_cadastro?: string | null
          data_ultima_atualizacao?: string | null
          data_validade_acesso?: string | null
          status?: 'ativo' | 'vencido' | 'pendente_renovacao' | 'inativo'
          observacoes?: string | null
          responsavel_id?: string | null
          alerta_vencimento_dias?: number
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      contracts: {
        Row: {
          id: string
          organization_id: string
          edital_id: string | null
          numero_contrato: string
          objeto: string
          contratante: string
          valor_total: number
          data_assinatura: string
          data_inicio_vigencia: string
          data_fim_vigencia: string
          prazo_execucao_dias: number | null
          status: 'em_elaboracao' | 'ativo' | 'suspenso' | 'encerrado' | 'rescindido'
          tipo_contrato: 'fornecimento' | 'servico' | 'obra' | 'concessao' | 'outros' | null
          modalidade_pagamento: string | null
          garantia_contratual: number | null
          tipo_garantia: 'caucao' | 'seguro_garantia' | 'fianca_bancaria' | 'nenhuma' | null
          observacoes: string | null
          arquivo_url: string | null
          arquivo_nome: string | null
          responsavel_id: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          edital_id?: string | null
          numero_contrato: string
          objeto: string
          contratante: string
          valor_total: number
          data_assinatura: string
          data_inicio_vigencia: string
          data_fim_vigencia: string
          prazo_execucao_dias?: number | null
          status?: 'em_elaboracao' | 'ativo' | 'suspenso' | 'encerrado' | 'rescindido'
          tipo_contrato?: 'fornecimento' | 'servico' | 'obra' | 'concessao' | 'outros' | null
          modalidade_pagamento?: string | null
          garantia_contratual?: number | null
          tipo_garantia?: 'caucao' | 'seguro_garantia' | 'fianca_bancaria' | 'nenhuma' | null
          observacoes?: string | null
          arquivo_url?: string | null
          arquivo_nome?: string | null
          responsavel_id?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          edital_id?: string | null
          numero_contrato?: string
          objeto?: string
          contratante?: string
          valor_total?: number
          data_assinatura?: string
          data_inicio_vigencia?: string
          data_fim_vigencia?: string
          prazo_execucao_dias?: number | null
          status?: 'em_elaboracao' | 'ativo' | 'suspenso' | 'encerrado' | 'rescindido'
          tipo_contrato?: 'fornecimento' | 'servico' | 'obra' | 'concessao' | 'outros' | null
          modalidade_pagamento?: string | null
          garantia_contratual?: number | null
          tipo_garantia?: 'caucao' | 'seguro_garantia' | 'fianca_bancaria' | 'nenhuma' | null
          observacoes?: string | null
          arquivo_url?: string | null
          arquivo_nome?: string | null
          responsavel_id?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      commitments: {
        Row: {
          id: string
          organization_id: string
          contract_id: string | null
          numero_empenho: string
          tipo_empenho: 'ordinario' | 'estimativo' | 'global' | null
          data_empenho: string
          valor_empenhado: number
          valor_liquidado: number
          valor_pago: number
          saldo: number
          dotacao_orcamentaria: string | null
          fonte_recurso: string | null
          status: 'empenhado' | 'liquidado' | 'pago' | 'cancelado' | 'anulado'
          observacoes: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          contract_id?: string | null
          numero_empenho: string
          tipo_empenho?: 'ordinario' | 'estimativo' | 'global' | null
          data_empenho: string
          valor_empenhado: number
          valor_liquidado?: number
          valor_pago?: number
          dotacao_orcamentaria?: string | null
          fonte_recurso?: string | null
          status?: 'empenhado' | 'liquidado' | 'pago' | 'cancelado' | 'anulado'
          observacoes?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          contract_id?: string | null
          numero_empenho?: string
          tipo_empenho?: 'ordinario' | 'estimativo' | 'global' | null
          data_empenho?: string
          valor_empenhado?: number
          valor_liquidado?: number
          valor_pago?: number
          dotacao_orcamentaria?: string | null
          fonte_recurso?: string | null
          status?: 'empenhado' | 'liquidado' | 'pago' | 'cancelado' | 'anulado'
          observacoes?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}