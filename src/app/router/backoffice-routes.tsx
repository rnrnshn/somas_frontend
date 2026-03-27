import { createRoute, redirect, type AnyRoute } from '@tanstack/react-router'
import { backofficeLayoutComponent, backofficeRouteDefinitions } from '@/app/router/backoffice-route-definitions'

export function buildBackofficeRoutes(rootRoute: AnyRoute) {
  const backofficeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/backoffice',
    component: backofficeLayoutComponent,
  })

  const backofficeIndexRoute = createRoute({
    getParentRoute: () => backofficeRoute,
    path: '/',
    beforeLoad: () => {
      throw redirect({ to: '/backoffice/dashboard' })
    },
  })

  return backofficeRoute.addChildren([
    backofficeIndexRoute,
    ...backofficeRouteDefinitions.map(({ path, component }) =>
      createRoute({
        getParentRoute: () => backofficeRoute,
        path,
        component,
      })
    ),
  ])
}
