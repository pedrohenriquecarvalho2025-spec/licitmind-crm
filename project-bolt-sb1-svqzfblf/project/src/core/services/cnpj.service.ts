/**
 * Serviço para consulta de CNPJ via ReceitaWS
 * API pública: https://www.receitaws.com.br/
 */

import { logger } from '../utils/logger'

export interface CNPJData {
  cnpj: string
  razao_social: string
  nome_fantasia: string
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  municipio: string
  uf: string
  cep: string
  telefone: string
  email: string
  situacao: string
  data_situacao: string
  atividade_principal: Array<{
    code: string
    text: string
  }>
  atividades_secundarias: Array<{
    code: string
    text: string
  }>
  natureza_juridica: string
  capital_social: string
  porte: string
}

interface ReceitaWSResponse {
  status: string
  message?: string
  cnpj?: string
  nome?: string
  fantasia?: string
  logradouro?: string
  numero?: string
  complemento?: string
  bairro?: string
  municipio?: string
  uf?: string
  cep?: string
  telefone?: string
  email?: string
  situacao?: string
  data_situacao?: string
  atividade_principal?: Array<{ code: string; text: string }>
  atividades_secundarias?: Array<{ code: string; text: string }>
  natureza_juridica?: string
  capital_social?: string
  porte?: string
}

export class CNPJService {
  private readonly baseURL = 'https://www.receitaws.com.br/v1/cnpj'
  private readonly cache = new Map<string, { data: CNPJData; timestamp: number }>()
  private readonly cacheTimeout = 1000 * 60 * 60 * 24 // 24 horas

  /**
   * Busca dados de um CNPJ na ReceitaWS
   */
  async search(cnpj: string): Promise<CNPJData> {
    try {
      // Remove caracteres não numéricos
      const cleanCNPJ = cnpj.replace(/\D/g, '')

      if (cleanCNPJ.length !== 14) {
        throw new Error('CNPJ inválido. Deve conter 14 dígitos.')
      }

      // Verifica cache
      const cached = this.cache.get(cleanCNPJ)
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        logger.info('CNPJ data retrieved from cache', { cnpj: cleanCNPJ })
        return cached.data
      }

      // Faz requisição à API
      logger.info('Fetching CNPJ data from ReceitaWS', { cnpj: cleanCNPJ })

      const response = await fetch(`${this.baseURL}/${cleanCNPJ}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Limite de requisições excedido. Tente novamente em alguns minutos.')
        }
        throw new Error(`Erro ao consultar CNPJ: ${response.status} ${response.statusText}`)
      }

      const rawData: ReceitaWSResponse = await response.json()

      // Verifica se houve erro na resposta
      if (rawData.status === 'ERROR') {
        throw new Error(rawData.message || 'Erro ao consultar CNPJ')
      }

      // Mapeia resposta para formato interno
      const data: CNPJData = {
        cnpj: this.formatCNPJ(rawData.cnpj || cleanCNPJ),
        razao_social: rawData.nome || '',
        nome_fantasia: rawData.fantasia || '',
        logradouro: rawData.logradouro || '',
        numero: rawData.numero || '',
        complemento: rawData.complemento || '',
        bairro: rawData.bairro || '',
        municipio: rawData.municipio || '',
        uf: rawData.uf || '',
        cep: rawData.cep || '',
        telefone: rawData.telefone || '',
        email: rawData.email || '',
        situacao: rawData.situacao || '',
        data_situacao: rawData.data_situacao || '',
        atividade_principal: rawData.atividade_principal || [],
        atividades_secundarias: rawData.atividades_secundarias || [],
        natureza_juridica: rawData.natureza_juridica || '',
        capital_social: rawData.capital_social || '',
        porte: rawData.porte || ''
      }

      // Armazena em cache
      this.cache.set(cleanCNPJ, {
        data,
        timestamp: Date.now()
      })

      logger.info('CNPJ data fetched successfully', { cnpj: cleanCNPJ })

      return data
    } catch (error) {
      logger.error('Error fetching CNPJ data', { error, cnpj })
      
      if (error instanceof Error) {
        throw error
      }
      
      throw new Error('Erro ao consultar CNPJ. Verifique o número e tente novamente.')
    }
  }

  /**
   * Valida formato de CNPJ
   */
  validate(cnpj: string): boolean {
    const cleanCNPJ = cnpj.replace(/\D/g, '')

    if (cleanCNPJ.length !== 14) return false

    // Validação do dígito verificador
    let tamanho = cleanCNPJ.length - 2
    let numeros = cleanCNPJ.substring(0, tamanho)
    const digitos = cleanCNPJ.substring(tamanho)
    let soma = 0
    let pos = tamanho - 7

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--
      if (pos < 2) pos = 9
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
    if (resultado !== parseInt(digitos.charAt(0))) return false

    tamanho = tamanho + 1
    numeros = cleanCNPJ.substring(0, tamanho)
    soma = 0
    pos = tamanho - 7

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--
      if (pos < 2) pos = 9
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
    if (resultado !== parseInt(digitos.charAt(1))) return false

    return true
  }

  /**
   * Formata CNPJ para exibição (XX.XXX.XXX/XXXX-XX)
   */
  formatCNPJ(cnpj: string): string {
    const cleanCNPJ = cnpj.replace(/\D/g, '')
    
    if (cleanCNPJ.length !== 14) return cnpj

    return cleanCNPJ.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      '$1.$2.$3/$4-$5'
    )
  }

  /**
   * Limpa cache
   */
  clearCache(): void {
    this.cache.clear()
    logger.info('CNPJ cache cleared')
  }
}

export const cnpjService = new CNPJService()

