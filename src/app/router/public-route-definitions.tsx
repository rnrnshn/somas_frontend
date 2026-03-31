import { lazyPage } from '@/app/router/lazy-page'

export const publicRouteDefinitions = [
  {
    path: '/',
    component: lazyPage(() => import('@/app/components/gateway').then((module) => ({ default: module.Gateway }))),
  },
  {
    path: 'field-app',
    component: lazyPage(() => import('@/app/components/field/field-app').then((module) => ({ default: module.FieldApp }))),
  },
] as const
