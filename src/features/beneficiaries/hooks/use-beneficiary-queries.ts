import { keepPreviousData, useQueries, useQuery } from '@tanstack/react-query'
import {
  getBeneficiaries,
  getBeneficiary,
  getBeneficiaryCampaigns,
  getBeneficiaryMetrics,
  getBeneficiarySavings,
  getBeneficiaryTransactions,
  getBeneficiaryWithMetrics,
} from '@/features/beneficiaries/api/beneficiaries-api'
import type { BeneficiaryListFilters } from '@/features/beneficiaries/types/beneficiary'
import { QUERY_STALE_TIME } from '@/lib/constants/query'

export function useBeneficiariesQuery(filters: BeneficiaryListFilters) {
  return useQuery({
    queryKey: ['beneficiaries', filters],
    queryFn: () => getBeneficiaries(filters),
    placeholderData: keepPreviousData,
    staleTime: QUERY_STALE_TIME.list,
  })
}

export function useBeneficiaryDetailQueries(beneficiaryId: number) {
  const enabled = Number.isFinite(beneficiaryId)

  return {
    profile: useQuery({
      queryKey: ['beneficiary', beneficiaryId],
      queryFn: () => getBeneficiary(beneficiaryId),
      enabled,
      staleTime: QUERY_STALE_TIME.detail,
    }),
    withMetrics: useQuery({
      queryKey: ['beneficiary', beneficiaryId, 'with-metrics'],
      queryFn: () => getBeneficiaryWithMetrics(beneficiaryId),
      enabled,
      staleTime: QUERY_STALE_TIME.detail,
    }),
    metrics: useQuery({
      queryKey: ['beneficiary', beneficiaryId, 'metrics'],
      queryFn: () => getBeneficiaryMetrics(beneficiaryId),
      enabled,
      staleTime: QUERY_STALE_TIME.dashboard,
    }),
    transactions: useQuery({
      queryKey: ['beneficiary', beneficiaryId, 'transactions'],
      queryFn: () => getBeneficiaryTransactions(beneficiaryId),
      enabled,
      staleTime: QUERY_STALE_TIME.list,
    }),
    savings: useQuery({
      queryKey: ['beneficiary', beneficiaryId, 'savings'],
      queryFn: () => getBeneficiarySavings(beneficiaryId),
      enabled,
      staleTime: QUERY_STALE_TIME.list,
    }),
    campaigns: useQuery({
      queryKey: ['beneficiary', beneficiaryId, 'campaigns'],
      queryFn: () => getBeneficiaryCampaigns(beneficiaryId),
      enabled,
      staleTime: QUERY_STALE_TIME.list,
    }),
  }
}

export function useBeneficiaryRowQueries(beneficiaryIds: number[]) {
  return useQueries({
    queries: beneficiaryIds.flatMap((beneficiaryId) => [
      {
        queryKey: ['beneficiary', beneficiaryId, 'with-metrics'],
        queryFn: () => getBeneficiaryWithMetrics(beneficiaryId),
        enabled: Number.isFinite(beneficiaryId),
        staleTime: QUERY_STALE_TIME.detail,
      },
      {
        queryKey: ['beneficiary', beneficiaryId, 'campaigns', 'row'],
        queryFn: () => getBeneficiaryCampaigns(beneficiaryId, 1, 1),
        enabled: Number.isFinite(beneficiaryId),
        staleTime: QUERY_STALE_TIME.list,
      },
    ]),
  })
}
