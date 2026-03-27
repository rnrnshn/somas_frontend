import type {
  DisbursementBatchItem,
  TransactionAnalyticsSummary,
  TransactionDetail,
  TransactionListItem,
} from '@/features/transactions/types/transaction'

export function adaptTransaction(item: TransactionListItem | TransactionDetail) {
  return {
    numericId: item.id,
    id: `TXN-${item.id}`,
    reference: `TXN-${item.id}`,
    beneficiary: item.beneficiary?.name ?? 'Unknown beneficiary',
    beneficiaryCode: item.beneficiary ? `BEN-${String(item.beneficiary.id).padStart(6, '0')}` : '—',
    campaign: item.campaign?.name ?? '—',
    campaignId: item.campaign?.code ?? (item.campaign ? `CMP-${item.campaign.id}` : '—'),
    type: normalizeType(item.type),
    amount: item.amount,
    mobileMoneyProvider: item.paymentChannel?.name ?? '—',
    externalTxnId: 'externalId' in item ? (item.externalId ?? null) : null,
    status: normalizeStatus(item.status),
    executedAt: formatDateTime(item.executedAt),
    createdAt: formatDateTime(item.createdAt),
    currency: 'MZN',
    errorMessage: 'errorMessage' in item ? (item.errorMessage ?? null) : null,
  }
}

export function adaptBatch(item: DisbursementBatchItem) {
  return {
    id: item.code,
    campaign: item.campaign?.name ?? '—',
    campaignId: item.campaign?.code ?? (item.campaign ? `CMP-${item.campaign.id}` : '—'),
    totalAmount: item.totalAmount ?? 0,
    transactions: item.transactionsCount ?? 0,
    successful: item.successCount ?? 0,
    failed: item.failedCount ?? 0,
    pending: item.pendingCount ?? 0,
    status: normalizeBatchStatus(item.status),
    createdAt: formatDateTime(item.createdAt),
    executedAt: formatDateTime(item.executedAt),
  }
}

export function adaptAnalytics(summary?: TransactionAnalyticsSummary) {
  return {
    totalDisbursed: summary?.totalDisbursed ?? 0,
    totalTransactions: summary?.totalTransactions ?? 0,
    successfulTransactions: getStatusCount(summary?.byStatus, ['successful', 'confirmed', 'completed', 'success']),
    failedTransactions: summary?.failedTransactions ?? getStatusCount(summary?.byStatus, ['failed', 'reversed', 'error']),
    successRate: summary?.successRate?.toFixed(1) ?? '0.0',
    byCampaign: (summary?.byCampaign ?? []).map((item, index) => ({
      name: item.campaignName,
      count: item.count,
      amount: item.amount,
      color: `var(--chart-${(index % 5) + 1})`,
    })),
    byStatus: [
      { status: 'Successful', count: getStatusCount(summary?.byStatus, ['successful', 'confirmed', 'completed', 'success']), color: 'var(--success)' },
      { status: 'Pending', count: getStatusCount(summary?.byStatus, ['pending']), color: 'var(--warning)' },
      { status: 'Processing', count: getStatusCount(summary?.byStatus, ['processing']), color: 'var(--warning)' },
      { status: 'Failed', count: getStatusCount(summary?.byStatus, ['failed', 'error']), color: 'var(--destructive)' },
      { status: 'Reversed', count: getStatusCount(summary?.byStatus, ['reversed']), color: 'var(--destructive)' },
    ].filter((item) => item.count > 0),
  }
}

function getStatusCount(byStatus: Record<string, number> | undefined, keys: string[]) {
  if (!byStatus) return 0
  return Object.entries(byStatus).reduce((total, [key, value]) => {
    return keys.includes(key.toLowerCase()) ? total + value : total
  }, 0)
}

function normalizeType(type: string) {
  const value = type.toLowerCase()
  if (value.includes('saving')) return 'Savings'
  return 'Disbursement'
}

function normalizeStatus(status: string) {
  const value = status.toLowerCase()
  if (['successful', 'confirmed', 'completed', 'success'].includes(value)) return 'Successful'
  if (value === 'pending') return 'Pending'
  if (value === 'processing') return 'Processing'
  if (['failed', 'error'].includes(value)) return 'Failed'
  if (value === 'reversed') return 'Reversed'
  return status
}

function normalizeBatchStatus(status: string) {
  const value = status.toLowerCase()
  if (['completed', 'successful'].includes(value)) return 'Completed'
  if (['processing', 'pending'].includes(value)) return 'Processing'
  if (['scheduled', 'planned'].includes(value)) return 'Scheduled'
  if (['failed', 'error'].includes(value)) return 'Failed'
  return status
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date)
}
