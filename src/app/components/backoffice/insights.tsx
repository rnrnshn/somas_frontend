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
  YAxis,
} from 'recharts'
import { Activity, DollarSign, FileCog, FileSpreadsheet, FileText, MapPin, Percent, PiggyBank, Target, TrendingUp, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Button } from '../ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { useCampaignsQuery } from '@/features/campaigns/hooks/use-campaign-queries'
import { adaptBeneficiaries, adaptFinancial, adaptOverview } from '@/features/dashboard/adapters/insights'
import { useInsightsBeneficiariesQuery, useInsightsFinancialQuery, useInsightsSummaryQuery } from '@/features/dashboard/hooks/use-insights-queries'
import type { DashboardFilters } from '@/features/dashboard/types/dashboard'
import { formatCompactMetical, formatMetical } from '@/lib/format/currency'
import { DataTablePagination, useTablePagination } from '../ui/table-pagination'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/lib/auth/auth-context'
import { normalizeRole } from '@/lib/auth/roles'

export function Insights() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const isAnalyticsOnly = normalizeRole(user?.role) === 'analytics'
  const [activeTab, setActiveTab] = useState('overview')
  const [campaignFilter, setCampaignFilter] = useState('all')
  const [provinceFilter, setProvinceFilter] = useState('all')
  const campaignsQuery = useCampaignsQuery({ page: 1, pageSize: 100 })
  const filters: DashboardFilters = useMemo(
    () => ({ campaignId: campaignFilter === 'all' ? undefined : Number(campaignFilter), province: provinceFilter === 'all' ? undefined : provinceFilter }),
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
          <h1 style={{ fontSize: 'var(--text-32)', fontWeight: 'var(--font-weight-semi-bold)' }}>{t('insightsPage.title')}</h1>
          <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)', marginTop: '8px' }}>
            {t('insightsPage.subtitle')}
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={provinceFilter} onValueChange={setProvinceFilter}>
            <SelectTrigger className="w-48"><SelectValue placeholder={t('insightsPage.province')} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('insightsPage.allProvinces')}</SelectItem>
              {beneficiaries.beneficiariesByProvince.map((item) => <SelectItem key={item.province} value={item.province}>{item.province}</SelectItem>)}
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

      {error ? <p style={{ fontSize: 'var(--text-14)', color: 'var(--error)', marginBottom: '16px' }}>{error instanceof Error ? error.message : t('insightsPage.loadError')}</p> : null}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">{t('insightsPage.overview')}</TabsTrigger>
          <TabsTrigger value="financial">{t('insightsPage.financial')}</TabsTrigger>
          <TabsTrigger value="beneficiary">{t('insightsPage.beneficiary')}</TabsTrigger>
          {isAnalyticsOnly ? null : <TabsTrigger value="savings">{t('insightsPage.savings')}</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <MetricGrid items={[
            [t('insightsPage.totalPaid'), formatCompactCurrency(overview.totalPaid), DollarSign, 'var(--success)'],
            [t('insightsPage.totalBeneficiaries'), String(overview.totalBeneficiaries), Users, 'var(--primary)'],
            [t('insightsPage.activePrograms'), String(overview.activePrograms), Target, 'var(--primary)'],
            [t('insightsPage.totalTransactions'), String(overview.totalTransactions), Activity, 'var(--primary)'],
            ...(isAnalyticsOnly ? [] : [[t('insightsPage.totalSaved'), formatCompactCurrency(overview.totalSaved), PiggyBank, 'var(--success)']] as Array<[string, string, typeof DollarSign, string]>),
          ]} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title={t('insightsPage.paymentsOverTime')}>
              <ResponsiveContainer width="100%" height={300}><AreaChart data={overview.paymentsOverTime}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Area type="monotone" dataKey="amount" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.15} /></AreaChart></ResponsiveContainer>
            </ChartCard>
            <ChartCard title={t('insightsPage.completedVsFailed')}>
              <ResponsiveContainer width="100%" height={300}><BarChart data={overview.transactionSuccessRate}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Bar dataKey="successful" fill="var(--success)" /><Bar dataKey="failed" fill="var(--destructive)" /></BarChart></ResponsiveContainer>
            </ChartCard>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title={t('insightsPage.paymentsByProgram')}>
              <ResponsiveContainer width="100%" height={300}><BarChart data={financial.disbursementsByCampaign} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis type="number" /><YAxis dataKey="campaign" type="category" width={200} /><Tooltip /><Bar dataKey="amount" fill="var(--primary)" /></BarChart></ResponsiveContainer>
            </ChartCard>
            <ChartCard title={t('insightsPage.paymentsByProvince')}>
              <ResponsiveContainer width="100%" height={300}><PieChart><Pie data={financial.disbursementsByProvince} cx="50%" cy="50%" outerRadius={100} dataKey="amount" label={({ province }) => province}>{financial.disbursementsByProvince.map((entry, index) => <Cell key={index} fill={entry.color} />)}</Pie></PieChart></ResponsiveContainer>
            </ChartCard>
          </div>
          <Card><CardHeader><CardTitle style={{ fontSize: 'var(--text-16)', fontWeight: 'var(--font-weight-semi-bold)' }}>{t('insightsPage.providerTransactions')}</CardTitle></CardHeader><CardContent className="space-y-4">{financial.transactionsByProvider.map((provider) => <div key={provider.provider}><div className="flex items-center justify-between mb-2"><div><p style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)' }}>{provider.provider}</p><p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>{t('insightsPage.providerTransactionsCount', { count: provider.count })}</p></div><p style={{ fontSize: 'var(--text-16)', fontWeight: 'var(--font-weight-semi-bold)' }}>{formatCurrency(provider.amount)}</p></div><div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}><div className="h-full" style={{ width: `${(provider.amount / totalDisbursed) * 100}%`, backgroundColor: provider.color }} /></div></div>)}</CardContent></Card>
          <Card><CardHeader><CardTitle style={{ fontSize: 'var(--text-16)', fontWeight: 'var(--font-weight-semi-bold)' }}>{t('insightsPage.topPrograms')}</CardTitle></CardHeader><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>{t('insightsPage.position')}</TableHead><TableHead>{t('insightsPage.program')}</TableHead><TableHead className="text-right">{t('insightsPage.totalPaid')}</TableHead><TableHead className="text-right">{t('insightsPage.totalBeneficiaries')}</TableHead><TableHead className="text-right">{t('insightsPage.averagePayment')}</TableHead></TableRow></TableHeader><TableBody>{topCampaignsPagination.paginatedItems.map((campaign) => <TableRow key={campaign.rank}><TableCell>{campaign.rank}</TableCell><TableCell>{campaign.campaign}</TableCell><TableCell className="text-right">{formatCurrency(campaign.totalDisbursed)}</TableCell><TableCell className="text-right">{campaign.beneficiaries}</TableCell><TableCell className="text-right">{formatCurrency(campaign.avgPayment)}</TableCell></TableRow>)}</TableBody></Table><DataTablePagination page={topCampaignsPagination.page} pageSize={topCampaignsPagination.pageSize} totalItems={topCampaignsPagination.totalItems} totalPages={topCampaignsPagination.totalPages} onPageChange={topCampaignsPagination.setPage} /></CardContent></Card>
        </TabsContent>

        <TabsContent value="beneficiary" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MetricCard icon={DollarSign} label={t('insightsPage.avgPaymentPerBeneficiary')} value={formatCurrency(beneficiaries.averagePaymentPerBeneficiary)} />
            {isAnalyticsOnly ? null : <MetricCard icon={Percent} label={t('insightsPage.participationRate')} value={`${beneficiaries.participationRate.toFixed(1)}%`} accent="var(--success)" />}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card><CardHeader><CardTitle style={{ fontSize: 'var(--text-16)', fontWeight: 'var(--font-weight-semi-bold)' }}>{t('insightsPage.beneficiariesByProvince')}</CardTitle></CardHeader><CardContent className="space-y-4">{beneficiaries.beneficiariesByProvince.map((province) => <div key={province.province}><div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2"><MapPin className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} /><p style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)' }}>{province.province}</p></div><div className="flex items-center gap-3"><p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)' }}>{province.count}</p><p style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-medium)' }}>{province.percentage}%</p></div></div><div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}><div className="h-full" style={{ width: `${province.percentage}%`, backgroundColor: 'var(--primary)' }} /></div></div>)}</CardContent></Card>
            <Card><CardHeader><CardTitle style={{ fontSize: 'var(--text-16)', fontWeight: 'var(--font-weight-semi-bold)' }}>{t('insightsPage.beneficiariesByProgram')}</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><BarChart data={beneficiaries.beneficiariesByCampaign}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="campaign" angle={-20} textAnchor="end" height={100} /><YAxis /><Tooltip /><Bar dataKey="count">{beneficiaries.beneficiariesByCampaign.map((entry, index) => <Cell key={index} fill={entry.color} />)}</Bar></BarChart></ResponsiveContainer></CardContent></Card>
          </div>
        </TabsContent>

        {isAnalyticsOnly ? null : <TabsContent value="savings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard icon={PiggyBank} label={t('insightsPage.totalSaved')} value={formatCurrency(overview.totalSaved)} accent="var(--success)" />
            <MetricCard icon={Users} label={t('insightsPage.savers')} value="N/A" />
            <MetricCard icon={DollarSign} label={t('insightsPage.averageSavingsPerBeneficiary')} value="N/A" />
          </div>
          <Card><CardHeader><CardTitle style={{ fontSize: 'var(--text-16)', fontWeight: 'var(--font-weight-semi-bold)' }}>{t('insightsPage.savingsAnalysis')}</CardTitle></CardHeader><CardContent><p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }}>{t('insightsPage.savingsBackendNote')}</p></CardContent></Card>
        </TabsContent>}
      </Tabs>
    </div>
  )
}

