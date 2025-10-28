/**
 * Formulário para criação e edição de Fornecedores
 * Inclui busca automática de dados via CNPJ (ReceitaWS)
 */

import React, { useState } from 'react'
import { Search, Loader, CheckCircle, AlertCircle, Building2, Mail, Phone, MapPin } from 'lucide-react'
import { cnpjService } from '../../../core/services/cnpj.service'
import { Button } from '../../../components/ui/atoms/Button'
import { Input } from '../../../components/ui/atoms/Input'
import type { Supplier } from '../types'

interface SupplierFormProps {
  supplier?: Supplier | null
  onSubmit: (data: SupplierFormData) => Promise<void>
  onCancel: () => void
}

export interface SupplierFormData {
  cnpj: string
  razao_social: string
  nome_fantasia?: string
  email?: string
  telefone?: string
  endereco?: string
  cidade?: string
  estado?: string
  cep?: string
  observacoes?: string
  is_active: boolean
}

export function SupplierForm({ supplier, onSubmit, onCancel }: SupplierFormProps) {
  const [formData, setFormData] = useState<SupplierFormData>({
    cnpj: supplier?.cnpj || '',
    razao_social: supplier?.razao_social || '',
    nome_fantasia: supplier?.nome_fantasia || '',
    email: supplier?.email || '',
    telefone: supplier?.telefone || '',
    endereco: supplier?.endereco || '',
    cidade: supplier?.cidade || '',
    estado: supplier?.estado || '',
    cep: supplier?.cep || '',
    observacoes: supplier?.observacoes || '',
    is_active: supplier?.is_active ?? true
  })

  const [cnpjSearch, setCnpjSearch] = useState('')
  const [searchingCNPJ, setSearchingCNPJ] = useState(false)
  const [cnpjError, setCnpjError] = useState<string | null>(null)
  const [cnpjSuccess, setCnpjSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleCNPJSearch = async () => {
    setCnpjError(null)
    setCnpjSuccess(false)

    // Validação básica
    if (!cnpjService.validate(cnpjSearch)) {
      setCnpjError('CNPJ inválido')
      return
    }

    try {
      setSearchingCNPJ(true)

      const data = await cnpjService.search(cnpjSearch)

      // Preenche formulário com dados retornados
      setFormData({
        ...formData,
        cnpj: data.cnpj,
        razao_social: data.razao_social,
        nome_fantasia: data.nome_fantasia || '',
        email: data.email || '',
        telefone: data.telefone || '',
        endereco: `${data.logradouro}${data.numero ? ', ' + data.numero : ''}${data.complemento ? ' - ' + data.complemento : ''}`,
        cidade: data.municipio || '',
        estado: data.uf || '',
        cep: data.cep || ''
      })

      setCnpjSuccess(true)
      
      // Limpa success message após 3s
      setTimeout(() => setCnpjSuccess(false), 3000)
    } catch (error) {
      setCnpjError(error instanceof Error ? error.message : 'Erro ao consultar CNPJ')
    } finally {
      setSearchingCNPJ(false)
    }
  }

  const handleCNPJKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleCNPJSearch()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!cnpjService.validate(formData.cnpj)) {
      setCnpjError('CNPJ inválido')
      return
    }

    try {
      setSubmitting(true)
      await onSubmit(formData)
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (field: keyof SupplierFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Busca CNPJ */}
      {!supplier && (
        <div className="bg-gradient-to-br from-primary-50 to-brand-cyan/10 rounded-2xl p-6 border border-primary-200">
          <div className="flex items-center space-x-2 mb-4">
            <Building2 className="w-5 h-5 text-primary-600" />
            <h3 className="font-bold text-primary-900">Buscar Dados do Fornecedor</h3>
          </div>
          
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                value={cnpjSearch}
                onChange={(e) => setCnpjSearch(e.target.value)}
                onKeyPress={handleCNPJKeyPress}
                placeholder="Digite o CNPJ (apenas números)"
                disabled={searchingCNPJ}
                className="w-full"
              />
            </div>
            <Button
              type="button"
              onClick={handleCNPJSearch}
              disabled={searchingCNPJ || !cnpjSearch}
              variant="primary"
              className="flex items-center space-x-2"
            >
              {searchingCNPJ ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Buscando...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Buscar</span>
                </>
              )}
            </Button>
          </div>

          {cnpjError && (
            <div className="mt-3 flex items-center space-x-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span>{cnpjError}</span>
            </div>
          )}

          {cnpjSuccess && (
            <div className="mt-3 flex items-center space-x-2 text-sm text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span>Dados carregados com sucesso!</span>
            </div>
          )}
        </div>
      )}

      {/* Dados Principais */}
      <div className="bg-white rounded-2xl p-6 border border-neutral-200">
        <h3 className="font-bold text-neutral-800 mb-4">Dados Principais</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              CNPJ *
            </label>
            <Input
              value={formData.cnpj}
              onChange={(e) => handleChange('cnpj', e.target.value)}
              placeholder="00.000.000/0000-00"
              required
              disabled={!!supplier}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Razão Social *
            </label>
            <Input
              value={formData.razao_social}
              onChange={(e) => handleChange('razao_social', e.target.value)}
              placeholder="Razão Social da Empresa"
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Nome Fantasia
            </label>
            <Input
              value={formData.nome_fantasia || ''}
              onChange={(e) => handleChange('nome_fantasia', e.target.value)}
              placeholder="Nome Fantasia"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center space-x-1">
              <Mail className="w-4 h-4" />
              <span>E-mail</span>
            </label>
            <Input
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="contato@empresa.com"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center space-x-1">
              <Phone className="w-4 h-4" />
              <span>Telefone</span>
            </label>
            <Input
              value={formData.telefone || ''}
              onChange={(e) => handleChange('telefone', e.target.value)}
              placeholder="(00) 0000-0000"
              className="w-full"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>Endereço</span>
            </label>
            <Input
              value={formData.endereco || ''}
              onChange={(e) => handleChange('endereco', e.target.value)}
              placeholder="Rua, Número, Complemento"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Cidade
            </label>
            <Input
              value={formData.cidade || ''}
              onChange={(e) => handleChange('cidade', e.target.value)}
              placeholder="Cidade"
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Estado
              </label>
              <Input
                value={formData.estado || ''}
                onChange={(e) => handleChange('estado', e.target.value)}
                placeholder="UF"
                maxLength={2}
                className="w-full uppercase"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                CEP
              </label>
              <Input
                value={formData.cep || ''}
                onChange={(e) => handleChange('cep', e.target.value)}
                placeholder="00000-000"
                className="w-full"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Observações
            </label>
            <textarea
              value={formData.observacoes || ''}
              onChange={(e) => handleChange('observacoes', e.target.value)}
              placeholder="Observações adicionais sobre o fornecedor"
              rows={3}
              className="w-full px-4 py-2 rounded-xl border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors"
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => handleChange('is_active', e.target.checked)}
                className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-neutral-700">Fornecedor Ativo</span>
            </label>
          </div>
        </div>
      </div>

      {/* Ações */}
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={submitting}
          className="flex items-center space-x-2"
        >
          {submitting ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              <span>Salvando...</span>
            </>
          ) : (
            <span>{supplier ? 'Atualizar' : 'Criar'} Fornecedor</span>
          )}
        </Button>
      </div>
    </form>
  )
}

