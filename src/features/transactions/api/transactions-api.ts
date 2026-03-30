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
  if (Number.isFinite(filters.campaignId)) params.set('campaignId', String(filters.campaignId))

  return `?${params.toString()}`
}

export function getTransactions(filters: TransactionListFilters) {
  return apiRequest<TransactionsResponse>(`/transactions${buildTransactionListQuery(filters)}`, {
    method: 'GET',
    auth: true,
  })
}

export async function getAllCampaignTransactions(campaignId: number) {
  const pageSize = 100
  const firstPage = await getTransactions({ page: 1, pageSize, campaignId })
  const allRows = [...firstPage.data]

  for (let page = 2; page <= firstPage.meta.lastPage; page += 1) {
    const nextPage = await getTransactions({ page, pageSize, campaignId })
    allRows.push(...nextPage.data)
  }

  return {
    ...firstPage,
    data: allRows,
    meta: {
      ...firstPage.meta,
      total: allRows.length,
      perPage: allRows.length,
      currentPage: 1,
      lastPage: 1,
      firstPage: 1,
    },
  }
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
