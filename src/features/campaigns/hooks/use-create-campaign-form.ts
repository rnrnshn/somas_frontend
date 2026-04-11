import { useEffect, useState, type ChangeEvent } from 'react'
import type {
  CampaignBeneficiaryUploadPreview,
  CampaignBeneficiaryUploadPreviewRow,
} from '@/features/campaigns/types/campaign'
import {
  formatParseError,
  getTotalDisbursement,
  getValidationSummary,
  mapPreviewRowToFormRow,
  type CampaignBeneficiaryRow,
  type CampaignFormData,
} from '@/features/campaigns/components/create-campaign-shared'
import { HttpError } from '@/lib/api/http-error'
import { toast } from 'sonner'

const EMPTY_FORM: CampaignFormData = {
  name: '',
  program: '',
  region: '',
  province: '',
  district: '',
  startDate: '',
  endDate: '',
  description: '',
  enableSavings: false,
  beneficiaries: [],
  paymentChannel: '',
  disbursementType: '',
  executionDate: '',
  stagedDisbursement: false,
}

type Params = {
  isEditMode: boolean
  campaignData: any
  existingBeneficiaries: any[] | undefined
  validateUpload: (file: File) => Promise<CampaignBeneficiaryUploadPreview>
  validateRows: (rows: CampaignBeneficiaryRow[]) => Promise<CampaignBeneficiaryUploadPreview>
  fileValidationErrorMessage: string
}

export function useCreateCampaignForm({
  isEditMode,
  campaignData,
  existingBeneficiaries,
  validateUpload,
  validateRows,
  fileValidationErrorMessage,
}: Params) {
  const [currentStep, setCurrentStep] = useState(1)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadParseErrors, setUploadParseErrors] = useState<string[]>([])
  const [editingBeneficiaryId, setEditingBeneficiaryId] = useState<string | null>(null)
  const [formData, setFormData] = useState<CampaignFormData>(EMPTY_FORM)

  useEffect(() => {
    if (!campaignData) return

    setFormData((current) => ({
      ...current,
      name: campaignData.name ?? current.name,
      program: campaignData.programRelation?.id ? String(campaignData.programRelation.id) : current.program,
      region: campaignData.regionRelation?.id ? String(campaignData.regionRelation.id) : current.region,
      province:
        campaignData.provinceRelation?.id || campaignData.province?.id
          ? String(campaignData.provinceRelation?.id ?? campaignData.province?.id)
          : current.province,
      district:
        campaignData.districtRelation?.id || campaignData.district?.id
          ? String(campaignData.districtRelation?.id ?? campaignData.district?.id)
          : current.district,
      startDate: campaignData.startDate ?? current.startDate,
      endDate: campaignData.endDate ?? current.endDate,
      description: campaignData.description ?? '',
      enableSavings: campaignData.isSavingCampaignEnabled,
      paymentChannel: campaignData.paymentChannel?.id
        ? String(campaignData.paymentChannel.id)
        : current.paymentChannel,
      disbursementType: campaignData.disbursementType?.id
        ? String(campaignData.disbursementType.id)
        : current.disbursementType,
      executionDate: campaignData.executionDate ?? '',
    }))
  }, [campaignData])

  useEffect(() => {
    if (!isEditMode || uploadedFile || !campaignData || !existingBeneficiaries) return

    const rows = existingBeneficiaries.map((item) => ({
      id: String(item.id),
      index: item.id,
      name: item.beneficiary?.name ?? 'Beneficiary',
      msisdn: item.beneficiary?.msisdn ?? '—',
      disbursementAmount: item.disbursementAmount,
      testimony: null,
      gender: null,
      dateOfBirth: null,
      email: null,
      location: null,
      province: null,
      district: null,
      community: null,
      documentIdType: null,
      documentIdNumber: null,
      mobileMoneyProvider: null,
      mobileMoneyAccountName: null,
      mobileMoneyAccountNumber: null,
      notes: null,
      status: 'valid' as const,
      errors: [],
    }))

    if (rows.length === 0) return

    setFormData((current) =>
      current.beneficiaries.length > 0 ? current : { ...current, beneficiaries: rows }
    )
  }, [campaignData, existingBeneficiaries, isEditMode, uploadedFile])

  const applyValidationPreview = (preview: CampaignBeneficiaryUploadPreview) => {
    setUploadParseErrors(
      (preview.parseErrors ?? []).map((error) => formatParseError(error.row, error.message))
    )
    setFormData((current) => ({
      ...current,
      beneficiaries: preview.rows.map(mapPreviewRowToFormRow),
    }))
  }

  const revalidateBeneficiaries = async (rows: CampaignBeneficiaryRow[]) => {
    applyValidationPreview(await validateRows(rows))
  }

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadedFile(file)
    setSubmitError(null)

    try {
      applyValidationPreview(await validateUpload(file))
    } catch (error) {
      setUploadParseErrors([])
      setSubmitError(
        error instanceof HttpError ? error.message : fileValidationErrorMessage
      )
    }
  }

  const handleEditBeneficiary = async (updatedRow: CampaignBeneficiaryUploadPreviewRow) => {
    const nextRows = formData.beneficiaries.map((row) =>
      row.id === editingBeneficiaryId ? mapPreviewRowToFormRow(updatedRow) : row
    )

    try {
      await revalidateBeneficiaries(nextRows)
      setEditingBeneficiaryId(null)
    } catch (error) {
      toast.error(error instanceof HttpError ? error.message : fileValidationErrorMessage)
    }
  }

  const handleRemoveBeneficiary = async (beneficiaryId: string) => {
    const nextRows = formData.beneficiaries.filter((row) => row.id !== beneficiaryId)

    try {
      if (nextRows.length === 0) {
        setUploadParseErrors([])
        setFormData((current) => ({ ...current, beneficiaries: [] }))
        return
      }

      await revalidateBeneficiaries(nextRows)
    } catch (error) {
      toast.error(error instanceof HttpError ? error.message : fileValidationErrorMessage)
    }
  }

  return {
    currentStep,
    setCurrentStep,
    showConfirmDialog,
    setShowConfirmDialog,
    submitError,
    setSubmitError,
    uploadedFile,
    uploadParseErrors,
    editingBeneficiaryId,
    setEditingBeneficiaryId,
    formData,
    setFormData,
    validationSummary: getValidationSummary(formData.beneficiaries),
    totalDisbursement: getTotalDisbursement(formData.beneficiaries),
    hasKnownDisbursementAmounts: formData.beneficiaries.some(
      (beneficiary) => typeof beneficiary.disbursementAmount === 'number'
    ),
    editingBeneficiary:
      formData.beneficiaries.find((beneficiary) => beneficiary.id === editingBeneficiaryId) ?? null,
    handleFileUpload,
    handleEditBeneficiary,
    handleRemoveBeneficiary,
  }
}
