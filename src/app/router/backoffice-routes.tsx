import { createRoute, redirect, type AnyRoute } from '@tanstack/react-router'
import { backofficeLayoutComponent, backofficeRouteDefinitions } from '@/app/router/backoffice-route-definitions'
import { lazyPage } from '@/app/router/lazy-page'

export function buildBackofficeRoutes(rootRoute: AnyRoute) {
  const backofficeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: 'backoffice',
  })

  const backofficeLoginRoute = createRoute({
    getParentRoute: () => backofficeRoute,
    path: 'login',
    component: lazyPage(() =>
      import('@/app/components/backoffice/login').then((module) => ({ default: module.BackofficeLogin }))
    ),
  })

  const backofficeForgotPasswordRoute = createRoute({
    getParentRoute: () => backofficeRoute,
    path: 'forgot-password',
    component: lazyPage(() =>
      import('@/app/components/backoffice/forgot-password').then((module) => ({ default: module.ForgotPassword }))
    ),
  })

  const backofficeResetPasswordRoute = createRoute({
    getParentRoute: () => backofficeRoute,
    path: 'reset-password',
    component: lazyPage(() =>
      import('@/app/components/backoffice/reset-password').then((module) => ({ default: module.ResetPassword }))
    ),
  })

  const backofficeProtectedRoute = createRoute({
    getParentRoute: () => backofficeRoute,
    id: 'backoffice-protected',
    component: backofficeLayoutComponent,
  })

  const backofficeIndexRoute = createRoute({
    getParentRoute: () => backofficeProtectedRoute,
    path: '/',
    beforeLoad: () => {
      throw redirect({ to: '/backoffice/dashboard' })
    },
  })

  return backofficeRoute.addChildren([
    backofficeLoginRoute,
    backofficeForgotPasswordRoute,
    backofficeResetPasswordRoute,
    backofficeProtectedRoute.addChildren([
      backofficeIndexRoute,
      ...backofficeRouteDefinitions.map(({ path, component }) =>
        createRoute({
          getParentRoute: () => backofficeProtectedRoute,
          path,
          component,
        })
      ),
    ]),
  ])
}
