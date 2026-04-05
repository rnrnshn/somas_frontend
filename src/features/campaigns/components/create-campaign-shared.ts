import type { CampaignBeneficiaryUploadPreviewRow } from '@/features/campaigns/types/campaign'

export type CampaignBeneficiaryRow = CampaignBeneficiaryUploadPreviewRow & {
  id: string
  location: string | null
}

export type CampaignFormData = {
  name: string
  program: string
  region: string
  startDate: string
  endDate: string
  description: string
  enableSavings: boolean
  beneficiaries: CampaignBeneficiaryRow[]
  paymentChannel: string
  disbursementType: string
  executionDate: string
  stagedDisbursement: boolean
}

export function mapPreviewRowToFormRow(
  row: CampaignBeneficiaryUploadPreviewRow
): CampaignBeneficiaryRow {
  return {
    ...row,
    dateOfBirth: normalizeDateOfBirth(row.dateOfBirth),
    id: String(row.index),
    location:
      row.location ?? ([row.community, row.district, row.province].filter(Boolean).join(', ') || null),
  }
}

export function formatParseError(row: number, message: string) {
  return row > 0 ? `Row ${row}: ${message}` : message
}

export function getValidationSummary(beneficiaries: CampaignBeneficiaryRow[]) {
  const total = beneficiaries.length
  const valid = beneficiaries.filter((beneficiary) => beneficiary.status === 'valid').length
  const errors = beneficiaries.filter((beneficiary) => beneficiary.status !== 'valid').length
  return { total, valid, errors }
}

export function getTotalDisbursement(beneficiaries: CampaignBeneficiaryRow[]) {
  return beneficiaries
    .filter((beneficiary) => beneficiary.status === 'valid')
    .reduce((sum, beneficiary) => sum + (beneficiary.disbursementAmount ?? 0), 0)
}

export function normalizeDateOfBirth(value: string | null | undefined) {
  if (!value) return null

  const trimmed = value.trim()
  if (!trimmed) return null

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed

  if (/^\d+(\.\d+)?$/.test(trimmed)) {
    const numericValue = Number(trimmed)
    if (!Number.isFinite(numericValue)) return trimmed

    const wholeDays = Math.floor(numericValue)
    const excelEpoch = Date.UTC(1899, 11, 30)
    const date = new Date(excelEpoch + wholeDays * 24 * 60 * 60 * 1000)

    if (!Number.isNaN(date.getTime())) {
      return date.toISOString().slice(0, 10)
    }
  }

  return trimmed
}
