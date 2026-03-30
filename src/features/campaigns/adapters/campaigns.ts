import type { CampaignDetail, CampaignListItem, CampaignProgress, CampaignStatus } from '@/features/campaigns/types/campaign'

export function adaptCampaignStatus(status: CampaignStatus) {
  switch (status) {
    case 'active':
      return 'Active'
    case 'completed':
      return 'Closed'
    case 'suspended':
      return 'Suspended'
    case 'draft':
      return 'Draft'
    case 'cancelled':
      return 'Closed'
    case 'planned':
      return 'Draft'
    default:
      return status
  }
}

export function adaptCampaignListItem(item: CampaignListItem, detail?: CampaignDetail) {
  return {
    id: String(item.id),
    numericId: item.id,
    name: item.name,
    code: item.code,
    program: detail?.programRelation?.name ?? detail?.program ?? '—',
    region: item.province,
    startDate: item.startDate,
    endDate: item.endDate,
    beneficiaries: item.totalBeneficiariesCount ?? detail?.totalBeneficiariesCount ?? 0,
    disbursementAmount: item.totalDisbursementAmount ?? detail?.totalDisbursementAmount ?? 0,
    successRate: item.successRate ?? detail?.successRate ?? 0,
    status: adaptCampaignStatus(item.status),
  }
}

export function adaptCampaignDetail(detail: CampaignDetail, progress?: CampaignProgress) {
  const pending = progress?.progressByStatus.pending ?? 0
  const confirmed = progress?.progressByStatus.confirmed ?? 0
  const failed = (progress?.progressByStatus.not_confirmed ?? 0) + (progress?.progressByStatus.not_found ?? 0)
  const successRate = detail.successRate ?? 0
  const amountDisbursed = Math.round(detail.totalDisbursementAmount * (successRate / 100))
  const totalBeneficiaries = Math.max(detail.totalBeneficiariesCount, progress?.total ?? pending + confirmed + failed)

  return {
    id: detail.code ?? `CMP-${detail.id}`,
    numericId: detail.id,
    name: detail.name,
    program: detail.programRelation?.name ?? detail.program ?? '—',
    region: detail.province,
    startDate: detail.startDate,
    endDate: detail.endDate,
    status: adaptCampaignStatus(detail.status),
    enabledSavings: detail.isSavingCampaignEnabled,
    totalBeneficiaries,
    amountDisbursed,
    totalBudget: detail.totalDisbursementAmount,
    successRate,
    pendingPayments: pending,
    failedPayments: failed,
    description: detail.description ?? 'No campaign description available.',
  }
}

export function adaptCampaignProgressSeries(detail: CampaignDetail) {
  const start = new Date(detail.startDate)
  const end = new Date(detail.executionDate ?? detail.endDate)

  return [
    { month: formatMonth(start), amount: 0 },
    { month: formatMonth(end), amount: detail.totalDisbursementAmount },
  ]
}

function formatMonth(date: Date) {
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date)
}
