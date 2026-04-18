import { Button } from '@/app/components/ui/button'
import { CampaignBeneficiaryUploadStep } from '@/features/campaigns/components/campaign-beneficiary-upload-step'
import { CampaignConfirmDialog } from '@/features/campaigns/components/campaign-confirm-dialog'
import { CampaignDetailsStep } from '@/features/campaigns/components/campaign-details-step'
import { CampaignDisbursementStep } from '@/features/campaigns/components/campaign-disbursement-step'
import { CampaignReviewStep } from '@/features/campaigns/components/campaign-review-step'
import {
  buildConfirmSummary,
  getCatalogLabel,
  submitCampaign,
} from '@/features/campaigns/components/create-campaign-submit'
import { CreateCampaignHeader } from '@/features/campaigns/components/create-campaign-header'
import { CreateCampaignSkeleton } from '@/features/campaigns/components/create-campaign-skeleton'
import { CampaignUploadRowEditor } from '@/features/campaigns/components/campaign-upload-row-editor'
import { useCampaignCatalogs, useDistrictCatalog } from '@/features/catalogs/hooks/use-catalog-queries'
import {
  useAllCampaignBeneficiariesQuery,
  useCampaignQuery,
} from '@/features/campaigns/hooks/use-campaign-queries'
import {
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
  useValidateCampaignBeneficiaryRowsMutation,
  useValidateCampaignBeneficiariesUploadMutation,
} from '@/features/campaigns/hooks/use-campaign-mutations'
import { buildInitialCampaignFormData, useCreateCampaignForm } from '@/features/campaigns/hooks/use-create-campaign-form'
import { formatMetical } from '@/lib/format/currency'
import { useNavigate, useParams } from '@/lib/router'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { useTablePagination } from '../ui/table-pagination'

const TOTAL_STEPS = 4
const FILE_INPUT_ID = 'file-upload'

export function CreateCampaign() {
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const campaignId = Number(id)
  const isEditMode = Number.isFinite(campaignId)
  const catalogs = useCampaignCatalogs()
  const campaignQuery = useCampaignQuery(campaignId)
  const existingCampaignBeneficiariesQuery = useAllCampaignBeneficiariesQuery(campaignId)
  const createCampaignMutation = useCreateCampaignMutation()
  const updateCampaignMutation = useUpdateCampaignMutation(campaignId)
  const validateUploadMutation = useValidateCampaignBeneficiariesUploadMutation()
  const validateRowsMutation = useValidateCampaignBeneficiaryRowsMutation()
  const { t } = useTranslation()
  const initialFormData = buildInitialCampaignFormData(
    campaignQuery.data,
    existingCampaignBeneficiariesQuery.data?.data
  )

  if (isEditMode && (campaignQuery.isPending || catalogs.isPending) && !campaignQuery.data) {
    return <CreateCampaignSkeleton />
  }

  return (
    <CreateCampaignEditor
      key={isEditMode ? `edit-${campaignId}` : 'create'}
      campaignError={campaignQuery.error}
      catalogs={catalogs}
      createCampaignMutation={createCampaignMutation}
      initialFormData={initialFormData}
      isEditMode={isEditMode}
      navigate={navigate}
      t={t}
      updateCampaignMutation={updateCampaignMutation}
      validateRowsMutation={validateRowsMutation}
      validateUploadMutation={validateUploadMutation}
    />
  )
}

