import { useState } from "react";
import { useNavigate, useParams } from "@/lib/router";
import { formatCompactMetical, formatMetical } from "@/lib/format/currency";
import { useCampaignQuery } from "@/features/campaigns/hooks/use-campaign-queries";
import { useSavingsProgramQuery } from "@/features/savings-programs/hooks/use-savings-program-queries";
import {
  adaptSavingsProgramDetail,
  buildParticipationData,
  buildSavingsGrowth,
} from "@/features/savings-programs/adapters/savings-programs";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Progress } from "../ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
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
  DollarSign,
  Users,
  Target,
  TrendingUp,
  Search,
  AlertTriangle,
  Pause,
  XCircle,
  Download,
  FileText
} from "lucide-react";
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
  ResponsiveContainer,
  Legend
} from "recharts";
import { DataTablePagination, useTablePagination } from "../ui/table-pagination";

export function SavingsCampaignDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const savingsProgramId = Number(id);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const savingsProgramQuery = useSavingsProgramQuery(savingsProgramId);
  const campaignQuery = useCampaignQuery(savingsProgramQuery.data?.campaignId ?? Number.NaN);
  const campaign = savingsProgramQuery.data ? adaptSavingsProgramDetail(savingsProgramQuery.data, campaignQuery.data) : null;
  const savingsGrowth = buildSavingsGrowth(campaign?.totalSaved ?? 0);
  const savingsByRegion: Array<{ region: string; amount: number; color?: string }> = [];
  const participationData = buildParticipationData(campaign?.participants ?? 0, campaign?.totalBeneficiaries ?? 0);
  const participants: Array<{ id: string; name: string; totalSaved: number; lastContribution: string; contributionAmount: number; goalProgress: number; personalGoal: number; status: string }> = [];
  const transactions: Array<{ id: string; beneficiary: string; amount: number; date: string; status: string; type: string }> = [];
  const participantsPagination = useTablePagination(participants, undefined, [activeTab, searchQuery]);
  const transactionsPagination = useTablePagination(transactions, undefined, [activeTab]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant?: "default" | "secondary" | "outline" | "success" | "warning" | "destructive" }> = {
      Active: { variant: "success" },
      Inactive: { variant: "secondary" },
      Confirmed: { variant: "success" },
      Pending: { variant: "warning" },
      Failed: { variant: "destructive" }
    };
    return <Badge {...(variants[status] || {})}>{status}</Badge>;
  };

  const formatCurrency = (amount: number) => formatCompactMetical(amount);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const goalProgress = campaign && campaign.savingsGoal > 0 ? (campaign.totalSaved / campaign.savingsGoal) * 100 : 0;
  const participationRate = campaign && campaign.totalBeneficiaries > 0 ? (campaign.participants / campaign.totalBeneficiaries) * 100 : 0;
  const errorMessage = savingsProgramQuery.error instanceof Error ? savingsProgramQuery.error.message : campaignQuery.error instanceof Error ? campaignQuery.error.message : null;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/backoffice/savings')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Savings Campaigns
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 style={{ fontSize: "var(--text-32)", fontWeight: "var(--font-weight-semi-bold)" }}>
                {campaign?.name ?? (savingsProgramQuery.isPending ? 'Loading savings campaign...' : 'Savings campaign unavailable')}
              </h1>
              {campaign ? getStatusBadge(campaign.status) : null}
            </div>
            <p style={{ fontSize: "var(--text-14)", color: "var(--muted-foreground)" }}>
              {campaign ? `${campaign.id} • Linked to ${campaign.linkedCampaign} (${campaign.linkedCampaignId})` : 'Loading savings program details'}
            </p>
          </div>
          <div className="flex items-center gap-2">
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
        <Card className="mb-6">
          <CardContent className="p-4">
            <p style={{ fontSize: "var(--text-14)", color: "var(--error)" }}>{errorMessage}</p>
          </CardContent>
        </Card>
      ) : null}

      {/* Tabs */}
      {campaign ? <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="history">Savings History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)" }}>
                    Total Saved
                  </p>
                  <DollarSign className="w-5 h-5" style={{ color: "var(--success)" }} />
                </div>
                <p style={{ fontSize: "var(--text-24)", fontWeight: "var(--font-weight-semi-bold)" }}>
                  {formatCurrency(campaign.totalSaved)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)" }}>
                    Participants
                  </p>
                  <Users className="w-5 h-5" style={{ color: "var(--primary)" }} />
                </div>
                <p style={{ fontSize: "var(--text-24)", fontWeight: "var(--font-weight-semi-bold)" }}>
                  {campaign.participants.toLocaleString()}
                </p>
                <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)", marginTop: "4px" }}>
                  of {campaign.totalBeneficiaries.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)" }}>
                    Goal Progress
                  </p>
                  <Target className="w-5 h-5" style={{ color: "var(--primary)" }} />
                </div>
                <p style={{ fontSize: "var(--text-24)", fontWeight: "var(--font-weight-semi-bold)" }}>
                  {goalProgress.toFixed(1)}%
                </p>
                <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)", marginTop: "4px" }}>
                  Goal: {formatCurrency(campaign.savingsGoal)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)" }}>
                    Avg per Beneficiary
                  </p>
                  <TrendingUp className="w-5 h-5" style={{ color: "var(--primary)" }} />
                </div>
                <p style={{ fontSize: "var(--text-24)", fontWeight: "var(--font-weight-semi-bold)" }}>
                  {formatMetical(campaign.avgSavingsPerBeneficiary)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Goal Progress */}
          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: "var(--text-16)" }}>Savings Goal Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: "var(--text-13)", color: "var(--muted-foreground)" }}>
                    {formatCurrency(campaign.totalSaved)} of {formatCurrency(campaign.savingsGoal)}
                  </span>
                  <span style={{ fontSize: "var(--text-13)", fontWeight: "var(--font-weight-medium)" }}>
                    {goalProgress.toFixed(1)}%
                  </span>
                </div>
                <Progress value={goalProgress} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Campaign Details */}
          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: "var(--text-16)" }}>Campaign Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)", marginBottom: "4px" }}>
                    Start Date
                  </p>
                  <p style={{ fontSize: "var(--text-14)", fontWeight: "var(--font-weight-medium)" }}>
                    {formatDate(campaign.startDate)}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)", marginBottom: "4px" }}>
                    End Date
                  </p>
                  <p style={{ fontSize: "var(--text-14)", fontWeight: "var(--font-weight-medium)" }}>
                    {formatDate(campaign.endDate)}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)", marginBottom: "4px" }}>
                    Minimum Contribution
                  </p>
                  <p style={{ fontSize: "var(--text-14)", fontWeight: "var(--font-weight-medium)" }}>
                    {formatMetical(campaign.minimumContribution)}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)", marginBottom: "4px" }}>
                    Matching Bonus
                  </p>
                  <p style={{ fontSize: "var(--text-14)", fontWeight: "var(--font-weight-medium)" }}>
                    {campaign.matchingBonus}%
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)", marginBottom: "4px" }}>
                    Participation Rate
                  </p>
                  <p style={{ fontSize: "var(--text-14)", fontWeight: "var(--font-weight-medium)" }}>
                    {participationRate.toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PARTICIPANTS TAB */}
        <TabsContent value="participants" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle style={{ fontSize: "var(--text-16)" }}>Savings Participants</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: "var(--muted-foreground)" }} />
                  <Input
                    placeholder="Search participants..."
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
                    <TableHead>Beneficiary</TableHead>
                    <TableHead>Total Saved</TableHead>
                    <TableHead>Last Contribution</TableHead>
                    <TableHead>Savings Goal Progress</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {participants.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12">
                        <p style={{ fontSize: "var(--text-14)", color: "var(--muted-foreground)" }}>
                          Savings participant rows are not wired yet for this screen.
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : participantsPagination.paginatedItems.map((participant) => (
                    <TableRow key={participant.id}>
                      <TableCell>
                        <div>
                          <p style={{ fontSize: "var(--text-13)", fontWeight: "var(--font-weight-medium)" }}>
                            {participant.name}
                          </p>
                          <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)" }}>
                            {participant.id}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell style={{ fontSize: "var(--text-13)", fontWeight: "var(--font-weight-medium)" }}>
                        {formatMetical(participant.totalSaved)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p style={{ fontSize: "var(--text-13)" }}>
                            {formatDate(participant.lastContribution)}
                          </p>
                          <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)" }}>
                            {formatMetical(participant.contributionAmount)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)" }}>
                              {formatMetical(participant.personalGoal)}
                            </span>
                            <span style={{ fontSize: "var(--text-12)", fontWeight: "var(--font-weight-medium)" }}>
                              {participant.goalProgress}%
                            </span>
                          </div>
                          <Progress value={participant.goalProgress} className="h-1.5" />
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(participant.status)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <DataTablePagination
                page={participantsPagination.page}
                pageSize={participantsPagination.pageSize}
                totalItems={participantsPagination.totalItems}
                totalPages={participantsPagination.totalPages}
                onPageChange={participantsPagination.setPage}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* SAVINGS HISTORY TAB */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: "var(--text-16)" }}>Savings Transactions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Beneficiary</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12">
                        <p style={{ fontSize: "var(--text-14)", color: "var(--muted-foreground)" }}>
                          Savings transaction rows are not wired yet for this screen.
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : transactionsPagination.paginatedItems.map((txn) => (
                    <TableRow key={txn.id}>
                      <TableCell style={{ fontSize: "var(--text-12)", fontFamily: "var(--font-mono)" }}>
                        {txn.id}
                      </TableCell>
                      <TableCell style={{ fontSize: "var(--text-13)" }}>
                        {txn.beneficiary}
                      </TableCell>
                      <TableCell style={{ fontSize: "var(--text-13)", fontWeight: "var(--font-weight-medium)" }}>
                        {formatMetical(txn.amount)}
                      </TableCell>
                      <TableCell style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)" }}>
                        {txn.date}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(txn.status)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <DataTablePagination
                page={transactionsPagination.page}
                pageSize={transactionsPagination.pageSize}
                totalItems={transactionsPagination.totalItems}
                totalPages={transactionsPagination.totalPages}
                onPageChange={transactionsPagination.setPage}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ANALYTICS TAB */}
        <TabsContent value="analytics" className="space-y-6">
          {/* Savings Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: "var(--text-16)" }}>Savings Growth Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={savingsGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" style={{ fontSize: "var(--text-12)" }} />
                  <YAxis style={{ fontSize: "var(--text-12)" }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    name="Total Saved (MZN)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Savings by Region */}
            <Card>
              <CardHeader>
                <CardTitle style={{ fontSize: "var(--text-16)" }}>Savings by Region</CardTitle>
              </CardHeader>
              <CardContent>
                {savingsByRegion.length === 0 ? (
                  <div className="flex h-[300px] items-center justify-center">
                    <p style={{ fontSize: "var(--text-14)", color: "var(--muted-foreground)" }}>
                      Region analytics are not wired yet for this screen.
                    </p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={savingsByRegion}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="region" style={{ fontSize: "var(--text-12)" }} />
                      <YAxis style={{ fontSize: "var(--text-12)" }} />
                      <Tooltip />
                      <Bar dataKey="amount" fill="var(--primary)" name="Amount (MZN)" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Participation Rate */}
            <Card>
              <CardHeader>
                <CardTitle style={{ fontSize: "var(--text-16)" }}>Participation Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={participationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.category}: ${entry.count.toLocaleString()}`}
                      outerRadius={80}
                      fill="var(--primary)"
                      dataKey="count"
                    >
                      {participationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs> : null}

      {/* Suspend Dialog */}
      <Dialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle style={{ fontSize: "var(--text-20)" }}>
              Suspend Savings Campaign
            </DialogTitle>
            <DialogDescription style={{ fontSize: "var(--text-14)", color: "var(--muted-foreground)" }}>
              Are you sure you want to suspend this savings campaign? All savings activities will be paused.
            </DialogDescription>
          </DialogHeader>
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

      {/* Close Dialog */}
      <Dialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle style={{ fontSize: "var(--text-20)" }}>
              Close Savings Campaign
            </DialogTitle>
            <DialogDescription style={{ fontSize: "var(--text-14)", color: "var(--muted-foreground)" }}>
              Are you sure you want to close this savings campaign? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
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
