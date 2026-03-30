import { useState } from "react";
import { useNavigate } from "@/lib/router";
import { useCampaignDetailsQueries } from "@/features/campaigns/hooks/use-campaign-queries";
import { useSavingsProgramsQuery } from "@/features/savings-programs/hooks/use-savings-program-queries";
import { adaptSavingsProgramListItem } from "@/features/savings-programs/adapters/savings-programs";
import type { SavingsProgramListFilters, SavingsProgramStatus } from "@/features/savings-programs/types/savings-program";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Progress } from "../ui/progress";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Plus,
  Search,
  DollarSign,
  TrendingUp,
  Users,
  Target,
  MoreVertical,
  Eye,
  Edit,
  Pause,
  XCircle,
  Download
} from "lucide-react";
import { DataTablePagination, useTablePagination } from "../ui/table-pagination";

export function BackofficeSavings() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [campaignFilter, setCampaignFilter] = useState("all");
  const filters: SavingsProgramListFilters = {
    search: searchQuery.trim() || undefined,
    status: mapSavingsStatusFilter(statusFilter),
    campaignId: campaignFilter === 'all' ? undefined : Number(campaignFilter),
  };
  const savingsProgramsQuery = useSavingsProgramsQuery(filters);
  const campaignQueries = useCampaignDetailsQueries((savingsProgramsQuery.data ?? []).map((program) => program.campaignId));
  const campaignMap = new Map(
    campaignQueries
      .map((query) => query.data)
      .filter((detail): detail is NonNullable<typeof detail> => Boolean(detail))
      .map((detail) => [detail.id, detail])
  );
  const savingsCampaigns = (savingsProgramsQuery.data ?? []).map((program) =>
    adaptSavingsProgramListItem(program, campaignMap.get(program.campaignId))
  );

  // Calculate stats
  const totalSavings = savingsCampaigns
    .filter(c => c.status === 'Active')
    .reduce((sum, c) => sum + c.totalSaved, 0);
  
  const totalParticipants = savingsCampaigns
    .filter(c => c.status === 'Active')
    .reduce((sum, c) => sum + c.participants, 0);
  
  const activeCampaigns = savingsCampaigns.filter(c => c.status === 'Active').length;

  const avgGoalProgress = savingsCampaigns
    .filter(c => c.status === 'Active')
    .reduce((sum, c) => sum + (c.savingsGoal > 0 ? (c.totalSaved / c.savingsGoal) * 100 : 0), 0) / (activeCampaigns || 1);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant?: "default" | "secondary" | "outline" | "success" | "warning" | "destructive" }> = {
      Active: { variant: "success" },
      Closed: { variant: "secondary" },
      Suspended: { variant: "warning" },
      Draft: { variant: "outline" }
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

  const getGoalProgress = (saved: number, goal: number) => {
    return Math.min((saved / goal) * 100, 100);
  };

  const filteredCampaigns = savingsCampaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.linkedCampaign.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
    const matchesCampaign = campaignFilter === "all" || String(campaign.linkedCampaignNumericId) === campaignFilter;
    
    return matchesSearch && matchesStatus && matchesCampaign;
  });
  const savingsPagination = useTablePagination(filteredCampaigns, undefined, [searchQuery, statusFilter, campaignFilter]);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 style={{ fontSize: "var(--text-32)", fontWeight: "var(--font-weight-semi-bold)" }}>
            Savings Campaigns
          </h1>
          <p style={{ fontSize: "var(--text-14)", color: "var(--muted-foreground)", marginTop: "8px" }}>
            Manage savings programs linked to social transfer campaigns
          </p>
        </div>
        <Button onClick={() => navigate('/backoffice/savings/create')}>
          <Plus className="w-4 h-4 mr-2" />
          Create Savings Campaign
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)" }}>
                Total Savings
              </p>
              <DollarSign className="w-5 h-5" style={{ color: "var(--success)" }} />
            </div>
            <p style={{ fontSize: "var(--text-24)", fontWeight: "var(--font-weight-semi-bold)" }}>
              {formatCurrency(totalSavings)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)" }}>
                Active Campaigns
              </p>
              <TrendingUp className="w-5 h-5" style={{ color: "var(--primary)" }} />
            </div>
            <p style={{ fontSize: "var(--text-24)", fontWeight: "var(--font-weight-semi-bold)" }}>
              {activeCampaigns}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)" }}>
                Total Participants
              </p>
              <Users className="w-5 h-5" style={{ color: "var(--primary)" }} />
            </div>
            <p style={{ fontSize: "var(--text-24)", fontWeight: "var(--font-weight-semi-bold)" }}>
              {totalParticipants.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)" }}>
                Avg Goal Progress
              </p>
              <Target className="w-5 h-5" style={{ color: "var(--primary)" }} />
            </div>
            <p style={{ fontSize: "var(--text-24)", fontWeight: "var(--font-weight-semi-bold)" }}>
              {avgGoalProgress.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: "var(--muted-foreground)" }} />
              <Input
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
              </SelectContent>
            </Select>

            <Select value={campaignFilter} onValueChange={setCampaignFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Linked Campaign" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Campaigns</SelectItem>
                {(savingsProgramsQuery.data ?? []).map((program) => (
                  <SelectItem key={`${program.id}-${program.campaignId}`} value={String(program.campaignId)}>{program.campaign?.name ?? `Campaign ${program.campaignId}`}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {savingsProgramsQuery.error ? (
            <p style={{ fontSize: "var(--text-13)", color: "var(--error)", marginTop: "12px" }}>
              {savingsProgramsQuery.error instanceof Error ? savingsProgramsQuery.error.message : 'Savings programs could not be loaded.'}
            </p>
          ) : null}
        </CardContent>
      </Card>

      {/* Savings Campaigns Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign Name</TableHead>
                <TableHead>Linked Campaign</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Total Saved</TableHead>
                <TableHead>Savings Goal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCampaigns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <p style={{ fontSize: "var(--text-14)", color: "var(--muted-foreground)" }}>
                      {savingsProgramsQuery.isPending ? 'Loading savings campaigns...' : 'No savings campaigns found'}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                savingsPagination.paginatedItems.map((campaign) => (
                  <TableRow
                    key={campaign.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/backoffice/savings/${campaign.numericId}`)}
                  >
                    <TableCell>
                      <div>
                        <p style={{ fontSize: "var(--text-13)", fontWeight: "var(--font-weight-medium)" }}>
                          {campaign.name}
                        </p>
                          <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)" }}>
                            SAV-{String(campaign.numericId).padStart(3, '0')}
                          </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p style={{ fontSize: "var(--text-13)" }}>
                          {campaign.linkedCampaign}
                        </p>
                        <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)" }}>
                          {campaign.linkedCampaignId}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p style={{ fontSize: "var(--text-13)", fontWeight: "var(--font-weight-medium)" }}>
                        {campaign.participants.toLocaleString()}
                      </p>
                      <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)" }}>
                        of {campaign.totalBeneficiaries.toLocaleString()}
                      </p>
                    </TableCell>
                    <TableCell style={{ fontSize: "var(--text-13)", fontWeight: "var(--font-weight-medium)" }}>
                      {formatCurrency(campaign.totalSaved)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)" }}>
                            {formatCurrency(campaign.savingsGoal)}
                          </span>
                          <span style={{ fontSize: "var(--text-12)", fontWeight: "var(--font-weight-medium)" }}>
                            {getGoalProgress(campaign.totalSaved, campaign.savingsGoal).toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={getGoalProgress(campaign.totalSaved, campaign.savingsGoal)} className="h-1.5" />
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(campaign.status)}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/backoffice/savings/${campaign.numericId}`)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/backoffice/savings/${campaign.numericId}/edit`)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Pause className="w-4 h-4 mr-2" />
                            Suspend
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <XCircle className="w-4 h-4 mr-2" />
                            Close
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" />
                            Export Data
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <DataTablePagination
            page={savingsPagination.page}
            pageSize={savingsPagination.pageSize}
            totalItems={savingsPagination.totalItems}
            totalPages={savingsPagination.totalPages}
            onPageChange={savingsPagination.setPage}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function mapSavingsStatusFilter(status: string): SavingsProgramStatus | undefined {
  switch (status) {
    case 'Active':
      return 'active';
    case 'Closed':
      return 'closed';
    case 'Suspended':
      return 'suspended';
    case 'Draft':
      return 'draft';
    default:
      return undefined;
  }
}
