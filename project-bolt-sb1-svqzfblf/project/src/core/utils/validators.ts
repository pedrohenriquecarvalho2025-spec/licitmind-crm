/**
 * Utilitários de validação
 * @module core/utils/validators
 */

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidCNPJ = (cnpj: string): boolean => {
  const cleaned = cnpj.replace(/\D/g, '')
  
  if (cleaned.length !== 14) return false
  if (/^(\d)\1+$/.test(cleaned)) return false
  
  let sum = 0
  let pos = 5
  
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleaned.charAt(i)) * pos
    pos = pos === 2 ? 9 : pos - 1
  }
  
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== parseInt(cleaned.charAt(12))) return false
  
  sum = 0
  pos = 6
  
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleaned.charAt(i)) * pos
    pos = pos === 2 ? 9 : pos - 1
  }
  
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  return result === parseInt(cleaned.charAt(13))
}

export const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length >= 10 && cleaned.length <= 11
}

export const isRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  return true
}

export const minLength = (value: string, length: number): boolean => {
  return value.length >= length
}

export const maxLength = (value: string, length: number): boolean => {
  return value.length <= length
}

