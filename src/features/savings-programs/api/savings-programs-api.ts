import { apiRequest } from '@/lib/api/client'
import type {
  SavingsProgram,
  SavingsProgramListFilters,
  SavingsProgramMutationPayload,
} from '@/features/savings-programs/types/savings-program'

function buildSavingsProgramsQuery(filters: SavingsProgramListFilters) {
  const params = new URLSearchParams()

  if (filters.status) params.set('status', filters.status)
  if (typeof filters.campaignId === 'number' && Number.isFinite(filters.campaignId)) {
    params.set('campaignId', String(filters.campaignId))
  }
  if (filters.search?.trim()) params.set('search', filters.search.trim())

  const query = params.toString()
  return query ? `?${query}` : ''
}

export function getSavingsPrograms(filters: SavingsProgramListFilters) {
  return apiRequest<SavingsProgram[]>(`/savings-programs${buildSavingsProgramsQuery(filters)}`, {
    method: 'GET',
    auth: true,
  })
}

export function getSavingsProgram(savingsProgramId: number) {
  return apiRequest<SavingsProgram>(`/savings-programs/${savingsProgramId}`, {
    method: 'GET',
    auth: true,
  })
}

export function createSavingsProgram(payload: SavingsProgramMutationPayload) {
  return apiRequest<SavingsProgram>('/savings-programs', {
    method: 'POST',
    auth: true,
    body: payload,
  })
}

export function updateSavingsProgram(savingsProgramId: number, payload: SavingsProgramMutationPayload) {
  return apiRequest<SavingsProgram>(`/savings-programs/${savingsProgramId}`, {
    method: 'PATCH',
    auth: true,
    body: payload,
  })
}

export function deleteSavingsProgram(savingsProgramId: number) {
  return apiRequest<void>(`/savings-programs/${savingsProgramId}`, {
    method: 'DELETE',
    auth: true,
  })
}
