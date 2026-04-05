import { RotateCcw } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table'
import { DataTablePagination } from '@/app/components/ui/table-pagination'
import { CampaignStatusBadge, type CampaignTransactionItem } from '@/features/campaigns/components/campaign-detail-shared'
import { formatMetical } from '@/lib/format/currency'
import { useTranslation } from 'react-i18next'

type Props = {
  transactions: CampaignTransactionItem[]
  transactionsPagination: {
    paginatedItems: CampaignTransactionItem[]
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
    setPage: (page: number) => void
  }
  isPending: boolean
  error: unknown
}

export function CampaignTransactionsTab({
  transactions,
  transactionsPagination,
  isPending,
  error,
}: Props) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle style={{ fontSize: 'var(--text-16)' }}>{t('campaignDetailPage.transactions')}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('campaignDetailPage.transactionId')}</TableHead>
              <TableHead>Beneficiary</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>{t('campaignDetailPage.errorMessage')}</TableHead>
              <TableHead>{t('campaignDetailPage.executionDate')}</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              <EmptyRow message={t('transactionsPage.loadingTransactions')} tone="muted" />
            ) : error ? (
              <EmptyRow
                message={error instanceof Error ? error.message : t('campaignDetailPage.transactionsLoadError')}
                tone="error"
              />
            ) : transactions.length === 0 ? (
              <EmptyRow message={t('campaignDetailPage.noTransactionsYet')} tone="muted" />
            ) : (
              transactionsPagination.paginatedItems.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell style={{ fontSize: 'var(--text-12)', fontFamily: 'var(--font-mono)' }}>
                    {transaction.id}
                  </TableCell>
                  <TableCell style={{ fontSize: 'var(--text-13)' }}>{transaction.beneficiary}</TableCell>
                  <TableCell style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-medium)' }}>
                    {formatMetical(transaction.amount)}
                  </TableCell>
                  <TableCell>
                    <CampaignStatusBadge status={transaction.status} />
                  </TableCell>
                  <TableCell>
                    {transaction.errorMessage ? (
                      <span style={{ fontSize: 'var(--text-12)', color: 'var(--error)' }}>
                        {transaction.errorMessage}
                      </span>
                    ) : (
                      <span style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>—</span>
                    )}
                  </TableCell>
                  <TableCell style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                    {transaction.executionDate}
                  </TableCell>
                  <TableCell>
                    {transaction.status === 'Failed' ? (
                      <Button variant="ghost" size="sm">
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <DataTablePagination
          page={transactionsPagination.page}
          pageSize={transactionsPagination.pageSize}
          totalItems={transactionsPagination.totalItems}
          totalPages={transactionsPagination.totalPages}
          onPageChange={transactionsPagination.setPage}
        />
      </CardContent>
    </Card>
  )
}

function EmptyRow({ message, tone }: { message: string; tone: 'muted' | 'error' }) {
  return (
    <TableRow>
      <TableCell colSpan={7} className="py-12 text-center">
        <p style={{ fontSize: 'var(--text-14)', color: tone === 'error' ? 'var(--error)' : 'var(--muted-foreground)' }}>
          {message}
        </p>
      </TableCell>
    </TableRow>
  )
}
