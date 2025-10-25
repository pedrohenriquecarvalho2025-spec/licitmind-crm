import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { ModalBase as Modal } from '../ui/molecules/ModalBase'
import { Input } from '../ui/atoms/Input'
import { Button } from '../ui/atoms/Button'

interface SupplierFormProps {
  supplier: any | null
  onClose: () => void
  onSuccess: () => void
}

export function SupplierForm({ supplier, onClose, onSuccess }: SupplierFormProps) {
  const { profile, user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    cnpj: '',
    razao_social: '',
    nome_fantasia: '',
    email: '',
    telefone: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    contato_principal: '',
    observacoes: '',
    is_active: true
  })

  useEffect(() => {
    if (supplier) {
      setFormData({
        cnpj: supplier.cnpj || '',
        razao_social: supplier.razao_social || '',
        nome_fantasia: supplier.nome_fantasia || '',
        email: supplier.email || '',
        telefone: supplier.telefone || '',
        endereco: supplier.endereco || '',
        cidade: supplier.cidade || '',
        estado: supplier.estado || '',
        cep: supplier.cep || '',
        contato_principal: supplier.contato_principal || '',
        observacoes: supplier.observacoes || '',
        is_active: supplier.is_active ?? true
      })
    }
  }, [supplier])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile?.organization_id || !user?.id) return

    try {
      setLoading(true)

      const data = {
        ...formData,
        organization_id: profile.organization_id,
        created_by: user.id
      }

      if (supplier) {
        const { error } = await supabase
          .from('suppliers')
          .update(data)
          .eq('id', supplier.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('suppliers')
          .insert([data])

        if (error) throw error
      }

      onSuccess()
    } catch (error: any) {
      console.error('Error saving supplier:', error)
      alert(error.message || 'Erro ao salvar fornecedor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal onClose={onClose} title={supplier ? 'Editar Fornecedor' : 'Novo Fornecedor'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="CNPJ"
            value={formData.cnpj}
            onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
            required
            placeholder="00.000.000/0000-00"
          />
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-brand-cyan rounded"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-neutral-700">
              Ativo
            </label>
          </div>
        </div>

        <Input
          label="Razão Social"
          value={formData.razao_social}
          onChange={(e) => setFormData({ ...formData, razao_social: e.target.value })}
          required
        />

        <Input
          label="Nome Fantasia"
          value={formData.nome_fantasia}
          onChange={(e) => setFormData({ ...formData, nome_fantasia: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            label="Telefone"
            value={formData.telefone}
            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
          />
        </div>

        <Input
          label="Endereço"
          value={formData.endereco}
          onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
        />

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="CEP"
            value={formData.cep}
            onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
            placeholder="00000-000"
          />
          <Input
            label="Cidade"
            value={formData.cidade}
            onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
          />
          <Input
            label="Estado"
            value={formData.estado}
            onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
            placeholder="UF"
            maxLength={2}
          />
        </div>

        <Input
          label="Contato Principal"
          value={formData.contato_principal}
          onChange={(e) => setFormData({ ...formData, contato_principal: e.target.value })}
        />

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Observações
          </label>
          <textarea
            value={formData.observacoes}
            onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
          />
        </div>

        <div className="flex space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Salvando...' : supplier ? 'Atualizar' : 'Criar'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
