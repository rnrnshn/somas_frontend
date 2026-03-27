export type FieldSearchFilters = {
  campaignId?: number
  msisdn?: string
  name?: string
}

export type FieldSearchResult = {
  id: number
  campaignId: number
  beneficiaryId: number
  disbursementAmount: number
  disbursementStatus: string
  beneficiary?: {
    id: number
    name: string
    msisdn: string
  } | null
  campaign?: {
    id: number
    name: string
    code: string | null
  } | null
}

export type FieldConfirmationDraft = {
  localId: string
  campaignId: number
  campaignBeneficiaryId: number
  beneficiaryName: string
  status: 'confirmed' | 'not_confirmed' | 'not_found'
  latitude?: number
  longitude?: number
  verifiedAt?: string
  signatureUrl?: string
  photoUrl?: string
  createdAt: string
}
