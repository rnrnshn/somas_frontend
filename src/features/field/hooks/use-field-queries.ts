import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { confirmFieldBeneficiary, getFieldDisbursement, searchCampaignBeneficiaries, syncFieldConfirmations } from '@/features/field/api/field-api'
import type { ConfirmCampaignBeneficiaryPayload } from '@/features/campaigns/types/campaign'
import type { FieldSearchFilters } from '@/features/field/types/field'
import { QUERY_STALE_TIME } from '@/lib/constants/query'

export function useFieldSearchQuery(filters: FieldSearchFilters, enabled = false) {
  return useQuery({
    queryKey: ['field', 'search', filters],
    queryFn: () => searchCampaignBeneficiaries(filters),
    enabled,
    staleTime: QUERY_STALE_TIME.fieldSearch,
  })
}

export function useFieldDisbursementQuery(campaignId: number, campaignBeneficiaryId: number) {
  return useQuery({
    queryKey: ['field', 'disbursement', campaignId, campaignBeneficiaryId],
    queryFn: () => getFieldDisbursement(campaignId, campaignBeneficiaryId),
    enabled: Number.isFinite(campaignId) && Number.isFinite(campaignBeneficiaryId),
    staleTime: QUERY_STALE_TIME.fieldDetail,
  })
}

export function useConfirmFieldBeneficiaryMutation(campaignId: number, campaignBeneficiaryId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ConfirmCampaignBeneficiaryPayload) => confirmFieldBeneficiary(campaignId, campaignBeneficiaryId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['field', 'disbursement', campaignId, campaignBeneficiaryId] })
    },
  })
}

export function useSyncFieldConfirmationsMutation() {
  return useMutation({ mutationFn: syncFieldConfirmations })
}
