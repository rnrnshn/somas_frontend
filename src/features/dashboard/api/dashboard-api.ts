import { apiRequest } from '@/lib/api/client'
import type {
  DashboardBeneficiaries,
  DashboardFilters,
  DashboardOperationalHealth,
  DashboardOverview,
  DashboardTransactions,
} from '@/features/dashboard/types/dashboard'

function buildDashboardQuery(filters: DashboardFilters) {
  const params = new URLSearchParams()

  if (filters.period) params.set('period', filters.period)
  if (filters.province?.trim()) params.set('province', filters.province.trim())
  if (typeof filters.campaignId === 'number' && Number.isFinite(filters.campaignId)) {
    params.set('campaignId', String(filters.campaignId))
  }

  const query = params.toString()
  return query ? `?${query}` : ''
}

export function getDashboardOverview(filters: DashboardFilters) {
  return apiRequest<DashboardOverview>(`/dashboard/overview${buildDashboardQuery(filters)}`, {
    method: 'GET',
    auth: true,
  })
}

export function getDashboardTransactions(filters: DashboardFilters) {
  return apiRequest<DashboardTransactions>(`/dashboard/transactions${buildDashboardQuery(filters)}`, {
    method: 'GET',
    auth: true,
  })
}

export function getDashboardBeneficiaries(filters: DashboardFilters) {
  return apiRequest<DashboardBeneficiaries>(`/dashboard/beneficiaries${buildDashboardQuery(filters)}`, {
    method: 'GET',
    auth: true,
  })
}

export function getDashboardOperationalHealth(filters: DashboardFilters) {
  return apiRequest<DashboardOperationalHealth>(`/dashboard/operational-health${buildDashboardQuery(filters)}`, {
    method: 'GET',
    auth: true,
  })
}
