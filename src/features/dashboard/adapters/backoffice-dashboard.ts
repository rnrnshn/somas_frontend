import type {
  DashboardBeneficiaries,
  DashboardOperationalHealth,
  DashboardOverview,
  DashboardTransactions,
} from '@/features/dashboard/types/dashboard'

function shortDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit' }).format(date)
}

function monthDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date)
}

export function adaptDailyMetrics(overview?: DashboardOverview) {
  const latest = overview?.daily.at(-1)
  const previous = overview?.daily.at(-2)

  const trend = (current: number, prior: number) => {
    if (!prior) return current > 0 ? 100 : 0
    return Number((((current - prior) / prior) * 100).toFixed(1))
  }

  return {
    transactionsToday: latest?.transactionsCount ?? 0,
    amountToday: latest?.transactionsAmount ?? 0,
    newBeneficiariesToday: latest?.newBeneficiariesCount ?? 0,
    savingsToday: latest?.savingsTotalAmount ?? 0,
    transactionsTrend: trend(latest?.transactionsCount ?? 0, previous?.transactionsCount ?? 0),
    amountTrend: trend(latest?.transactionsAmount ?? 0, previous?.transactionsAmount ?? 0),
    beneficiariesTrend: trend(latest?.newBeneficiariesCount ?? 0, previous?.newBeneficiariesCount ?? 0),
    savingsTrend: trend(latest?.savingsTotalAmount ?? 0, previous?.savingsTotalAmount ?? 0),
  }
}

export function adaptTransactionStatus(overview?: DashboardOverview) {
  const distribution = overview?.statusDistribution

  return [
    { name: 'Confirmed', value: distribution?.confirmed ?? 0, color: 'var(--success)' },
    { name: 'Pending', value: distribution?.pending ?? 0, color: 'var(--warning)' },
    { name: 'Failed', value: distribution?.failed ?? 0, color: 'var(--error)' },
  ]
}

export function adaptCampaignPerformance(overview?: DashboardOverview) {
  return (overview?.campaignPerformance ?? []).map((campaign) => ({
    id: String(campaign.campaignId),
    name: campaign.name,
    code: campaign.code,
    region: campaign.province,
    beneficiaries: campaign.beneficiaries,
    amount: campaign.amount,
    successRate: campaign.successRate,
    status: campaign.status,
    progress: campaign.progress,
  }))
}

export function adaptTransactionTrend(transactions?: DashboardTransactions) {
  return (transactions?.series ?? []).map((item) => ({
    date: shortDate(item.date),
    count: item.transactionsCount,
    amount: item.amount,
  }))
}

export function adaptRecentTransactions(transactions?: DashboardTransactions) {
  return (transactions?.recent ?? []).map((item) => ({
    id: `TXN-${item.id}`,
    beneficiary: item.beneficiaryName ?? 'Unknown beneficiary',
    campaign: item.campaignName ?? 'Unknown campaign',
    amount: item.amount,
    status: normalizeStatus(item.status),
    date: new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(new Date(item.createdAt)),
  }))
}

export function adaptSavingsGrowth(overview?: DashboardOverview) {
  return (overview?.daily ?? []).map((item) => ({
    month: monthDate(item.date),
    amount: item.savingsTotalAmount,
  }))
}

export function adaptSavingsByRegion(beneficiaries?: DashboardBeneficiaries) {
  return (beneficiaries?.byProvince ?? []).map((item) => ({
    region: item.province,
    amount: item.beneficiaries,
    participants: item.beneficiaries,
  }))
}

export function adaptBeneficiaryGrowth(beneficiaries?: DashboardBeneficiaries) {
  return (beneficiaries?.growth ?? []).map((item) => ({
    month: monthDate(item.date),
    total: item.total,
    active: item.active,
  }))
}

export function adaptSystemHealth(health?: DashboardOperationalHealth) {
  return {
    activeSessions: health?.activeSessions ?? 0,
    failedLogins: health?.failedLogins ?? 0,
    systemEvents: health?.systemEvents ?? 0,
    pendingSync: health?.pendingFieldSync ?? 0,
    avgResponseTime: health?.avgResponseTimeMs ? `${health.avgResponseTimeMs}ms` : 'N/A',
    uptime: typeof health?.systemUptimePct === 'number' ? `${health.systemUptimePct}%` : 'N/A',
  }
}

function normalizeStatus(status: string) {
  const value = status.toLowerCase()
  if (value === 'confirmed' || value === 'success' || value === 'successful') return 'Confirmed'
  if (value === 'pending') return 'Pending'
  if (value === 'failed' || value === 'error') return 'Failed'
  return status
}
