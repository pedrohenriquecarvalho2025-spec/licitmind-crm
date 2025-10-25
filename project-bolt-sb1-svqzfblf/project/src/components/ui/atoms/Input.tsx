import React, { InputHTMLAttributes, forwardRef } from 'react'
import type { InputSize } from '../../../types/ui'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputSize?: InputSize
  error?: boolean
}

const sizes: Record<InputSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-base'
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ inputSize = 'md', error = false, className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`
          w-full border rounded-lg shadow-sm
          bg-white dark:bg-neutral-800
          text-neutral-900 dark:text-white
          placeholder-neutral-400 dark:placeholder-neutral-500
          focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-brand-cyan
          hover:border-neutral-400 dark:hover:border-neutral-600
          disabled:bg-neutral-50 dark:disabled:bg-neutral-900 disabled:cursor-not-allowed
          transition-all duration-200
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-neutral-200 dark:border-neutral-700'}
          ${sizes[inputSize]}
          ${className}
        `}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

