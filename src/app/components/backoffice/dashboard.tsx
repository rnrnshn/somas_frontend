import { useState } from "react";
import { useNavigate } from "@/lib/router";
import { useAuth } from "@/lib/auth/auth-context";
import { normalizeRole } from "@/lib/auth/roles";
import { formatCompactMetical, formatMetical } from "@/lib/format/currency";
import { useBackofficeDashboardQueries } from "@/features/dashboard/hooks/use-dashboard-queries";
import { useCampaignTableSummaryQueries } from "@/features/campaigns/hooks/use-campaign-queries";
import { useCampaignCatalogs } from "@/features/catalogs/hooks/use-catalog-queries";
import {
  adaptBeneficiaryGrowth,
  adaptCampaignPerformance,
  adaptDailyMetrics,
  adaptRecentTransactions,
  adaptSystemHealth,
  adaptTransactionStatus,
  adaptTransactionTrend} from "@/features/dashboard/adapters/backoffice-dashboard";
import type { DashboardFilters } from "@/features/dashboard/types/dashboard";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue} from "../ui/select";
import { Progress } from "../ui/progress";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell} from "../ui/table";
import {
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Target,
  Calendar,
  Download,
  Plus} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer} from "recharts";
import {
  DataTablePagination,
  useTablePagination} from "../ui/table-pagination";
import { useTranslation } from "react-i18next";

