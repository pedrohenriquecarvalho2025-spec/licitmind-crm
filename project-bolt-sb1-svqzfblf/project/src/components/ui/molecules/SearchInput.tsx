import React from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '../atoms/Input'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onClear?: () => void
  className?: string
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Buscar...',
  onClear,
  className = ''
}: SearchInputProps) {
  const handleClear = () => {
    onChange('')
    onClear?.()
  }

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5 pointer-events-none" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-10"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
          type="button"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

