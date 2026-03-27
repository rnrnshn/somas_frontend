import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateBeneficiary } from '@/features/beneficiaries/api/beneficiaries-api'

export function useUpdateBeneficiaryMutation(beneficiaryId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: Parameters<typeof updateBeneficiary>[1]) => updateBeneficiary(beneficiaryId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['beneficiaries'] })
      void queryClient.invalidateQueries({ queryKey: ['beneficiary', beneficiaryId] })
    },
  })
}
