import { lazyPage } from '@/app/router/lazy-page'

export const fieldLayoutComponent = lazyPage(() =>
  import('@/app/components/field/layout').then((module) => ({ default: module.FieldLayout }))
)

export const fieldRouteDefinitions = [
  { path: 'dashboard', component: lazyPage(() => import('@/app/components/field/dashboard').then((module) => ({ default: module.FieldDashboard }))) },
  { path: 'search', component: lazyPage(() => import('@/app/components/field/search').then((module) => ({ default: module.FieldSearch }))) },
  { path: 'status', component: lazyPage(() => import('@/app/components/field/status').then((module) => ({ default: module.FieldStatus }))) },
  { path: 'beneficiary/$campaignId/$campaignBeneficiaryId', component: lazyPage(() => import('@/app/components/field/beneficiary-profile').then((module) => ({ default: module.BeneficiaryProfile }))) },
  { path: 'beneficiary/$campaignId/$campaignBeneficiaryId/verify', component: lazyPage(() => import('@/app/components/field/beneficiary-verification').then((module) => ({ default: module.FieldBeneficiaryVerification }))) },
] as const
