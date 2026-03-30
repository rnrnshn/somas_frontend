import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getAllCampaignTransactions,
  getDisbursementBatches,
  getFailedTransactions,
  getTransaction,
  getTransactionAnalyticsSummary,
  getTransactions,
  retryTransactions,
} from '@/features/transactions/api/transactions-api'
import type { TransactionListFilters } from '@/features/transactions/types/transaction'
import { QUERY_STALE_TIME } from '@/lib/constants/query'

export function useTransactionsQuery(filters: TransactionListFilters) {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => getTransactions(filters),
    placeholderData: keepPreviousData,
    staleTime: QUERY_STALE_TIME.list,
  })
}

export function useCampaignTransactionsQuery(campaignId: number) {
  return useQuery({
    queryKey: ['transactions', 'campaign', campaignId],
    queryFn: () => getAllCampaignTransactions(campaignId),
    enabled: Number.isFinite(campaignId),
    staleTime: QUERY_STALE_TIME.list,
  })
}

export function useFailedTransactionsQuery(filters: TransactionListFilters) {
  return useQuery({
    queryKey: ['transactions', 'failed', filters],
    queryFn: () => getFailedTransactions(filters),
    placeholderData: keepPreviousData,
    staleTime: QUERY_STALE_TIME.list,
  })
}

export function useTransactionAnalyticsSummaryQuery() {
  return useQuery({
    queryKey: ['transactions', 'analytics', 'summary'],
    queryFn: getTransactionAnalyticsSummary,
    staleTime: QUERY_STALE_TIME.transactionsSummary,
  })
}

export function useDisbursementBatchesQuery(page = 1, pageSize = 5) {
  return useQuery({
    queryKey: ['transactions', 'batches', page, pageSize],
    queryFn: () => getDisbursementBatches(page, pageSize),
    placeholderData: keepPreviousData,
    staleTime: QUERY_STALE_TIME.list,
  })
}

export function useTransactionQuery(transactionId: number) {
  return useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: () => getTransaction(transactionId),
    enabled: Number.isFinite(transactionId),
    staleTime: QUERY_STALE_TIME.detail,
  })
}

export function useRetryTransactionsMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: retryTransactions,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['transactions'] }),
        queryClient.invalidateQueries({ queryKey: ['transaction'] }),
      ])
    },
  })
}
