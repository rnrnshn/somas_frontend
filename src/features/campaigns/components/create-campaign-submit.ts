import { importCampaignBeneficiaries } from '@/features/campaigns/api/campaigns-api'
import type { CampaignFormData } from '@/features/campaigns/components/create-campaign-shared'
import { formatMetical } from '@/lib/format/currency'

export function buildConfirmSummary(
  valid: number,
  totalDisbursement: number,
  hasKnownDisbursementAmounts: boolean
) {
  return hasKnownDisbursementAmounts
    ? `${valid} beneficiaries • ${formatMetical(totalDisbursement)} total`
    : `${valid} beneficiaries`
}

export function getCatalogLabel(options: Array<{ id: number; name: string }>, value: string) {
  if (!value) return ''
  return options.find((option) => String(option.id) === value)?.name ?? ''
}

export function buildCampaignPayload(
  formData: CampaignFormData
) {
  return {
    name: formData.name,
    description: formData.description || undefined,
    programId: formData.program ? Number(formData.program) : undefined,
    regionId: formData.region ? Number(formData.region) : undefined,
    provinceId: Number(formData.province),
    districtId: formData.district ? Number(formData.district) : undefined,
    community: undefined,
    startDate: formData.startDate,
    endDate: formData.endDate,
    executionDate: formData.executionDate || undefined,
    isSavingCampaignEnabled: formData.enableSavings,
    paymentChannelId: formData.paymentChannel ? Number(formData.paymentChannel) : undefined,
    disbursementTypeId: formData.disbursementType ? Number(formData.disbursementType) : undefined,
  }
}

export async function submitCampaign({
  formData,
  isEditMode,
  uploadedFile,
  createCampaign,
  updateCampaign,
}: {
  formData: CampaignFormData
  isEditMode: boolean
  uploadedFile: File | null
  createCampaign: (payload: ReturnType<typeof buildCampaignPayload>) => Promise<{ id: number }>
  updateCampaign: (payload: ReturnType<typeof buildCampaignPayload>) => Promise<{ id: number }>
}) {
  const payload = buildCampaignPayload(formData)
  const savedCampaign = isEditMode ? await updateCampaign(payload) : await createCampaign(payload)
  const validRows = formData.beneficiaries
    .filter((row) => row.status === 'valid' && typeof row.disbursementAmount === 'number')
    .map((row) => ({ ...row, location: row.location ?? undefined }))

  if (uploadedFile && validRows.length > 0) {
    await importCampaignBeneficiaries(savedCampaign.id, validRows)
  }

  return savedCampaign.id
}
