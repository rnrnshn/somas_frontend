import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getCurrentUser, logout } from '@/features/auth/api/auth-api'
import type { AuthUser } from '@/features/auth/types/auth'
import { HttpError } from '@/lib/api/http-error'
import { clearAccessToken, getAccessToken, setAccessToken } from '@/lib/auth/token-storage'

type AuthContextValue = {
  token: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  isBootstrapping: boolean
  signIn: (token: string, user?: AuthUser | null) => void
  signOut: () => Promise<void>
}

const AUTH_USER_KEY = 'somas.auth_user'
const AuthContext = createContext<AuthContextValue | null>(null)

function getStoredUser(): AuthUser | null {
  const raw = window.localStorage.getItem(AUTH_USER_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    window.localStorage.removeItem(AUTH_USER_KEY)
    return null
  }
}

function setStoredUser(user: AuthUser | null) {
  if (!user) {
    window.localStorage.removeItem(AUTH_USER_KEY)
    return
  }

  window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getAccessToken())
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser())
  const [isBootstrapping, setIsBootstrapping] = useState(Boolean(token))

  useEffect(() => {
    if (!token) {
      setUser(null)
      setIsBootstrapping(false)
      return
    }

    let cancelled = false

    setIsBootstrapping(true)

    void getCurrentUser()
      .then((nextUser) => {
        if (cancelled) return
        setUser(nextUser)
        setStoredUser(nextUser)
      })
      .catch((error: unknown) => {
        if (cancelled) return

        if (error instanceof HttpError && (error.status === 401 || error.status === 498)) {
          clearAccessToken()
          setStoredUser(null)
          setToken(null)
          setUser(null)
          return
        }

        setUser(getStoredUser())
      })
      .finally(() => {
        if (!cancelled) {
          setIsBootstrapping(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [token])

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isBootstrapping,
      signIn: (nextToken, nextUser) => {
        setAccessToken(nextToken)
        setStoredUser(nextUser ?? null)
        setToken(nextToken)
        setUser(nextUser ?? null)
        setIsBootstrapping(false)
      },
      signOut: async () => {
        try {
          if (token) {
            await logout()
          }
        } catch {
        } finally {
          clearAccessToken()
          setStoredUser(null)
          setToken(null)
          setUser(null)
          setIsBootstrapping(false)
        }
      },
    }),
    [isBootstrapping, token, user]
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
