import { useQuery } from '@tanstack/react-query'
import { getInsightsBeneficiaries, getInsightsFinancial, getInsightsSummary } from '@/features/dashboard/api/insights-api'
import type { DashboardFilters } from '@/features/dashboard/types/dashboard'
import { QUERY_STALE_TIME } from '@/lib/constants/query'

export function useInsightsSummaryQuery(filters: DashboardFilters) {
  return useQuery({ queryKey: ['insights', 'summary', filters], queryFn: () => getInsightsSummary(filters), staleTime: QUERY_STALE_TIME.dashboard })
}

export function useInsightsFinancialQuery(filters: DashboardFilters) {
  return useQuery({ queryKey: ['insights', 'financial', filters], queryFn: () => getInsightsFinancial(filters), staleTime: QUERY_STALE_TIME.dashboard })
}

export function useInsightsBeneficiariesQuery(filters: DashboardFilters) {
  return useQuery({ queryKey: ['insights', 'beneficiaries', filters], queryFn: () => getInsightsBeneficiaries(filters), staleTime: QUERY_STALE_TIME.dashboard })
}
