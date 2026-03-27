import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { useDisbursementBatchesQuery } from '@/features/transactions/hooks/use-transaction-queries'
import { adaptBatch } from '@/features/transactions/adapters/transactions'

export function Disbursements() {
  const batchesQuery = useDisbursementBatchesQuery(1, 100)
  const batches = (batchesQuery.data?.data ?? []).map(adaptBatch)
  const totalAmount = batches.reduce((sum, batch) => sum + batch.totalAmount, 0)
  const totalTransactions = batches.reduce((sum, batch) => sum + batch.transactions, 0)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 style={{ fontSize: 'var(--text-32)', fontWeight: 'var(--font-weight-semi-bold)' }}>Disbursements</h1>
        <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)', marginTop: '8px' }}>
          Manage bulk payments and execution batches
        </p>
      </div>

      {batchesQuery.error ? <p style={{ fontSize: 'var(--text-14)', color: 'var(--error)', marginBottom: '16px' }}>{batchesQuery.error instanceof Error ? batchesQuery.error.message : 'Disbursement batches could not be loaded.'}</p> : null}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <MetricCard label="Execution batches" value={String(batches.length)} />
        <MetricCard label="Transactions" value={String(totalTransactions)} />
        <MetricCard label="Scheduled amount" value={`MZN ${totalAmount.toLocaleString('pt-MZ')}`} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Execution batches</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Transactions</TableHead>
                <TableHead className="text-right">Successful</TableHead>
                <TableHead className="text-right">Failed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center">
                    <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }}>
                      {batchesQuery.isPending ? 'Loading disbursement batches...' : 'No disbursement batches found'}
                    </p>
                  </TableCell>
                </TableRow>
              ) : batches.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell>{batch.id}</TableCell>
                  <TableCell>{batch.campaign}</TableCell>
                  <TableCell>{batch.status}</TableCell>
                  <TableCell className="text-right">MZN {batch.totalAmount.toLocaleString('pt-MZ')}</TableCell>
                  <TableCell className="text-right">{batch.transactions}</TableCell>
                  <TableCell className="text-right">{batch.successful}</TableCell>
                  <TableCell className="text-right">{batch.failed}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return <Card><CardContent className="p-6"><p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)' }}>{label}</p><p style={{ fontSize: 'var(--text-28)', fontWeight: 'var(--font-weight-semi-bold)', marginTop: '8px' }}>{value}</p></CardContent></Card>
}
