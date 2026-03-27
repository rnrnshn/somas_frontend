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

export function Insights() {
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

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="mb-6">
          <h1 style={{ fontSize: 'var(--text-32)', fontWeight: 'var(--font-weight-semi-bold)' }}>Analise</h1>
          <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)', marginTop: '8px' }}>
            Analise operacional e relatorios para programas de transferencia social
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={provinceFilter} onValueChange={setProvinceFilter}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Provincia" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Provincias</SelectItem>
              {beneficiaries.beneficiariesByProvince.map((item) => <SelectItem key={item.province} value={item.province}>{item.province}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={campaignFilter} onValueChange={setCampaignFilter}>
            <SelectTrigger className="w-64"><SelectValue placeholder="Programa" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Programas</SelectItem>
              {(campaignsQuery.data?.data ?? []).map((campaign) => <SelectItem key={campaign.id} value={String(campaign.id)}>{campaign.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline"><FileSpreadsheet className="w-4 h-4 mr-2" />Exportar CSV</Button>
          <Button variant="outline"><FileText className="w-4 h-4 mr-2" />Exportar Excel</Button>
          <Button variant="outline"><FileCog className="w-4 h-4 mr-2" />Exportar PDF</Button>
        </div>
      </div>

      {error ? <p style={{ fontSize: 'var(--text-14)', color: 'var(--error)', marginBottom: '16px' }}>{error instanceof Error ? error.message : 'Insights could not be loaded.'}</p> : null}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Resumo Geral</TabsTrigger>
          <TabsTrigger value="financial">Analise Financeira</TabsTrigger>
          <TabsTrigger value="beneficiary">Analise de Beneficiarios</TabsTrigger>
          <TabsTrigger value="savings">Analise de Poupanca</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <MetricGrid items={[
            ['Total Pago', formatCompactCurrency(overview.totalPaid), DollarSign, 'var(--success)'],
            ['Total de Beneficiarios', String(overview.totalBeneficiaries), Users, 'var(--primary)'],
            ['Programas Ativos', String(overview.activePrograms), Target, 'var(--primary)'],
            ['Total de Transacoes', String(overview.totalTransactions), Activity, 'var(--primary)'],
            ['Total Poupado', formatCompactCurrency(overview.totalSaved), PiggyBank, 'var(--success)'],
          ]} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Pagamentos ao Longo do Tempo">
              <ResponsiveContainer width="100%" height={300}><AreaChart data={overview.paymentsOverTime}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Area type="monotone" dataKey="amount" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.15} /></AreaChart></ResponsiveContainer>
            </ChartCard>
            <ChartCard title="Transacoes: Concluidas vs Falhadas">
              <ResponsiveContainer width="100%" height={300}><BarChart data={overview.transactionSuccessRate}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Bar dataKey="successful" fill="var(--success)" /><Bar dataKey="failed" fill="var(--destructive)" /></BarChart></ResponsiveContainer>
            </ChartCard>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Pagamentos por Programa">
              <ResponsiveContainer width="100%" height={300}><BarChart data={financial.disbursementsByCampaign} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis type="number" /><YAxis dataKey="campaign" type="category" width={200} /><Tooltip /><Bar dataKey="amount" fill="var(--primary)" /></BarChart></ResponsiveContainer>
            </ChartCard>
            <ChartCard title="Pagamentos por Provincia">
              <ResponsiveContainer width="100%" height={300}><PieChart><Pie data={financial.disbursementsByProvince} cx="50%" cy="50%" outerRadius={100} dataKey="amount" label={({ province }) => province}>{financial.disbursementsByProvince.map((entry, index) => <Cell key={index} fill={entry.color} />)}</Pie></PieChart></ResponsiveContainer>
            </ChartCard>
          </div>
          <Card><CardHeader><CardTitle style={{ fontSize: 'var(--text-16)', fontWeight: 'var(--font-weight-semi-bold)' }}>Transacoes por Operador</CardTitle></CardHeader><CardContent className="space-y-4">{financial.transactionsByProvider.map((provider) => <div key={provider.provider}><div className="flex items-center justify-between mb-2"><div><p style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)' }}>{provider.provider}</p><p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>{provider.count} transacoes</p></div><p style={{ fontSize: 'var(--text-16)', fontWeight: 'var(--font-weight-semi-bold)' }}>{formatCurrency(provider.amount)}</p></div><div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}><div className="h-full" style={{ width: `${(provider.amount / totalDisbursed) * 100}%`, backgroundColor: provider.color }} /></div></div>)}</CardContent></Card>
          <Card><CardHeader><CardTitle style={{ fontSize: 'var(--text-16)', fontWeight: 'var(--font-weight-semi-bold)' }}>Principais Programas por Valor de Pagamento</CardTitle></CardHeader><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Posicao</TableHead><TableHead>Programa</TableHead><TableHead className="text-right">Total Pago</TableHead><TableHead className="text-right">Beneficiarios</TableHead><TableHead className="text-right">Pagamento Medio</TableHead></TableRow></TableHeader><TableBody>{financial.topCampaignsByDisbursement.map((campaign) => <TableRow key={campaign.rank}><TableCell>{campaign.rank}</TableCell><TableCell>{campaign.campaign}</TableCell><TableCell className="text-right">{formatCurrency(campaign.totalDisbursed)}</TableCell><TableCell className="text-right">{campaign.beneficiaries}</TableCell><TableCell className="text-right">{formatCurrency(campaign.avgPayment)}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
        </TabsContent>

        <TabsContent value="beneficiary" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MetricCard icon={DollarSign} label="Pagamento Medio por Beneficiario" value={formatCurrency(beneficiaries.averagePaymentPerBeneficiary)} />
            <MetricCard icon={Percent} label="Taxa de Participacao em Programas" value={`${beneficiaries.participationRate.toFixed(1)}%`} accent="var(--success)" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card><CardHeader><CardTitle style={{ fontSize: 'var(--text-16)', fontWeight: 'var(--font-weight-semi-bold)' }}>Beneficiarios por Provincia</CardTitle></CardHeader><CardContent className="space-y-4">{beneficiaries.beneficiariesByProvince.map((province) => <div key={province.province}><div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2"><MapPin className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} /><p style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)' }}>{province.province}</p></div><div className="flex items-center gap-3"><p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)' }}>{province.count}</p><p style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-medium)' }}>{province.percentage}%</p></div></div><div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}><div className="h-full" style={{ width: `${province.percentage}%`, backgroundColor: 'var(--primary)' }} /></div></div>)}</CardContent></Card>
            <Card><CardHeader><CardTitle style={{ fontSize: 'var(--text-16)', fontWeight: 'var(--font-weight-semi-bold)' }}>Beneficiarios por Programa</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><BarChart data={beneficiaries.beneficiariesByCampaign}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="campaign" angle={-20} textAnchor="end" height={100} /><YAxis /><Tooltip /><Bar dataKey="count">{beneficiaries.beneficiariesByCampaign.map((entry, index) => <Cell key={index} fill={entry.color} />)}</Bar></BarChart></ResponsiveContainer></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="savings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard icon={PiggyBank} label="Total Poupado" value={formatCurrency(overview.totalSaved)} accent="var(--success)" />
            <MetricCard icon={Users} label="Poupadores" value="N/A" />
            <MetricCard icon={DollarSign} label="Poupanca Media por Beneficiario" value="N/A" />
          </div>
          <Card><CardHeader><CardTitle style={{ fontSize: 'var(--text-16)', fontWeight: 'var(--font-weight-semi-bold)' }}>Analise de Poupanca</CardTitle></CardHeader><CardContent><p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }}>The backend currently exposes total savings in insights, but not detailed saver counts, growth history, or savings-by-program analytics for this screen.</p></CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MetricGrid({ items }: { items: Array<[string, string, typeof DollarSign, string]> }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">{items.map(([label, value, Icon, color]) => <MetricCard key={label} icon={Icon} label={label} value={value} accent={color} />)}</div>
}

function MetricCard({ icon: Icon, label, value, accent = 'var(--primary)' }: { icon: typeof DollarSign; label: string; value: string; accent?: string }) {
  return <Card><CardContent className="p-6"><div className="flex items-center justify-between mb-2"><p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)' }}>{label}</p><Icon className="w-4 h-4" style={{ color: accent }} /></div><p style={{ fontSize: 'var(--text-28)', fontWeight: 'var(--font-weight-semi-bold)' }}>{value}</p><p style={{ fontSize: 'var(--text-12)', color: accent, marginTop: '4px' }}><TrendingUp className="w-3 h-3 inline mr-1" />Live backend data</p></CardContent></Card>
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return <Card><CardHeader><CardTitle style={{ fontSize: 'var(--text-16)', fontWeight: 'var(--font-weight-semi-bold)' }}>{title}</CardTitle></CardHeader><CardContent>{children}</CardContent></Card>
}

function formatCurrency(value: number) {
  return `MZN ${value.toLocaleString('pt-MZ')}`
}

function formatCompactCurrency(value: number) {
  return `MZN ${(value / 1000000).toFixed(1)}M`
}
