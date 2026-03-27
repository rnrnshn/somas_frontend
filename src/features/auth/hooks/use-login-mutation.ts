import { useMutation } from '@tanstack/react-query'
import { loginBackoffice, loginField } from '@/features/auth/api/auth-api'
import type { LoginPayload } from '@/features/auth/types/auth'

export function useBackofficeLoginMutation() {
  return useMutation({
    mutationFn: (payload: LoginPayload) => loginBackoffice(payload),
  })
}

export function useFieldLoginMutation() {
  return useMutation({
    mutationFn: (payload: LoginPayload) => loginField(payload),
  })
}
