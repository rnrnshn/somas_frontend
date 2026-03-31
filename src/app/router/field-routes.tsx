import { createRoute, redirect, type AnyRoute } from '@tanstack/react-router'
import { fieldLayoutComponent, fieldRouteDefinitions } from '@/app/router/field-route-definitions'
import { lazyPage } from '@/app/router/lazy-page'

export function buildFieldRoutes(rootRoute: AnyRoute) {
  const fieldRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: 'field',
  })

  const fieldLoginRoute = createRoute({
    getParentRoute: () => fieldRoute,
    path: 'login',
    component: lazyPage(() => import('@/app/components/field/login').then((module) => ({ default: module.FieldLogin }))),
  })

  const fieldProtectedRoute = createRoute({
    getParentRoute: () => fieldRoute,
    id: 'field-protected',
    component: fieldLayoutComponent,
  })

  const fieldIndexRoute = createRoute({
    getParentRoute: () => fieldProtectedRoute,
    path: '/',
    beforeLoad: () => {
      throw redirect({ to: '/field/dashboard' })
    },
  })

  return fieldRoute.addChildren([
    fieldLoginRoute,
    fieldProtectedRoute.addChildren([
      fieldIndexRoute,
      ...fieldRouteDefinitions.map(({ path, component }) =>
        createRoute({
          getParentRoute: () => fieldProtectedRoute,
          path,
          component,
        })
      ),
    ]),
  ])
}
