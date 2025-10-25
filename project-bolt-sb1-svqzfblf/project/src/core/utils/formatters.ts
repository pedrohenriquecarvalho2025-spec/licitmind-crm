/**
 * Utilitários de formatação
 * @module core/utils/formatters
 */

import { CURRENCY, LOCALE } from '../config/constants'

export const formatCurrency = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '-'
  
  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: CURRENCY,
    minimumFractionDigits: 2
  }).format(value)
}

export const formatNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '-'
  
  return new Intl.NumberFormat(LOCALE).format(value)
}

export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return '-'
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString(LOCALE)
}

export const formatDateTime = (date: string | Date | null | undefined): string => {
  if (!date) return '-'
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleString(LOCALE)
}

export const formatCNPJ = (cnpj: string | null | undefined): string => {
  if (!cnpj) return '-'
  
  const cleaned = cnpj.replace(/\D/g, '')
  return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
}

export const formatPhone = (phone: string | null | undefined): string => {
  if (!phone) return '-'
  
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
  
  return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
}

