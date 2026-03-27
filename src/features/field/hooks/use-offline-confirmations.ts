import { useEffect, useState } from 'react'
import { readOfflineConfirmations } from '@/features/field/lib/offline-queue'

export function useOfflineConfirmations() {
  const [items, setItems] = useState(() => readOfflineConfirmations())

  useEffect(() => {
    const update = () => setItems(readOfflineConfirmations())
    window.addEventListener('storage', update)
    window.addEventListener('somas-field-queue-updated', update)
    return () => {
      window.removeEventListener('storage', update)
      window.removeEventListener('somas-field-queue-updated', update)
    }
  }, [])

  return items
}
