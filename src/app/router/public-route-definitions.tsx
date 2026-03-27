import { lazyPage } from '@/app/router/lazy-page'

export const publicRouteDefinitions = [
  {
    path: '/',
    component: lazyPage(() => import('@/app/components/gateway').then((module) => ({ default: module.Gateway }))),
  },
  {
    path: '/backoffice/login',
    component: lazyPage(() =>
      import('@/app/components/backoffice/login').then((module) => ({ default: module.BackofficeLogin }))
    ),
  },
  {
    path: '/backoffice/forgot-password',
    component: lazyPage(() =>
      import('@/app/components/backoffice/forgot-password').then((module) => ({ default: module.ForgotPassword }))
    ),
  },
  {
    path: '/backoffice/reset-password',
    component: lazyPage(() =>
      import('@/app/components/backoffice/reset-password').then((module) => ({ default: module.ResetPassword }))
    ),
  },
  {
    path: '/field/login',
    component: lazyPage(() => import('@/app/components/field/login').then((module) => ({ default: module.FieldLogin }))),
  },
  {
    path: '/field-app',
    component: lazyPage(() => import('@/app/components/field/field-app').then((module) => ({ default: module.FieldApp }))),
  },
] as const
