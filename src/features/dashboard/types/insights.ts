import type { DashboardFilters } from '@/features/dashboard/types/dashboard'

export type InsightsFilters = DashboardFilters

export type InsightsSummary = {
  cards: {
    totalPaid: number
    totalBeneficiaries: number
    activePrograms: number
    totalTransactions: number
    totalSaved: number
  }
  paymentsOverTime: Array<{ period: string; amount: number }>
  transactionsStatusOverTime: Array<{ period: string; successful: number; failed: number }>
}

export type InsightsFinancial = {
  paymentsByProgram: Array<{ programId: number | null; programName: string; amount: number }>
  paymentsByProvince: Array<{ province: string; amount: number }>
  transactionsByOperator: Array<{ operator: string; amount: number; count: number }>
  topPrograms: Array<{
    programId: number | null
    programName: string
    totalPaid: number
    beneficiaries: number
    averagePayment: number
  }>
}

export type InsightsBeneficiaries = {
  averagePaymentPerBeneficiary: number
  participationRate: number
  beneficiariesByProvince: Array<{ province: string; beneficiaries: number }>
  beneficiariesByProgram: Array<{ programId: number | null; programName: string; beneficiaries: number }>
}
