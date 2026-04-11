import type { PaginatedResponse } from '@/types/pagination'

export type BeneficiaryListFilters = {
  page: number
  pageSize: number
  name?: string
  msisdn?: string
}

export type BeneficiaryListItem = {
  id: number
  name: string
  msisdn: string
  createdAt: string
}

export type BeneficiaryMetric = {
  beneficiaryId?: number
  totalReceived: number
  totalSaved: number
  lastTransactionAt: string | null
}

export type BeneficiaryDetail = {
  id: number
  code: string | null
  status: string
  name: string
  msisdn: string
  email: string | null
  gender: string | null
  dateOfBirth: string | null
  location: string | null
  province:
    | string
    | {
        id: number
        name: string
      }
    | null
  district:
    | string
    | {
        id: number
        name: string
      }
    | null
  provinceId?: number | null
  districtId?: number | null
  community: string | null
  documentIdType: string | null
  documentIdNumber: string | null
  mobileMoneyProvider: string | null
  mobileMoneyAccountName: string | null
  mobileMoneyAccountNumber: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

export type BeneficiaryWithMetrics = BeneficiaryDetail & {
  activeCampaigns?: number
  metric?: {
    totalReceived: number
    totalSaved: number
    lastTransactionAt: string | null
  } | null
}

export type UpdateBeneficiaryPayload = {
  name?: string
  msisdn?: string
  gender?: string | null
  dateOfBirth?: string | null
  email?: string | null
  location?: string | null
  provinceId?: number | null
  districtId?: number | null
  community?: string | null
  documentIdType?: string | null
  documentIdNumber?: string | null
  mobileMoneyProvider?: string | null
  mobileMoneyAccountName?: string | null
  mobileMoneyAccountNumber?: string | null
  notes?: string | null
}

export type BeneficiaryTransactionItem = {
  id: number
  amount: number
  status: string
  type: string
  executedAt: string | null
  createdAt: string
  campaign?: {
    id: number
    name: string
    code: string | null
  } | null
}

export type BeneficiaryCampaignItem = {
  id: number
  campaignId: number
  createdAt: string
  campaign: {
    id: number
    name: string
    code: string | null
    status: string
    programRelation?: {
      id: number
      name: string
      code?: string | null
    } | null
  }
}

export type BeneficiaryListResponse = PaginatedResponse<BeneficiaryListItem>
export type BeneficiaryTransactionsResponse = PaginatedResponse<BeneficiaryTransactionItem>
export type BeneficiaryCampaignsResponse = PaginatedResponse<BeneficiaryCampaignItem>
