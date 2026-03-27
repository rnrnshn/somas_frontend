import { apiRequest } from '@/lib/api/client'
import type {
  DisbursementBatchesResponse,
  RetryTransactionsResult,
  TransactionAnalyticsSummary,
  TransactionDetail,
  TransactionListFilters,
  TransactionsResponse,
} from '@/features/transactions/types/transaction'

function buildTransactionListQuery(filters: TransactionListFilters) {
  const params = new URLSearchParams({
    page: String(filters.page),
    pageSize: String(filters.pageSize),
  })

  if (filters.q?.trim()) params.set('q', filters.q.trim())
  if (filters.status?.trim()) params.set('status', filters.status.trim())
  if (filters.type?.trim()) params.set('type', filters.type.trim())

  return `?${params.toString()}`
}

export function getTransactions(filters: TransactionListFilters) {
  return apiRequest<TransactionsResponse>(`/transactions${buildTransactionListQuery(filters)}`, {
    method: 'GET',
    auth: true,
  })
}

export function getFailedTransactions(filters: TransactionListFilters) {
  return apiRequest<TransactionsResponse>(`/transactions/failed${buildTransactionListQuery(filters)}`, {
    method: 'GET',
    auth: true,
  })
}

export function getTransaction(transactionId: number) {
  return apiRequest<TransactionDetail>(`/transactions/${transactionId}`, {
    method: 'GET',
    auth: true,
  })
}

export function getTransactionAnalyticsSummary() {
  return apiRequest<TransactionAnalyticsSummary>('/transactions/analytics/summary', {
    method: 'GET',
    auth: true,
  })
}

export function getDisbursementBatches(page = 1, pageSize = 5) {
  return apiRequest<DisbursementBatchesResponse>(`/transactions/batches?page=${page}&pageSize=${pageSize}`, {
    method: 'GET',
    auth: true,
  })
}

export function retryTransactions(transactionIds: number[]) {
  return apiRequest<RetryTransactionsResult>('/transactions/retry', {
    method: 'POST',
    auth: true,
    body: { transactionIds },
  })
}
