import { apiRequest } from '@/lib/api/client'
import type { CampaignBeneficiaryDisbursement, ConfirmCampaignBeneficiaryPayload } from '@/features/campaigns/types/campaign'
import type { FieldSearchFilters, FieldSearchResult } from '@/features/field/types/field'

function buildSearchQuery(filters: FieldSearchFilters) {
  const params = new URLSearchParams()
  if (typeof filters.campaignId === 'number' && Number.isFinite(filters.campaignId)) params.set('campaignId', String(filters.campaignId))
  if (filters.msisdn?.trim()) params.set('msisdn', filters.msisdn.trim())
  if (filters.name?.trim()) params.set('name', filters.name.trim())
  const query = params.toString()
  return query ? `?${query}` : ''
}

export function searchCampaignBeneficiaries(filters: FieldSearchFilters) {
  const campaignId = filters.campaignId
  if (!campaignId) throw new Error('campaignId is required for field search.')

  return apiRequest<FieldSearchResult[]>(`/campaigns/${campaignId}/beneficiaries/search${buildSearchQuery({ ...filters, campaignId: undefined })}`, {
    method: 'GET',
    auth: true,
  })
}

export function getFieldDisbursement(campaignId: number, campaignBeneficiaryId: number) {
  return apiRequest<CampaignBeneficiaryDisbursement>(`/campaigns/${campaignId}/beneficiaries/${campaignBeneficiaryId}`, {
    method: 'GET',
    auth: true,
  })
}

export function confirmFieldBeneficiary(
  campaignId: number,
  campaignBeneficiaryId: number,
  payload: ConfirmCampaignBeneficiaryPayload
) {
  return apiRequest(`/campaigns/${campaignId}/beneficiaries/${campaignBeneficiaryId}/confirm`, {
    method: 'POST',
    auth: true,
    body: payload,
  })
}

export function syncFieldConfirmations(
  confirmations: Array<ConfirmCampaignBeneficiaryPayload & { campaignBeneficiaryId: number }>
) {
  return apiRequest<{ processed: number; errors: Array<{ index: number; message: string }> }>('/campaigns/confirmations/sync', {
    method: 'POST',
    auth: true,
    body: { confirmations },
  })
}
