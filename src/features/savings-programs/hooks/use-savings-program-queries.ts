import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createSavingsProgram,
  deleteSavingsProgram,
  getSavingsProgram,
  getSavingsPrograms,
  updateSavingsProgram,
} from '@/features/savings-programs/api/savings-programs-api'
import type {
  SavingsProgramListFilters,
  SavingsProgramMutationPayload,
} from '@/features/savings-programs/types/savings-program'
import { QUERY_STALE_TIME } from '@/lib/constants/query'

export function useSavingsProgramsQuery(filters: SavingsProgramListFilters) {
  return useQuery({
    queryKey: ['savings-programs', filters],
    queryFn: () => getSavingsPrograms(filters),
    staleTime: QUERY_STALE_TIME.list,
  })
}

export function useSavingsProgramQuery(savingsProgramId: number) {
  return useQuery({
    queryKey: ['savings-program', savingsProgramId],
    queryFn: () => getSavingsProgram(savingsProgramId),
    enabled: Number.isFinite(savingsProgramId),
    staleTime: QUERY_STALE_TIME.detail,
  })
}

export function useCreateSavingsProgramMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SavingsProgramMutationPayload) => createSavingsProgram(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['savings-programs'] })
    },
  })
}

export function useUpdateSavingsProgramMutation(savingsProgramId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SavingsProgramMutationPayload) => updateSavingsProgram(savingsProgramId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['savings-programs'] })
      void queryClient.invalidateQueries({ queryKey: ['savings-program', savingsProgramId] })
    },
  })
}

export function useDeleteSavingsProgramMutation(savingsProgramId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteSavingsProgram(savingsProgramId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['savings-programs'] })
      void queryClient.removeQueries({ queryKey: ['savings-program', savingsProgramId] })
    },
  })
}
