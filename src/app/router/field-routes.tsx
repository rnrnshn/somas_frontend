import { createRoute, redirect, type AnyRoute } from '@tanstack/react-router'
import { fieldLayoutComponent, fieldRouteDefinitions } from '@/app/router/field-route-definitions'

export function buildFieldRoutes(rootRoute: AnyRoute) {
  const fieldRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/field',
    component: fieldLayoutComponent,
  })

  const fieldIndexRoute = createRoute({
    getParentRoute: () => fieldRoute,
    path: '/',
    beforeLoad: () => {
      throw redirect({ to: '/field/dashboard' })
    },
  })

  return fieldRoute.addChildren([
    fieldIndexRoute,
    ...fieldRouteDefinitions.map(({ path, component }) =>
      createRoute({
        getParentRoute: () => fieldRoute,
        path,
        component,
      })
    ),
  ])
}
