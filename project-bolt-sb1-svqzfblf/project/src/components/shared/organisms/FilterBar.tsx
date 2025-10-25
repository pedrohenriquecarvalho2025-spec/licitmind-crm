import React, { useState } from 'react'
import { Filter, X } from 'lucide-react'
import { Button } from '../../ui/atoms/Button'
import { SearchInput } from '../../ui/molecules/SearchInput'
import { Select } from '../../ui/molecules/Select'
import type { SelectOption } from '../../../types/ui'

interface FilterConfig {
  key: string
  label: string
  type: 'select' | 'search'
  options?: SelectOption[]
}

interface FilterBarProps {
  filters: FilterConfig[]
  values: Record<string, any>
  onChange: (key: string, value: any) => void
  onClear: () => void
  onApply?: () => void
  showApplyButton?: boolean
}

export function FilterBar({
  filters,
  values,
  onChange,
  onClear,
  onApply,
  showApplyButton = false
}: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const hasActiveFilters = Object.values(values).some(v => v !== '' && v !== null && v !== undefined)

  const renderFilter = (filter: FilterConfig) => {
    const value = values[filter.key] || ''
    
    if (filter.type === 'search') {
      return (
        <SearchInput
          key={filter.key}
          value={value}
          onChange={(val) => onChange(filter.key, val)}
          placeholder={filter.label}
        />
      )
    }
    
    if (filter.type === 'select' && filter.options) {
      return (
        <div key={filter.key} className="min-w-[200px]">
          <Select
            options={filter.options}
            value={value}
            onChange={(e) => onChange(filter.key, e.target.value)}
          />
        </div>
      )
    }
    
    return null
  }

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-brand-cyan" />
          <span className="font-semibold text-neutral-800 dark:text-neutral-200">Filtros</span>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 bg-brand-cyan/20 text-brand-blue text-xs font-bold rounded-full">
              Ativos
            </span>
          )}
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-brand-blue hover:text-brand-cyan transition-colors"
        >
          {isExpanded ? 'Recolher' : 'Expandir'}
        </button>
      </div>
      
      {isExpanded && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {filters.map(renderFilter)}
          </div>
          
          <div className="flex items-center justify-end space-x-2 pt-2">
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={onClear}>
                <X className="w-4 h-4 mr-1" />
                Limpar
              </Button>
            )}
            {showApplyButton && onApply && (
              <Button size="sm" onClick={onApply}>
                Aplicar Filtros
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

