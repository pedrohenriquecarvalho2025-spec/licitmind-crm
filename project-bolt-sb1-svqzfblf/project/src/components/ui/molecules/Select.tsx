import React, { SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import type { SelectOption } from '../../../types/ui'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[]
  error?: boolean
}

export function Select({
  options,
  error = false,
  className = '',
  ...props
}: SelectProps) {
  return (
    <div className="relative">
      <select
        className={`
          w-full px-4 py-2.5 pr-10 border rounded-lg shadow-sm
          bg-white dark:bg-neutral-800
          text-neutral-900 dark:text-white
          focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-brand-cyan
          hover:border-neutral-400 dark:hover:border-neutral-600
          disabled:bg-neutral-50 dark:disabled:bg-neutral-900 disabled:cursor-not-allowed
          appearance-none cursor-pointer
          transition-all duration-200
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-neutral-200 dark:border-neutral-700'}
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
    </div>
  )
}

