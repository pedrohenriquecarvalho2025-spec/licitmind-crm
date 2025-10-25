/**
 * Hook para gerenciamento de tabelas com paginação, ordenação e filtros
 * @module hooks/useDataTable
 */

import { useState, useCallback } from 'react'
import type { PaginationParams, SortParams, FilterParams } from '../types'

interface UseDataTableOptions {
  initialPageSize?: number
}

export function useDataTable(options: UseDataTableOptions = {}) {
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    pageSize: options.initialPageSize || 20
  })
  
  const [sort, setSort] = useState<SortParams | null>(null)
  const [filters, setFilters] = useState<FilterParams>({})

  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }))
  }, [])

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setPagination({ page: 1, pageSize })
  }, [])

  const handleSort = useCallback((newSort: SortParams) => {
    setSort(newSort)
  }, [])

  const handleFilterChange = useCallback((key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({})
    setPagination(prev => ({ ...prev, page: 1 }))
  }, [])

  const reset = useCallback(() => {
    setPagination({ page: 1, pageSize: options.initialPageSize || 20 })
    setSort(null)
    setFilters({})
  }, [options.initialPageSize])

  return {
    pagination,
    sort,
    filters,
    handlePageChange,
    handlePageSizeChange,
    handleSort,
    handleFilterChange,
    clearFilters,
    reset
  }
}

