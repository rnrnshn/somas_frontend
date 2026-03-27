import { useState } from "react";
import { useNavigate } from "@/lib/router";
import { useCampaignDetailsQueries, useCampaignsQuery } from "@/features/campaigns/hooks/use-campaign-queries";
import { adaptCampaignListItem } from "@/features/campaigns/adapters/campaigns";
import type { CampaignListFilters, CampaignStatus } from "@/features/campaigns/types/campaign";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
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
  Download 
} from "lucide-react";

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
  const campaignIds = (campaignsQuery.data?.data ?? []).map((campaign) => campaign.id);
  const campaignDetailsQueries = useCampaignDetailsQueries(campaignIds);
  const detailMap = new Map(
    campaignDetailsQueries
      .map((query) => query.data)
      .filter((detail): detail is NonNullable<typeof detail> => Boolean(detail))
      .map((detail) => [detail.id, detail])
  );
  const campaigns = (campaignsQuery.data?.data ?? []).map((item) => adaptCampaignListItem(item, detailMap.get(item.id)));

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
                <TableHead>End Date</TableHead>
                <TableHead>Beneficiaries</TableHead>
                <TableHead>Disbursement</TableHead>
                <TableHead>Success Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
               {filteredCampaigns.length === 0 ? (
                 <TableRow>
                   <TableCell colSpan={10} className="text-center py-12">
                     <p style={{ fontSize: "var(--text-14)", color: "var(--muted-foreground)" }}>
                       {campaignsQuery.isPending ? 'Loading campaigns...' : 'No campaigns found'}
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
                    <TableCell style={{ fontSize: "var(--text-13)", color: "var(--muted-foreground)" }}>
                      {formatDate(campaign.endDate)}
                    </TableCell>
                    <TableCell style={{ fontSize: "var(--text-13)", fontWeight: "var(--font-weight-medium)" }}>
                      {campaign.beneficiaries > 0 ? campaign.beneficiaries.toLocaleString() : '—'}
                    </TableCell>
                    <TableCell style={{ fontSize: "var(--text-13)", fontWeight: "var(--font-weight-medium)" }}>
                      {formatCurrency(campaign.disbursementAmount)}
                    </TableCell>
                    <TableCell>
                      {campaign.successRate > 0 ? (
                        <span style={{ fontSize: "var(--text-13)", fontWeight: "var(--font-weight-medium)", color: "var(--success)" }}>
                          {campaign.successRate}%
                        </span>
                      ) : (
                        <span style={{ fontSize: "var(--text-13)", color: "var(--muted-foreground)" }}>—</span>
                      )}
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
        </CardContent>
      </Card>
    </div>
  );
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
