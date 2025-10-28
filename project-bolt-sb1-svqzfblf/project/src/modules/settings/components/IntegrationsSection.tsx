/**
 * Seção de Integrações nas Configurações
 */

import React, { useState } from 'react'
import { Link, Key, CheckCircle, XCircle, Copy, Eye, EyeOff } from 'lucide-react'
import { Button } from '../../../components/ui/atoms/Button'
import { Input } from '../../../components/ui/atoms/Input'

interface Integration {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  enabled: boolean
  apiKey?: string
}

export function IntegrationsSection() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'google-drive',
      name: 'Google Drive',
      description: 'Sincronize documentos com Google Drive',
      icon: <Link className="w-6 h-6" />,
      enabled: false
    },
    {
      id: 'receitaws',
      name: 'ReceitaWS',
      description: 'Busca automática de CNPJ',
      icon: <Key className="w-6 h-6" />,
      enabled: true,
      apiKey: 'RECEITAWS_PUBLIC_API'
    }
  ])

  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({})

  const toggleIntegration = (id: string) => {
    setIntegrations(prev =>
      prev.map(int =>
        int.id === id ? { ...int, enabled: !int.enabled } : int
      )
    )
  }

  const copyApiKey = (apiKey: string) => {
    navigator.clipboard.writeText(apiKey)
    alert('API Key copiada!')
  }

  const toggleShowApiKey = (id: string) => {
    setShowApiKey(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-neutral-800 mb-2">Integrações</h3>
        <p className="text-neutral-600">Conecte o LicitMind com outros serviços</p>
      </div>

      {/* Lista de Integrações */}
      <div className="space-y-4">
        {integrations.map((integration) => (
          <div
            key={integration.id}
            className="bg-white rounded-2xl shadow-brand border border-neutral-200 p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  integration.enabled
                    ? 'bg-green-100 text-green-600'
                    : 'bg-neutral-100 text-neutral-400'
                }`}>
                  {integration.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-bold text-neutral-800">{integration.name}</h4>
                    {integration.enabled ? (
                      <span className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        <span>Ativo</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 px-2 py-1 bg-neutral-100 text-neutral-600 text-xs font-medium rounded-full">
                        <XCircle className="w-3 h-3" />
                        <span>Inativo</span>
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-600 mb-4">{integration.description}</p>

                  {/* API Key */}
                  {integration.apiKey && integration.enabled && (
                    <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
                      <label className="block text-xs font-medium text-neutral-700 mb-2">
                        API Key
                      </label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type={showApiKey[integration.id] ? 'text' : 'password'}
                          value={integration.apiKey}
                          readOnly
                          className="flex-1 font-mono text-sm"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleShowApiKey(integration.id)}
                        >
                          {showApiKey[integration.id] ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyApiKey(integration.apiKey!)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Button
                variant={integration.enabled ? 'ghost' : 'primary'}
                onClick={() => toggleIntegration(integration.id)}
              >
                {integration.enabled ? 'Desativar' : 'Ativar'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h4 className="font-bold text-blue-900 mb-2">ℹ️ Sobre Integrações</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• As integrações permitem conectar o LicitMind com serviços externos</li>
          <li>• Mantenha suas API Keys em segurança</li>
          <li>• Algumas integrações podem ter custos adicionais</li>
          <li>• Entre em contato com o suporte para mais integrações</li>
        </ul>
      </div>
    </div>
  )
}

