import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createCampaign,
  executeCampaignDisbursement,
  importCampaignBeneficiaries,
  updateCampaign,
  updateCampaignStatus,
  validateCampaignBeneficiariesUpload,
} from '@/features/campaigns/api/campaigns-api'
import type { CampaignStatus } from '@/features/campaigns/types/campaign'

export function useCreateCampaignMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCampaign,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['campaigns'] })
    },
  })
}

export function useUpdateCampaignMutation(campaignId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: Parameters<typeof updateCampaign>[1]) => updateCampaign(campaignId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['campaigns'] })
      void queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] })
    },
  })
}

export function useExecuteCampaignDisbursementMutation(campaignId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => executeCampaignDisbursement(campaignId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['campaigns'] }),
        queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] }),
        queryClient.invalidateQueries({ queryKey: ['transactions'] }),
        queryClient.invalidateQueries({ queryKey: ['field', 'search'] }),
      ])
    },
  })
}

export function useUpdateCampaignStatusMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ campaignId, status }: { campaignId: number; status: CampaignStatus }) =>
      updateCampaignStatus(campaignId, { status }),
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['campaigns'] }),
        queryClient.invalidateQueries({ queryKey: ['campaign', variables.campaignId] }),
      ])
    },
  })
}

export function useValidateCampaignBeneficiariesUploadMutation() {
  return useMutation({ mutationFn: validateCampaignBeneficiariesUpload })
}

export function useImportCampaignBeneficiariesMutation(campaignId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (rows: Parameters<typeof importCampaignBeneficiaries>[1]) => importCampaignBeneficiaries(campaignId, rows),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] })
      void queryClient.invalidateQueries({ queryKey: ['campaigns'] })
    },
  })
}
