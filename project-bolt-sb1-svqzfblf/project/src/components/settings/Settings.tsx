import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../contexts/ThemeContext'
import { Button } from '../ui/atoms/Button'
import { Input } from '../ui/atoms/Input'
import { Spinner as LoadingSpinner } from '../ui/atoms/Spinner'
import { 
  Building, 
  Users, 
  Settings as SettingsIcon, 
  Save,
  AlertCircle,
  CheckCircle,
  Database,
  Shield,
  Bell,
  Sun,
  Moon,
  Palette
} from 'lucide-react'

export function Settings() {
  const { profile } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  const [organizationData, setOrganizationData] = useState({
    name: '',
    slug: '',
  })

  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
  })

  useEffect(() => {
    loadData()
  }, [profile])

  const loadData = async () => {
    if (!profile?.organization_id) return

    try {
      setLoading(true)

      // Carregar dados da organização
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', profile.organization_id)
        .single()

      if (orgError) throw orgError

      setOrganizationData({
        name: orgData.name,
        slug: orgData.slug,
      })

      setProfileData({
        full_name: profile.full_name,
        email: profile.email,
      })
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveOrganization = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile?.organization_id) return

    try {
      setSaving(true)
      setMessage(null)

      const { error } = await supabase
        .from('organizations')
        .update({
          name: organizationData.name,
          slug: organizationData.slug,
        })
        .eq('id', profile.organization_id)

      if (error) throw error

      setMessage({ type: 'success', text: 'Dados da organização atualizados com sucesso!' })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setSaving(true)
      setMessage(null)

      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: profileData.full_name,
          email: profileData.email,
        })
        .eq('id', profile?.id)

      if (error) throw error

      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Message */}
      {message && (
        <div className={`flex items-center space-x-2 p-4 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Appearance Settings */}
      <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-brand-cyan to-brand-blue rounded-xl flex items-center justify-center">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Aparência</h2>
            <p className="text-neutral-600 dark:text-neutral-400 font-medium">Personalize o tema do sistema</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-xl border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center space-x-4">
              {theme === 'light' ? (
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <Sun className="w-5 h-5 text-white" />
                </div>
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Moon className="w-5 h-5 text-white" />
                </div>
              )}
              <div>
                <p className="font-bold text-neutral-900 dark:text-white">
                  {theme === 'light' ? 'Modo Claro' : 'Modo Escuro'}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {theme === 'light' ? 'Interface clara e vibrante' : 'Interface escura e confortável'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="px-6 py-2.5 bg-gradient-to-r from-brand-cyan to-brand-blue text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Alternar
            </button>
          </div>
        </div>
      </div>

      {/* Organization Settings */}
      <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-6">
          <Building className="w-6 h-6 text-gray-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Organização</h2>
            <p className="text-gray-600">Configurações da sua organização</p>
          </div>
        </div>

        <form onSubmit={handleSaveOrganization} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nome da Organização"
              value={organizationData.name}
              onChange={(e) => setOrganizationData(prev => ({ ...prev, name: e.target.value }))}
              required
              placeholder="Nome da empresa"
            />

            <Input
              label="Slug (URL amigável)"
              value={organizationData.slug}
              onChange={(e) => setOrganizationData(prev => ({ ...prev, slug: e.target.value }))}
              required
              placeholder="minha-empresa"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" loading={saving}>
              <Save className="w-4 h-4 mr-2" />
              Salvar Organização
            </Button>
          </div>
        </form>
      </div>

      {/* Profile Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Users className="w-6 h-6 text-gray-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Perfil Pessoal</h2>
            <p className="text-gray-600">Suas informações pessoais</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nome Completo"
              value={profileData.full_name}
              onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
              required
              placeholder="Seu nome completo"
            />

            <Input
              label="Email"
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
              required
              placeholder="seu@email.com"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" loading={saving}>
              <Save className="w-4 h-4 mr-2" />
              Salvar Perfil
            </Button>
          </div>
        </form>
      </div>

      {/* System Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Database className="w-6 h-6 text-gray-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Informações do Sistema</h2>
            <p className="text-gray-600">Status e configurações do sistema</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Sistema Online</h3>
            <p className="text-sm text-gray-600">Funcionando normalmente</p>
          </div>

          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Shield className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Segurança</h3>
            <p className="text-sm text-gray-600">RLS ativo</p>
          </div>

          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <Bell className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Notificações</h3>
            <p className="text-sm text-gray-600">Ativas</p>
          </div>
        </div>
      </div>
    </div>
  )
}