import type { PaginatedResponse } from '@/types/pagination'

export type TransactionListFilters = {
  page: number
  pageSize: number
  q?: string
  status?: string
  type?: string
  campaignId?: number
  beneficiaryId?: number
  paymentChannelId?: number
  disbursementBatchId?: number
  createdFrom?: string
  createdTo?: string
  executedFrom?: string
  executedTo?: string
}

export type TransactionListItem = {
  id: number
  amount: number
  status: string
  type: string
  executedAt: string | null
  createdAt: string
  beneficiary?: {
    id: number
    name: string
    msisdn: string
  } | null
  campaign?: {
    id: number
    name: string
    code: string | null
  } | null
  paymentChannel?: {
    id: number
    name: string
    code: string | null
  } | null
  disbursementBatch?: {
    id: number
    code: string
    status: string
  } | null
}

export type TransactionDetail = TransactionListItem & {
  externalId?: string | null
  errorMessage?: string | null
  failureCode?: string | null
  attemptCount?: number
  lastAttemptAt?: string | null
  nextRetryAt?: string | null
  updatedAt?: string
}

export type TransactionAnalyticsSummary = {
  totalDisbursed: number
  totalTransactions: number
  successRate: number
  failedTransactions: number
  byStatus: Record<string, number>
  byCampaign: Array<{
    campaignId: number
    campaignName: string
    count: number
    amount: number
  }>
}

export type RetryTransactionsResult = {
  scheduled: number
  skipped: Array<{
    id: number
    reason: string
  }>
}

export type DisbursementBatchItem = {
  id: number
  code: string
  status: string
  totalAmount?: number
  transactionsCount?: number
  successCount?: number
  failedCount?: number
  pendingCount?: number
  executedAt?: string | null
  createdAt?: string
  campaign?: {
    id: number
    name: string
    code: string | null
  } | null
  paymentChannel?: {
    id: number
    name: string
    code: string | null
  } | null
}

export type TransactionsResponse = PaginatedResponse<TransactionListItem>
export type DisbursementBatchesResponse = PaginatedResponse<DisbursementBatchItem>
