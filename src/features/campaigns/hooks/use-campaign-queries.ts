import { keepPreviousData, useQueries, useQuery } from '@tanstack/react-query'
import {
  getAllCampaignBeneficiaries,
  getCampaign,
  getCampaignBeneficiaries,
  getCampaignProgress,
  getCampaigns,
} from '@/features/campaigns/api/campaigns-api'
import { getAllCampaignTransactions } from '@/features/transactions/api/transactions-api'
import type { CampaignBeneficiariesFilters, CampaignListFilters } from '@/features/campaigns/types/campaign'
import { QUERY_STALE_TIME } from '@/lib/constants/query'

export function useCampaignsQuery(filters: CampaignListFilters) {
  return useQuery({
    queryKey: ['campaigns', filters],
    queryFn: () => getCampaigns(filters),
    placeholderData: keepPreviousData,
    staleTime: QUERY_STALE_TIME.list,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  })
}

export function useCampaignQuery(campaignId: number) {
  return useQuery({
    queryKey: ['campaign', campaignId],
    queryFn: () => getCampaign(campaignId),
    enabled: Number.isFinite(campaignId),
    staleTime: QUERY_STALE_TIME.detail,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  })
}

export function useCampaignProgressQuery(campaignId: number) {
  return useQuery({
    queryKey: ['campaign', campaignId, 'progress'],
    queryFn: () => getCampaignProgress(campaignId),
    enabled: Number.isFinite(campaignId),
    staleTime: QUERY_STALE_TIME.dashboard,
  })
}

export function useCampaignBeneficiariesQuery(
  campaignId: number,
  filters: CampaignBeneficiariesFilters = {}
) {
  return useQuery({
    queryKey: ['campaign', campaignId, 'beneficiaries', filters],
    queryFn: () => getCampaignBeneficiaries(campaignId, filters),
    enabled: Number.isFinite(campaignId),
    placeholderData: keepPreviousData,
    staleTime: QUERY_STALE_TIME.list,
  })
}

export function useAllCampaignBeneficiariesQuery(campaignId: number) {
  return useQuery({
    queryKey: ['campaign', campaignId, 'beneficiaries', 'all'],
    queryFn: () => getAllCampaignBeneficiaries(campaignId),
    enabled: Number.isFinite(campaignId),
    staleTime: QUERY_STALE_TIME.list,
  })
}

export function useCampaignDetailsQueries(campaignIds: number[]) {
  return useQueries({
    queries: campaignIds.map((campaignId) => ({
      queryKey: ['campaign', campaignId],
      queryFn: () => getCampaign(campaignId),
      enabled: Number.isFinite(campaignId),
      staleTime: QUERY_STALE_TIME.detail,
      refetchOnMount: 'always' as const,
      refetchOnWindowFocus: true,
    })),
  })
}

export function useCampaignTableSummaryQueries(campaignIds: number[]) {
  return useQueries({
    queries: campaignIds.map((campaignId) => ({
      queryKey: ['campaign', campaignId, 'table-summary'],
      queryFn: async () => {
        const [beneficiaries, transactions] = await Promise.all([
          getAllCampaignBeneficiaries(campaignId),
          getAllCampaignTransactions(campaignId),
        ])

        const totalBeneficiaries = beneficiaries.data.length
        const successfulTransactions = transactions.data.filter(
          (transaction) => String(transaction.status).toLowerCase() === 'success'
        )
        const amountDisbursed = successfulTransactions.reduce(
          (sum, transaction) => sum + Number(transaction.amount ?? 0),
          0
        )
        const successRate = totalBeneficiaries > 0
          ? Math.round((successfulTransactions.length / totalBeneficiaries) * 100)
          : 0

        return {
          campaignId,
          totalBeneficiaries,
          amountDisbursed,
          successRate,
        }
      },
      enabled: Number.isFinite(campaignId),
      staleTime: QUERY_STALE_TIME.list,
      refetchOnMount: 'always' as const,
      refetchOnWindowFocus: true,
    })),
  })
}