function MetricGrid({ items }: { items: Array<[string, string, typeof DollarSign, string]> }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">{items.map(([label, value, Icon, color]) => <MetricCard key={label} icon={Icon} label={label} value={value} accent={color} />)}</div>
}

function MetricCard({ icon: Icon, label, value, accent = 'var(--primary)' }: { icon: typeof DollarSign; label: string; value: string; accent?: string }) {
  const { t } = useTranslation()
  return <Card><CardContent className="p-6"><div className="flex items-center justify-between mb-2"><p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)' }}>{label}</p><Icon className="w-4 h-4" style={{ color: accent }} /></div><p style={{ fontSize: 'var(--text-28)', fontWeight: 'var(--font-weight-semi-bold)' }}>{value}</p><p style={{ fontSize: 'var(--text-12)', color: accent, marginTop: '4px' }}><TrendingUp className="w-3 h-3 inline mr-1" />{t('insightsPage.liveBackendData')}</p></CardContent></Card>
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return <Card><CardHeader><CardTitle style={{ fontSize: 'var(--text-16)', fontWeight: 'var(--font-weight-semi-bold)' }}>{title}</CardTitle></CardHeader><CardContent>{children}</CardContent></Card>
}

function formatCurrency(value: number) {
  return formatMetical(value)
}

function formatCompactCurrency(value: number) {
  return formatCompactMetical(value)
}
