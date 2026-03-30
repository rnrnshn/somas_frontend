import { useState } from "react";
import { useNavigate, useParams } from "@/lib/router";
import { useAllCampaignBeneficiariesQuery, useCampaignBeneficiariesQuery, useCampaignProgressQuery, useCampaignQuery } from "@/features/campaigns/hooks/use-campaign-queries";
import { useExecuteCampaignDisbursementMutation } from "@/features/campaigns/hooks/use-campaign-mutations";
import { adaptCampaignDetail, adaptCampaignProgressSeries } from "@/features/campaigns/adapters/campaigns";
import { useFieldSearchQuery } from "@/features/field/hooks/use-field-queries";
import { adaptTransaction } from "@/features/transactions/adapters/transactions";
import { useCampaignTransactionsQuery } from "@/features/transactions/hooks/use-transaction-queries";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Progress } from "../ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Alert, AlertDescription } from "../ui/alert";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  ArrowLeft,
  Download,
  Pause,
  XCircle,
  AlertTriangle,
  Play,
  SquarePen,
  Search,
  Eye,
  Flag,
  RotateCcw,
  FileText,
  PiggyBank
} from "lucide-react";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export function CampaignDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const campaignId = Number(id);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [showExecuteDialog, setShowExecuteDialog] = useState(false);
  const beneficiarySearch = searchQuery.trim();

  const campaignQuery = useCampaignQuery(campaignId);
  const progressQuery = useCampaignProgressQuery(campaignId);
  const campaignBeneficiariesListQuery = useAllCampaignBeneficiariesQuery(campaignId);
  const campaignBeneficiariesQuery = useFieldSearchQuery(
    {
      campaignId,
      name: beneficiarySearch || undefined,
      msisdn: beneficiarySearch || undefined,
    },
    Number.isFinite(campaignId) && beneficiarySearch.length > 0
  );
  const campaignTransactionsQuery = useCampaignTransactionsQuery(campaignId);
  const executeDisbursementMutation = useExecuteCampaignDisbursementMutation(campaignId);
  const campaign = campaignQuery.data ? adaptCampaignDetail(campaignQuery.data, progressQuery.data) : null;

  const searchedBeneficiaries = (campaignBeneficiariesQuery.data ?? []).map((item) => ({
    id: `CB-${item.id}`,
    campaignBeneficiaryId: item.id,
    beneficiaryId: item.beneficiaryId,
    name: item.beneficiary?.name ?? 'Beneficiary',
    msisdn: item.beneficiary?.msisdn ?? '—',
    location: 'Not available',
    amount: Number(item.disbursementAmount ?? 0),
    status: formatDisbursementStatus(item.disbursementStatus),
    lastActivity: '—',
  }));
  const listedBeneficiaries = (campaignBeneficiariesListQuery.data?.data ?? []).map((item) => ({
    id: `CB-${item.id}`,
    campaignBeneficiaryId: item.id,
    beneficiaryId: item.beneficiaryId,
    name: item.beneficiary?.name ?? 'Beneficiary',
    msisdn: item.beneficiary?.msisdn ?? '—',
    location: '—',
    amount: Number(item.disbursementAmount ?? 0),
    status: formatDisbursementStatus(item.disbursementStatus),
    lastActivity: '—',
  }));
  const beneficiaries = beneficiarySearch.length > 0 ? searchedBeneficiaries : listedBeneficiaries;
  const beneficiaryBudget = listedBeneficiaries.reduce((sum, beneficiary) => sum + beneficiary.amount, 0);
  const fallbackBudget = Math.max(
    beneficiaryBudget,
    searchedBeneficiaries.reduce((sum, beneficiary) => sum + beneficiary.amount, 0)
  );
  const totalBudget = campaign ? Math.max(campaign.totalBudget, fallbackBudget) : fallbackBudget;
  const totalBeneficiaries = campaign ? campaign.totalBeneficiaries : beneficiaries.length;

  const transactions = (campaignTransactionsQuery.data?.data ?? []).map((item) => {
      const transaction = adaptTransaction(item);

      return {
        id: transaction.id,
        beneficiary: transaction.beneficiary,
        amount: transaction.amount,
        status: transaction.status,
        errorMessage: transaction.errorMessage,
        executedAtRaw: item.executedAt ?? item.createdAt,
        executionDate: transaction.executedAt ?? transaction.createdAt ?? '—',
      };
    });

  const successfulTransactions = transactions.filter((item) => item.status === 'Successful');
  const failedTransactions = transactions.filter((item) => ['Failed', 'Reversed'].includes(item.status));
  const processingTransactions = transactions.filter((item) => ['Pending', 'Processing'].includes(item.status));
  const amountDisbursed =
    successfulTransactions.length > 0
      ? successfulTransactions.reduce((sum, item) => sum + item.amount, 0)
      : campaign?.amountDisbursed ?? 0;
  const pendingPayments =
    transactions.length > 0
      ? Math.max(totalBeneficiaries - successfulTransactions.length - failedTransactions.length, processingTransactions.length)
      : campaign?.pendingPayments ?? 0;
  const failedPayments = transactions.length > 0 ? failedTransactions.length : campaign?.failedPayments ?? 0;
  const successRate =
    transactions.length > 0 && totalBeneficiaries > 0
      ? Math.round((successfulTransactions.length / totalBeneficiaries) * 100)
      : campaign?.successRate ?? 0;
  const effectiveTotalBudget = Math.max(totalBudget, amountDisbursed);
  const completionPercentage = effectiveTotalBudget > 0 ? Math.min((amountDisbursed / effectiveTotalBudget) * 100, 100) : 0;
  const disbursementProgress = transactions.length > 0
    ? buildDisbursementProgressFromTransactions(successfulTransactions)
    : campaignQuery.data
      ? adaptCampaignProgressSeries(campaignQuery.data)
      : [];

  // Savings data
  const savingsData: Array<{ id: string; beneficiary: string; savedAmount: number; lastDeposit: string }> = [];

  const savingsParticipation = campaign ? [
    { category: 'Participating', count: Math.round(campaign.totalBeneficiaries * (successRate / 100)) },
    { category: 'Not Participating', count: Math.max(campaign.totalBeneficiaries - Math.round(campaign.totalBeneficiaries * (successRate / 100)), 0) },
  ] : [];
  const errorMessage = campaignQuery.error instanceof Error ? campaignQuery.error.message : progressQuery.error instanceof Error ? progressQuery.error.message : null;
  const hasPaymentChannel = Boolean(campaignQuery.data?.paymentChannel?.id);
  const canExecuteDisbursement = campaign ? !['Closed', 'Suspended'].includes(campaign.status) && hasPaymentChannel : false;

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant?: "default" | "secondary" | "outline" | "success" | "warning" | "destructive" }> = {
      Active: { variant: "success" },
      Paid: { variant: "success" },
      Confirmed: { variant: "success" },
      Pending: { variant: "warning" },
      Failed: { variant: "destructive" },
      Closed: { variant: "secondary" }
    };
    return <Badge {...(variants[status] || {})}>{status}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(2)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleExecuteDisbursement = async () => {
    try {
      const result = await executeDisbursementMutation.mutateAsync();
      const transactionsCount = typeof result?.transactionsCount === 'number' ? result.transactionsCount : null;

      toast.success(
        transactionsCount !== null
          ? `Disbursement batch ${result.code ?? result.batchId ?? ''} started for ${transactionsCount} transaction${transactionsCount === 1 ? '' : 's'}.`.trim()
          : 'Disbursement execution started successfully.'
      );
      setShowExecuteDialog(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Disbursement execution could not be started.');
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/backoffice/campaigns')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Campaigns
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 style={{ fontSize: "var(--text-32)", fontWeight: "var(--font-weight-semi-bold)" }}>
                {campaign?.name ?? (campaignQuery.isPending ? 'Loading campaign...' : 'Campaign unavailable')}
              </h1>
              {campaign ? getStatusBadge(campaign.status) : null}
            </div>
            <p style={{ fontSize: "var(--text-14)", color: "var(--muted-foreground)" }}>
              {campaign ? `${campaign.id} • ${campaign.program} • ${campaign.region}` : 'Loading campaign details'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate(`/backoffice/campaigns/${campaignId}/edit`)}>
              <SquarePen className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button onClick={() => setShowExecuteDialog(true)} disabled={!canExecuteDisbursement || executeDisbursementMutation.isPending}>
              <Play className="w-4 h-4 mr-2" />
              {executeDisbursementMutation.isPending ? 'Executing...' : 'Execute Disbursement'}
            </Button>
            <Button variant="outline" onClick={() => setShowSuspendDialog(true)}>
              <Pause className="w-4 h-4 mr-2" />
              Suspend
            </Button>
            <Button variant="outline" onClick={() => setShowCloseDialog(true)}>
              <XCircle className="w-4 h-4 mr-2" />
              Close
            </Button>
          </div>
        </div>
      </div>

      {errorMessage ? (
        <Alert className="mb-6" variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      {campaign && !hasPaymentChannel ? (
        <Alert className="mb-6" variant="destructive">
          <AlertDescription>
            This campaign cannot be executed until a payment channel is configured. Edit the campaign and select a payment channel first.
          </AlertDescription>
        </Alert>
      ) : null}

      {/* Tabs */}
      {campaign ? <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="beneficiaries">Beneficiaries</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          {campaign.enabledSavings && <TabsTrigger value="savings">Savings</TabsTrigger>}
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card>
              <CardContent className="p-6">
                <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)", marginBottom: "8px" }}>
                  Total Beneficiaries
                </p>
                <p style={{ fontSize: "var(--text-24)", fontWeight: "var(--font-weight-semi-bold)" }}>
                  {totalBeneficiaries.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)", marginBottom: "8px" }}>
                  Amount Disbursed
                </p>
                <p style={{ fontSize: "var(--text-24)", fontWeight: "var(--font-weight-semi-bold)" }}>
                  {formatCurrency(amountDisbursed)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)", marginBottom: "8px" }}>
                  Success Rate
                </p>
                <p style={{ fontSize: "var(--text-24)", fontWeight: "var(--font-weight-semi-bold)", color: "var(--success)" }}>
                  {successRate}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)", marginBottom: "8px" }}>
                  Pending Payments
                </p>
                <p style={{ fontSize: "var(--text-24)", fontWeight: "var(--font-weight-semi-bold)", color: "var(--warning)" }}>
                  {pendingPayments}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)", marginBottom: "8px" }}>
                  Failed Payments
                </p>
                <p style={{ fontSize: "var(--text-24)", fontWeight: "var(--font-weight-semi-bold)", color: "var(--error)" }}>
                  {failedPayments}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Campaign Progress */}
          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: "var(--text-16)" }}>Campaign Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: "var(--text-13)", color: "var(--muted-foreground)" }}>
                    {formatCurrency(amountDisbursed)} of {formatCurrency(effectiveTotalBudget)}
                  </span>
                  <span style={{ fontSize: "var(--text-13)", fontWeight: "var(--font-weight-medium)" }}>
                    {completionPercentage.toFixed(1)}%
                  </span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Disbursement Progress Chart */}
          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: "var(--text-16)" }}>Disbursement Progress Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={disbursementProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" style={{ fontSize: "var(--text-12)" }} />
                  <YAxis style={{ fontSize: "var(--text-12)" }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    name="Disbursed ($)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* BENEFICIARIES TAB */}
        <TabsContent value="beneficiaries" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle style={{ fontSize: "var(--text-16)" }}>Beneficiaries</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: "var(--muted-foreground)" }} />
                  <Input
                    placeholder="Search beneficiaries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>MSISDN</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {beneficiarySearch.length > 0 && campaignBeneficiariesQuery.isPending ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <p style={{ fontSize: "var(--text-14)", color: "var(--muted-foreground)" }}>
                          Loading beneficiaries...
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : beneficiarySearch.length > 0 && campaignBeneficiariesQuery.error ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <p style={{ fontSize: "var(--text-14)", color: "var(--error)" }}>
                          {campaignBeneficiariesQuery.error instanceof Error ? campaignBeneficiariesQuery.error.message : 'Campaign beneficiaries could not be loaded.'}
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : beneficiarySearch.length === 0 && campaignBeneficiariesListQuery.isPending ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <p style={{ fontSize: "var(--text-14)", color: "var(--muted-foreground)" }}>
                          Loading beneficiaries...
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : beneficiarySearch.length === 0 && campaignBeneficiariesListQuery.error ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <p style={{ fontSize: "var(--text-14)", color: "var(--error)" }}>
                          {campaignBeneficiariesListQuery.error instanceof Error ? campaignBeneficiariesListQuery.error.message : 'Campaign beneficiaries could not be loaded.'}
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : beneficiaries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <p style={{ fontSize: "var(--text-14)", color: "var(--muted-foreground)" }}>
                          {beneficiarySearch.length > 0 ? 'No beneficiaries match your search.' : 'No beneficiaries were found for this campaign.'}
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : beneficiaries.map((beneficiary) => (
                    <TableRow key={beneficiary.id}>
                      <TableCell>
                        <div>
                          <p style={{ fontSize: "var(--text-13)", fontWeight: "var(--font-weight-medium)" }}>
                            {beneficiary.name}
                          </p>
                          <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)" }}>
                            {beneficiary.id}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell style={{ fontSize: "var(--text-13)", fontFamily: "var(--font-mono)" }}>
                        {beneficiary.msisdn}
                      </TableCell>
                      <TableCell style={{ fontSize: "var(--text-13)", color: "var(--muted-foreground)" }}>
                        {beneficiary.location}
                      </TableCell>
                      <TableCell style={{ fontSize: "var(--text-13)", fontWeight: "var(--font-weight-medium)" }}>
                        {typeof beneficiary.amount === 'number' ? `$${beneficiary.amount.toLocaleString()}` : '—'}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(beneficiary.status)}
                      </TableCell>
                      <TableCell style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)" }}>
                        {beneficiary.lastActivity}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => navigate(`/backoffice/beneficiaries/profile/${beneficiary.beneficiaryId}`)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Flag className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TRANSACTIONS TAB */}
        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: "var(--text-16)" }}>Transactions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Beneficiary</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Error Message</TableHead>
                    <TableHead>Execution Date</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaignTransactionsQuery.isPending ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <p style={{ fontSize: "var(--text-14)", color: "var(--muted-foreground)" }}>
                          Loading transactions...
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : campaignTransactionsQuery.error ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <p style={{ fontSize: "var(--text-14)", color: "var(--error)" }}>
                          {campaignTransactionsQuery.error instanceof Error ? campaignTransactionsQuery.error.message : 'Campaign transactions could not be loaded.'}
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <p style={{ fontSize: "var(--text-14)", color: "var(--muted-foreground)" }}>
                          No transactions have been created for this campaign yet.
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : transactions.map((txn) => (
                    <TableRow key={txn.id}>
                      <TableCell style={{ fontSize: "var(--text-12)", fontFamily: "var(--font-mono)" }}>
                        {txn.id}
                      </TableCell>
                      <TableCell style={{ fontSize: "var(--text-13)" }}>
                        {txn.beneficiary}
                      </TableCell>
                      <TableCell style={{ fontSize: "var(--text-13)", fontWeight: "var(--font-weight-medium)" }}>
                        ${txn.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(txn.status)}
                      </TableCell>
                      <TableCell>
                        {txn.errorMessage ? (
                          <span style={{ fontSize: "var(--text-12)", color: "var(--error)" }}>
                            {txn.errorMessage}
                          </span>
                        ) : (
                          <span style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)" }}>—</span>
                        )}
                      </TableCell>
                      <TableCell style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)" }}>
                        {txn.executionDate}
                      </TableCell>
                      <TableCell>
                        {txn.status === 'Failed' && (
                          <Button variant="ghost" size="sm">
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SAVINGS TAB */}
        {campaign.enabledSavings && (
          <TabsContent value="savings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)", marginBottom: "8px" }}>
                      Total Savings Amount
                    </p>
                    <p style={{ fontSize: "var(--text-24)", fontWeight: "var(--font-weight-semi-bold)" }}>
                     {formatCurrency(amountDisbursed)}
                    </p>
                  </CardContent>
                </Card>

              <Card>
                <CardContent className="p-6">
                  <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)", marginBottom: "8px" }}>
                    Number of Participants
                  </p>
                  <p style={{ fontSize: "var(--text-24)", fontWeight: "var(--font-weight-semi-bold)" }}>
                    {savingsParticipation[0]?.count.toLocaleString() ?? '0'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)", marginBottom: "8px" }}>
                    Avg Savings per Beneficiary
                  </p>
                  <p style={{ fontSize: "var(--text-24)", fontWeight: "var(--font-weight-semi-bold)" }}>
                    {formatCurrency(savingsParticipation[0]?.count ? amountDisbursed / savingsParticipation[0].count : 0)}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle style={{ fontSize: "var(--text-16)" }}>Savings Participation</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={savingsParticipation}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="category" style={{ fontSize: "var(--text-12)" }} />
                    <YAxis style={{ fontSize: "var(--text-12)" }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="var(--primary)" name="Beneficiaries" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle style={{ fontSize: "var(--text-16)" }}>Savings Details</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Beneficiary</TableHead>
                      <TableHead>Saved Amount</TableHead>
                      <TableHead>Last Deposit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {savingsData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-12">
                          <p style={{ fontSize: "var(--text-14)", color: "var(--muted-foreground)" }}>
                            Savings detail rows are not wired yet for this screen.
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : savingsData.map((saving) => (
                      <TableRow key={saving.id}>
                        <TableCell style={{ fontSize: "var(--text-13)" }}>
                          {saving.beneficiary}
                        </TableCell>
                        <TableCell style={{ fontSize: "var(--text-13)", fontWeight: "var(--font-weight-medium)" }}>
                          ${saving.savedAmount.toLocaleString()}
                        </TableCell>
                        <TableCell style={{ fontSize: "var(--text-13)", color: "var(--muted-foreground)" }}>
                          {formatDate(saving.lastDeposit)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* REPORTS TAB */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: "var(--text-16)" }}>Export Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-[--radius]" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5" style={{ color: "var(--muted-foreground)" }} />
                  <div>
                    <p style={{ fontSize: "var(--text-14)", fontWeight: "var(--font-weight-medium)" }}>
                      Export Beneficiaries
                    </p>
                    <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)" }}>
                      Download complete beneficiary list with payment status
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    CSV
                  </Button>
                  <Button variant="outline" size="sm">
                    Excel
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-[--radius]" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5" style={{ color: "var(--muted-foreground)" }} />
                  <div>
                    <p style={{ fontSize: "var(--text-14)", fontWeight: "var(--font-weight-medium)" }}>
                      Export Transactions
                    </p>
                    <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)" }}>
                      Download all transaction records with details
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    CSV
                  </Button>
                  <Button variant="outline" size="sm">
                    Excel
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-[--radius]" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5" style={{ color: "var(--muted-foreground)" }} />
                  <div>
                    <p style={{ fontSize: "var(--text-14)", fontWeight: "var(--font-weight-medium)" }}>
                      Export Campaign Summary
                    </p>
                    <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)" }}>
                      Download comprehensive campaign performance report
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    CSV
                  </Button>
                  <Button variant="outline" size="sm">
                    Excel
                  </Button>
                </div>
              </div>

              {campaign.enabledSavings && (
                <div className="flex items-center justify-between p-4 border rounded-[--radius]" style={{ borderColor: "var(--border)" }}>
                  <div className="flex items-center gap-3">
                    <PiggyBank className="w-5 h-5" style={{ color: "var(--muted-foreground)" }} />
                    <div>
                      <p style={{ fontSize: "var(--text-14)", fontWeight: "var(--font-weight-medium)" }}>
                        Export Savings Data
                      </p>
                      <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)" }}>
                        Download savings participation and amounts
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      CSV
                    </Button>
                    <Button variant="outline" size="sm">
                      Excel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs> : null}

      {/* Suspend Campaign Dialog */}
      <Dialog open={showExecuteDialog} onOpenChange={setShowExecuteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle style={{ fontSize: "var(--text-20)" }}>
              Execute Disbursement
            </DialogTitle>
            <DialogDescription style={{ fontSize: "var(--text-14)", color: "var(--muted-foreground)" }}>
              This will create and process campaign transactions for the current beneficiaries.
            </DialogDescription>
          </DialogHeader>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription style={{ fontSize: "var(--text-13)" }}>
              {campaign ? `${campaign.pendingPayments} pending payment${campaign.pendingPayments === 1 ? '' : 's'} will be considered for execution.` : 'Pending campaign payments will be considered for execution.'}
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExecuteDialog(false)} disabled={executeDisbursementMutation.isPending}>
              Cancel
            </Button>
            <Button onClick={handleExecuteDisbursement} disabled={!canExecuteDisbursement || executeDisbursementMutation.isPending}>
              {executeDisbursementMutation.isPending ? 'Executing...' : 'Execute Disbursement'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suspend Campaign Dialog */}
      <Dialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle style={{ fontSize: "var(--text-20)" }}>
              Suspend Campaign
            </DialogTitle>
            <DialogDescription style={{ fontSize: "var(--text-14)", color: "var(--muted-foreground)" }}>
              Are you sure you want to suspend this campaign? All pending disbursements will be paused.
            </DialogDescription>
          </DialogHeader>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription style={{ fontSize: "var(--text-13)" }}>
              This action will temporarily halt all campaign activities
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSuspendDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => setShowSuspendDialog(false)}>
              Suspend Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Close Campaign Dialog */}
      <Dialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle style={{ fontSize: "var(--text-20)" }}>
              Close Campaign
            </DialogTitle>
            <DialogDescription style={{ fontSize: "var(--text-14)", color: "var(--muted-foreground)" }}>
              Are you sure you want to close this campaign? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription style={{ fontSize: "var(--text-13)" }}>
              Once closed, no further disbursements can be made
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCloseDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => setShowCloseDialog(false)}>
              Close Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function formatDisbursementStatus(status: string) {
  switch (status) {
    case 'confirmed':
      return 'Confirmed';
    case 'not_confirmed':
      return 'Failed';
    case 'not_found':
      return 'Failed';
    case 'pending':
      return 'Pending';
    default:
      return status;
  }
}

function buildDisbursementProgressFromTransactions(
  transactions: Array<{ amount: number; executedAtRaw: string | null }>
) {
  const totals = new Map<string, { label: string; amount: number }>()

  transactions.forEach((transaction) => {
    if (!transaction.executedAtRaw) return
    const date = new Date(transaction.executedAtRaw)
    if (Number.isNaN(date.getTime())) return
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const label = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date)
    const current = totals.get(key)
    totals.set(key, {
      label,
      amount: (current?.amount ?? 0) + transaction.amount,
    })
  })

  let runningTotal = 0

  return Array.from(totals.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([, value]) => {
      runningTotal += value.amount
      return { month: value.label, amount: runningTotal }
    })
}
