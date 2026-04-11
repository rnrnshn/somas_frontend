import { apiRequest } from '@/lib/api/client'
import type { DashboardFilters } from '@/features/dashboard/types/dashboard'
import type { InsightsBeneficiaries, InsightsFinancial, InsightsSummary } from '@/features/dashboard/types/insights'

function buildQuery(filters: DashboardFilters) {
  const params = new URLSearchParams()
  if (filters.period) params.set('period', filters.period)
  if (typeof filters.provinceId === 'number' && Number.isFinite(filters.provinceId)) {
    params.set('provinceId', String(filters.provinceId))
  }
  if (typeof filters.campaignId === 'number' && Number.isFinite(filters.campaignId)) {
    params.set('campaignId', String(filters.campaignId))
  }
  const query = params.toString()
  return query ? `?${query}` : ''
}

export const getInsightsSummary = (filters: DashboardFilters) =>
  apiRequest<InsightsSummary>(`/insights/summary${buildQuery(filters)}`, { method: 'GET', auth: true })

export const getInsightsFinancial = (filters: DashboardFilters) =>
  apiRequest<InsightsFinancial>(`/insights/financial${buildQuery(filters)}`, { method: 'GET', auth: true })

export const getInsightsBeneficiaries = (filters: DashboardFilters) =>
  apiRequest<InsightsBeneficiaries>(`/insights/beneficiaries${buildQuery(filters)}`, { method: 'GET', auth: true })
