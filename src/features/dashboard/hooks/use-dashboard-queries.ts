import { useQuery } from '@tanstack/react-query'
import {
  getDashboardBeneficiaries,
  getDashboardOperationalHealth,
  getDashboardOverview,
  getDashboardTransactions,
} from '@/features/dashboard/api/dashboard-api'
import type { DashboardFilters } from '@/features/dashboard/types/dashboard'
import { QUERY_STALE_TIME } from '@/lib/constants/query'

export function useDashboardOverviewQuery(filters: DashboardFilters) {
  return useQuery({
    queryKey: ['dashboard', 'overview', filters],
    queryFn: () => getDashboardOverview(filters),
    staleTime: QUERY_STALE_TIME.dashboard,
  })
}

export function useDashboardTransactionsQuery(filters: DashboardFilters) {
  return useQuery({
    queryKey: ['dashboard', 'transactions', filters],
    queryFn: () => getDashboardTransactions(filters),
    staleTime: QUERY_STALE_TIME.dashboard,
  })
}

export function useDashboardBeneficiariesQuery(filters: DashboardFilters) {
  return useQuery({
    queryKey: ['dashboard', 'beneficiaries', filters],
    queryFn: () => getDashboardBeneficiaries(filters),
    staleTime: QUERY_STALE_TIME.dashboard,
  })
}

export function useDashboardOperationalHealthQuery(filters: DashboardFilters) {
  return useQuery({
    queryKey: ['dashboard', 'operational-health', filters],
    queryFn: () => getDashboardOperationalHealth(filters),
    staleTime: QUERY_STALE_TIME.dashboard,
  })
}

export function useBackofficeDashboardQueries(filters: DashboardFilters) {
  const overview = useDashboardOverviewQuery(filters)
  const transactions = useDashboardTransactionsQuery(filters)
  const beneficiaries = useDashboardBeneficiariesQuery(filters)
  const health = useDashboardOperationalHealthQuery(filters)

  const error = overview.error ?? transactions.error ?? beneficiaries.error ?? health.error ?? null

  return {
    overview,
    transactions,
    beneficiaries,
    health,
    error,
    isPending: overview.isPending || transactions.isPending || beneficiaries.isPending || health.isPending,
    refetchAll: () => {
      void Promise.all([overview.refetch(), transactions.refetch(), beneficiaries.refetch(), health.refetch()])
    },
  }
}
