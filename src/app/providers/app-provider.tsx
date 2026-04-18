import { type ReactNode } from 'react'
import { RouterProvider } from '@tanstack/react-router'
import { router } from '@/app/router'
import { Toaster } from '@/app/components/ui/sonner'
import { AppQueryProvider } from '@/app/providers/query-provider'
import { AuthProvider } from '@/lib/auth/auth-context'

function LanguageTransitionShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-language-shell">
      <div className="app-language-shell__content">{children}</div>
    </div>
  )
}

export function AppProvider({ children }: { children?: ReactNode }) {
  return (
    <AppQueryProvider>
      <AuthProvider>
        <LanguageTransitionShell>
          {children}
          <RouterProvider router={router} />
          <Toaster />
        </LanguageTransitionShell>
      </AuthProvider>
    </AppQueryProvider>
  )
}
