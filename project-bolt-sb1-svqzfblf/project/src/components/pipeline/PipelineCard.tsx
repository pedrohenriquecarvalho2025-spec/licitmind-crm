import React from 'react'
import { Clock, DollarSign, AlertTriangle, CheckCircle, Eye, CreditCard as Edit, Trash2 } from 'lucide-react'
import type { Database } from '../../lib/database.types'

type Edital = Database['public']['Tables']['editals']['Row'] & {
  responsavel: { full_name: string } | null
}

interface PipelineCardProps {
  edital: Edital
  onViewDetails?: (edital: Edital) => void
  onEdit?: (edital: Edital) => void
  onDelete?: (edital: Edital) => void
}

const modalidadeLabels = {
  concorrencia: 'Concorrência',
  pregao_presencial: 'Pregão Presencial',
  pregao_eletronico: 'Pregão Eletrônico',
  tomada_precos: 'Tomada de Preços',
  convite: 'Convite',
  dispensa: 'Dispensa',
  inexigibilidade: 'Inexigibilidade',
  rdc: 'RDC',
}

export function PipelineCard({ edital, onViewDetails, onEdit, onDelete }: PipelineCardProps) {
  const [showActions, setShowActions] = React.useState(false)

  const getPriorityColor = () => {
    if (!edital.data_entrega_propostas) return 'text-neutral-500'

    const now = new Date()
    const deadline = new Date(edital.data_entrega_propostas)
    const daysUntil = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntil < 0) return 'text-red-600 bg-red-50 border-red-200'
    if (daysUntil <= 3) return 'text-red-600 bg-red-50 border-red-200'
    if (daysUntil <= 7) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-green-600 bg-green-50 border-green-200'
  }

  const getDeadlineMessage = () => {
    if (!edital.data_entrega_propostas) return null

    const now = new Date()
    const deadline = new Date(edital.data_entrega_propostas)
    const daysUntil = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntil < 0) return `Venceu há ${Math.abs(daysUntil)} dias`
    if (daysUntil === 0) return 'Vence hoje'
    if (daysUntil === 1) return 'Vence amanhã'
    return `Vence em ${daysUntil} dias`
  }

  const formatCurrency = (value: number | null) => {
    if (!value) return 'Valor não informado'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  const deadlineMessage = getDeadlineMessage()
  const priorityColor = getPriorityColor()

  return (
    <div
      className="group relative bg-white rounded-2xl border-2 border-gray-200 hover:border-brand-cyan hover:shadow-2xl hover:shadow-brand-cyan/20 transition-all duration-300 cursor-move overflow-hidden transform hover:scale-[1.02]"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      draggable
      onDragStart={(e) => e.dataTransfer.setData('text/plain', edital.id)}
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/5 via-transparent to-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Folder Tab */}
      <div className="absolute -top-4 left-4 z-10">
        <div className="relative">
          <div className="bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-blue-dark px-5 py-2 rounded-t-xl shadow-xl shadow-brand-cyan/30">
            <span className="text-xs font-black text-white tracking-wider">
              {edital.numero_edital}
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-cyan to-brand-blue rounded-t-xl blur-md opacity-60 animate-pulse" />
        </div>
      </div>

      {/* Card Content */}
      <div className="relative p-5 pt-7">
        {/* Header with Actions */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <span className="inline-flex items-center px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-lg border border-gray-300 shadow-sm">
              {modalidadeLabels[edital.modalidade]}
            </span>
          </div>

          {/* Actions Menu */}
          <div className={`flex items-center space-x-1 transition-all duration-300 ${showActions ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}`}>
            {onViewDetails && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onViewDetails(edital)
                }}
                className="p-2 bg-brand-cyan/10 hover:bg-brand-cyan hover:text-white text-brand-blue rounded-lg transition-all duration-200 transform hover:scale-110 shadow-sm"
                title="Visualizar detalhes"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(edital)
                }}
                className="p-2 bg-blue-50 hover:bg-blue-500 hover:text-white text-blue-600 rounded-lg transition-all duration-200 transform hover:scale-110 shadow-sm"
                title="Editar"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(edital)
                }}
                className="p-2 bg-red-50 hover:bg-red-500 hover:text-white text-red-600 rounded-lg transition-all duration-200 transform hover:scale-110 shadow-sm"
                title="Excluir"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <h4 className="font-bold text-gray-900 mb-4 line-clamp-2 leading-tight text-base">
          {edital.objeto}
        </h4>

        {/* Organization */}
        <div className="flex items-center space-x-3 mb-4 p-2 bg-gray-50 rounded-lg border border-gray-100">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-cyan/20 to-brand-blue/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-base">🏛️</span>
          </div>
          <span className="text-sm font-medium text-gray-700 truncate">{edital.orgao_entidade}</span>
        </div>

        {/* Value */}
        <div className="flex items-center space-x-3 mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
            <DollarSign className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-black text-green-900">
            {formatCurrency(edital.valor_estimado)}
          </span>
        </div>

        {/* Deadline Badge */}
        {deadlineMessage && (
          <div className={`flex items-center space-x-2 px-3 py-2.5 rounded-xl border-2 ${priorityColor} mb-4 shadow-sm`}>
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs font-black">
              {deadlineMessage}
            </span>
            {priorityColor.includes('red') && (
              <AlertTriangle className="w-4 h-4 flex-shrink-0 ml-auto animate-pulse" />
            )}
            {priorityColor.includes('green') && (
              <CheckCircle className="w-4 h-4 flex-shrink-0 ml-auto" />
            )}
          </div>
        )}

        {/* Responsible */}
        {edital.responsavel && (
          <div className="flex items-center space-x-3 pt-4 border-t-2 border-gray-100">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-cyan to-brand-blue rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-cyan/30">
              <span className="text-xs font-black text-white">
                {getInitials(edital.responsavel.full_name)}
              </span>
            </div>
            <span className="text-xs font-bold text-gray-700 truncate">
              {edital.responsavel.full_name}
            </span>
          </div>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-brand-cyan/10 via-brand-blue/5 to-transparent rounded-bl-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-brand-blue/10 to-transparent rounded-tr-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
    </div>
  )
}
