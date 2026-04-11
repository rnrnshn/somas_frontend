import type { PaginatedResponse } from '@/types/pagination'

export type CampaignStatus = 'draft' | 'planned' | 'active' | 'completed' | 'suspended' | 'cancelled'

export type CampaignListFilters = {
  page: number
  pageSize: number
  code?: string
  name?: string
  status?: CampaignStatus
  provinceId?: number
}

export type CampaignListItem = {
  id: number
  name: string
  code: string | null
  status: CampaignStatus
  province?: string | null
  provinceId?: number | null
  startDate: string
  endDate: string
  totalBeneficiariesCount?: number
  totalDisbursementAmount?: number
  successRate?: number | null
}

export type CampaignListResponse = PaginatedResponse<CampaignListItem>

export type CampaignDetail = {
  id: number
  name: string
  code: string | null
  description: string | null
  program: string | null
  community: string | null
  province?: string | null
  provinceId?: number | null
  districtId?: number | null
  status: CampaignStatus
  startDate: string
  endDate: string
  executionDate: string | null
  isSavingCampaignEnabled: boolean
  totalBeneficiariesCount: number
  totalDisbursementAmount: number
  successRate: number | null
  createdAt: string
  updatedAt: string
  programRelation?: {
    id: number
    name: string
  } | null
  regionRelation?: {
    id: number
    name: string
  } | null
  provinceRelation?: {
    id: number
    name: string
  } | null
  districtRelation?: {
    id: number
    name: string
  } | null
  paymentChannel?: {
    id: number
    name: string
  } | null
  disbursementType?: {
    id: number
    name: string
  } | null
}

export type CampaignProgress = {
  campaignId: number
  progressByStatus: {
    pending?: number
    confirmed?: number
    not_confirmed?: number
    not_found?: number
  }
  total: number
}

export type CampaignBeneficiaryListItem = {
  id: number
  campaignId: number
  beneficiaryId: number
  disbursementAmount: number
  disbursementStatus: string
  createdAt: string
  beneficiary?: {
    id: number
    name: string
    msisdn: string
  } | null
}

export type CampaignBeneficiariesResponse = PaginatedResponse<CampaignBeneficiaryListItem>

export type CampaignBeneficiariesFilters = {
  page?: number
  pageSize?: number
}

export type CampaignBeneficiaryUploadPreviewRow = {
  index: number
  name: string
  msisdn: string
  disbursementAmount: number | null
  testimony?: string | null
  gender?: string | null
  dateOfBirth?: string | null
  email?: string | null
  location?: string | null
  province?: string | null
  district?: string | null
  community?: string | null
  documentIdType?: string | null
  documentIdNumber?: string | null
  mobileMoneyProvider?: string | null
  mobileMoneyAccountName?: string | null
  mobileMoneyAccountNumber?: string | null
  notes?: string | null
  status: 'valid' | 'invalid' | 'duplicate'
  errors: string[]
  duplicateOf?: number
}

export type CampaignBeneficiaryUploadPreview = {
  summary: {
    total: number
    valid: number
    invalid: number
    duplicate: number
    errors: number
  }
  rows: CampaignBeneficiaryUploadPreviewRow[]
  parseErrors?: Array<{
    row: number
    message: string
    msisdn?: string
    name?: string
  }>
}

export type CampaignBeneficiaryImportResult = {
  created: number
  skipped: number
  errors: Array<{
    row: number
    message: string
    msisdn?: string
    name?: string
  }>
}

export type AddCampaignBeneficiaryPayload = {
  name: string
  msisdn: string
  disbursementAmount: number
  testimony?: string | null
  gender?: string | null
  dateOfBirth?: string | null
  email?: string | null
  location?: string | null
  province?: string | null
  district?: string | null
  community?: string | null
  documentIdType?: string | null
  documentIdNumber?: string | null
  mobileMoneyProvider?: string | null
  mobileMoneyAccountName?: string | null
  mobileMoneyAccountNumber?: string | null
  notes?: string | null
}

export type CampaignMutationPayload = {
  name: string
  description?: string
  program?: string
  programId?: number | null
  community?: string
  provinceId: number
  districtId?: number | null
  regionId?: number | null
  startDate: string
  endDate: string
  executionDate?: string
  isSavingCampaignEnabled?: boolean
  paymentChannelId?: number | null
  disbursementTypeId?: number | null
  rules?: Record<string, unknown>
}

export type CampaignStatusUpdatePayload = {
  status: CampaignStatus
}

export type CampaignDisbursementExecutionResult = {
  batchId?: number | string
  code?: string
  transactionsCount?: number
  totalAmount?: number
}

export type CampaignBeneficiaryDisbursement = {
  id: number
  campaignId: number
  beneficiaryId: number
  disbursementAmount: number
  disbursementStatus: string
  testimony?: string | null
  latitude?: number | null
  longitude?: number | null
  verifiedAt?: string | null
  signatureUrl?: string | null
  photoUrl?: string | null
  beneficiary?: {
    id: number
    name: string
    msisdn: string
  } | null
  campaign?: {
    id: number
    name: string
    code?: string | null
  } | null
}

export type ConfirmCampaignBeneficiaryPayload = {
  status: 'confirmed' | 'not_confirmed' | 'not_found'
  latitude?: number
  longitude?: number
  verifiedAt?: string
  signatureUrl?: string
  photoUrl?: string
}
