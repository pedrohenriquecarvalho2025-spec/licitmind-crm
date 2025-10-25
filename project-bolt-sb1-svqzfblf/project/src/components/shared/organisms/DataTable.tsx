import React from 'react'
import { ChevronUp, ChevronDown, Loader2 } from 'lucide-react'
import { Text } from '../../ui/atoms/Text'
import type { TableColumn, SortParams } from '../../../types'

interface DataTableProps<T> {
  columns: TableColumn<T>[]
  data: T[]
  keyExtractor: (item: T) => string
  loading?: boolean
  emptyMessage?: string
  onSort?: (sort: SortParams) => void
  currentSort?: SortParams
  onRowClick?: (item: T) => void
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  loading = false,
  emptyMessage = 'Nenhum registro encontrado',
  onSort,
  currentSort,
  onRowClick
}: DataTableProps<T>) {
  const handleSort = (field: string) => {
    if (!onSort) return
    
    const direction = 
      currentSort?.field === field && currentSort?.direction === 'asc'
        ? 'desc'
        : 'asc'
    
    onSort({ field, direction })
  }

  const renderSortIcon = (field: string) => {
    if (!currentSort || currentSort.field !== field) return null
    
    return currentSort.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4 ml-1" />
      : <ChevronDown className="w-4 h-4 ml-1" />
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-brand-cyan" />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
        <Text variant="body" color="muted">{emptyMessage}</Text>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
          <thead className="bg-neutral-50 dark:bg-neutral-900">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-${column.align || 'left'} text-xs font-bold text-brand-blue dark:text-brand-cyan uppercase tracking-wider ${column.sortable && onSort ? 'cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800' : ''}`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center">
                    {column.label}
                    {column.sortable && renderSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {data.map((row) => (
              <tr
                key={keyExtractor(row)}
                onClick={() => onRowClick?.(row)}
                className={`hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-6 py-4 whitespace-nowrap text-sm text-${column.align || 'left'}`}
                  >
                    {column.render 
                      ? column.render((row as any)[column.key], row)
                      : (row as any)[column.key]
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

