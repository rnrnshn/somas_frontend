import type { CampaignDetail } from '@/features/campaigns/types/campaign'
import type { SavingsProgram, SavingsProgramStatus } from '@/features/savings-programs/types/savings-program'

export function adaptSavingsProgramStatus(status: SavingsProgramStatus) {
  switch (status) {
    case 'active':
      return 'Active'
    case 'closed':
      return 'Closed'
    case 'suspended':
      return 'Suspended'
    case 'draft':
      return 'Draft'
    default:
      return status
  }
}

export function adaptSavingsProgramListItem(program: SavingsProgram, campaign?: CampaignDetail) {
  const totalBeneficiaries = campaign?.totalBeneficiariesCount ?? program.participantTarget ?? 0
  const participants = Math.min(program.participantTarget ?? 0, totalBeneficiaries || program.participantTarget || 0)

  return {
    id: String(program.id),
    numericId: program.id,
    name: program.name,
    linkedCampaign: program.campaign?.name ?? campaign?.name ?? '—',
    linkedCampaignNumericId: program.campaignId,
    linkedCampaignId: program.campaign?.code ?? (program.campaign ? `CMP-${program.campaign.id}` : `CMP-${program.campaignId}`),
    participants,
    totalBeneficiaries,
    totalSaved: 0,
    savingsGoal: program.savingsGoal,
    status: adaptSavingsProgramStatus(program.status),
    startDate: program.startDate,
    endDate: program.endDate,
  }
}

export function adaptSavingsProgramDetail(program: SavingsProgram, campaign?: CampaignDetail) {
  const totalBeneficiaries = campaign?.totalBeneficiariesCount ?? program.participantTarget ?? 0
  const participants = Math.min(program.participantTarget ?? 0, totalBeneficiaries || program.participantTarget || 0)

  return {
    id: program.code,
    numericId: program.id,
    name: program.name,
    linkedCampaign: program.campaign?.name ?? campaign?.name ?? '—',
    linkedCampaignNumericId: program.campaignId,
    linkedCampaignId: program.campaign?.code ?? (program.campaign ? `CMP-${program.campaign.id}` : `CMP-${program.campaignId}`),
    status: adaptSavingsProgramStatus(program.status),
    startDate: program.startDate,
    endDate: program.endDate,
    totalSaved: 0,
    savingsGoal: program.savingsGoal,
    participants,
    totalBeneficiaries,
    minimumContribution: program.minimumContribution,
    matchingBonus: program.matchingBonusEnabled ? (program.matchingBonusPercentage ?? 0) : 0,
    avgSavingsPerBeneficiary: participants > 0 ? 0 : 0,
    description: program.description ?? 'No savings program description is available.',
  }
}

export function buildSavingsGrowth(totalSaved: number) {
  return [
    { month: 'Start', amount: 0 },
    { month: 'Current', amount: totalSaved },
  ]
}

export function buildParticipationData(participants: number, totalBeneficiaries: number) {
  return [
    { category: 'Active Savers', count: participants, color: 'var(--chart-1)' },
    { category: 'Not Participating', count: Math.max(totalBeneficiaries - participants, 0), color: 'var(--chart-5)' },
  ]
}
