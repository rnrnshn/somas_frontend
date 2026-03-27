export type SavingsProgramStatus = 'draft' | 'active' | 'suspended' | 'closed'

export type SavingsProgramListFilters = {
  status?: SavingsProgramStatus
  campaignId?: number
  search?: string
}

export type SavingsProgram = {
  id: number
  campaignId: number
  name: string
  code: string
  startDate: string
  endDate: string
  savingsGoal: number
  minimumContribution: number
  matchingBonusEnabled: boolean
  matchingBonusPercentage: number | null
  description: string | null
  status: SavingsProgramStatus
  participantTarget: number | null
  createdAt: string
  updatedAt: string
  campaign?: {
    id: number
    name: string
    code: string | null
  } | null
}

export type SavingsProgramMutationPayload = {
  campaignId?: number
  name?: string
  startDate?: string
  endDate?: string
  savingsGoal?: number
  minimumContribution?: number
  matchingBonusEnabled?: boolean
  matchingBonusPercentage?: number
  description?: string
  participantTarget?: number
  status?: SavingsProgramStatus
}
