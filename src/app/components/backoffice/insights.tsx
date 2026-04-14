import { useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis} from 'recharts'
import { Activity, DollarSign, FileCog, FileSpreadsheet, FileText, MapPin, Percent, Target, TrendingUp, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Button } from '../ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { useCampaignsQuery } from '@/features/campaigns/hooks/use-campaign-queries'
import { useCampaignCatalogs } from '@/features/catalogs/hooks/use-catalog-queries'
import { adaptBeneficiaries, adaptFinancial, adaptOverview } from '@/features/dashboard/adapters/insights'
import { useInsightsBeneficiariesQuery, useInsightsFinancialQuery, useInsightsSummaryQuery } from '@/features/dashboard/hooks/use-insights-queries'
import type { DashboardFilters } from '@/features/dashboard/types/dashboard'
import { formatCompactMetical, formatMetical } from '@/lib/format/currency'
import { DataTablePagination, useTablePagination } from '../ui/table-pagination'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/lib/auth/auth-context'
import { normalizeRole } from '@/lib/auth/roles'
import { cn } from '@/lib/utils'

export function Insights() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const isAnalyticsOnly = normalizeRole(user?.role) === 'analytics'
  const [activeTab, setActiveTab] = useState('overview')
  const [campaignFilter, setCampaignFilter] = useState('all')
  const [provinceFilter, setProvinceFilter] = useState('all')
  const campaignsQuery = useCampaignsQuery({ page: 1, pageSize: 100 })
  const catalogs = useCampaignCatalogs()
  const filters: DashboardFilters = useMemo(
    () => ({
      campaignId: campaignFilter === 'all' ? undefined : Number(campaignFilter),
      provinceId: provinceFilter === 'all' ? undefined : Number(provinceFilter)}),
    [campaignFilter, provinceFilter]
  )

  const summaryQuery = useInsightsSummaryQuery(filters)
  const financialQuery = useInsightsFinancialQuery(filters)
  const beneficiariesQuery = useInsightsBeneficiariesQuery(filters)
  const overview = adaptOverview(summaryQuery.data)
  const financial = adaptFinancial(financialQuery.data)
  const beneficiaries = adaptBeneficiaries(beneficiariesQuery.data)
  const error = summaryQuery.error ?? financialQuery.error ?? beneficiariesQuery.error
  const totalDisbursed = overview.totalPaid || 1
  const topCampaignsPagination = useTablePagination(financial.topCampaignsByDisbursement, undefined, [activeTab, campaignFilter, provinceFilter])

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="mb-6">
          <h1 className="font-semibold">{t('insightsPage.title')}</h1>
          <p className="mt-2 text-muted-foreground">
            {t('insightsPage.subtitle')}
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={provinceFilter} onValueChange={setProvinceFilter}>
            <SelectTrigger className="w-48"><SelectValue placeholder={t('insightsPage.province')} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('insightsPage.allProvinces')}</SelectItem>
              {(catalogs.provinces.data ?? []).map((item) => <SelectItem key={item.id} value={String(item.id)}>{item.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={campaignFilter} onValueChange={setCampaignFilter}>
            <SelectTrigger className="w-64"><SelectValue placeholder={t('insightsPage.program')} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('insightsPage.allPrograms')}</SelectItem>
              {(campaignsQuery.data?.data ?? []).map((campaign) => <SelectItem key={campaign.id} value={String(campaign.id)}>{campaign.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline"><FileSpreadsheet className="w-4 h-4 mr-2" />{t('insightsPage.exportCsv')}</Button>
          <Button variant="outline"><FileText className="w-4 h-4 mr-2" />{t('insightsPage.exportExcel')}</Button>
          <Button variant="outline"><FileCog className="w-4 h-4 mr-2" />{t('insightsPage.exportPdf')}</Button>
        </div>
      </div>

      {error ? <p className="mb-4 text-destructive">{error instanceof Error ? error.message : t('insightsPage.loadError')}</p> : null}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">{t('insightsPage.overview')}</TabsTrigger>
          <TabsTrigger value="financial">{t('insightsPage.financial')}</TabsTrigger>
          <TabsTrigger value="beneficiary">{t('insightsPage.beneficiary')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <MetricGrid items={[
            [t('insightsPage.totalPaid'), formatCompactCurrency(overview.totalPaid), DollarSign, 'text-[var(--success)]'],
            [t('insightsPage.totalBeneficiaries'), String(overview.totalBeneficiaries), Users, 'text-[var(--primary)]'],
            [t('insightsPage.activePrograms'), String(overview.activePrograms), Target, 'text-[var(--primary)]'],
            [t('insightsPage.totalTransactions'), String(overview.totalTransactions), Activity, 'text-[var(--primary)]'],
          ]} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold">{t('insightsPage.paymentsOverTime')}</h3>
              <ChartCard>
                <div className="h-[300px] rounded-xl bg-gradient-to-br from-muted/40 via-transparent to-transparent p-3 ring-1 ring-border/40">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={overview.paymentsOverTime}
                      margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="insightsPaymentsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="var(--border)" strokeOpacity={0.35} strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tickMargin={8} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tickMargin={8} width={60} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                      <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'var(--border)', strokeDasharray: '4 4' }} />
                      <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="var(--primary)"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        fill="url(#insightsPaymentsGradient)"
                        dot={false}
                        activeDot={{ r: 4 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold">{t('insightsPage.completedVsFailed')}</h3>
              <ChartCard>
                <div className="h-[300px] rounded-xl bg-gradient-to-br from-muted/40 via-transparent to-transparent p-3 ring-1 ring-border/40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={overview.transactionSuccessRate} barSize={24} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                      <CartesianGrid stroke="var(--border)" strokeOpacity={0.35} strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tickMargin={8} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tickMargin={8} width={40} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                      <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--muted)', opacity: 0.35 }} />
                      <Bar dataKey="successful" fill="var(--success)" radius={[8, 8, 4, 4]} />
                      <Bar dataKey="failed" fill="var(--destructive)" radius={[8, 8, 4, 4]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold">{t('insightsPage.paymentsByProgram')}</h3>
              <ChartCard>
                <div className="h-[300px] rounded-xl bg-gradient-to-br from-muted/40 via-transparent to-transparent p-3 ring-1 ring-border/40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={financial.disbursementsByCampaign} layout="vertical" barSize={16} margin={{ top: 6, right: 12, left: 6, bottom: 6 }}>
                      <CartesianGrid stroke="var(--border)" strokeOpacity={0.35} strokeDasharray="3 3" vertical={false} />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                      <YAxis dataKey="campaign" type="category" width={180} axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                      <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--muted)', opacity: 0.35 }} />
                      <Bar dataKey="amount" fill="var(--primary)" radius={[8, 8, 8, 8]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold">{t('insightsPage.paymentsByProvince')}</h3>
              <ChartCard>
                <div className="h-[300px] rounded-xl bg-gradient-to-br from-muted/40 via-transparent to-transparent p-3 ring-1 ring-border/40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={financial.disbursementsByProvince}
                        cx="50%"
                        cy="50%"
                        outerRadius={110}
                        innerRadius={55}
                        paddingAngle={3}
                        labelLine={false}
                        dataKey="amount"
                        label={({ province }) => province}
                      >
                        {financial.disbursementsByProvince.map((entry, index) => (
                          <Cell key={index} fill={entry.color} stroke="var(--card)" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="font-semibold">{t('insightsPage.providerTransactions')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {financial.transactionsByProvider.map((provider) => (
                <div key={provider.provider}>
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{provider.provider}</p>
                      <p className="text-muted-foreground">{t('insightsPage.providerTransactionsCount', { count: provider.count })}</p>
                    </div>
                    <p className="font-semibold">{formatCurrency(provider.amount)}</p>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full" style={{ width: `${(provider.amount / totalDisbursed) * 100}%`, backgroundColor: provider.color }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <div className="space-y-3">
            <h3 className="font-semibold">{t('insightsPage.topPrograms')}</h3>
            <Card>
              <CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>{t('insightsPage.position')}</TableHead><TableHead>{t('insightsPage.program')}</TableHead><TableHead className="text-right">{t('insightsPage.totalPaid')}</TableHead><TableHead className="text-right">{t('insightsPage.totalBeneficiaries')}</TableHead><TableHead className="text-right">{t('insightsPage.averagePayment')}</TableHead></TableRow></TableHeader><TableBody>{topCampaignsPagination.paginatedItems.map((campaign) => <TableRow key={campaign.rank}><TableCell>{campaign.rank}</TableCell><TableCell>{campaign.campaign}</TableCell><TableCell className="text-right">{formatCurrency(campaign.totalDisbursed)}</TableCell><TableCell className="text-right">{campaign.beneficiaries}</TableCell><TableCell className="text-right">{formatCurrency(campaign.avgPayment)}</TableCell></TableRow>)}</TableBody></Table><DataTablePagination page={topCampaignsPagination.page} pageSize={topCampaignsPagination.pageSize} totalItems={topCampaignsPagination.totalItems} totalPages={topCampaignsPagination.totalPages} onPageChange={topCampaignsPagination.setPage} /></CardContent></Card></div>
        </TabsContent>

        <TabsContent value="beneficiary" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MetricCard icon={DollarSign} label={t('insightsPage.avgPaymentPerBeneficiary')} value={formatCurrency(beneficiaries.averagePaymentPerBeneficiary)} />
            {isAnalyticsOnly ? null : <MetricCard icon={Percent} label={t('insightsPage.participationRate')} value={`${beneficiaries.participationRate.toFixed(1)}%`} accent="var(--success)" />}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold">{t('insightsPage.beneficiariesByProvince')}</h3>
              <Card>
                <CardContent className="space-y-4">
                {beneficiaries.beneficiariesByProvince.map((province) => (
                  <div key={province.province}>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">{province.province}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-muted-foreground">{province.count}</p>
                        <p className="font-medium">{province.percentage}%</p>
                      </div>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-primary" style={{ width: `${province.percentage}%` }} />
                    </div>
                  </div>
                ))}
                </CardContent>
              </Card>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold">{t('insightsPage.beneficiariesByProgram')}</h3>
              <ChartCard>
                <div className="h-[300px] rounded-xl bg-gradient-to-br from-muted/40 via-transparent to-transparent p-3 ring-1 ring-border/40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={beneficiaries.beneficiariesByCampaign} barSize={20} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
                      <CartesianGrid stroke="var(--border)" strokeOpacity={0.35} strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="campaign" angle={-20} textAnchor="end" height={80} axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                      <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--muted)', opacity: 0.35 }} />
                      <Bar dataKey="count" radius={[8, 8, 4, 4]}>
                        {beneficiaries.beneficiariesByCampaign.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </div>
          </div>
        </TabsContent>

      </Tabs>
    </div>
  )
}

function MetricGrid({ items }: { items: Array<[string, string, typeof DollarSign, string]> }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">{items.map(([label, value, Icon, accentClass]) => <MetricCard key={label} icon={Icon} label={label} value={value} accentClass={accentClass} />)}</div>
}

function MetricCard({ icon: Icon, label, value, accentClass = 'text-[var(--primary)]' }: { icon: typeof DollarSign; label: string; value: string; accentClass?: string }) {
  const { t } = useTranslation()
  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-muted-foreground">{label}</p>
          <Icon className={cn('h-4 w-4', accentClass)} />
        </div>
        <p className="font-semibold">{value}</p>
        <p className={cn('mt-1 flex items-center gap-1 text-xs', accentClass)}>
          <TrendingUp className="h-3 w-3" />
          {t('insightsPage.liveBackendData')}
        </p>
      </CardContent>
    </Card>
  )
}

function ChartCard({ children }: { children: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="pt-6">{children}</CardContent>
    </Card>
  )
}

function formatCurrency(value: number) {
  return formatMetical(value)
}

function formatCompactCurrency(value: number) {
  return formatCompactMetical(value)
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name?: string; value?: number }>; label?: string }) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="rounded-lg bg-card px-3 py-2 shadow-[0_6px_18px_rgba(15,23,42,0.12)]">
      {label ? <p className="text-xs text-muted-foreground mb-1">{label}</p> : null}
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
