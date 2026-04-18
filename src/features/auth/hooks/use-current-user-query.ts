import { useQuery } from '@tanstack/react-query'
import { getCurrentUser } from '@/features/auth/api/auth-api'
import { normalizeAuthUser } from '@/lib/auth/roles'

export const AUTH_ME_QUERY_KEY = ['auth', 'me'] as const

export function useCurrentUserQuery(token: string | null) {
  return useQuery({
    queryKey: AUTH_ME_QUERY_KEY,
    queryFn: async () => normalizeAuthUser(await getCurrentUser()),
    enabled: Boolean(token),
    staleTime: 5 * 60 * 1000,
  })
}
