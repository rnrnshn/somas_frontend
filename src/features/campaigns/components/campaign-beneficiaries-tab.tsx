import { Download, Eye, Flag, Plus, Search, Upload } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table'
import { DataTablePagination } from '@/app/components/ui/table-pagination'
import { CampaignStatusBadge, type CampaignBeneficiaryItem } from '@/features/campaigns/components/campaign-detail-shared'
import { formatMetical } from '@/lib/format/currency'
import { useTranslation } from 'react-i18next'

type Props = {
  searchQuery: string
  onSearchChange: (value: string) => void
  beneficiarySearch: string
  beneficiaries: CampaignBeneficiaryItem[]
  beneficiariesPagination: {
    paginatedItems: CampaignBeneficiaryItem[]
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
    setPage: (page: number) => void
  }
  searchPending: boolean
  searchError: unknown
  listPending: boolean
  listError: unknown
  canAddBeneficiary: boolean
  onAddBeneficiary: () => void
  onImportCsv: () => void
  onExportCsv: () => void
  onViewBeneficiary: (beneficiaryId: number) => void
}

export function CampaignBeneficiariesTab({
  searchQuery,
  onSearchChange,
  beneficiarySearch,
  beneficiaries,
  beneficiariesPagination,
  searchPending,
  searchError,
  listPending,
  listError,
  canAddBeneficiary,
  onAddBeneficiary,
  onImportCsv,
  onExportCsv,
  onViewBeneficiary,
}: Props) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle style={{ fontSize: 'var(--text-16)' }}>{t('campaignDetailPage.beneficiaries')}</CardTitle>
          <div className="flex items-center gap-3">
            {canAddBeneficiary ? (
              <Button onClick={onAddBeneficiary}>
                <Plus className="mr-2 h-4 w-4" />
                {t('campaignDetailPage.addBeneficiary')}
              </Button>
            ) : null}
            <Button variant="outline" onClick={onImportCsv}>
              <Upload className="mr-2 h-4 w-4" />
              {t('campaignDetailPage.importCsv')}
            </Button>
            <Button variant="outline" onClick={onExportCsv}>
              <Download className="mr-2 h-4 w-4" />
              {t('campaignDetailPage.exportCsv')}
            </Button>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform" style={{ color: 'var(--muted-foreground)' }} />
              <Input
                placeholder={t('campaignDetailPage.searchBeneficiaries')}
                value={searchQuery}
                onChange={(event) => onSearchChange(event.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('campaignDetailPage.beneficiaryTableName')}</TableHead>
              <TableHead>MSISDN</TableHead>
              <TableHead>{t('campaignDetailPage.beneficiaryTableLocation')}</TableHead>
              <TableHead>{t('campaignDetailPage.beneficiaryTableAmount')}</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>{t('campaignDetailPage.beneficiaryTableLastActivity')}</TableHead>
              <TableHead className="w-24">{t('transactionsPage.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getContentState({ beneficiarySearch, searchPending, searchError, listPending, listError, beneficiariesLength: beneficiaries.length }) === 'loading' ? (
              <EmptyRow colSpan={7} message={t('campaignDetailPage.loadingBeneficiaries')} tone="muted" />
            ) : getContentState({ beneficiarySearch, searchPending, searchError, listPending, listError, beneficiariesLength: beneficiaries.length }) === 'error' ? (
              <EmptyRow
                colSpan={7}
                message={
                  searchError instanceof Error
                    ? searchError.message
                    : listError instanceof Error
                      ? listError.message
                      : t('campaignDetailPage.beneficiariesLoadError')
                }
                tone="error"
              />
            ) : beneficiaries.length === 0 ? (
              <EmptyRow
                colSpan={7}
                message={
                  beneficiarySearch.length > 0
                    ? t('campaignDetailPage.noBeneficiariesSearch')
                    : t('campaignDetailPage.noBeneficiariesCampaign')
                }
                tone="muted"
              />
            ) : (
              beneficiariesPagination.paginatedItems.map((beneficiary) => (
                <TableRow key={beneficiary.id}>
                  <TableCell>
                    <div>
                      <p style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-medium)' }}>
                        {beneficiary.name}
                      </p>
                      <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                        {beneficiary.id}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell style={{ fontSize: 'var(--text-13)', fontFamily: 'var(--font-mono)' }}>
                    {beneficiary.msisdn}
                  </TableCell>
                  <TableCell style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)' }}>
                    {beneficiary.location}
                  </TableCell>
                  <TableCell style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-medium)' }}>
                    {typeof beneficiary.amount === 'number' ? formatMetical(beneficiary.amount) : '—'}
                  </TableCell>
                  <TableCell>
                    <CampaignStatusBadge status={beneficiary.status} />
                  </TableCell>
                  <TableCell style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                    {beneficiary.lastActivity}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => onViewBeneficiary(beneficiary.beneficiaryId)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Flag className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <DataTablePagination
          page={beneficiariesPagination.page}
          pageSize={beneficiariesPagination.pageSize}
          totalItems={beneficiariesPagination.totalItems}
          totalPages={beneficiariesPagination.totalPages}
          onPageChange={beneficiariesPagination.setPage}
        />
      </CardContent>
    </Card>
  )
}

function getContentState({
  beneficiarySearch,
  searchPending,
  searchError,
  listPending,
  listError,
  beneficiariesLength,
}: {
  beneficiarySearch: string
  searchPending: boolean
  searchError: unknown
  listPending: boolean
  listError: unknown
  beneficiariesLength: number
}) {
  if (beneficiarySearch.length > 0 && searchPending) return 'loading'
  if (beneficiarySearch.length > 0 && searchError) return 'error'
  if (beneficiarySearch.length === 0 && listPending) return 'loading'
  if (beneficiarySearch.length === 0 && listError) return 'error'
  if (beneficiariesLength === 0) return 'empty'
  return 'ready'
}

function EmptyRow({ colSpan, message, tone }: { colSpan: number; message: string; tone: 'muted' | 'error' }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="py-12 text-center">
        <p style={{ fontSize: 'var(--text-14)', color: tone === 'error' ? 'var(--error)' : 'var(--muted-foreground)' }}>
          {message}
        </p>
      </TableCell>
    </TableRow>
  )
}
