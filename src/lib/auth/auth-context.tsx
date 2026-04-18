import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { logout } from '@/features/auth/api/auth-api'
import { AUTH_ME_QUERY_KEY, useCurrentUserQuery } from '@/features/auth/hooks/use-current-user-query'
import type { AuthUser } from '@/features/auth/types/auth'
import { HttpError } from '@/lib/api/http-error'
import { normalizeAuthUser } from '@/lib/auth/roles'
import { clearAccessToken, getAccessToken, setAccessToken } from '@/lib/auth/token-storage'

type AuthContextValue = {
  token: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  isBootstrapping: boolean
  signIn: (token: string, user?: AuthUser | null) => void
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [token, setToken] = useState<string | null>(() => getAccessToken())
  const currentUserQuery = useCurrentUserQuery(token)

  if (
    token
    && currentUserQuery.error instanceof HttpError
    && (currentUserQuery.error.status === 401 || currentUserQuery.error.status === 498)
  ) {
    clearAccessToken()
    setToken(null)
    queryClient.removeQueries({ queryKey: AUTH_ME_QUERY_KEY })
  }

  const user = token ? currentUserQuery.data ?? null : null
  const isBootstrapping = Boolean(token) && currentUserQuery.isPending

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isBootstrapping,
      signIn: (nextToken, nextUser) => {
        const normalizedUser = normalizeAuthUser(nextUser)
        setAccessToken(nextToken)
        setToken(nextToken)
        queryClient.setQueryData(AUTH_ME_QUERY_KEY, normalizedUser ?? null)
        if (!normalizedUser) {
          void queryClient.invalidateQueries({ queryKey: AUTH_ME_QUERY_KEY })
        }
      },
      signOut: async () => {
        try {
          if (token) {
            await logout()
          }
        } catch {
        } finally {
          clearAccessToken()
          queryClient.removeQueries({ queryKey: AUTH_ME_QUERY_KEY })
          setToken(null)
        }
      },
    }),
    [isBootstrapping, queryClient, token, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)

  if (!value) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return value
}
