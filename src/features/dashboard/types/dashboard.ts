export type DashboardPeriod = 'today' | 'last_7_days' | 'last_30_days' | 'last_90_days' | 'last_year'

export type DashboardFilters = {
  period?: DashboardPeriod
  province?: string
  campaignId?: number
}

export type DashboardOverview = {
  kpis: {
    totalDisbursed: number
    totalTransactions: number
    successRate: number
    failedTransactions: number
    activeCampaigns: number
    newBeneficiaries: number
    totalSaved: number
    participationRate: number
  }
  daily: Array<{
    date: string
    transactionsCount: number
    transactionsAmount: number
    transactionsCountSuccess: number
    transactionsCountFailed: number
    transactionsCountPending: number
    newBeneficiariesCount: number
    activeCampaignsCount: number
    savingsCount: number
    savingsTotalAmount: number
    beneficiariesTotalCumulative: number
  }>
  statusDistribution: {
    confirmed: number
    pending: number
    failed: number
  }
  campaignPerformance: Array<{
    campaignId: number
    name: string
    code: string | null
    province: string
    beneficiaries: number
    amount: number
    successRate: number
    status: string
    progress: number
  }>
}

export type DashboardTransactions = {
  series: Array<{
    date: string
    transactionsCount: number
    amount: number
  }>
  recent: Array<{
    id: number
    beneficiaryName: string | null
    campaignName: string | null
    amount: number
    status: string
    createdAt: string
  }>
}

export type DashboardBeneficiaries = {
  kpis: {
    total: number
    active: number
    inactive: number
    withSavings: number
  }
  growth: Array<{
    date: string
    total: number
    active: number
  }>
  byProvince: Array<{
    province: string
    beneficiaries: number
  }>
}

export type DashboardOperationalHealth = {
  activeSessions: number | null
  failedLogins: number
  systemEvents: number
  pendingFieldSync: number | null
  avgResponseTimeMs: number | null
  systemUptimePct: number | null
}
