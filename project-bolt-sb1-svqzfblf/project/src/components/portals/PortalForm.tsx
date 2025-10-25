import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { ModalBase as Modal } from '../ui/molecules/ModalBase'
import { Input } from '../ui/atoms/Input'
import { Select } from '../ui/molecules/Select'
import { Button } from '../ui/atoms/Button'

interface PortalFormProps {
  portal: any | null
  onClose: () => void
  onSuccess: () => void
}

export function PortalForm({ portal, onClose, onSuccess }: PortalFormProps) {
  const { profile, user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome_portal: '',
    url: '',
    tipo: 'federal',
    usuario: '',
    email_acesso: '',
    certificado_digital: false,
    data_cadastro: '',
    data_ultima_atualizacao: '',
    data_validade_acesso: '',
    observacoes: '',
    alerta_vencimento_dias: 30
  })

  useEffect(() => {
    if (portal) {
      setFormData({
        nome_portal: portal.nome_portal || '',
        url: portal.url || '',
        tipo: portal.tipo || 'federal',
        usuario: portal.usuario || '',
        email_acesso: portal.email_acesso || '',
        certificado_digital: portal.certificado_digital || false,
        data_cadastro: portal.data_cadastro || '',
        data_ultima_atualizacao: portal.data_ultima_atualizacao || '',
        data_validade_acesso: portal.data_validade_acesso || '',
        observacoes: portal.observacoes || '',
        alerta_vencimento_dias: portal.alerta_vencimento_dias || 30
      })
    }
  }, [portal])

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

      if (portal) {
        const { error } = await supabase
          .from('bidding_portals')
          .update(data)
          .eq('id', portal.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('bidding_portals')
          .insert([data])

        if (error) throw error
      }

      onSuccess()
    } catch (error: any) {
      console.error('Error saving portal:', error)
      alert(error.message || 'Erro ao salvar portal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal onClose={onClose} title={portal ? 'Editar Portal' : 'Novo Portal'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nome do Portal"
          value={formData.nome_portal}
          onChange={(e) => setFormData({ ...formData, nome_portal: e.target.value })}
          required
          placeholder="Ex: ComprasNet, Licitações-e, BLL"
        />

        <Input
          label="URL"
          type="url"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          placeholder="https://..."
        />

        <Select
          label="Tipo"
          value={formData.tipo}
          onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
        >
          <option value="federal">Federal</option>
          <option value="estadual">Estadual</option>
          <option value="municipal">Municipal</option>
          <option value="privado">Privado</option>
          <option value="outros">Outros</option>
        </Select>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Usuário"
            value={formData.usuario}
            onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
            placeholder="Nome de usuário"
          />
          <Input
            label="Email de Acesso"
            type="email"
            value={formData.email_acesso}
            onChange={(e) => setFormData({ ...formData, email_acesso: e.target.value })}
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="certificado_digital"
            checked={formData.certificado_digital}
            onChange={(e) => setFormData({ ...formData, certificado_digital: e.target.checked })}
            className="w-4 h-4 text-brand-cyan rounded"
          />
          <label htmlFor="certificado_digital" className="text-sm font-medium text-neutral-700">
            Requer Certificado Digital
          </label>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Data Cadastro"
            type="date"
            value={formData.data_cadastro}
            onChange={(e) => setFormData({ ...formData, data_cadastro: e.target.value })}
          />
          <Input
            label="Última Atualização"
            type="date"
            value={formData.data_ultima_atualizacao}
            onChange={(e) => setFormData({ ...formData, data_ultima_atualizacao: e.target.value })}
          />
          <Input
            label="Validade Acesso"
            type="date"
            value={formData.data_validade_acesso}
            onChange={(e) => setFormData({ ...formData, data_validade_acesso: e.target.value })}
          />
        </div>

        <Input
          label="Alertar com (dias de antecedência)"
          type="number"
          value={formData.alerta_vencimento_dias}
          onChange={(e) => setFormData({ ...formData, alerta_vencimento_dias: parseInt(e.target.value) })}
          min="1"
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
            placeholder="Informações adicionais sobre o portal..."
          />
        </div>

        <div className="flex space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Salvando...' : portal ? 'Atualizar' : 'Criar'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
