import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Progress } from '@/app/components/ui/progress'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

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
  formatCurrency}: Props) {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
        <MetricCard label={t('campaignDetailPage.totalBeneficiaries')} value={totalBeneficiaries.toLocaleString()} />
        <MetricCard label={t('campaignDetailPage.amountDisbursed')} value={formatCurrency(amountDisbursed)} />
        <MetricCard label={t('campaignDetailPage.successRate')} value={`${successRate}%`} accentClass="text-[var(--success)]" />
        <MetricCard label={t('campaignDetailPage.pendingPayments')} value={String(pendingPayments)} accentClass="text-[var(--warning)]" />
        <MetricCard label={t('campaignDetailPage.failedPayments')} value={String(failedPayments)} accentClass="text-[var(--error)]" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {t('campaignDetailPage.campaignCompletion')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span style={{  color: 'var(--muted-foreground)' }}>
                {formatCurrency(amountDisbursed)} of {formatCurrency(effectiveTotalBudget)}
              </span>
              <span style={{  fontWeight: 'var(--font-weight-medium)' }}>
                {completionPercentage.toFixed(1)}%
              </span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="font-semibold">{t('campaignDetailPage.disbursementProgress')}</h3>
        <Card>
          <CardContent className="pt-6">
            <div className="h-[300px] rounded-xl bg-gradient-to-br from-muted/40 via-transparent to-transparent p-3 ring-1 ring-border/40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={disbursementProgress} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.35} vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tickMargin={8} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tickMargin={8} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'var(--border)', strokeDasharray: '4 4' }} />
                  <Line type="monotone" dataKey="amount" stroke="var(--primary)" strokeWidth={2.5} strokeLinecap="round" dot={false} activeDot={{ r: 4 }} name="Disbursed (MZN)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MetricCard({ label, value, accentClass }: { label: string; value: string; accentClass?: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="mb-2 text-muted-foreground">{label}</p>
        <p className={cn('font-semibold', accentClass)}>{value}</p>
      </CardContent>
    </Card>
  )
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name?: string; value?: number }>; label?: string }) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="rounded-lg bg-card px-3 py-2 shadow-[0_6px_18px_rgba(15,23,42,0.12)]">
      {label ? <p className="mb-1 text-xs text-muted-foreground">{label}</p> : null}
      <div className="space-y-1">
        {payload.map((item, index) => (
          <div key={`${item.name ?? 'value'}-${index}`} className="flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">{item.name ?? 'Value'}</span>
            <span className="text-xs font-medium">{(item.value ?? 0).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