export function BackofficeDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("month");
  const [region, setRegion] = useState("all");
  const [campaign, setCampaign] = useState("all");
  const { t } = useTranslation();
  const isAnalyticsOnly = normalizeRole(user?.role) === "analytics";
  const catalogs = useCampaignCatalogs();

  const filters: DashboardFilters = {
    period: mapDateRange(dateRange),
    provinceId: region === "all" ? undefined : Number(region),
    campaignId: campaign === "all" ? undefined : Number(campaign)};

  const dashboard = useBackofficeDashboardQueries(filters);
  const selectedPeriodLabel = getSelectedPeriodLabel(dateRange, t);
  const kpiMetrics = dashboard.overview.data?.kpis ?? {
    totalTransactions: 0,
    totalDisbursed: 0,
    successRate: 0,
    failedTransactions: 0,
    activeCampaigns: 0,
    newBeneficiaries: 0,
    totalSaved: 0,
    participationRate: 0};
  const dailyMetrics = adaptDailyMetrics(dashboard.overview.data);
  const transactionStatus = adaptTransactionStatus(dashboard.overview.data);
  const campaigns = adaptCampaignPerformance(dashboard.overview.data);
  const campaignSummaryQueries = useCampaignTableSummaryQueries(
    campaigns.map((item) => Number(item.id)),
  );
  const campaignSummaryMap = new Map(
    campaignSummaryQueries
      .map((query) => query.data)
      .filter((summary): summary is NonNullable<typeof summary> =>
        Boolean(summary),
      )
      .map((summary) => [summary.campaignId, summary]),
  );
  const campaignPerformance = campaigns.map((campaign) => {
    const summary = campaignSummaryMap.get(Number(campaign.id));
    if (!summary) return campaign;

    return {
      ...campaign,
      beneficiaries: summary.totalBeneficiaries,
      amount: summary.amountDisbursed,
      successRate: summary.successRate,
      progress: summary.successRate};
  });
  const transactionTrend = adaptTransactionTrend(dashboard.transactions.data);
  const recentTransactions = adaptRecentTransactions(
    dashboard.transactions.data,
  );
  const beneficiaryGrowth = adaptBeneficiaryGrowth(
    dashboard.beneficiaries.data,
  );
  const systemHealth = adaptSystemHealth(dashboard.health.data);
  const beneficiaryKpis = dashboard.beneficiaries.data?.kpis ?? {
    total: 0,
    active: 0,
    inactive: 0};
  const availableCampaigns = campaignPerformance;
  const availableRegions = catalogs.provinces.data ?? [];
  const dashboardError =
    dashboard.error instanceof Error ? dashboard.error.message : null;
  const campaignPerformancePagination = useTablePagination(
    campaignPerformance,
    undefined,
    [activeTab, dateRange, region, campaign],
  );
  const recentTransactionsPagination = useTablePagination(
    recentTransactions,
    undefined,
    [activeTab, dateRange, region, campaign],
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      {
        variant?:
          | "default"
          | "secondary"
          | "outline"
          | "success"
          | "warning"
          | "destructive";
      }
    > = {
      Confirmed: { variant: "success" },
      Active: { variant: "success" },
      Pending: { variant: "warning" },
      Failed: { variant: "destructive" }};
    return <Badge {...(variants[status] || {})}>{status}</Badge>;
  };

  const formatCurrency = (amount: number) => formatCompactMetical(amount);

  return (
    <div className="p-8" style={{ backgroundColor: "var(--background)" }}>
      {/* Header with Filters */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1
            style={{
              
              fontWeight: "var(--font-weight-semi-bold)"}}
          >
            {t("dashboardPage.title")}
          </h1>
          <p
            style={{
              
              color: "var(--muted-foreground)",
              marginTop: "8px"}}
          >
            {t("dashboardPage.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={campaign} onValueChange={setCampaign}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder={t("dashboardPage.campaign")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("dashboardPage.allCampaigns")}
              </SelectItem>
              {availableCampaigns.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t("dashboardPage.province")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("dashboardPage.allProvinces")}
              </SelectItem>
              {availableRegions.map((item) => (
                <SelectItem key={item.id} value={String(item.id)}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t("dashboardPage.period")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">{t("dashboardPage.today")}</SelectItem>
              <SelectItem value="week">
                {t("dashboardPage.thisWeek")}
              </SelectItem>
              <SelectItem value="month">
                {t("dashboardPage.thisMonth")}
              </SelectItem>
              <SelectItem value="quarter">
                {t("dashboardPage.thisQuarter")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs */}
      {dashboardError ? (
        <Alert className="mb-6" variant="destructive">
          <AlertDescription>{dashboardError}</AlertDescription>
        </Alert>
      ) : null}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="overview">
            {t("dashboardPage.overview")}
          </TabsTrigger>
          <TabsTrigger value="transactions">
            {t("dashboardPage.transactions")}
          </TabsTrigger>
          <TabsTrigger value="beneficiaries">
            {t("dashboardPage.beneficiaries")}
          </TabsTrigger>
          <TabsTrigger value="operational">
            {t("dashboardPage.operationalHealth")}
          </TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-8">
          {/* KPI Summary Cards */}
          <div style={{ marginBottom: "32px" }}>
            <h3
              style={{
                
                fontWeight: "var(--font-weight-medium)",
                marginBottom: "24px"}}
            >
              {t("dashboardPage.kpis")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <p
                    style={{
                      
                      fontWeight: "var(--font-weight-medium)",
                      color: "var(--muted-foreground)",
                      marginBottom: "8px"}}
                  >
                    {t("dashboardPage.totalDisbursed")}
                  </p>
                  <div
                    style={{
                      
                      fontWeight: "var(--font-weight-semi-bold)",
                      color: "var(--foreground)"}}
                  >
                    {formatMetical(kpiMetrics.totalDisbursed)}
                  </div>
                  <p
                    style={{
                      
                      fontWeight: "var(--font-weight-regular)",
                      color: "var(--muted-foreground)",
                      marginTop: "8px"}}
                  >
                    {selectedPeriodLabel}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <p
                    style={{
                      
                      fontWeight: "var(--font-weight-medium)",
                      color: "var(--muted-foreground)",
                      marginBottom: "8px"}}
                  >
                    {t("dashboardPage.totalTransactions")}
                  </p>
                  <div
                    style={{
                      
                      fontWeight: "var(--font-weight-semi-bold)",
                      color: "var(--foreground)"}}
                  >
                    {kpiMetrics.totalTransactions.toLocaleString()}
                  </div>
                  <p
                    style={{
                      
                      fontWeight: "var(--font-weight-regular)",
                      color: "var(--muted-foreground)",
                      marginTop: "8px"}}
                  >
                    {selectedPeriodLabel}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <p
                    style={{
                      
                      fontWeight: "var(--font-weight-medium)",
                      color: "var(--muted-foreground)",
                      marginBottom: "8px"}}
                  >
                    {t("dashboardPage.successRate")}
                  </p>
                  <div
                    style={{
                      
                      fontWeight: "var(--font-weight-semi-bold)",
                      color: "var(--foreground)"}}
                  >
                    {kpiMetrics.successRate}%
                  </div>
                  <p
                    style={{
                      
                      fontWeight: "var(--font-weight-regular)",
                      color: "var(--muted-foreground)",
                      marginTop: "8px"}}
                  >
                    {t("dashboardPage.confirmationRate")}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <p
                    style={{
                      
                      fontWeight: "var(--font-weight-medium)",
                      color: "var(--muted-foreground)",
                      marginBottom: "8px"}}
                  >
                    {t("dashboardPage.failedTransactions")}
                  </p>
                  <div
                    style={{
                      
                      fontWeight: "var(--font-weight-semi-bold)",
                      color: "var(--foreground)"}}
                  >
                    {kpiMetrics.failedTransactions.toLocaleString()}
                  </div>
                  <p
                    style={{
                      
                      fontWeight: "var(--font-weight-regular)",
                      color: "var(--muted-foreground)",
                      marginTop: "8px"}}
                  >
                    {t("dashboardPage.requiresAttention")}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <p
                    style={{
                      
                      fontWeight: "var(--font-weight-medium)",
                      color: "var(--muted-foreground)",
                      marginBottom: "8px"}}
                  >
                    Active Campaigns
                  </p>
                  <div
                    style={{
                      
                      fontWeight: "var(--font-weight-semi-bold)",
                      color: "var(--foreground)"}}
                  >
                    {kpiMetrics.activeCampaigns}
                  </div>
                  <p
                    style={{
                      
                      fontWeight: "var(--font-weight-regular)",
                      color: "var(--muted-foreground)",
                      marginTop: "8px"}}
                  >
                    In progress
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <p
                    style={{
                      
                      fontWeight: "var(--font-weight-medium)",
                      color: "var(--muted-foreground)",
                      marginBottom: "8px"}}
                  >
                    New Beneficiaries
                  </p>
                  <div
                    style={{
                      
                      fontWeight: "var(--font-weight-semi-bold)",
                      color: "var(--foreground)"}}
                  >
                    {kpiMetrics.newBeneficiaries.toLocaleString()}
                  </div>
                  <p
                    style={{
                      
                      fontWeight: "var(--font-weight-regular)",
                      color: "var(--muted-foreground)",
                      marginTop: "8px"}}
                  >
                    {selectedPeriodLabel}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Daily Operational Metrics */}
          <div>
            <h3
              style={{
                
                fontWeight: "var(--font-weight-medium)",
                marginBottom: "16px"}}
            >
              Daily Operational Metrics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <p
                    style={{
                      
                      color: "var(--muted-foreground)",
                      marginBottom: "8px"}}
                  >
                    Transactions Today
                  </p>
                  <div
                    style={{
                      
                      fontWeight: "var(--font-weight-semi-bold)"}}
                  >
                    {dailyMetrics.transactionsToday.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <ArrowUpRight
                      className="w-4 h-4"
                      style={{ color: "var(--success)" }}
                    />
                    <span
                      style={{
                        
                        color: "var(--success)"}}
                    >
                      +{dailyMetrics.transactionsTrend}% from yesterday
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <p
                    style={{
                      
                      color: "var(--muted-foreground)",
                      marginBottom: "8px"}}
                  >
                    Amount Disbursed Today
                  </p>
                  <div
                    style={{
                      
                      fontWeight: "var(--font-weight-semi-bold)"}}
                  >
                    {formatCurrency(dailyMetrics.amountToday)}
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <ArrowUpRight
                      className="w-4 h-4"
                      style={{ color: "var(--success)" }}
                    />
                    <span
                      style={{
                        
                        color: "var(--success)"}}
                    >
                      +{dailyMetrics.amountTrend}% from yesterday
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <p
                    style={{
                      
                      color: "var(--muted-foreground)",
                      marginBottom: "8px"}}
                  >
                    New Beneficiaries Today
                  </p>
                  <div
                    style={{
                      
                      fontWeight: "var(--font-weight-semi-bold)"}}
                  >
                    {dailyMetrics.newBeneficiariesToday}
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <ArrowUpRight
                      className="w-4 h-4"
                      style={{ color: "var(--success)" }}
                    />
                    <span
                      style={{
                        
                        color: "var(--success)"}}
                    >
                      +{dailyMetrics.beneficiariesTrend}% from yesterday
                    </span>
                  </div>
                </CardContent>
              </Card>

              {isAnalyticsOnly && null}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Transaction Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Transaction Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={transactionStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {transactionStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {transactionStatus.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span>
                          {item.name}
                        </span>
                      </div>
                      <span
                        style={{
                          
                          fontWeight: "var(--font-weight-medium)"}}
                      >
                        {item.value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {t("dashboardPage.quickActions")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => navigate("/backoffice/campaigns")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t("dashboardPage.createCampaign")}
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => navigate("/backoffice/reports")}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t("dashboardPage.exportReport")}
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => navigate("/backoffice/audit")}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {t("dashboardPage.viewAuditLogs")}
                </Button>
              </CardContent>
            </Card>

            {/* System Health & Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>
                  System Health & Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <p style={{ fontWeight: "var(--font-weight-medium)" }}>
                      Failed transaction spike
                    </p>
                    <p
                      style={{
                        color: "var(--muted-foreground)",
                        marginTop: "2px"}}
                    >
                      {kpiMetrics.failedTransactions.toLocaleString()} failed
                      transactions in selected period
                    </p>
                  </AlertDescription>
                </Alert>
                <Alert variant="default">
                  <Activity className="h-4 w-4" />
                  <AlertDescription>
                    <p style={{ fontWeight: "var(--font-weight-medium)" }}>
                      Pending sync backlog
                    </p>
                    <p
                      style={{
                        color: "var(--muted-foreground)",
                        marginTop: "2px"}}
                    >
                      {systemHealth.pendingSync.toLocaleString()} field records
                      awaiting sync
                    </p>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* Campaign Performance Overview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 style={{  fontWeight: 'var(--font-weight-semi-bold)' }}>
                Campaign Performance Overview
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/backoffice/campaigns")}
              >
                View All
              </Button>
            </div>
            <Card>
              <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Beneficiaries</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Success Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaignPerformancePagination.paginatedItems.map(
                    (campaign) => (
                      <TableRow
                        key={campaign.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() =>
                          navigate(`/backoffice/campaigns/${campaign.id}`)
                        }
                      >
                        <TableCell>
                          <div>
                            <p
                              style={{
                                
                                fontWeight: "var(--font-weight-medium)"}}
                            >
                              {campaign.name}
                            </p>
                            <p
                              style={{
                                
                                color: "var(--muted-foreground)"}}
                            >
                              {campaign.id}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{campaign.region}</TableCell>
                        <TableCell>
                          {campaign.beneficiaries.toLocaleString()}
                        </TableCell>
                        <TableCell>{formatCurrency(campaign.amount)}</TableCell>
                        <TableCell>
                          <span
                            style={{
                              color: "var(--success)",
                              fontWeight: "var(--font-weight-medium)"}}
                          >
                            {campaign.successRate}%
                          </span>
                        </TableCell>
                        <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={campaign.progress}
                              className="w-20"
                            />
                            <span
                              style={{
                                
                                color: "var(--muted-foreground)"}}
                            >
                              {campaign.progress}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ),
                  )}
                </TableBody>
              </Table>
              <DataTablePagination
                page={campaignPerformancePagination.page}
                pageSize={campaignPerformancePagination.pageSize}
                totalItems={campaignPerformancePagination.totalItems}
                totalPages={campaignPerformancePagination.totalPages}
                onPageChange={campaignPerformancePagination.setPage}
              />
            </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TRANSACTIONS TAB */}
        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                Transactions Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={transactionTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="date"
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    name="Transaction Count"
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="var(--accent)"
                    strokeWidth={2}
                    name="Amount (MZN)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h3 style={{  fontWeight: 'var(--font-weight-semi-bold)' }}>
              Recent Transactions
            </h3>
            <Card>
              <CardContent>
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Beneficiary</TableHead>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactionsPagination.paginatedItems.map((txn) => (
                    <TableRow key={txn.id}>
                      <TableCell
                        style={{
                          fontFamily: "var(--font-mono)"}}
                      >
                        {txn.id}
                      </TableCell>
                      <TableCell>{txn.beneficiary}</TableCell>
                      <TableCell
                        style={{
                          
                          color: "var(--muted-foreground)"}}
                      >
                        {txn.campaign}
                      </TableCell>
                      <TableCell
                        style={{ fontWeight: "var(--font-weight-medium)" }}
                      >
                        {formatCurrency(txn.amount)}
                      </TableCell>
                      <TableCell>{getStatusBadge(txn.status)}</TableCell>
                      <TableCell
                        style={{
                          
                          color: "var(--muted-foreground)"}}
                      >
                        {txn.date}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <DataTablePagination
                page={recentTransactionsPagination.page}
                pageSize={recentTransactionsPagination.pageSize}
                totalItems={recentTransactionsPagination.totalItems}
                totalPages={recentTransactionsPagination.totalPages}
                onPageChange={recentTransactionsPagination.setPage}
              />
            </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* BENEFICIARIES TAB */}
        <TabsContent value="beneficiaries" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <p
                  style={{
                    
                    color: "var(--muted-foreground)",
                    marginBottom: "8px"}}
                >
                  Total Beneficiaries
                </p>
                <div
                  style={{
                    
                    fontWeight: "var(--font-weight-semi-bold)"}}
                >
                  {beneficiaryKpis.total.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <p
                  style={{
                    
                    color: "var(--muted-foreground)",
                    marginBottom: "8px"}}
                >
                  Active Beneficiaries
                </p>
                <div
                  style={{
                    
                    fontWeight: "var(--font-weight-semi-bold)",
                    color: "var(--success)"}}
                >
                  {beneficiaryKpis.active.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <p
                  style={{
                    
                    color: "var(--muted-foreground)",
                    marginBottom: "8px"}}
                >
                  Inactive Beneficiaries
                </p>
                <div
                  style={{
                    
                    fontWeight: "var(--font-weight-semi-bold)",
                    color: "var(--muted-foreground)"}}
                >
                  {beneficiaryKpis.inactive.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                Beneficiary Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={beneficiaryGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="month"
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    name="Total Beneficiaries"
                  />
                  <Line
                    type="monotone"
                    dataKey="active"
                    stroke="var(--success)"
                    strokeWidth={2}
                    name="Active Beneficiaries"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* OPERATIONAL HEALTH TAB */}
        <TabsContent value="operational" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p
                    style={{
                      
                      color: "var(--muted-foreground)"}}
                  >
                    Active Sessions
                  </p>
                  <Activity
                    className="w-4 h-4"
                    style={{ color: "var(--muted-foreground)" }}
                  />
                </div>
                <div
                  style={{
                    
                    fontWeight: "var(--font-weight-semi-bold)"}}
                >
                  {systemHealth.activeSessions}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p
                    style={{
                      
                      color: "var(--muted-foreground)"}}
                  >
                    Failed Logins
                  </p>
                  <AlertTriangle
                    className="w-4 h-4"
                    style={{ color: "var(--warning)" }}
                  />
                </div>
                <div
                  style={{
                    
                    fontWeight: "var(--font-weight-semi-bold)",
                    color: "var(--warning)"}}
                >
                  {systemHealth.failedLogins}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p
                    style={{
                      
                      color: "var(--muted-foreground)"}}
                  >
                    System Events
                  </p>
                  <FileText
                    className="w-4 h-4"
                    style={{ color: "var(--muted-foreground)" }}
                  />
                </div>
                <div
                  style={{
                    
                    fontWeight: "var(--font-weight-semi-bold)"}}
                >
                  {systemHealth.systemEvents.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p
                    style={{
                      
                      color: "var(--muted-foreground)"}}
                  >
                    Pending Field Sync
                  </p>
                  <Activity
                    className="w-4 h-4"
                    style={{ color: "var(--warning)" }}
                  />
                </div>
                <div
                  style={{
                    
                    fontWeight: "var(--font-weight-semi-bold)",
                    color: "var(--warning)"}}
                >
                  {systemHealth.pendingSync}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p
                    style={{
                      
                      color: "var(--muted-foreground)"}}
                  >
                    Avg Response Time
                  </p>
                  <TrendingUp
                    className="w-4 h-4"
                    style={{ color: "var(--success)" }}
                  />
                </div>
                <div
                  style={{
                    
                    fontWeight: "var(--font-weight-semi-bold)",
                    color: "var(--success)"}}
                >
                  {systemHealth.avgResponseTime}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p
                    style={{
                      
                      color: "var(--muted-foreground)"}}
                  >
                    System Uptime
                  </p>
                  <Activity
                    className="w-4 h-4"
                    style={{ color: "var(--success)" }}
                  />
                </div>
                <div
                  style={{
                    
                    fontWeight: "var(--font-weight-semi-bold)",
                    color: "var(--success)"}}
                >
                  {systemHealth.uptime}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                System Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <p
                    style={{
                      
                      fontWeight: "var(--font-weight-medium)"}}
                  >
                    High failed login attempts
                  </p>
                  <p
                    style={{
                      
                      color: "var(--muted-foreground)",
                      marginTop: "4px"}}
                  >
                    23 failed login attempts in the last hour from IP
                    192.168.1.45
                  </p>
                </AlertDescription>
              </Alert>
              <Alert variant="default">
                <Activity className="h-4 w-4" />
                <AlertDescription>
                  <p
                    style={{
                      
                      fontWeight: "var(--font-weight-medium)"}}
                  >
                    Pending sync backlog
                  </p>
                  <p
                    style={{
                      
                      color: "var(--muted-foreground)",
                      marginTop: "4px"}}
                  >
                    {systemHealth.pendingSync.toLocaleString()} field records
                    awaiting synchronization
                  </p>
                </AlertDescription>
              </Alert>
              <Alert variant="default">
                <TrendingDown className="h-4 w-4" />
                <AlertDescription>
                  <p
                    style={{
                      
                      fontWeight: "var(--font-weight-medium)"}}
                  >
                    Suspicious activity detected
                  </p>
                  <p
                    style={{
                      
                      color: "var(--muted-foreground)",
                      marginTop: "4px"}}
                  >
                    Multiple access attempts from unrecognized location
                  </p>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function mapDateRange(value: string): DashboardFilters["period"] {
  switch (value) {
    case "today":
      return "today";
    case "week":
      return "last_7_days";
    case "month":
      return "last_30_days";
    case "quarter":
      return "last_90_days";
    default:
      return "last_30_days";
  }
}

function getSelectedPeriodLabel(
  value: string,
  t: (key: string) => string,
) {
  switch (value) {
    case "today":
      return t("dashboardPage.today");
    case "week":
      return t("dashboardPage.thisWeek");
    case "quarter":
      return t("dashboardPage.thisQuarter");
    case "month":
    default:
      return t("dashboardPage.last30Days");
  }
}
