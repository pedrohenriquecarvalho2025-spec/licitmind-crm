import React from 'react'
import { AlertTriangle } from 'lucide-react'
import { ModalBase } from './ModalBase'
import { Button } from '../atoms/Button'
import { Text } from '../atoms/Text'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  loading?: boolean
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'warning',
  loading = false
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm()
    if (!loading) {
      onClose()
    }
  }

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={handleConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="flex items-start space-x-4 py-4">
        <div className={`p-3 rounded-full ${variant === 'danger' ? 'bg-red-100' : 'bg-yellow-100'}`}>
          <AlertTriangle className={`w-6 h-6 ${variant === 'danger' ? 'text-red-600' : 'text-yellow-600'}`} />
        </div>
        <Text variant="body" color="muted">
          {message}
        </Text>
      </div>
    </ModalBase>
  )
}

