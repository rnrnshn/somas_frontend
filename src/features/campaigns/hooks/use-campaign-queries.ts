import { keepPreviousData, useQueries, useQuery } from '@tanstack/react-query'
import {
  getCampaign,
  getCampaignBeneficiaries,
  getCampaignProgress,
  getCampaigns,
} from '@/features/campaigns/api/campaigns-api'
import type { CampaignBeneficiariesFilters, CampaignListFilters } from '@/features/campaigns/types/campaign'
import { QUERY_STALE_TIME } from '@/lib/constants/query'

export function useCampaignsQuery(filters: CampaignListFilters) {
  return useQuery({
    queryKey: ['campaigns', filters],
    queryFn: () => getCampaigns(filters),
    placeholderData: keepPreviousData,
    staleTime: QUERY_STALE_TIME.list,
  })
}

export function useCampaignQuery(campaignId: number) {
  return useQuery({
    queryKey: ['campaign', campaignId],
    queryFn: () => getCampaign(campaignId),
    enabled: Number.isFinite(campaignId),
    staleTime: QUERY_STALE_TIME.detail,
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

export function useCampaignDetailsQueries(campaignIds: number[]) {
  return useQueries({
    queries: campaignIds.map((campaignId) => ({
      queryKey: ['campaign', campaignId],
      queryFn: () => getCampaign(campaignId),
      enabled: Number.isFinite(campaignId),
      staleTime: QUERY_STALE_TIME.detail,
    })),
  })
}
