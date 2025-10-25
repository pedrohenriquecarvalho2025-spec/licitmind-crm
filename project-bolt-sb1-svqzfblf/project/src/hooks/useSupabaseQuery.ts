/**
 * Hook para consultas Supabase com loading e error handling
 * @module hooks/useSupabaseQuery
 */

import { useState, useEffect, useCallback } from 'react'
import { logger } from '../core/utils'

interface UseSupabaseQueryOptions<T> {
  queryFn: () => Promise<{ data: T | null; error: any }>
  dependencies?: any[]
  enabled?: boolean
}

export function useSupabaseQuery<T>(options: UseSupabaseQueryOptions<T>) {
  const { queryFn, dependencies = [], enabled = true } = options
  
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const execute = useCallback(async () => {
    if (!enabled) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const result = await queryFn()
      
      if (result.error) {
        throw new Error(result.error.message || 'Query failed')
      }
      
      setData(result.data)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      logger.error('Query error:', error)
    } finally {
      setLoading(false)
    }
  }, [queryFn, enabled])

  useEffect(() => {
    execute()
  }, [execute, ...dependencies])

  const refetch = useCallback(() => {
    return execute()
  }, [execute])

  return {
    data,
    loading,
    error,
    refetch
  }
}

