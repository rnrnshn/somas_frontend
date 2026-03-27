import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createDisbursementType,
  createPaymentChannel,
  createProgram,
  createRegion,
  deleteDisbursementType,
  deletePaymentChannel,
  deleteProgram,
  deleteRegion,
  updateDisbursementType,
  updatePaymentChannel,
  updateProgram,
  updateRegion,
} from '@/features/catalogs/api/catalogs-api'

function invalidate(queryClient: ReturnType<typeof useQueryClient>, key: string) {
  void queryClient.invalidateQueries({ queryKey: ['catalogs', key] })
}

export function useCatalogAdminMutations() {
  const queryClient = useQueryClient()

  return {
    createProgram: useMutation({ mutationFn: createProgram, onSuccess: () => invalidate(queryClient, 'programs') }),
    updateProgram: useMutation({ mutationFn: ({ id, payload }: { id: number; payload: { name?: string; description?: string } }) => updateProgram(id, payload), onSuccess: () => invalidate(queryClient, 'programs') }),
    deleteProgram: useMutation({ mutationFn: deleteProgram, onSuccess: () => invalidate(queryClient, 'programs') }),
    createRegion: useMutation({ mutationFn: createRegion, onSuccess: () => invalidate(queryClient, 'regions') }),
    updateRegion: useMutation({ mutationFn: ({ id, payload }: { id: number; payload: { name?: string } }) => updateRegion(id, payload), onSuccess: () => invalidate(queryClient, 'regions') }),
    deleteRegion: useMutation({ mutationFn: deleteRegion, onSuccess: () => invalidate(queryClient, 'regions') }),
    createPaymentChannel: useMutation({ mutationFn: createPaymentChannel, onSuccess: () => invalidate(queryClient, 'payment-channels') }),
    updatePaymentChannel: useMutation({ mutationFn: ({ id, payload }: { id: number; payload: { name?: string; description?: string } }) => updatePaymentChannel(id, payload), onSuccess: () => invalidate(queryClient, 'payment-channels') }),
    deletePaymentChannel: useMutation({ mutationFn: deletePaymentChannel, onSuccess: () => invalidate(queryClient, 'payment-channels') }),
    createDisbursementType: useMutation({ mutationFn: createDisbursementType, onSuccess: () => invalidate(queryClient, 'disbursement-types') }),
    updateDisbursementType: useMutation({ mutationFn: ({ id, payload }: { id: number; payload: { name?: string; description?: string } }) => updateDisbursementType(id, payload), onSuccess: () => invalidate(queryClient, 'disbursement-types') }),
    deleteDisbursementType: useMutation({ mutationFn: deleteDisbursementType, onSuccess: () => invalidate(queryClient, 'disbursement-types') }),
  }
}
