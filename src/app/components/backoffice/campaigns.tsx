import { useState } from "react";
import { useNavigate } from "@/lib/router";
import { useCampaignDetailsQueries, useCampaignsQuery, useCampaignTableSummaryQueries } from "@/features/campaigns/hooks/use-campaign-queries";
import { adaptCampaignListItem } from "@/features/campaigns/adapters/campaigns";
import { useUpdateCampaignStatusMutation } from "@/features/campaigns/hooks/use-campaign-mutations";
import type { CampaignListFilters, CampaignStatus } from "@/features/campaigns/types/campaign";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
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
  MoreVertical, 
  Eye, 
  Edit, 
  Pause, 
  XCircle,
  Download,
  LoaderCircle,
} from "lucide-react";
import { toast } from "sonner";

export function BackofficeCampaigns() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [programFilter, setProgramFilter] = useState("all");

  const filters: CampaignListFilters = {
    page: 1,
    pageSize: 100,
    name: searchQuery.trim() || undefined,
    code: searchQuery.trim() || undefined,
    status: mapStatusFilter(statusFilter),
    province: regionFilter === 'all' ? undefined : regionFilter,
  };
  const campaignsQuery = useCampaignsQuery(filters);
  const updateCampaignStatusMutation = useUpdateCampaignStatusMutation();
  const campaignIds = (campaignsQuery.data?.data ?? []).map((campaign) => campaign.id);
  const campaignDetailsQueries = useCampaignDetailsQueries(campaignIds);
  const campaignSummaryQueries = useCampaignTableSummaryQueries(campaignIds);
  const detailMap = new Map(
    campaignDetailsQueries
      .map((query) => query.data)
      .filter((detail): detail is NonNullable<typeof detail> => Boolean(detail))
      .map((detail) => [detail.id, detail])
  );
  const summaryMap = new Map(
    campaignSummaryQueries
      .map((query) => query.data)
      .filter((summary): summary is NonNullable<typeof summary> => Boolean(summary))
      .map((summary) => [summary.campaignId, summary])
  );
  const campaigns = (campaignsQuery.data?.data ?? []).map((item) => {
    const campaign = adaptCampaignListItem(item, detailMap.get(item.id));
    const summary = summaryMap.get(item.id);

    if (!summary) return campaign;

    return {
      ...campaign,
      beneficiaries: summary.totalBeneficiaries,
      disbursementAmount: summary.amountDisbursed,
      successRate: summary.successRate,
    };
  });
  const summaryLoadingIds = new Set(
    campaignSummaryQueries.filter((query) => query.isPending).map((query, index) => campaignIds[index]).filter(Boolean)
  );

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
    if (amount === 0) return "$0";
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

  const handleStatusChange = async (campaignId: number, status: CampaignStatus) => {
    try {
      await updateCampaignStatusMutation.mutateAsync({ campaignId, status })
      toast.success(`Campaign status updated to ${formatStatusLabel(status)}.`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Campaign status could not be updated.')
    }
  }

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
    const matchesRegion = regionFilter === "all" || campaign.region === regionFilter;
    const matchesProgram = programFilter === "all" || campaign.program === programFilter;
    
    return matchesSearch && matchesStatus && matchesRegion && matchesProgram;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 style={{ fontSize: "var(--text-32)", fontWeight: "var(--font-weight-semi-bold)" }}>
            Campaigns
          </h1>
          <p style={{ fontSize: "var(--text-14)", color: "var(--muted-foreground)", marginTop: "8px" }}>
            Manage social transfer programs and savings campaigns
          </p>
        </div>
        <Button onClick={() => navigate('/backoffice/campaigns/create')}>
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative lg:col-span-2">
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

            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {Array.from(new Set(campaigns.map((item) => item.region))).filter(Boolean).map((region) => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={programFilter} onValueChange={setProgramFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Programs</SelectItem>
                {Array.from(new Set(campaigns.map((item) => item.program))).filter((program) => program && program !== '—').map((program) => (
                  <SelectItem key={program} value={program}>{program}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {campaignsQuery.error ? (
            <p style={{ fontSize: "var(--text-13)", color: "var(--error)", marginTop: "12px" }}>
              {campaignsQuery.error instanceof Error ? campaignsQuery.error.message : 'Campaigns could not be loaded.'}
            </p>
          ) : null}
        </CardContent>
      </Card>

      {/* Campaigns Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Beneficiaries</TableHead>
                <TableHead>Disbursement</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
               {campaignsQuery.isPending && campaigns.length === 0 ? (
                 Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={`campaign-skeleton-${index}`}>
                    <TableCell><Skeleton className="h-10 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                 ))
               ) : filteredCampaigns.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <p style={{ fontSize: "var(--text-14)", color: "var(--muted-foreground)" }}>
                        No campaigns found
                      </p>
                    </TableCell>
                  </TableRow>
              ) : (
                filteredCampaigns.map((campaign) => (
                  <TableRow
                    key={campaign.id}
                    className="cursor-pointer hover:bg-muted/50"
                     onClick={() => navigate(`/backoffice/campaigns/${campaign.numericId}`)}
                  >
                    <TableCell>
                      <div>
                        <p style={{ fontSize: "var(--text-13)", fontWeight: "var(--font-weight-medium)" }}>
                          {campaign.name}
                        </p>
                        <p style={{ fontSize: "var(--text-12)", color: "var(--muted-foreground)" }}>
                          {campaign.id}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell style={{ fontSize: "var(--text-13)" }}>
                      {campaign.program}
                    </TableCell>
                    <TableCell style={{ fontSize: "var(--text-13)" }}>
                      {campaign.region}
                    </TableCell>
                    <TableCell style={{ fontSize: "var(--text-13)", color: "var(--muted-foreground)" }}>
                      {formatDate(campaign.startDate)}
                    </TableCell>
                    <TableCell style={{ fontSize: "var(--text-13)", fontWeight: "var(--font-weight-medium)" }}>
                      {summaryLoadingIds.has(campaign.numericId) ? <Skeleton className="h-5 w-12" /> : campaign.beneficiaries > 0 ? campaign.beneficiaries.toLocaleString() : '—'}
                    </TableCell>
                    <TableCell style={{ fontSize: "var(--text-13)", fontWeight: "var(--font-weight-medium)" }}>
                      {summaryLoadingIds.has(campaign.numericId) ? <Skeleton className="h-5 w-20" /> : formatCurrency(campaign.disbursementAmount)}
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
                           <DropdownMenuItem onClick={() => navigate(`/backoffice/campaigns/${campaign.numericId}`)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </DropdownMenuItem>
                           <DropdownMenuItem onClick={() => navigate(`/backoffice/campaigns/${campaign.numericId}/edit`)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {getCampaignStatusActions(campaign.statusCode).map((action) => (
                            <DropdownMenuItem
                              key={action.status}
                              onClick={() => handleStatusChange(campaign.numericId, action.status)}
                              disabled={updateCampaignStatusMutation.isPending}
                            >
                              {updateCampaignStatusMutation.isPending ? <LoaderCircle className="w-4 h-4 mr-2 animate-spin" /> : <action.icon className="w-4 h-4 mr-2" />}
                              {action.label}
                            </DropdownMenuItem>
                          ))}
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
        </CardContent>
      </Card>
    </div>
  );
}

function getCampaignStatusActions(status: CampaignStatus) {
  switch (status) {
    case 'draft':
      return [
        { status: 'planned' as const, label: 'Mark Planned', icon: Edit },
        { status: 'cancelled' as const, label: 'Cancel', icon: XCircle },
      ]
    case 'planned':
      return [
        { status: 'active' as const, label: 'Activate', icon: Eye },
        { status: 'cancelled' as const, label: 'Cancel', icon: XCircle },
      ]
    case 'active':
      return [
        { status: 'suspended' as const, label: 'Suspend', icon: Pause },
        { status: 'completed' as const, label: 'Complete', icon: Eye },
        { status: 'cancelled' as const, label: 'Cancel', icon: XCircle },
      ]
    case 'suspended':
      return [
        { status: 'active' as const, label: 'Activate', icon: Eye },
        { status: 'cancelled' as const, label: 'Cancel', icon: XCircle },
      ]
    default:
      return []
  }
}

function formatStatusLabel(status: CampaignStatus) {
  switch (status) {
    case 'draft':
      return 'Draft'
    case 'planned':
      return 'Planned'
    case 'active':
      return 'Active'
    case 'completed':
      return 'Completed'
    case 'suspended':
      return 'Suspended'
    case 'cancelled':
      return 'Cancelled'
  }
}

function mapStatusFilter(status: string): CampaignStatus | undefined {
  switch (status) {
    case 'Active':
      return 'active';
    case 'Closed':
      return 'completed';
    case 'Suspended':
      return 'suspended';
    case 'Draft':
      return 'draft';
    default:
      return undefined;
  }
}
