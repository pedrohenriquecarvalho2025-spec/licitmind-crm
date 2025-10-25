import React, { useState, useEffect } from 'react'
import { Building2, Plus, Search, Edit2, Trash2, Phone, Mail, MapPin } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/atoms/Button'
import { Input } from '../ui/atoms/Input'
import { Spinner as LoadingSpinner } from '../ui/atoms/Spinner'
import { SupplierForm } from './SupplierForm'

interface Supplier {
  id: string
  cnpj: string
  razao_social: string
  nome_fantasia: string | null
  email: string | null
  telefone: string | null
  cidade: string | null
  estado: string | null
  is_active: boolean
}

export function SuppliersManager() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const { profile } = useAuth()

  useEffect(() => {
    loadSuppliers()
  }, [profile])

  const loadSuppliers = async () => {
    if (!profile?.organization_id) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('organization_id', profile.organization_id)
        .order('razao_social')

      if (error) throw error
      setSuppliers(data || [])
    } catch (error) {
      console.error('Error loading suppliers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este fornecedor?')) return

    try {
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id)

      if (error) throw error
      loadSuppliers()
    } catch (error) {
      console.error('Error deleting supplier:', error)
      alert('Erro ao excluir fornecedor')
    }
  }

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.razao_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.cnpj.includes(searchTerm) ||
    supplier.nome_fantasia?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-brand-cyan to-primary-500 rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-neutral-800">Fornecedores</h2>
            <p className="text-sm text-neutral-600">{suppliers.length} fornecedores cadastrados</p>
          </div>
        </div>
        <Button onClick={() => { setSelectedSupplier(null); setShowForm(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Fornecedor
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Buscar por razão social, CNPJ ou nome fantasia..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-neutral-800 mb-1">{supplier.razao_social}</h3>
                {supplier.nome_fantasia && (
                  <p className="text-sm text-neutral-600 mb-2">{supplier.nome_fantasia}</p>
                )}
                <p className="text-xs text-neutral-500 font-mono">{supplier.cnpj}</p>
              </div>
              <div className={`w-3 h-3 rounded-full ${supplier.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
            </div>

            <div className="space-y-2 mb-4">
              {supplier.email && (
                <div className="flex items-center text-sm text-neutral-600">
                  <Mail className="w-4 h-4 mr-2 text-neutral-400" />
                  {supplier.email}
                </div>
              )}
              {supplier.telefone && (
                <div className="flex items-center text-sm text-neutral-600">
                  <Phone className="w-4 h-4 mr-2 text-neutral-400" />
                  {supplier.telefone}
                </div>
              )}
              {supplier.cidade && supplier.estado && (
                <div className="flex items-center text-sm text-neutral-600">
                  <MapPin className="w-4 h-4 mr-2 text-neutral-400" />
                  {supplier.cidade}/{supplier.estado}
                </div>
              )}
            </div>

            <div className="flex space-x-2 pt-4 border-t border-neutral-100">
              <button
                onClick={() => { setSelectedSupplier(supplier); setShowForm(true); }}
                className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                <span className="text-sm font-medium">Editar</span>
              </button>
              <button
                onClick={() => handleDelete(supplier.id)}
                className="flex items-center justify-center px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredSuppliers.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-500">Nenhum fornecedor encontrado</p>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <SupplierForm
          supplier={selectedSupplier}
          onClose={() => { setShowForm(false); setSelectedSupplier(null); }}
          onSuccess={() => { setShowForm(false); setSelectedSupplier(null); loadSuppliers(); }}
        />
      )}
    </div>
  )
}
