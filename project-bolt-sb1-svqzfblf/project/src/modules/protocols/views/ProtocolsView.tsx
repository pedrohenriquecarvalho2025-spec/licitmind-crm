/**
 * View simplificada de Protocolos Administrativos
 */

import React, { useState } from 'react'
import { FileText, Plus } from 'lucide-react'
import { Button } from '../../../components/ui/atoms/Button'

export function ProtocolsView() {
  const [protocols] = useState([])

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-800">Protocolos Administrativos</h1>
            <p className="text-neutral-600 mt-1">Gestão de protocolos, recursos e impugnações</p>
          </div>
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Novo Protocolo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow-brand p-6 border border-neutral-200">
            <div className="text-2xl font-bold text-neutral-800">0</div>
            <div className="text-sm text-neutral-600">Total de Protocolos</div>
          </div>
          <div className="bg-yellow-50 rounded-2xl shadow-brand p-6 border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-800">0</div>
            <div className="text-sm text-yellow-700">Aguardando Resposta</div>
          </div>
          <div className="bg-blue-50 rounded-2xl shadow-brand p-6 border border-blue-200">
            <div className="text-2xl font-bold text-blue-800">0</div>
            <div className="text-sm text-blue-700">Em Análise</div>
          </div>
          <div className="bg-green-50 rounded-2xl shadow-brand p-6 border border-green-200">
            <div className="text-2xl font-bold text-green-800">0</div>
            <div className="text-sm text-green-700">Deferidos</div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      <div className="bg-white rounded-2xl shadow-brand border border-neutral-200 p-12 text-center">
        <FileText className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-neutral-800 mb-2">Nenhum protocolo cadastrado</h3>
        <p className="text-neutral-600 mb-4">
          Comece criando seu primeiro protocolo administrativo
        </p>
        <Button variant="primary">
          <Plus className="w-4 h-4 mr-2" />
          Novo Protocolo
        </Button>
      </div>
    </div>
  )
}

