import { useSyncExternalStore } from 'react'
import { readOfflineConfirmations } from '@/features/field/lib/offline-queue'

export function useOfflineConfirmations() {
  return useSyncExternalStore(subscribeToOfflineConfirmations, readOfflineConfirmations, () => [])
}

function subscribeToOfflineConfirmations(onStoreChange: () => void) {
  window.addEventListener('storage', onStoreChange)
  window.addEventListener('somas-field-queue-updated', onStoreChange)

  return () => {
    window.removeEventListener('storage', onStoreChange)
    window.removeEventListener('somas-field-queue-updated', onStoreChange)
  }
}
