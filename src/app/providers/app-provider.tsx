import { type ReactNode } from 'react'
import { RouterProvider } from '@tanstack/react-router'
import { router } from '@/app/router'
import { Toaster } from '@/app/components/ui/sonner'
import { AppQueryProvider } from '@/app/providers/query-provider'
import { AuthProvider } from '@/lib/auth/auth-context'

export function AppProvider({ children }: { children?: ReactNode }) {
  return (
    <AuthProvider>
      <AppQueryProvider>
        {children}
        <RouterProvider router={router} />
        <Toaster />
      </AppQueryProvider>
    </AuthProvider>
  )
}
