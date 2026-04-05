import {
  Bar,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Progress } from '@/app/components/ui/progress'
import { useTranslation } from 'react-i18next'

type Props = {
  totalBeneficiaries: number
  amountDisbursed: number
  successRate: number
  pendingPayments: number
  failedPayments: number
  effectiveTotalBudget: number
  completionPercentage: number
  disbursementProgress: Array<{ month: string; amount: number }>
  formatCurrency: (amount: number) => string
}

export function CampaignOverviewTab({
  totalBeneficiaries,
  amountDisbursed,
  successRate,
  pendingPayments,
  failedPayments,
  effectiveTotalBudget,
  completionPercentage,
  disbursementProgress,
  formatCurrency,
}: Props) {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
        <MetricCard label={t('campaignDetailPage.totalBeneficiaries')} value={totalBeneficiaries.toLocaleString()} />
        <MetricCard label={t('campaignDetailPage.amountDisbursed')} value={formatCurrency(amountDisbursed)} />
        <MetricCard label={t('campaignDetailPage.successRate')} value={`${successRate}%`} color="var(--success)" />
        <MetricCard label={t('campaignDetailPage.pendingPayments')} value={String(pendingPayments)} color="var(--warning)" />
        <MetricCard label={t('campaignDetailPage.failedPayments')} value={String(failedPayments)} color="var(--error)" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle style={{ fontSize: 'var(--text-16)' }}>
            {t('campaignDetailPage.campaignCompletion')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)' }}>
                {formatCurrency(amountDisbursed)} of {formatCurrency(effectiveTotalBudget)}
              </span>
              <span style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-medium)' }}>
                {completionPercentage.toFixed(1)}%
              </span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle style={{ fontSize: 'var(--text-16)' }}>
            {t('campaignDetailPage.disbursementProgress')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={disbursementProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" style={{ fontSize: 'var(--text-12)' }} />
              <YAxis style={{ fontSize: 'var(--text-12)' }} />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="var(--primary)" strokeWidth={2} name="Disbursed (MZN)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

function MetricCard({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)', marginBottom: '8px' }}>{label}</p>
        <p style={{ fontSize: 'var(--text-24)', fontWeight: 'var(--font-weight-semi-bold)', ...(color ? { color } : {}) }}>{value}</p>
      </CardContent>
    </Card>
  )
}
