/**
 * Hook para mutações Supabase (create, update, delete)
 * @module hooks/useSupabaseMutation
 */

import { useState, useCallback } from 'react'
import { logger } from '../core/utils'

interface UseSupabaseMutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<{ data: TData | null; error: any }>
  onSuccess?: (data: TData) => void
  onError?: (error: Error) => void
}

export function useSupabaseMutation<TData = any, TVariables = any>(
  options: UseSupabaseMutationOptions<TData, TVariables>
) {
  const { mutationFn, onSuccess, onError } = options
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const mutate = useCallback(async (variables: TVariables) => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await mutationFn(variables)
      
      if (result.error) {
        throw new Error(result.error.message || 'Mutation failed')
      }
      
      if (result.data) {
        onSuccess?.(result.data)
      }
      
      return { success: true, data: result.data }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      onError?.(error)
      logger.error('Mutation error:', error)
      
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }, [mutationFn, onSuccess, onError])

  return {
    mutate,
    loading,
    error
  }
}

