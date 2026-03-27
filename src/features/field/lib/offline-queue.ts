import type { FieldConfirmationDraft } from '@/features/field/types/field'

const KEY = 'somas.field.offline-confirmations.v1'

function emitUpdate() {
  window.dispatchEvent(new CustomEvent('somas-field-queue-updated'))
}

export function readOfflineConfirmations(): FieldConfirmationDraft[] {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeOfflineConfirmations(items: FieldConfirmationDraft[]) {
  window.localStorage.setItem(KEY, JSON.stringify(items))
  emitUpdate()
}

export function queueOfflineConfirmation(item: Omit<FieldConfirmationDraft, 'localId' | 'createdAt'>) {
  const next: FieldConfirmationDraft = {
    ...item,
    localId: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  writeOfflineConfirmations([...readOfflineConfirmations(), next])
  return next
}

export function removeOfflineConfirmation(localId: string) {
  writeOfflineConfirmations(readOfflineConfirmations().filter((item) => item.localId !== localId))
}

export function clearOfflineConfirmations() {
  writeOfflineConfirmations([])
}
