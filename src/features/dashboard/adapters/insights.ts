import type { InsightsBeneficiaries, InsightsFinancial, InsightsSummary } from '@/features/dashboard/types/insights'

export function adaptOverview(summary?: InsightsSummary) {
  return {
    totalPaid: summary?.cards.totalPaid ?? 0,
    totalBeneficiaries: summary?.cards.totalBeneficiaries ?? 0,
    activePrograms: summary?.cards.activePrograms ?? 0,
    totalTransactions: summary?.cards.totalTransactions ?? 0,
    totalSaved: summary?.cards.totalSaved ?? 0,
    paymentsOverTime: (summary?.paymentsOverTime ?? []).map((item) => ({ month: item.period, amount: item.amount })),
    transactionSuccessRate: (summary?.transactionsStatusOverTime ?? []).map((item) => ({ month: item.period, successful: item.successful, failed: item.failed })),
  }
}

export function adaptFinancial(financial?: InsightsFinancial) {
  return {
    disbursementsByCampaign: (financial?.paymentsByProgram ?? []).map((item) => ({ campaign: item.programName, amount: item.amount, beneficiaries: 0 })),
    disbursementsByProvince: (financial?.paymentsByProvince ?? []).map((item, index) => ({ province: item.province, amount: item.amount, color: `var(--chart-${(index % 5) + 1})` })),
    transactionsByProvider: (financial?.transactionsByOperator ?? []).map((item, index) => ({ provider: item.operator, count: item.count, amount: item.amount, color: `var(--chart-${(index % 5) + 1})` })),
    topCampaignsByDisbursement: (financial?.topPrograms ?? []).map((item, index) => ({ rank: index + 1, campaign: item.programName, campaignId: item.programId ? `PRG-${item.programId}` : '—', totalDisbursed: item.totalPaid, beneficiaries: item.beneficiaries, avgPayment: item.averagePayment })),
  }
}

export function adaptBeneficiaries(beneficiaries?: InsightsBeneficiaries) {
  const byProvince = beneficiaries?.beneficiariesByProvince ?? []
  const total = byProvince.reduce((sum, item) => sum + item.beneficiaries, 0) || 1

  return {
    averagePaymentPerBeneficiary: beneficiaries?.averagePaymentPerBeneficiary ?? 0,
    participationRate: beneficiaries?.participationRate ?? 0,
    beneficiariesByProvince: byProvince.map((item) => ({ province: item.province, count: item.beneficiaries, percentage: Number(((item.beneficiaries / total) * 100).toFixed(1)) })),
    beneficiariesByCampaign: (beneficiaries?.beneficiariesByProgram ?? []).map((item, index) => ({ campaign: item.programName, count: item.beneficiaries, color: `var(--chart-${(index % 5) + 1})` })),
  }
}
