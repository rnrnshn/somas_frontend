import { apiRequest } from '@/lib/api/client'
import type {
  CampaignBeneficiariesFilters,
  CampaignBeneficiariesResponse,
  CampaignDisbursementExecutionResult,
  CampaignBeneficiaryImportResult,
  CampaignBeneficiaryUploadPreview,
  CampaignBeneficiaryUploadPreviewRow,
  CampaignDetail,
  CampaignListFilters,
  CampaignListResponse,
  CampaignMutationPayload,
  CampaignProgress,
} from '@/features/campaigns/types/campaign'

function buildCampaignListQuery(filters: CampaignListFilters) {
  const params = new URLSearchParams({
    page: String(filters.page),
    pageSize: String(filters.pageSize),
  })

  if (filters.code?.trim()) params.set('code', filters.code.trim())
  if (filters.name?.trim()) params.set('name', filters.name.trim())
  if (filters.status) params.set('status', filters.status)
  if (filters.province?.trim()) params.set('province', filters.province.trim())

  return `?${params.toString()}`
}

export function getCampaigns(filters: CampaignListFilters) {
  return apiRequest<CampaignListResponse>(`/campaigns${buildCampaignListQuery(filters)}`, {
    method: 'GET',
    auth: true,
  })
}

export function getCampaign(campaignId: number) {
  return apiRequest<CampaignDetail>(`/campaigns/${campaignId}`, {
    method: 'GET',
    auth: true,
  })
}

export function getCampaignProgress(campaignId: number) {
  return apiRequest<CampaignProgress>(`/campaigns/${campaignId}/progress`, {
    method: 'GET',
    auth: true,
  })
}

export function getCampaignBeneficiaries(
  campaignId: number,
  filters: CampaignBeneficiariesFilters = {}
) {
  const params = new URLSearchParams({
    page: String(filters.page ?? 1),
    pageSize: String(filters.pageSize ?? 100),
  })

  return apiRequest<CampaignBeneficiariesResponse>(
    `/campaigns/${campaignId}/beneficiaries?${params.toString()}`,
    {
      method: 'GET',
      auth: true,
    }
  )
}

export function createCampaign(payload: CampaignMutationPayload) {
  return apiRequest<CampaignDetail>('/campaigns', {
    method: 'POST',
    auth: true,
    body: payload,
  })
}

export function updateCampaign(campaignId: number, payload: CampaignMutationPayload) {
  return apiRequest<CampaignDetail>(`/campaigns/${campaignId}`, {
    method: 'PATCH',
    auth: true,
    body: payload,
  })
}

export function executeCampaignDisbursement(campaignId: number) {
  return apiRequest<CampaignDisbursementExecutionResult>(`/campaigns/${campaignId}/disbursements/execute`, {
    method: 'POST',
    auth: true,
  })
}

export function validateCampaignBeneficiariesUpload(file: File) {
  const body = new FormData()
  body.append('file', file)
  return apiRequest<CampaignBeneficiaryUploadPreview>('/campaigns/beneficiaries/validate-upload', {
    method: 'POST',
    auth: true,
    body,
  })
}

export function importCampaignBeneficiaries(campaignId: number, rows: CampaignBeneficiaryUploadPreviewRow[]) {
  const payloadRows = rows.map((row) => ({
    name: row.name,
    msisdn: row.msisdn,
    disbursementAmount: row.disbursementAmount,
    testimony: row.testimony ?? undefined,
    location: row.location ?? undefined,
    province: row.province ?? undefined,
    district: row.district ?? undefined,
    community: row.community ?? undefined,
  }))

  return apiRequest<CampaignBeneficiaryImportResult>(`/campaigns/${campaignId}/beneficiaries/import-bulk`, {
    method: 'POST',
    auth: true,
    body: { rows: payloadRows },
  })
}
