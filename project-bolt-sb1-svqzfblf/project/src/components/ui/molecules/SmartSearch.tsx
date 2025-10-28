import { useState } from 'react'
import { Search, X, TrendingUp } from 'lucide-react'

interface SmartSearchProps {
  placeholder?: string
  suggestions?: string[]
  onSearch?: (query: string) => void
}

export function SmartSearch({ 
  placeholder = 'Pesquisar...', 
  suggestions = [],
  onSearch
}: SmartSearchProps) {
  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleSearch = () => {
    if (onSearch && query.trim()) {
      onSearch(query)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
          <Search className="w-5 h-5 text-neutral-400 group-focus-within:text-brand-cyan transition-colors" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setShowSuggestions(e.target.value.length > 0)
          }}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="w-full pl-12 pr-32 py-4 bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:border-brand-cyan focus:ring-4 focus:ring-brand-cyan/20 transition-all text-neutral-900 dark:text-white placeholder-neutral-400 font-medium"
        />

        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
          {query && (
            <button
              onClick={() => {
                setQuery('')
                setShowSuggestions(false)
              }}
              className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-neutral-400" />
            </button>
          )}
          
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-gradient-to-r from-brand-cyan to-brand-blue text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all"
          >
            Buscar
          </button>
        </div>
      </div>

      {/* Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-2xl p-4 z-50">
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="w-4 h-4 text-brand-cyan" />
            <span className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
              Sugestões Rápidas
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  setQuery(suggestion)
                  setShowSuggestions(false)
                }}
                className="px-3 py-1.5 bg-gradient-to-r from-brand-cyan/10 to-brand-blue/10 hover:from-brand-cyan/20 hover:to-brand-blue/20 border border-brand-cyan/30 rounded-full text-sm font-semibold text-brand-blue dark:text-brand-cyan transition-all hover:scale-105"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
