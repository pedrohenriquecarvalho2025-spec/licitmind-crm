import React, { useState } from 'react'
import { PipelineCard } from './PipelineCard'
import { DollarSign, TrendingUp } from 'lucide-react'
import type { Database } from '../../lib/database.types'

type Edital = Database['public']['Tables']['editals']['Row'] & {
  responsavel: { full_name: string } | null
}

interface PipelineColumnProps {
  title: string
  color: string
  editals: Edital[]
  onStatusChange: (editalId: string, newStatus: string) => void
  canDrop: string
  onViewDetails?: (edital: Edital) => void
  onEdit?: (edital: Edital) => void
  onDelete?: (edital: Edital) => void
}

export function PipelineColumn({ title, color, editals, onStatusChange, canDrop, onViewDetails, onEdit, onDelete }: PipelineColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const editalId = e.dataTransfer.getData('text/plain')
    onStatusChange(editalId, canDrop)
  }

  const totalValue = editals.reduce((sum, edital) => sum + (edital.valor_estimado || 0), 0)
  const avgValue = editals.length > 0 ? totalValue / editals.length : 0

  return (
    <div className="flex-shrink-0 w-80">
      {/* Column Header */}
      <div className="relative bg-white rounded-xl shadow-md border-2 border-gray-200 p-4 mb-4 overflow-hidden group hover:shadow-lg transition-all duration-300">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/5 to-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="relative flex items-center justify-between mb-4">
          <h3 className="font-black text-gray-900 text-lg">{title}</h3>
          <span className="bg-gradient-to-r from-brand-cyan to-brand-blue text-white text-sm font-black rounded-full px-4 py-1.5 shadow-lg shadow-brand-cyan/30">
            {editals.length}
          </span>
        </div>

        <div className="relative space-y-3">
          <div className="flex items-center justify-between p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <span className="text-xs text-green-700 font-bold flex items-center space-x-1.5">
              <div className="p-1 bg-green-500 rounded">
                <DollarSign className="w-3 h-3 text-white" />
              </div>
              <span>Total</span>
            </span>
            <span className="font-black text-green-900 text-sm">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(totalValue)}
            </span>
          </div>

          <div className="flex items-center justify-between p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <span className="text-xs text-blue-700 font-bold flex items-center space-x-1.5">
              <div className="p-1 bg-blue-500 rounded">
                <TrendingUp className="w-3 h-3 text-white" />
              </div>
              <span>Média</span>
            </span>
            <span className="font-black text-blue-900 text-sm">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(avgValue)}
            </span>
          </div>
        </div>
      </div>

      {/* Drop Zone */}
      <div
        className={`relative rounded-2xl border-3 border-dashed p-5 min-h-[600px] transition-all duration-300 ${color} ${
          isDragOver 
            ? 'border-brand-cyan bg-gradient-to-br from-brand-cyan/10 to-brand-blue/10 scale-[1.02] shadow-2xl shadow-brand-cyan/20' 
            : 'border-gray-300 bg-gray-50/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Animated Drop Indicator */}
        {isDragOver && (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/20 to-brand-blue/20 rounded-2xl animate-pulse pointer-events-none" />
        )}
        
        <div className="relative space-y-4">
          {editals.map(edital => (
            <PipelineCard
              key={edital.id}
              edital={edital}
              onViewDetails={onViewDetails}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
          {editals.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mb-3">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-sm font-bold text-gray-500">Arraste editais para cá</p>
              <p className="text-xs text-gray-400 mt-1">Solte para mover para esta etapa</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}