import { lazyPage } from '@/app/router/lazy-page'

export const backofficeLayoutComponent = lazyPage(() =>
  import('@/app/components/backoffice/layout').then((module) => ({ default: module.BackofficeLayout }))
)

export const backofficeRouteDefinitions = [
  { path: '/dashboard', component: lazyPage(() => import('@/app/components/backoffice/dashboard').then((module) => ({ default: module.BackofficeDashboard }))) },
  { path: '/campaigns', component: lazyPage(() => import('@/app/components/backoffice/campaigns').then((module) => ({ default: module.BackofficeCampaigns }))) },
  { path: '/campaigns/create', component: lazyPage(() => import('@/app/components/backoffice/create-campaign').then((module) => ({ default: module.CreateCampaign }))) },
  { path: '/campaigns/$id/edit', component: lazyPage(() => import('@/app/components/backoffice/create-campaign').then((module) => ({ default: module.CreateCampaign }))) },
  { path: '/campaigns/$id', component: lazyPage(() => import('@/app/components/backoffice/campaign-detail').then((module) => ({ default: module.CampaignDetail }))) },
  { path: '/savings', component: lazyPage(() => import('@/app/components/backoffice/savings').then((module) => ({ default: module.BackofficeSavings }))) },
  { path: '/savings/create', component: lazyPage(() => import('@/app/components/backoffice/create-savings-campaign').then((module) => ({ default: module.CreateSavingsCampaign }))) },
  { path: '/savings/$id/edit', component: lazyPage(() => import('@/app/components/backoffice/create-savings-campaign').then((module) => ({ default: module.CreateSavingsCampaign }))) },
  { path: '/savings/$id', component: lazyPage(() => import('@/app/components/backoffice/savings-campaign-detail').then((module) => ({ default: module.SavingsCampaignDetail }))) },
  { path: '/beneficiaries', component: lazyPage(() => import('@/app/components/backoffice/beneficiaries').then((module) => ({ default: module.BackofficeBeneficiaries }))) },
  { path: '/beneficiaries/profile/$id', component: lazyPage(() => import('@/app/components/backoffice/beneficiary-profile').then((module) => ({ default: module.BeneficiaryProfile }))) },
  { path: '/beneficiaries/form/$id', component: lazyPage(() => import('@/app/components/backoffice/beneficiary-form').then((module) => ({ default: module.BeneficiaryForm }))) },
  { path: '/field-verification', component: lazyPage(() => import('@/app/components/backoffice/field-verification').then((module) => ({ default: module.FieldVerification }))) },
  { path: '/transactions', component: lazyPage(() => import('@/app/components/backoffice/transactions').then((module) => ({ default: module.BackofficeTransactions }))) },
  { path: '/disbursements', component: lazyPage(() => import('@/app/components/backoffice/disbursements').then((module) => ({ default: module.Disbursements }))) },
  { path: '/metrics', component: lazyPage(() => import('@/app/components/backoffice/insights').then((module) => ({ default: module.Insights }))) },
  { path: '/insights', component: lazyPage(() => import('@/app/components/backoffice/insights').then((module) => ({ default: module.Insights }))) },
  { path: '/reports', component: lazyPage(() => import('@/app/components/backoffice/reports').then((module) => ({ default: module.Reports }))) },
  { path: '/sms-templates', component: lazyPage(() => import('@/app/components/backoffice/sms-templates').then((module) => ({ default: module.BackofficeSMSTemplates }))) },
  { path: '/users', component: lazyPage(() => import('@/app/components/backoffice/users').then((module) => ({ default: module.BackofficeUsers }))) },
  { path: '/roles', component: lazyPage(() => import('@/app/components/backoffice/roles').then((module) => ({ default: module.Roles }))) },
  { path: '/permissions', component: lazyPage(() => import('@/app/components/backoffice/permissions').then((module) => ({ default: module.Permissions }))) },
  { path: '/audit', component: lazyPage(() => import('@/app/components/backoffice/audit').then((module) => ({ default: module.BackofficeAudit }))) },
  { path: '/system-events', component: lazyPage(() => import('@/app/components/backoffice/system-events').then((module) => ({ default: module.BackofficeSystemEvents }))) },
  { path: '/activity', component: lazyPage(() => import('@/app/components/backoffice/activity').then((module) => ({ default: module.BackofficeActivity }))) },
  { path: '/settings', component: lazyPage(() => import('@/app/components/backoffice/settings').then((module) => ({ default: module.Settings }))) },
  { path: '/tenant-settings', component: lazyPage(() => import('@/app/components/backoffice/tenant-settings').then((module) => ({ default: module.TenantSettings }))) },
  { path: '/sessions', component: lazyPage(() => import('@/app/components/backoffice/session-management').then((module) => ({ default: module.SessionManagement }))) },
  { path: '/security-overview', component: lazyPage(() => import('@/app/components/backoffice/user-security-overview').then((module) => ({ default: module.UserSecurityOverview }))) },
  { path: '/auth-activity', component: lazyPage(() => import('@/app/components/backoffice/token-activity-panel').then((module) => ({ default: module.TokenActivityPanel }))) },
  { path: '/account-status-demo', component: lazyPage(() => import('@/app/components/backoffice/account-status-demo').then((module) => ({ default: module.AccountStatusDemo }))) },
] as const
