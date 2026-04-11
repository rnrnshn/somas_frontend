import { apiRequest } from '@/lib/api/client'
import type {
  BeneficiaryCampaignsResponse,
  BeneficiaryDetail,
  BeneficiaryListFilters,
  BeneficiaryListResponse,
  BeneficiaryMetric,
  BeneficiaryTransactionsResponse,
  BeneficiaryWithMetrics,
  UpdateBeneficiaryPayload,
} from '@/features/beneficiaries/types/beneficiary'

function buildBeneficiariesQuery(filters: BeneficiaryListFilters) {
  const params = new URLSearchParams({
    page: String(filters.page),
    pageSize: String(filters.pageSize),
  })

  if (filters.name?.trim()) params.set('name', filters.name.trim())
  if (filters.msisdn?.trim()) params.set('msisdn', filters.msisdn.trim())

  return `?${params.toString()}`
}

function pagedQuery(page = 1, pageSize = 5) {
  return `?page=${page}&pageSize=${pageSize}`
}

export function getBeneficiaries(filters: BeneficiaryListFilters) {
  return apiRequest<BeneficiaryListResponse>(`/beneficiaries${buildBeneficiariesQuery(filters)}`, {
    method: 'GET',
    auth: true,
  })
}

export function getBeneficiary(beneficiaryId: number) {
  return apiRequest<BeneficiaryDetail>(`/beneficiaries/${beneficiaryId}`, {
    method: 'GET',
    auth: true,
  })
}

export function getBeneficiaryWithMetrics(beneficiaryId: number) {
  return apiRequest<BeneficiaryWithMetrics>(`/beneficiaries/${beneficiaryId}/with-metrics`, {
    method: 'GET',
    auth: true,
  })
}

export function getBeneficiaryMetrics(beneficiaryId: number) {
  return apiRequest<BeneficiaryMetric>(`/beneficiaries/${beneficiaryId}/metrics`, {
    method: 'GET',
    auth: true,
  })
}

export function getBeneficiaryTransactions(beneficiaryId: number, page = 1, pageSize = 5) {
  return apiRequest<BeneficiaryTransactionsResponse>(`/beneficiaries/${beneficiaryId}/transactions${pagedQuery(page, pageSize)}`, {
    method: 'GET',
    auth: true,
  })
}

export function getBeneficiarySavings(beneficiaryId: number, page = 1, pageSize = 5) {
  return apiRequest<BeneficiaryTransactionsResponse>(`/beneficiaries/${beneficiaryId}/savings${pagedQuery(page, pageSize)}`, {
    method: 'GET',
    auth: true,
  })
}

export function getBeneficiaryCampaigns(beneficiaryId: number, page = 1, pageSize = 5) {
  return apiRequest<BeneficiaryCampaignsResponse>(`/beneficiaries/${beneficiaryId}/campaigns${pagedQuery(page, pageSize)}`, {
    method: 'GET',
    auth: true,
  })
}

export function updateBeneficiary(beneficiaryId: number, payload: UpdateBeneficiaryPayload) {
  return apiRequest<BeneficiaryDetail>(`/beneficiaries/${beneficiaryId}`, {
    method: 'PATCH',
    auth: true,
    body: payload,
  })
}
