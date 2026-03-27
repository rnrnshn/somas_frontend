import { Suspense } from 'react'
import { Outlet, createRootRoute, createRouter } from '@tanstack/react-router'
import { buildBackofficeRoutes } from '@/app/router/backoffice-routes'
import { buildFieldRoutes } from '@/app/router/field-routes'
import { buildPublicRoutes } from '@/app/router/public-routes'

function RootComponent() {
  return (
    <Suspense fallback={null}>
      <Outlet />
    </Suspense>
  )
}

const rootRoute = createRootRoute({
  component: RootComponent,
})

const routeTree = rootRoute.addChildren([
  ...buildPublicRoutes(rootRoute),
  buildBackofficeRoutes(rootRoute),
  buildFieldRoutes(rootRoute),
])

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
