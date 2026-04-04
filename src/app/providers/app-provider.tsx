import { type ReactNode, useEffect, useState } from 'react'
import { RouterProvider } from '@tanstack/react-router'
import { router } from '@/app/router'
import { Toaster } from '@/app/components/ui/sonner'
import { AppQueryProvider } from '@/app/providers/query-provider'
import { AuthProvider } from '@/lib/auth/auth-context'
import { i18n } from '@/lib/i18n'

function LanguageTransitionShell({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    let timeoutId: number | undefined

    const handleLanguageChanged = () => {
      setIsTransitioning(true)
      window.clearTimeout(timeoutId)
      timeoutId = window.setTimeout(() => {
        setIsTransitioning(false)
      }, 180)
    }

    i18n.on('languageChanged', handleLanguageChanged)

    return () => {
      i18n.off('languageChanged', handleLanguageChanged)
      window.clearTimeout(timeoutId)
    }
  }, [])

  return (
    <div className={isTransitioning ? 'app-language-shell app-language-shell--transitioning' : 'app-language-shell'}>
      <div className="app-language-shell__content">{children}</div>
    </div>
  )
}

export function AppProvider({ children }: { children?: ReactNode }) {
  return (
    <AuthProvider>
      <AppQueryProvider>
        <LanguageTransitionShell>
          {children}
          <RouterProvider router={router} />
          <Toaster />
        </LanguageTransitionShell>
      </AppQueryProvider>
    </AuthProvider>
  )
}
