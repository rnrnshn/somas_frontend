import { useQueries } from '@tanstack/react-query'
import {
  getDisbursementTypes,
  getPaymentChannels,
  getPrograms,
  getRegions,
} from '@/features/catalogs/api/catalogs-api'
import { QUERY_STALE_TIME } from '@/lib/constants/query'

export function useCampaignCatalogs() {
  const results = useQueries({
    queries: [
      { queryKey: ['catalogs', 'programs'], queryFn: getPrograms, staleTime: QUERY_STALE_TIME.catalogs },
      { queryKey: ['catalogs', 'regions'], queryFn: getRegions, staleTime: QUERY_STALE_TIME.catalogs },
      {
        queryKey: ['catalogs', 'payment-channels'],
        queryFn: getPaymentChannels,
        staleTime: QUERY_STALE_TIME.catalogs,
      },
      {
        queryKey: ['catalogs', 'disbursement-types'],
        queryFn: getDisbursementTypes,
        staleTime: QUERY_STALE_TIME.catalogs,
      },
    ],
  })

  const [programs, regions, paymentChannels, disbursementTypes] = results

  return {
    programs,
    regions,
    paymentChannels,
    disbursementTypes,
    isPending: results.some((result) => result.isPending),
    error: results.find((result) => result.error)?.error ?? null,
  }
}
