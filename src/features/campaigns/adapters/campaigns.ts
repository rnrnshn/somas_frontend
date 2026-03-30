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
  const detailTotalBeneficiaries = detail ? Number(detail.totalBeneficiariesCount ?? 0) : null
  const detailTotalDisbursement = detail ? Number(detail.totalDisbursementAmount ?? 0) : null
  const detailSuccessRate = detail?.successRate ?? null

  return {
    id: String(item.id),
    numericId: item.id,
    statusCode: item.status,
    name: item.name,
    code: item.code,
    program: detail?.programRelation?.name ?? detail?.program ?? '—',
    region: item.province,
    startDate: item.startDate,
    endDate: item.endDate,
    beneficiaries: detailTotalBeneficiaries ?? Number(item.totalBeneficiariesCount ?? 0),
    disbursementAmount: detailTotalDisbursement ?? Number(item.totalDisbursementAmount ?? 0),
    successRate: detailSuccessRate ?? Number(item.successRate ?? 0),
    status: adaptCampaignStatus(item.status),
  }
}

export function adaptCampaignDetail(detail: CampaignDetail, progress?: CampaignProgress) {
  const pending = progress?.progressByStatus.pending ?? 0
  const confirmed = progress?.progressByStatus.confirmed ?? 0
  const failed = (progress?.progressByStatus.not_confirmed ?? 0) + (progress?.progressByStatus.not_found ?? 0)
  const successRate = detail.successRate ?? 0
  const totalDisbursementAmount = Number(detail.totalDisbursementAmount ?? 0)
  const totalBeneficiariesCount = Number(detail.totalBeneficiariesCount ?? 0)
  const totalBeneficiaries = Math.max(totalBeneficiariesCount, progress?.total ?? pending + confirmed + failed)

  return {
    id: detail.code ?? `CMP-${detail.id}`,
    numericId: detail.id,
    statusCode: detail.status,
    name: detail.name,
    program: detail.programRelation?.name ?? detail.program ?? '—',
    region: detail.province,
    startDate: detail.startDate,
    endDate: detail.endDate,
    status: adaptCampaignStatus(detail.status),
    enabledSavings: detail.isSavingCampaignEnabled,
    totalBeneficiaries,
    amountDisbursed: totalDisbursementAmount,
    totalBudget: totalDisbursementAmount,
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
