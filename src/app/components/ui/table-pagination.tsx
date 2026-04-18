import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/app/components/ui/pagination'

export const DEFAULT_TABLE_PAGE_SIZE = 10

export function useTablePagination<T>(
  items: T[],
  pageSize = DEFAULT_TABLE_PAGE_SIZE,
  resetDeps: readonly unknown[] = []
) {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const resetDepsRef = useRef(resetDeps)
  const resetVersionRef = useRef(0)

  if (!areShallowEqual(resetDepsRef.current, resetDeps)) {
    resetDepsRef.current = resetDeps
    resetVersionRef.current += 1
  }

  const effectivePage = Math.min(resetVersionRef.current === 0 ? page : 1, totalPages)
  const clampedPage = Math.min(effectivePage, totalPages)

  const startIndex = (clampedPage - 1) * pageSize
  const endIndex = startIndex + pageSize

  return {
    page: clampedPage,
    pageSize,
    setPage: (nextPage: number) => {
      resetVersionRef.current = 0
      setPage(nextPage)
    },
    totalItems: items.length,
    totalPages,
    paginatedItems: items.slice(startIndex, endIndex),
  }
}

function areShallowEqual(previous: readonly unknown[], next: readonly unknown[]) {
  if (previous.length !== next.length) return false

  return previous.every((value, index) => Object.is(value, next[index]))
}

type DataTablePaginationProps = {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function DataTablePagination({
  page,
  pageSize,
  totalItems,
  totalPages,
  onPageChange,
}: DataTablePaginationProps) {
  const { t } = useTranslation()
  if (totalItems === 0) return null

  const startItem = (page - 1) * pageSize + 1
  const endItem = Math.min(page * pageSize, totalItems)

  return (
    <div className="flex items-center justify-between gap-4 border-t border-border px-6 py-4">
      <p className="text-sm text-muted-foreground">
        {t('tablePagination.showing', { start: startItem, end: endItem, total: totalItems })}
      </p>
      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(event) => {
                event.preventDefault()
                if (page > 1) onPageChange(page - 1)
              }}
              className={page <= 1 ? 'pointer-events-none opacity-50' : undefined}
              label={t('tablePagination.previous')}
            />
          </PaginationItem>
          <PaginationItem>
            <span className="px-3 text-sm text-muted-foreground">
              {t('tablePagination.pageOf', { page, total: totalPages })}
            </span>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(event) => {
                event.preventDefault()
                if (page < totalPages) onPageChange(page + 1)
              }}
              className={page >= totalPages ? 'pointer-events-none opacity-50' : undefined}
              label={t('tablePagination.next')}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
