import { Suspense, type ComponentType } from 'react'
import { createRoute, type AnyRoute } from '@tanstack/react-router'
import { publicRouteDefinitions } from '@/app/router/public-route-definitions'
import { Skeleton } from '@/app/components/ui/skeleton'

function PublicRouteBoundary({ component: Component }: { component: ComponentType }) {
  return (
    <Suspense fallback={<PublicRouteSkeleton />}>
      <Component />
    </Suspense>
  )
}

function PublicRouteSkeleton() {
  return (
    <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center p-8">
      <div className="w-full max-w-md space-y-4">
        <Skeleton className="mx-auto h-10 w-40" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  )
}

export function buildPublicRoutes(rootRoute: AnyRoute) {
  return publicRouteDefinitions.map(({ path, component }) =>
    createRoute({
      getParentRoute: () => rootRoute,
      path,
      component: () => <PublicRouteBoundary component={component} />,
    })
  )
}
