/**
 * API simplificada para Protocolos (mock até criar tabela no Supabase)
 */

import type { Protocol, ProtocolFilters, ProtocolCreateData } from './types'

export interface ProtocolsAPI {
  listProtocols(organizationId: string, filters?: ProtocolFilters): Promise<Protocol[]>
  getProtocol(id: string): Promise<Protocol | null>
  createProtocol(data: ProtocolCreateData, organizationId: string, userId: string): Promise<Protocol>
  updateProtocol(id: string, data: Partial<ProtocolCreateData>, userId: string): Promise<Protocol>
  deleteProtocol(id: string, userId: string): Promise<void>
}

class ProtocolsAPIImpl implements ProtocolsAPI {
  private mockData: Protocol[] = []

  async listProtocols(organizationId: string, filters?: ProtocolFilters): Promise<Protocol[]> {
    // Mock implementation - retorna array vazio até implementar Supabase
    return []
  }

  async getProtocol(id: string): Promise<Protocol | null> {
    return null
  }

  async createProtocol(data: ProtocolCreateData, organizationId: string, userId: string): Promise<Protocol> {
    const protocol: Protocol = {
      id: Math.random().toString(36).substr(2, 9),
      organization_id: organizationId,
      numero_protocolo: data.numero_protocolo,
      tipo: data.tipo,
      assunto: data.assunto,
      orgao_destino: data.orgao_destino,
      data_protocolo: data.data_protocolo,
      prazo_resposta: data.prazo_resposta || null,
      status: data.status || 'aguardando_resposta',
      observacoes: data.observacoes || null,
      resposta_recebida: data.resposta_recebida || false,
      data_resposta: data.data_resposta || null,
      anexo_url: null,
      responsavel_id: data.responsavel_id || null,
      created_by: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    this.mockData.push(protocol)
    return protocol
  }

  async updateProtocol(id: string, data: Partial<ProtocolCreateData>, userId: string): Promise<Protocol> {
    const index = this.mockData.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Protocol not found')
    
    this.mockData[index] = {
      ...this.mockData[index],
      ...data,
      updated_at: new Date().toISOString()
    }
    
    return this.mockData[index]
  }

  async deleteProtocol(id: string, userId: string): Promise<void> {
    this.mockData = this.mockData.filter(p => p.id !== id)
  }
}

export const protocolsAPI: ProtocolsAPI = new ProtocolsAPIImpl()

