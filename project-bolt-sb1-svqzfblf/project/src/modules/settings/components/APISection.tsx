/**
 * Seção de API nas Configurações
 * Gerenciamento de tokens e documentação da API
 */

import React, { useState } from 'react'
import { Key, Plus, Trash2, Copy, ExternalLink, BookOpen } from 'lucide-react'
import { Button } from '../../../components/ui/atoms/Button'
import { Input } from '../../../components/ui/atoms/Input'

interface ApiToken {
  id: string
  name: string
  token: string
  createdAt: string
  lastUsed: string | null
}

export function APISection() {
  const [tokens, setTokens] = useState<ApiToken[]>([
    {
      id: '1',
      name: 'Token de Desenvolvimento',
      token: 'lict_dev_1234567890abcdef',
      createdAt: '2024-10-01',
      lastUsed: '2024-10-28'
    }
  ])

  const [showNewTokenDialog, setShowNewTokenDialog] = useState(false)
  const [newTokenName, setNewTokenName] = useState('')

  const generateToken = () => {
    const randomToken = `lict_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
    const newToken: ApiToken = {
      id: Date.now().toString(),
      name: newTokenName || 'Novo Token',
      token: randomToken,
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: null
    }

    setTokens(prev => [...prev, newToken])
    setNewTokenName('')
    setShowNewTokenDialog(false)
    alert('Token criado com sucesso! Copie-o agora, pois não será exibido novamente.')
  }

  const deleteToken = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este token?')) {
      setTokens(prev => prev.filter(t => t.id !== id))
    }
  }

  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token)
    alert('Token copiado!')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-neutral-800 mb-2">API Pública</h3>
          <p className="text-neutral-600">Gerencie tokens de acesso à API RESTful</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowNewTokenDialog(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Token
        </Button>
      </div>

      {/* Documentação da API */}
      <div className="bg-gradient-to-br from-primary-500 to-brand-cyan rounded-2xl shadow-brand p-8 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xl font-bold">Documentação da API</h4>
            <p className="text-primary-100 text-sm">Guia completo para desenvolvedores</p>
          </div>
        </div>
        <p className="text-primary-100 mb-6">
          A API RESTful do LicitMind permite integração completa com sistemas externos.
          Acesse editais, contratos, entregas e muito mais via HTTP.
        </p>
        <div className="flex space-x-3">
          <Button className="bg-white text-primary-600 hover:bg-primary-50">
            <ExternalLink className="w-4 h-4 mr-2" />
            Ver Documentação
          </Button>
          <Button className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20">
            Exemplos de Código
          </Button>
        </div>
      </div>

      {/* Dialog de Novo Token */}
      {showNewTokenDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-brand-lg p-6 max-w-md w-full mx-4">
            <h4 className="text-xl font-bold text-neutral-800 mb-4">Criar Novo Token</h4>
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Nome do Token
              </label>
              <Input
                value={newTokenName}
                onChange={(e) => setNewTokenName(e.target.value)}
                placeholder="Ex: Token de Produção"
                className="w-full"
              />
            </div>
            <div className="flex space-x-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowNewTokenDialog(false)
                  setNewTokenName('')
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={generateToken}
                className="flex-1"
              >
                Criar Token
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Tokens */}
      <div className="space-y-4">
        <h4 className="font-bold text-neutral-800">Tokens Ativos</h4>
        {tokens.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-brand border border-neutral-200 p-12 text-center">
            <Key className="w-12 h-12 text-neutral-300 mx-auto mb-2" />
            <p className="text-neutral-600">Nenhum token criado</p>
          </div>
        ) : (
          tokens.map((token) => (
            <div
              key={token.id}
              className="bg-white rounded-2xl shadow-brand border border-neutral-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h5 className="font-bold text-neutral-800 mb-1">{token.name}</h5>
                  <div className="flex items-center space-x-4 text-sm text-neutral-600">
                    <span>Criado: {new Date(token.createdAt).toLocaleDateString('pt-BR')}</span>
                    {token.lastUsed && (
                      <span>Último uso: {new Date(token.lastUsed).toLocaleDateString('pt-BR')}</span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteToken(token.id)}
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
                <label className="block text-xs font-medium text-neutral-700 mb-2">
                  Token
                </label>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 text-sm font-mono text-neutral-800 bg-white rounded-lg px-3 py-2 border border-neutral-300">
                    {token.token}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToken(token.token)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Endpoints da API */}
      <div className="bg-white rounded-2xl shadow-brand border border-neutral-200 p-6">
        <h4 className="font-bold text-neutral-800 mb-4">Endpoints Disponíveis</h4>
        <div className="space-y-2">
          <EndpointItem method="GET" path="/api/v1/editals" description="Listar editais" />
          <EndpointItem method="POST" path="/api/v1/editals" description="Criar edital" />
          <EndpointItem method="GET" path="/api/v1/contracts" description="Listar contratos" />
          <EndpointItem method="GET" path="/api/v1/deliveries" description="Listar entregas" />
          <EndpointItem method="GET" path="/api/v1/quotations" description="Listar cotações" />
          <EndpointItem method="GET" path="/api/v1/suppliers" description="Listar fornecedores" />
        </div>
      </div>

      {/* Info */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
        <h4 className="font-bold text-yellow-900 mb-2">⚠️ Segurança</h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Mantenha seus tokens em segurança</li>
          <li>• Nunca compartilhe tokens publicamente</li>
          <li>• Use tokens diferentes para produção e desenvolvimento</li>
          <li>• Revogue tokens comprometidos imediatamente</li>
        </ul>
      </div>
    </div>
  )
}

function EndpointItem({ method, path, description }: { method: string; path: string; description: string }) {
  const methodColors: Record<string, string> = {
    GET: 'bg-blue-100 text-blue-700',
    POST: 'bg-green-100 text-green-700',
    PUT: 'bg-yellow-100 text-yellow-700',
    DELETE: 'bg-red-100 text-red-700'
  }

  return (
    <div className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
      <span className={`px-2 py-1 rounded text-xs font-bold ${methodColors[method]}`}>
        {method}
      </span>
      <code className="flex-1 text-sm font-mono text-neutral-700">{path}</code>
      <span className="text-sm text-neutral-600">{description}</span>
    </div>
  )
}

