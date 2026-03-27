import type {
  BeneficiaryCampaignItem,
  BeneficiaryDetail,
  BeneficiaryListItem,
  BeneficiaryMetric,
  BeneficiaryTransactionItem,
  BeneficiaryWithMetrics,
} from '@/features/beneficiaries/types/beneficiary'

export function adaptBeneficiaryListItem(
  item: BeneficiaryListItem,
  withMetrics?: BeneficiaryWithMetrics,
  primaryCampaign?: BeneficiaryCampaignItem
) {
  return {
    id: item.id,
    beneficiaryCode: withMetrics?.code ?? `BEN-${String(item.id).padStart(6, '0')}`,
    fullName: withMetrics?.name ?? item.name,
    msisdn: item.msisdn,
    province: withMetrics?.province ?? '—',
    district: withMetrics?.district ?? '—',
    campaign: primaryCampaign?.campaign.name ?? '—',
    lastTransaction: formatDate(withMetrics?.metric?.lastTransactionAt ?? null),
    totalReceived: withMetrics?.metric?.totalReceived ?? 0,
    totalSaved: withMetrics?.metric?.totalSaved ?? 0,
    status: normalizeStatus(withMetrics?.status),
  }
}

export function adaptBeneficiaryProfile(withMetrics: BeneficiaryWithMetrics, metrics?: BeneficiaryMetric) {
  const metric = metrics ?? withMetrics.metric ?? null

  return {
    id: String(withMetrics.id),
    beneficiaryCode: withMetrics.code ?? `BEN-${String(withMetrics.id).padStart(6, '0')}`,
    fullName: withMetrics.name,
    gender: withMetrics.gender ?? '—',
    dateOfBirth: formatDate(withMetrics.dateOfBirth),
    msisdn: withMetrics.msisdn,
    email: withMetrics.email,
    nationalId: withMetrics.documentIdNumber ?? '—',
    idType: withMetrics.documentIdType ?? '—',
    nationalIdVerified: Boolean(withMetrics.documentIdNumber),
    province: withMetrics.province ?? '—',
    district: withMetrics.district ?? '—',
    community: withMetrics.community ?? '—',
    mobileMoneyProvider: withMetrics.mobileMoneyProvider ?? '—',
    mobileMoneyName: withMetrics.mobileMoneyAccountName ?? withMetrics.name,
    mobileMoneyAccountNumber: withMetrics.mobileMoneyAccountNumber ?? withMetrics.msisdn,
    status: normalizeStatus(withMetrics.status),
    verificationStatus: withMetrics.documentIdNumber ? 'Verified' : 'Pending',
    createdAt: formatDate(withMetrics.createdAt),
    totalReceived: metric?.totalReceived ?? 0,
    totalSaved: metric?.totalSaved ?? 0,
    lastTransaction: formatDate(metric?.lastTransactionAt ?? null),
    campaignCount: withMetrics.activeCampaigns ?? 0,
    notes: withMetrics.notes ?? 'No beneficiary notes are available.',
    location: withMetrics.location ?? '—',
  }
}

export function adaptBeneficiaryTransactions(items: BeneficiaryTransactionItem[]) {
  return items.map((item) => ({
    id: `TXN-${item.id}`,
    campaign: item.campaign?.name ?? '—',
    amount: item.amount,
    status: normalizeTransactionStatus(item.status),
    date: formatDate(item.executedAt ?? item.createdAt),
  }))
}

export function adaptBeneficiarySavings(items: BeneficiaryTransactionItem[]) {
  return items.map((item) => ({
    id: `SAV-${item.id}`,
    campaign: item.campaign?.name ?? '—',
    amount: item.amount,
    status: normalizeTransactionStatus(item.status),
    date: formatDate(item.executedAt ?? item.createdAt),
  }))
}

export function adaptBeneficiaryCampaigns(items: BeneficiaryCampaignItem[]) {
  return items.map((item) => ({
    id: item.campaign.code ?? `CMP-${item.campaignId}`,
    name: item.campaign.name,
    program: item.campaign.programRelation?.name ?? '—',
    status: normalizeStatus(item.campaign.status),
    enrolled: formatDate(item.createdAt),
  }))
}

function normalizeStatus(status?: string | null) {
  const value = status?.toLowerCase() ?? ''
  if (value === 'active') return 'Active'
  if (value === 'inactive') return 'Suspended'
  if (value === 'suspended') return 'Suspended'
  if (value === 'pending') return 'Pending'
  return status ?? 'Pending'
}

function normalizeTransactionStatus(status: string) {
  const value = status.toLowerCase()
  if (value === 'confirmed' || value === 'completed' || value === 'success') return 'Completed'
  if (value === 'pending') return 'Pending'
  if (value === 'failed' || value === 'error') return 'Rejected'
  return status
}

function formatDate(value: string | null | undefined) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-CA').format(date)
}
