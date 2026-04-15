import type { ChangeEvent } from 'react'
import { AlertTriangle, Upload } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Alert, AlertDescription } from '@/app/components/ui/alert'
import { Card, CardContent } from '@/app/components/ui/card'
import { CampaignUploadPreviewTable } from '@/features/campaigns/components/campaign-upload-preview-table'
import type { CampaignBeneficiaryRow } from '@/features/campaigns/components/create-campaign-shared'

type Pagination = {
  paginatedItems: CampaignBeneficiaryRow[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
  setPage: (page: number) => void
}

type Props = {
  uploadedFile: File | null
  fileInputId: string
  beneficiaries: CampaignBeneficiaryRow[]
  uploadParseErrors: string[]
  validationSummary: { total: number; valid: number; errors: number }
  pagination: Pagination
  isEditMode: boolean
  isRowValidationPending: boolean
  onFileUpload: (event: ChangeEvent<HTMLInputElement>) => void
  onEditBeneficiary: (beneficiaryId: string) => void
  onRemoveBeneficiary: (beneficiaryId: string) => void
}

export function CampaignBeneficiaryUploadStep({
  uploadedFile,
  fileInputId,
  beneficiaries,
  uploadParseErrors,
  validationSummary,
  pagination,
  isEditMode,
  isRowValidationPending,
  onFileUpload,
  onEditBeneficiary,
  onRemoveBeneficiary}: Props) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div
          className="cursor-pointer rounded-[var(--radius)] border-2 border-dashed p-12 text-center transition-colors hover:border-primary"
          style={{ borderColor: 'var(--border)' }}
          onClick={() => document.getElementById(fileInputId)?.click()}
        >
          <Upload className="mx-auto mb-4 h-12 w-12" style={{ color: 'var(--muted-foreground)' }} />
          <p className="font-medium mb-2">
            {uploadedFile ? uploadedFile.name : t('createCampaignPage.dropFile')}
          </p>
          <p className="text-muted-foreground">
            {t('createCampaignPage.supportedFormats')}
          </p>
          <input
            id={fileInputId}
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={onFileUpload}
          />
        </div>

        {isEditMode && !uploadedFile && beneficiaries.length > 0 ? (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {t('createCampaignPage.existingBeneficiariesLoaded')}
            </AlertDescription>
          </Alert>
        ) : null}

        {uploadParseErrors.length > 0 ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <p style={{ fontWeight: 'var(--font-weight-medium)' }}>
                {t('createCampaignPage.fileIssuesDetected')}
              </p>
              <div className="mt-2 space-y-1">
                {uploadParseErrors.map((error) => (
                  <p key={error}>{error}</p>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        ) : null}

        {beneficiaries.length > 0 ? (
          <>
            <div className="grid grid-cols-3 gap-4">
              <SummaryCard label={t('createCampaignPage.totalRecords')} value={validationSummary.total} />
              <SummaryCard
                label={t('createCampaignPage.validRecords')}
                value={validationSummary.valid}
                color="var(--success)"
              />
              <SummaryCard
                label={t('createCampaignPage.errorsDetected')}
                value={validationSummary.errors}
                color="var(--error)"
              />
            </div>

            {validationSummary.errors > 0 ? (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <p style={{ fontWeight: 'var(--font-weight-medium)' }}>
                    {t('createCampaignPage.errorsDetectedCount', { count: validationSummary.errors })}
                  </p>
                  <p style={{ color: 'var(--muted-foreground)', marginTop: '4px' }}>
                    {t('createCampaignPage.reviewErrors')}
                  </p>
                </AlertDescription>
              </Alert>
            ) : null}

            <div>
              <h3
                style={{
                  
                  fontWeight: 'var(--font-weight-medium)',
                  marginBottom: '12px'}}
              >
                {t('createCampaignPage.preview')}
              </h3>
              <CampaignUploadPreviewTable
                uploadedFile={uploadedFile}
                pagination={pagination}
                isRowValidationPending={isRowValidationPending}
                onEditBeneficiary={onEditBeneficiary}
                onRemoveBeneficiary={onRemoveBeneficiary}
              />
            </div>

            {uploadedFile ? <p style={mutedSmallTextStyle}>{t('createCampaignPage.editRowsHint')}</p> : null}
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}

function SummaryCard({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p style={mutedSmallTextStyle}>{label}</p>
        <p
          style={{
            
            fontWeight: 'var(--font-weight-semi-bold)',
            marginTop: '4px',
            ...(color ? { color } : {})}}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  )
}

const mutedSmallTextStyle = {  color: 'var(--muted-foreground)' }
