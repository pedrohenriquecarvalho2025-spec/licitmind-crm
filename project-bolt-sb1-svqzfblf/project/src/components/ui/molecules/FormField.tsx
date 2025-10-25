import React from 'react'
import { Label } from '../atoms/Label'
import { Input } from '../atoms/Input'
import { Text } from '../atoms/Text'

interface FormFieldProps {
  id: string
  label: string
  required?: boolean
  error?: string
  helperText?: string
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  children?: React.ReactNode
}

export function FormField({
  id,
  label,
  required = false,
  error,
  helperText,
  inputProps,
  children
}: FormFieldProps) {
  return (
    <div className="w-full space-y-1.5">
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      
      {children || (
        <Input
          id={id}
          error={!!error}
          {...inputProps}
        />
      )}
      
      {error && (
        <Text variant="small" color="error" className="mt-1">
          {error}
        </Text>
      )}
      
      {!error && helperText && (
        <Text variant="small" color="muted" className="mt-1">
          {helperText}
        </Text>
      )}
    </div>
  )
}

