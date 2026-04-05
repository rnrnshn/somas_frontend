import { Badge } from '@/app/components/ui/badge'
import { formatCompactMetical } from '@/lib/format/currency'

export type CampaignBeneficiaryItem = {
  id: string
  campaignBeneficiaryId: number
  beneficiaryId: number
  name: string
  msisdn: string
  location: string
  amount: number
  status: string
  lastActivity: string
}

export type CampaignTransactionItem = {
  id: string
  beneficiary: string
  amount: number
  status: string
  errorMessage: string | null
  executedAtRaw: string | null
  executionDate: string
}

export type CampaignSavingsItem = {
  id: string
  beneficiary: string
  savedAmount: number
  lastDeposit: string
}

export function CampaignStatusBadge({ status }: { status: string }) {
  const variants: Record<
    string,
    { variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'destructive' }
  > = {
    Active: { variant: 'success' },
    Paid: { variant: 'success' },
    Confirmed: { variant: 'success' },
    Pending: { variant: 'warning' },
    Failed: { variant: 'destructive' },
    Closed: { variant: 'secondary' },
  }

  return <Badge {...(variants[status] || {})}>{status}</Badge>
}

export function formatDisbursementStatus(status: string) {
  switch (status) {
    case 'confirmed':
      return 'Confirmed'
    case 'not_confirmed':
    case 'not_found':
      return 'Failed'
    case 'pending':
      return 'Pending'
    default:
      return status
  }
}

export function formatCampaignCurrency(amount: number) {
  return formatCompactMetical(amount)
}

export function formatCampaignDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function buildDisbursementProgressFromTransactions(
  transactions: Array<{ amount: number; executedAtRaw: string | null }>
) {
  const totals = new Map<string, { label: string; amount: number }>()

  transactions.forEach((transaction) => {
    if (!transaction.executedAtRaw) return
    const date = new Date(transaction.executedAtRaw)
    if (Number.isNaN(date.getTime())) return
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const label = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date)
    const current = totals.get(key)
    totals.set(key, {
      label,
      amount: (current?.amount ?? 0) + transaction.amount,
    })
  })

  let runningTotal = 0

  return Array.from(totals.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([, value]) => {
      runningTotal += value.amount
      return { month: value.label, amount: runningTotal }
    })
}
