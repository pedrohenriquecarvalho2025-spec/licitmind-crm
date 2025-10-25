/**
 * Tipos para componentes de UI
 * @module types/ui
 */

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'success'
export type ButtonSize = 'sm' | 'md' | 'lg'

export type InputVariant = 'default' | 'search' | 'password'
export type InputSize = 'sm' | 'md' | 'lg'

export type BadgeVariant = 
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

export interface TableColumn<T = any> {
  key: string
  label: string
  sortable?: boolean
  render?: (value: any, row: T) => React.ReactNode
  width?: string
  align?: 'left' | 'center' | 'right'
}

export interface FormFieldError {
  field: string
  message: string
}

