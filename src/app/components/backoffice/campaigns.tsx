import { useState } from "react";
import { useNavigate } from "@/lib/router";
import { formatCompactMetical } from "@/lib/format/currency";
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
import { DataTablePagination, useTablePagination } from "../ui/table-pagination";
import { useTranslation } from "react-i18next";

export function BackofficeCampaigns() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [programFilter, setProgramFilter] = useState("all");
  const { t } = useTranslation();

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

  const formatCurrency = (amount: number) => formatCompactMetical(amount);

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
      toast.success(t('campaignsPage.updated', { status: formatStatusLabel(status, t) }))
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('campaignsPage.updateFailed'))
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
  const campaignsPagination = useTablePagination(filteredCampaigns, undefined, [searchQuery, statusFilter, regionFilter, programFilter]);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 style={{ fontSize: "var(--text-32)", fontWeight: "var(--font-weight-semi-bold)" }}>
            {t('campaignsPage.title')}
          </h1>
          <p style={{ fontSize: "var(--text-14)", color: "var(--muted-foreground)", marginTop: "8px" }}>
            {t('campaignsPage.subtitle')}
          </p>
        </div>
        <Button onClick={() => navigate('/backoffice/campaigns/create')}>
          <Plus className="w-4 h-4 mr-2" />
          {t('campaignsPage.create')}
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: "var(--muted-foreground)" }} />
              <Input
                placeholder={t('campaignsPage.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('campaignsPage.status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('campaignsPage.allStatus')}</SelectItem>
                <SelectItem value="Active">{t('campaignsPage.active')}</SelectItem>
                <SelectItem value="Closed">{t('campaignsPage.closed')}</SelectItem>
                <SelectItem value="Suspended">{t('campaignsPage.suspended')}</SelectItem>
                <SelectItem value="Draft">{t('campaignsPage.draft')}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('campaignsPage.region')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('campaignsPage.allRegions')}</SelectItem>
                {Array.from(new Set(campaigns.map((item) => item.region))).filter(Boolean).map((region) => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={programFilter} onValueChange={setProgramFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('campaignsPage.program')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('campaignsPage.allPrograms')}</SelectItem>
                {Array.from(new Set(campaigns.map((item) => item.program))).filter((program) => program && program !== '—').map((program) => (
                  <SelectItem key={program} value={program}>{program}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {campaignsQuery.error ? (
            <p style={{ fontSize: "var(--text-13)", color: "var(--error)", marginTop: "12px" }}>
               {campaignsQuery.error instanceof Error ? campaignsQuery.error.message : t('campaignsPage.loadError')}
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
                <TableHead>{t('campaignsPage.campaign')}</TableHead>
                <TableHead>{t('campaignsPage.program')}</TableHead>
                <TableHead>{t('campaignsPage.region')}</TableHead>
                <TableHead>{t('campaignsPage.startDate')}</TableHead>
                <TableHead>{t('campaignsPage.beneficiaries')}</TableHead>
                <TableHead>{t('campaignsPage.disbursement')}</TableHead>
                <TableHead>{t('campaignsPage.status')}</TableHead>
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
                         {t('campaignsPage.noCampaigns')}
                      </p>
                    </TableCell>
                  </TableRow>
              ) : (
                campaignsPagination.paginatedItems.map((campaign) => (
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
                            {t('campaignsPage.view')}
                          </DropdownMenuItem>
                           <DropdownMenuItem onClick={() => navigate(`/backoffice/campaigns/${campaign.numericId}/edit`)}>
                            <Edit className="w-4 h-4 mr-2" />
                            {t('campaignsPage.edit')}
                          </DropdownMenuItem>
                          {getCampaignStatusActions(campaign.statusCode, t).map((action) => (
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
                            {t('campaignsPage.exportData')}
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
            page={campaignsPagination.page}
            pageSize={campaignsPagination.pageSize}
            totalItems={campaignsPagination.totalItems}
            totalPages={campaignsPagination.totalPages}
            onPageChange={campaignsPagination.setPage}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function getCampaignStatusActions(status: CampaignStatus, t: (key: string) => string) {
  switch (status) {
    case 'draft':
      return [
        { status: 'planned' as const, label: t('campaignsPage.actionMarkPlanned'), icon: Edit },
        { status: 'cancelled' as const, label: t('campaignsPage.actionCancel'), icon: XCircle },
      ]
    case 'planned':
      return [
        { status: 'active' as const, label: t('campaignsPage.actionActivate'), icon: Eye },
        { status: 'cancelled' as const, label: t('campaignsPage.actionCancel'), icon: XCircle },
      ]
    case 'active':
      return [
        { status: 'suspended' as const, label: t('campaignsPage.actionSuspend'), icon: Pause },
        { status: 'completed' as const, label: t('campaignsPage.actionComplete'), icon: Eye },
        { status: 'cancelled' as const, label: t('campaignsPage.actionCancel'), icon: XCircle },
      ]
    case 'suspended':
      return [
        { status: 'active' as const, label: t('campaignsPage.actionActivate'), icon: Eye },
        { status: 'cancelled' as const, label: t('campaignsPage.actionCancel'), icon: XCircle },
      ]
    default:
      return []
  }
}

function formatStatusLabel(status: CampaignStatus, t: (key: string) => string) {
  switch (status) {
    case 'draft':
      return t('campaignsPage.draft')
    case 'planned':
      return t('campaignsPage.planned')
    case 'active':
      return t('campaignsPage.active')
    case 'completed':
      return t('campaignsPage.completed')
    case 'suspended':
      return t('campaignsPage.suspended')
    case 'cancelled':
      return t('campaignsPage.cancelled')
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
