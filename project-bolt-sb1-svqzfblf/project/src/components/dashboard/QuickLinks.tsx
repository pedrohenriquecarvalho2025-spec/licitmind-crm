import { useState, useEffect } from 'react'
import { ExternalLink, Plus, X, Edit2, Globe } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'

interface QuickLink {
  id: string
  title: string
  url: string
  description?: string
  icon_color: string
  created_by: string
}

export function QuickLinks() {
  const [links, setLinks] = useState<QuickLink[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingLink, setEditingLink] = useState<QuickLink | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    icon_color: 'from-brand-cyan to-brand-blue'
  })
  const { profile } = useAuth()

  const colorOptions = [
    { value: 'from-brand-cyan to-brand-blue', label: 'Azul' },
    { value: 'from-brand-tech-green to-emerald-500', label: 'Verde' },
    { value: 'from-brand-tech-purple to-purple-600', label: 'Roxo' },
    { value: 'from-brand-tech-orange to-orange-600', label: 'Laranja' },
    { value: 'from-pink-500 to-rose-500', label: 'Rosa' },
    { value: 'from-indigo-500 to-blue-600', label: 'Índigo' }
  ]

  useEffect(() => {
    loadLinks()
  }, [profile])

  const loadLinks = async () => {
    if (!profile?.organization_id) return

    const { data, error } = await supabase
      .from('quick_links')
      .select('*')
      .eq('organization_id', profile.organization_id)
      .order('created_at', { ascending: true })

    if (!error && data) {
      setLinks(data)
    }
  }

  const saveLink = async () => {
    if (!profile?.organization_id || !formData.title.trim() || !formData.url.trim()) return

    if (editingLink) {
      // Update
      await supabase
        .from('quick_links')
        .update(formData)
        .eq('id', editingLink.id)
    } else {
      // Create
      await supabase
        .from('quick_links')
        .insert({
          ...formData,
          organization_id: profile.organization_id,
          created_by: profile.id
        })
    }

    resetForm()
    loadLinks()
  }

  const deleteLink = async (id: string) => {
    await supabase
      .from('quick_links')
      .delete()
      .eq('id', id)
    
    loadLinks()
  }

  const resetForm = () => {
    setFormData({ title: '', url: '', description: '', icon_color: 'from-brand-cyan to-brand-blue' })
    setShowForm(false)
    setEditingLink(null)
  }

  const startEdit = (link: QuickLink) => {
    setEditingLink(link)
    setFormData({
      title: link.title,
      url: link.url,
      description: link.description || '',
      icon_color: link.icon_color
    })
    setShowForm(true)
  }

  const openLink = (url: string) => {
    // Ensure URL has protocol
    const fullUrl = url.startsWith('http') ? url : `https://${url}`
    window.open(fullUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-brand-cyan to-brand-blue rounded-xl flex items-center justify-center shadow-lg">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Acesso Rápido</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Portais e links favoritos</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-gradient-to-r from-brand-cyan to-brand-blue text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar</span>
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-6 p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <input
            type="text"
            placeholder="Nome do portal..."
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 mb-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-cyan text-neutral-900 dark:text-white"
          />
          
          <input
            type="text"
            placeholder="URL (ex: www.comprasnet.gov.br)"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            className="w-full px-4 py-2 mb-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-cyan text-neutral-900 dark:text-white"
          />
          
          <input
            type="text"
            placeholder="Descrição (opcional)..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 mb-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-cyan text-neutral-900 dark:text-white"
          />
          
          <div className="mb-3">
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              Cor do ícone:
            </label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setFormData({ ...formData, icon_color: color.value })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    formData.icon_color === color.value
                      ? `bg-gradient-to-r ${color.value} text-white shadow-lg`
                      : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  {color.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={resetForm}
              className="px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={saveLink}
              className="px-4 py-2 bg-gradient-to-r from-brand-cyan to-brand-blue text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              {editingLink ? 'Atualizar' : 'Salvar'}
            </button>
          </div>
        </div>
      )}

      {/* Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Globe className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
            <p className="text-neutral-500 dark:text-neutral-400">Nenhum link cadastrado</p>
            <p className="text-sm text-neutral-400 dark:text-neutral-500">Adicione portais que você acessa frequentemente</p>
          </div>
        ) : (
          links.map((link) => (
            <div
              key={link.id}
              className="group relative bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl p-4 hover:border-brand-cyan hover:shadow-xl transition-all cursor-pointer"
              onClick={() => openLink(link.url)}
            >
              {/* Edit/Delete Buttons */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    startEdit(link)
                  }}
                  className="p-1.5 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-lg transition-all"
                >
                  <Edit2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteLink(link.id)
                  }}
                  className="p-1.5 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg transition-all"
                >
                  <X className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                </button>
              </div>

              {/* Icon */}
              <div className={`w-12 h-12 bg-gradient-to-br ${link.icon_color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                <ExternalLink className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <h4 className="font-bold text-neutral-900 dark:text-white mb-1 truncate">
                {link.title}
              </h4>
              
              {link.description && (
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2 line-clamp-2">
                  {link.description}
                </p>
              )}
              
              <p className="text-xs text-brand-cyan dark:text-brand-cyan font-medium truncate">
                {link.url}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