function CreateCampaignEditor({
  campaignError,
  catalogs,
  createCampaignMutation,
  initialFormData,
  isEditMode,
  navigate,
  t,
  updateCampaignMutation,
  validateRowsMutation,
  validateUploadMutation,
}: {
  campaignError: unknown
  catalogs: ReturnType<typeof useCampaignCatalogs>
  createCampaignMutation: ReturnType<typeof useCreateCampaignMutation>
  initialFormData: Parameters<typeof useCreateCampaignForm>[0]['initialFormData']
  isEditMode: boolean
  navigate: ReturnType<typeof useNavigate>
  t: ReturnType<typeof useTranslation>['t']
  updateCampaignMutation: ReturnType<typeof useUpdateCampaignMutation>
  validateRowsMutation: ReturnType<typeof useValidateCampaignBeneficiaryRowsMutation>
  validateUploadMutation: ReturnType<typeof useValidateCampaignBeneficiariesUploadMutation>
}) {
  const form = useCreateCampaignForm({
    initialFormData,
    validateUpload: (file) => validateUploadMutation.mutateAsync(file),
    validateRows: (rows) => validateRowsMutation.mutateAsync(rows),
    fileValidationErrorMessage: t('createCampaignPage.fileValidationError'),
  })
  const selectedProvinceId = Number(form.formData.province)
  const districts = useDistrictCatalog(
    Number.isFinite(selectedProvinceId) && selectedProvinceId > 0 ? selectedProvinceId : undefined
  )
  const districtsLoading = districts.isFetching && Number.isFinite(selectedProvinceId) && selectedProvinceId > 0

  const beneficiariesPreviewPagination = useTablePagination(form.formData.beneficiaries, undefined, [
    form.currentStep,
    form.uploadedFile,
    form.formData.beneficiaries.length,
  ])

  const isRowValidationPending = validateRowsMutation.isPending || validateUploadMutation.isPending
  const isSavePending = createCampaignMutation.isPending || updateCampaignMutation.isPending

  return (
    <div className="mx-auto max-w-5xl p-8">
      <CreateCampaignHeader
        currentStep={form.currentStep}
        totalSteps={TOTAL_STEPS}
        isEditMode={isEditMode}
        onBackToCampaigns={() => navigate('/backoffice/campaigns')}
      />

      {form.currentStep === 1 ? (
        <CampaignDetailsStep
          formData={form.formData}
          setFormData={form.setFormData}
          programs={catalogs.programs.data ?? []}
          regions={catalogs.regions.data ?? []}
          provinces={catalogs.provinces.data ?? []}
          districts={districts.data ?? []}
          programsLoading={catalogs.programs.isPending}
          regionsLoading={catalogs.regions.isPending}
          provincesLoading={catalogs.provinces.isPending}
          districtsLoading={districtsLoading}
          submitError={form.submitError}
          catalogsError={catalogs.error}
          campaignError={campaignError}
        />
      ) : null}

      {form.currentStep === 2 ? (
        <CampaignBeneficiaryUploadStep
          uploadedFile={form.uploadedFile}
          fileInputId={FILE_INPUT_ID}
          beneficiaries={form.formData.beneficiaries}
          uploadParseErrors={form.uploadParseErrors}
          validationSummary={form.validationSummary}
          pagination={beneficiariesPreviewPagination}
          isEditMode={isEditMode}
          isRowValidationPending={isRowValidationPending}
          onFileUpload={form.handleFileUpload}
          onEditBeneficiary={form.setEditingBeneficiaryId}
          onRemoveBeneficiary={(beneficiaryId) => void form.handleRemoveBeneficiary(beneficiaryId)}
        />
      ) : null}

      {form.currentStep === 3 ? (
        <CampaignDisbursementStep
          formData={form.formData}
          setFormData={form.setFormData}
          paymentChannels={catalogs.paymentChannels.data ?? []}
          disbursementTypes={catalogs.disbursementTypes.data ?? []}
          paymentChannelsLoading={catalogs.paymentChannels.isPending}
          disbursementTypesLoading={catalogs.disbursementTypes.isPending}
        />
      ) : null}

      {form.currentStep === 4 ? (
        <CampaignReviewStep
          name={form.formData.name}
          programLabel={getCatalogLabel(catalogs.programs.data ?? [], form.formData.program)}
          regionLabel={getCatalogLabel(catalogs.regions.data ?? [], form.formData.region)}
          provinceLabel={getCatalogLabel(catalogs.provinces.data ?? [], form.formData.province)}
          districtLabel={getCatalogLabel(districts.data ?? [], form.formData.district)}
          paymentChannelLabel={getCatalogLabel(catalogs.paymentChannels.data ?? [], form.formData.paymentChannel)}
          validBeneficiaries={form.validationSummary.valid}
          totalDisbursementLabel={
            form.hasKnownDisbursementAmounts ? formatMetical(form.totalDisbursement) : '—'
          }
          executionDate={form.formData.executionDate}
        />
      ) : null}

      <div className="mt-8 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => form.setCurrentStep((current) => current - 1)}
          disabled={form.currentStep === 1}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('createCampaignPage.back')}
        </Button>

        <Button onClick={() => handleNext(form.currentStep, form.setCurrentStep, form.setShowConfirmDialog)}>
          {form.currentStep === TOTAL_STEPS ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              {isEditMode ? t('createCampaignPage.updateCampaign') : t('createCampaignPage.createCampaign')}
            </>
          ) : (
            <>
              {t('createCampaignPage.next')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      <CampaignConfirmDialog
        open={form.showConfirmDialog}
        isEditMode={isEditMode}
        isPending={isSavePending}
        totalSummary={buildConfirmSummary(form.validationSummary.valid, form.totalDisbursement, form.hasKnownDisbursementAmounts)}
        executionDate={form.formData.executionDate}
        onOpenChange={form.setShowConfirmDialog}
        onConfirm={() =>
          void onConfirmCampaign({
            formData: form.formData,
            isEditMode,
            uploadedFile: form.uploadedFile,
            createCampaign: createCampaignMutation.mutateAsync,
            updateCampaign: updateCampaignMutation.mutateAsync,
            createdSuccessMessage: t('createCampaignPage.createdSuccess'),
            updatedSuccessMessage: t('createCampaignPage.updatedSuccess'),
            selectProvinceMessage: t('createCampaignPage.province'),
            selectPaymentMessage: t('createCampaignPage.selectPaymentBeforeSaving'),
            saveFailedMessage: t('createCampaignPage.saveFailed', {
              action: isEditMode ? 'updated' : 'created',
            }),
            onSubmitError: form.setSubmitError,
            onClose: () => form.setShowConfirmDialog(false),
            onSuccessNavigate: (savedCampaignId) => navigate(`/backoffice/campaigns/${savedCampaignId}`),
          })
        }
      />

      <CampaignUploadRowEditor
        open={form.editingBeneficiary !== null}
        row={form.editingBeneficiary}
        isPending={isRowValidationPending}
        onOpenChange={(open) => {
          if (!open) form.setEditingBeneficiaryId(null)
        }}
        onSave={form.handleEditBeneficiary}
      />
    </div>
  )
}

function handleNext(currentStep: number, setCurrentStep: (updater: (current: number) => number) => void, setShowConfirmDialog: (open: boolean) => void) {
  if (currentStep < TOTAL_STEPS) {
    setCurrentStep((current) => current + 1)
    return
  }

  setShowConfirmDialog(true)
}

async function onConfirmCampaign({
  formData,
  isEditMode,
  uploadedFile,
  createCampaign,
  updateCampaign,
  createdSuccessMessage,
  updatedSuccessMessage,
  selectProvinceMessage,
  selectPaymentMessage,
  saveFailedMessage,
  onSubmitError,
  onClose,
  onSuccessNavigate,
}: {
  formData: ReturnType<typeof useCreateCampaignForm>['formData']
  isEditMode: boolean
  uploadedFile: File | null
  createCampaign: Parameters<typeof submitCampaign>[0]['createCampaign']
  updateCampaign: Parameters<typeof submitCampaign>[0]['updateCampaign']
  createdSuccessMessage: string
  updatedSuccessMessage: string
  selectProvinceMessage: string
  selectPaymentMessage: string
  saveFailedMessage: string
  onSubmitError: (message: string) => void
  onClose: () => void
  onSuccessNavigate: (savedCampaignId: number) => void
}) {
  if (!formData.province) {
    onSubmitError(`${selectProvinceMessage} is required.`)
    onClose()
    return
  }

  if (!formData.paymentChannel) {
    onSubmitError(selectPaymentMessage)
    onClose()
    return
  }

  try {
    const savedCampaignId = await submitCampaign({
      formData,
      isEditMode,
      uploadedFile,
      createCampaign,
      updateCampaign,
    })
    toast.success(isEditMode ? updatedSuccessMessage : createdSuccessMessage)
    onClose()
    onSuccessNavigate(savedCampaignId)
  } catch (error) {
    const message = error instanceof Error ? error.message : saveFailedMessage
    toast.error(message)
    onSubmitError(message)
    onClose()
  }
}
