import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { formatMetical } from '@/lib/format/currency'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table'
import { DataTablePagination } from '@/app/components/ui/table-pagination'
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
  pagination: Pagination
  isRowValidationPending: boolean
  onEditBeneficiary: (beneficiaryId: string) => void
  onRemoveBeneficiary: (beneficiaryId: string) => void
}

export function CampaignUploadPreviewTable({
  uploadedFile,
  pagination,
  isRowValidationPending,
  onEditBeneficiary,
  onRemoveBeneficiary,
}: Props) {
  const { t } = useTranslation()

  return (
    <div className="rounded-[--radius] border" style={{ borderColor: 'var(--border)' }}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>{t('createCampaignPage.name')}</TableHead>
            <TableHead>MSISDN</TableHead>
            <TableHead>{t('createCampaignPage.location')}</TableHead>
            <TableHead>{t('createCampaignPage.amount')}</TableHead>
            <TableHead>{t('createCampaignPage.status')}</TableHead>
            <TableHead>{t('createCampaignPage.errors')}</TableHead>
            <TableHead>{t('createCampaignPage.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pagination.paginatedItems.map((beneficiary) => (
            <TableRow key={beneficiary.id}>
              <TableCell style={mutedTextStyle}>{beneficiary.index}</TableCell>
              <TableCell style={bodyTextStyle}>{beneficiary.name}</TableCell>
              <TableCell style={monoTextStyle}>{beneficiary.msisdn}</TableCell>
              <TableCell style={mutedTextStyle}>{beneficiary.location ?? '—'}</TableCell>
              <TableCell style={amountTextStyle}>
                {typeof beneficiary.disbursementAmount === 'number'
                  ? formatMetical(beneficiary.disbursementAmount)
                  : '—'}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getStatusIcon(beneficiary.status)}
                  <StatusBadge status={beneficiary.status} />
                </div>
              </TableCell>
              <TableCell
                style={{
                  fontSize: 'var(--text-12)',
                  color: beneficiary.errors.length > 0 ? 'var(--error)' : 'var(--muted-foreground)',
                }}
              >
                {beneficiary.errors.length > 0 ? beneficiary.errors.join(' ') : '—'}
              </TableCell>
              <TableCell>
                {uploadedFile ? (
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEditBeneficiary(beneficiary.id)}>
                      {t('createCampaignPage.edit')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRemoveBeneficiary(beneficiary.id)}
                      disabled={isRowValidationPending}
                    >
                      {t('createCampaignPage.remove')}
                    </Button>
                  </div>
                ) : (
                  <span style={mutedSmallTextStyle}>—</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DataTablePagination
        page={pagination.page}
        pageSize={pagination.pageSize}
        totalItems={pagination.totalItems}
        totalPages={pagination.totalPages}
        onPageChange={pagination.setPage}
      />
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, { variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'destructive' }> = {
    valid: { variant: 'success' },
    duplicate: { variant: 'warning' },
    invalid: { variant: 'destructive' },
  }

  return <Badge {...(variants[status] || {})}>{status}</Badge>
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'valid':
      return <CheckCircle className="h-4 w-4" style={{ color: 'var(--success)' }} />
    case 'duplicate':
      return <AlertTriangle className="h-4 w-4" style={{ color: 'var(--warning)' }} />
    case 'invalid':
      return <XCircle className="h-4 w-4" style={{ color: 'var(--error)' }} />
    default:
      return null
  }
}

const bodyTextStyle = { fontSize: 'var(--text-13)' }
const mutedTextStyle = { fontSize: 'var(--text-13)', color: 'var(--muted-foreground)' }
const mutedSmallTextStyle = { fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }
const monoTextStyle = { fontSize: 'var(--text-13)', fontFamily: 'var(--font-mono)' }
const amountTextStyle = { fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-medium)' }
