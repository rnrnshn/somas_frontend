import { apiRequest } from '@/lib/api/client'
import { normalizeDateOfBirth } from '@/features/campaigns/components/create-campaign-shared'
import type {
  AddCampaignBeneficiaryPayload,
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
  CampaignStatusUpdatePayload,
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

export async function getAllCampaignBeneficiaries(campaignId: number) {
  const pageSize = 100
  const firstPage = await getCampaignBeneficiaries(campaignId, { page: 1, pageSize })
  const allRows = [...firstPage.data]

  for (let page = 2; page <= firstPage.meta.lastPage; page += 1) {
    const nextPage = await getCampaignBeneficiaries(campaignId, { page, pageSize })
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

export function addCampaignBeneficiary(campaignId: number, payload: AddCampaignBeneficiaryPayload) {
  return apiRequest(`/campaigns/${campaignId}/beneficiaries`, {
    method: 'POST',
    auth: true,
    body: payload,
  })
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

export function updateCampaignStatus(campaignId: number, payload: CampaignStatusUpdatePayload) {
  return apiRequest<CampaignDetail>(`/campaigns/${campaignId}/status`, {
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

export function validateCampaignBeneficiaryRows(rows: CampaignBeneficiaryUploadPreviewRow[]) {
  return validateCampaignBeneficiariesUpload(buildValidationFile(rows))
}

export function importCampaignBeneficiaries(campaignId: number, rows: CampaignBeneficiaryUploadPreviewRow[]) {
  const payloadRows = rows.map((row) => ({
    name: row.name,
    msisdn: row.msisdn,
    disbursementAmount: row.disbursementAmount,
    testimony: row.testimony ?? undefined,
    gender: row.gender ?? undefined,
    dateOfBirth: normalizeDateOfBirth(row.dateOfBirth) ?? undefined,
    email: row.email ?? undefined,
    location: row.location ?? undefined,
    province: row.province ?? undefined,
    district: row.district ?? undefined,
    community: row.community ?? undefined,
    documentIdType: row.documentIdType ?? undefined,
    documentIdNumber: row.documentIdNumber ?? undefined,
    mobileMoneyProvider: row.mobileMoneyProvider ?? undefined,
    mobileMoneyAccountName: row.mobileMoneyAccountName ?? undefined,
    mobileMoneyAccountNumber: row.mobileMoneyAccountNumber ?? undefined,
    notes: row.notes ?? undefined,
  }))

  return apiRequest<CampaignBeneficiaryImportResult>(`/campaigns/${campaignId}/beneficiaries/import-bulk`, {
    method: 'POST',
    auth: true,
    body: { rows: payloadRows },
  })
}

function buildValidationFile(rows: CampaignBeneficiaryUploadPreviewRow[]) {
  const headers = [
    'name',
    'msisdn',
    'disbursement',
    'testimony',
    'gender',
    'date of birth',
    'email',
    'location',
    'province',
    'district',
    'community',
    'document id type',
    'document id number',
    'mobile money provider',
    'account name',
    'account number',
    'notes',
  ]

  const csv = [
    headers.join(','),
    ...rows.map((row) =>
      [
        row.name,
        row.msisdn,
        row.disbursementAmount,
        row.testimony,
        row.gender,
        encodeValidationDateCell(normalizeDateOfBirth(row.dateOfBirth)),
        row.email,
        row.location,
        row.province,
        row.district,
        row.community,
        row.documentIdType,
        row.documentIdNumber,
        row.mobileMoneyProvider,
        row.mobileMoneyAccountName,
        row.mobileMoneyAccountNumber,
        row.notes,
      ]
        .map(escapeCsvCell)
        .join(',')
    ),
  ].join('\n')

  return new File([csv], 'campaign-beneficiaries-validation.csv', { type: 'text/csv' })
}

function escapeCsvCell(value: unknown) {
  const text = value == null ? '' : String(value)
  if (text.includes(',') || text.includes('"') || text.includes('\n')) {
    return `"${text.replaceAll('"', '""')}"`
  }
  return text
}

function encodeValidationDateCell(value: string | null) {
  if (!value) return ''
  return `="${value}"`
}
