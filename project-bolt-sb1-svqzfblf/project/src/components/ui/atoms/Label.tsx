import React, { LabelHTMLAttributes } from 'react'

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
  children: React.ReactNode
}

export function Label({ required = false, children, className = '', ...props }: LabelProps) {
  return (
    <label
      className={`block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 ${className}`}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  )
}

