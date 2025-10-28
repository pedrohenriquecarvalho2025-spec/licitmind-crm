/**
 * Serviço de busca de CNPJ via ReceitaWS
 * Permite autocompletar dados de órgãos/empresas
 */

export interface CNPJData {
  cnpj: string
  razao_social: string
  nome_fantasia?: string
  uf: string
  municipio: string
  bairro?: string
  logradouro?: string
  numero?: string
  complemento?: string
  cep?: string
  telefone?: string
  email?: string
  atividade_principal?: {
    code: string
    text: string
  }[]
  situacao: string
  data_situacao: string
}

export class CNPJService {
  private static readonly API_URL = 'https://www.receitaws.com.br/v1/cnpj'

  /**
   * Busca dados de um CNPJ na ReceitaWS
   */
  static async buscarCNPJ(cnpj: string): Promise<CNPJData | null> {
    try {
      // Remove formatação do CNPJ
      const cnpjLimpo = cnpj.replace(/\D/g, '')

      if (cnpjLimpo.length !== 14) {
        throw new Error('CNPJ inválido')
      }

      const response = await fetch(`${this.API_URL}/${cnpjLimpo}`)
      
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Limite de requisições atingido. Tente novamente em alguns minutos.')
        }
        throw new Error('Erro ao buscar CNPJ')
      }

      const data = await response.json()

      if (data.status === 'ERROR') {
        throw new Error(data.message || 'CNPJ não encontrado')
      }

      return {
        cnpj: data.cnpj,
        razao_social: data.nome,
        nome_fantasia: data.fantasia,
        uf: data.uf,
        municipio: data.municipio,
        bairro: data.bairro,
        logradouro: data.logradouro,
        numero: data.numero,
        complemento: data.complemento,
        cep: data.cep,
        telefone: data.telefone,
        email: data.email,
        atividade_principal: data.atividade_principal,
        situacao: data.situacao,
        data_situacao: data.data_situacao,
      }
    } catch (error) {
      console.error('Erro ao buscar CNPJ:', error)
      throw error
    }
  }

  /**
   * Formata um CNPJ
   */
  static formatarCNPJ(cnpj: string): string {
    const cnpjLimpo = cnpj.replace(/\D/g, '')
    return cnpjLimpo.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
  }

  /**
   * Valida um CNPJ
   */
  static validarCNPJ(cnpj: string): boolean {
    const cnpjLimpo = cnpj.replace(/\D/g, '')

    if (cnpjLimpo.length !== 14) return false

    // Elimina CNPJs inválidos conhecidos
    if (/^(\d)\1{13}$/.test(cnpjLimpo)) return false

    // Validação dos dígitos verificadores
    let tamanho = cnpjLimpo.length - 2
    let numeros = cnpjLimpo.substring(0, tamanho)
    const digitos = cnpjLimpo.substring(tamanho)
    let soma = 0
    let pos = tamanho - 7

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--
      if (pos < 2) pos = 9
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
    if (resultado !== parseInt(digitos.charAt(0))) return false

    tamanho = tamanho + 1
    numeros = cnpjLimpo.substring(0, tamanho)
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
}

export const cnpjService = CNPJService
