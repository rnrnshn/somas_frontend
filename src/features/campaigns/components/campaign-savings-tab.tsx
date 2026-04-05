import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table'
import { DataTablePagination } from '@/app/components/ui/table-pagination'
import { formatMetical } from '@/lib/format/currency'
import { useTranslation } from 'react-i18next'
import type { CampaignSavingsItem } from '@/features/campaigns/components/campaign-detail-shared'

type Props = {
  amountDisbursed: number
  savingsParticipation: Array<{ category: string; count: number }>
  savingsData: CampaignSavingsItem[]
  savingsPagination: {
    paginatedItems: CampaignSavingsItem[]
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
    setPage: (page: number) => void
  }
  formatCurrency: (amount: number) => string
  formatDate: (date: string) => string
}

export function CampaignSavingsTab({
  amountDisbursed,
  savingsParticipation,
  savingsData,
  savingsPagination,
  formatCurrency,
  formatDate,
}: Props) {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <MetricCard label="Total Savings Amount" value={formatCurrency(amountDisbursed)} />
        <MetricCard label="Number of Participants" value={String(savingsParticipation[0]?.count ?? 0)} />
        <MetricCard
          label="Avg Savings per Beneficiary"
          value={formatCurrency(savingsParticipation[0]?.count ? amountDisbursed / savingsParticipation[0].count : 0)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle style={{ fontSize: 'var(--text-16)' }}>{t('campaignDetailPage.savingsParticipation')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={savingsParticipation}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="category" style={{ fontSize: 'var(--text-12)' }} />
              <YAxis style={{ fontSize: 'var(--text-12)' }} />
              <Tooltip />
              <Bar dataKey="count" fill="var(--primary)" name={t('campaignDetailPage.beneficiaries')} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle style={{ fontSize: 'var(--text-16)' }}>{t('campaignDetailPage.savingsDetails')}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('campaignDetailPage.beneficiaries')}</TableHead>
                <TableHead>{t('campaignDetailPage.savedAmount')}</TableHead>
                <TableHead>{t('campaignDetailPage.lastDeposit')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {savingsData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="py-12 text-center">
                    <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }}>
                      {t('campaignDetailPage.savingsNotWired')}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                savingsPagination.paginatedItems.map((saving) => (
                  <TableRow key={saving.id}>
                    <TableCell style={{ fontSize: 'var(--text-13)' }}>{saving.beneficiary}</TableCell>
                    <TableCell style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-medium)' }}>
                      {formatMetical(saving.savedAmount)}
                    </TableCell>
                    <TableCell style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)' }}>
                      {formatDate(saving.lastDeposit)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <DataTablePagination
            page={savingsPagination.page}
            pageSize={savingsPagination.pageSize}
            totalItems={savingsPagination.totalItems}
            totalPages={savingsPagination.totalPages}
            onPageChange={savingsPagination.setPage}
          />
        </CardContent>
      </Card>
    </div>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)', marginBottom: '8px' }}>{label}</p>
        <p style={{ fontSize: 'var(--text-24)', fontWeight: 'var(--font-weight-semi-bold)' }}>{value}</p>
      </CardContent>
    </Card>
  )
}
