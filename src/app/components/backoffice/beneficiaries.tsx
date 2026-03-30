import { useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { useNavigate } from "@/lib/router";
import { useBeneficiariesQuery, useBeneficiaryRowQueries } from "@/features/beneficiaries/hooks/use-beneficiary-queries";
import { adaptBeneficiaryListItem } from "@/features/beneficiaries/adapters/beneficiaries";
import type { BeneficiaryListFilters } from "@/features/beneficiaries/types/beneficiary";
import { getFieldDisbursement } from "@/features/field/api/field-api";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../ui/table";
import { Plus, Search, Download, MapPin, CheckCircle, XCircle, Clock, Upload } from "lucide-react";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { DataTablePagination, useTablePagination } from "../ui/table-pagination";

export function BackofficeBeneficiaries() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("directory");
  const [searchQuery, setSearchQuery] = useState("");
  const [campaignFilter, setCampaignFilter] = useState("all");
  const [provinceFilter, setProvinceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filters: BeneficiaryListFilters = {
    page: 1,
    pageSize: 100,
    name: searchQuery.trim() || undefined,
    msisdn: searchQuery.trim() || undefined,
  };
  const beneficiariesQuery = useBeneficiariesQuery(filters);
  const rowQueries = useBeneficiaryRowQueries((beneficiariesQuery.data?.data ?? []).map((item) => item.id));
  const metricsMap = new Map<number, any>();
  const campaignsMap = new Map<number, any>();

  rowQueries.forEach((query, index) => {
    const beneficiaryIndex = Math.floor(index / 2);
    const beneficiaryId = beneficiariesQuery.data?.data?.[beneficiaryIndex]?.id;
    if (!beneficiaryId) return;

    if (index % 2 === 0 && query.data) {
      metricsMap.set(beneficiaryId, query.data);
    }

    if (index % 2 === 1 && query.data?.data?.[0]) {
      campaignsMap.set(beneficiaryId, query.data.data[0]);
    }
  });

  const verificationSourceRows = rowQueries
    .filter((_, index) => index % 2 === 1)
    .flatMap((query) => query.data?.data ?? []);

  const verificationQueries = useQueries({
    queries: verificationSourceRows.map((row) => ({
      queryKey: ['field', 'verification-record', row.campaignId, row.id],
      queryFn: () => getFieldDisbursement(row.campaignId, row.id),
      enabled: activeTab === 'field-verification',
      staleTime: 30_000,
    })),
  });

  const beneficiaries = (beneficiariesQuery.data?.data ?? []).map((item) =>
    adaptBeneficiaryListItem(item, metricsMap.get(item.id), campaignsMap.get(item.id))
  ).filter((beneficiary) => {
    const matchesCampaign = campaignFilter === 'all' || beneficiary.campaign === campaignFilter;
    const matchesProvince = provinceFilter === 'all' || beneficiary.province === provinceFilter;
    const matchesStatus = statusFilter === 'all' || beneficiary.status === statusFilter;
    return matchesCampaign && matchesProvince && matchesStatus;
  });

  const fieldVerifications = verificationSourceRows
    .map((row, index) => {
      const detail = verificationQueries[index]?.data;
      if (!detail) return null;

      const hasVerification = Boolean(detail.verifiedAt) || String(detail.disbursementStatus).toLowerCase() !== 'pending';
      if (!hasVerification) return null;

      return {
        id: `VER-${detail.id}`,
        beneficiary: detail.beneficiary?.name ?? row.campaign?.name ?? 'Beneficiary',
        beneficiaryCode: `BEN-${String(detail.beneficiaryId).padStart(6, '0')}`,
        enumerator: 'Field App',
        location:
          typeof detail.latitude === 'number' && typeof detail.longitude === 'number'
            ? `${detail.latitude.toFixed(4)}, ${detail.longitude.toFixed(4)}`
            : 'Not captured',
        date: formatDisplayDate(detail.verifiedAt ?? row.createdAt),
        status: mapVerificationStatus(detail.disbursementStatus),
        notes: detail.testimony ?? buildEvidenceSummary(detail.signatureUrl, detail.photoUrl),
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const filteredFieldVerifications = fieldVerifications.filter((verification) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return [verification.id, verification.beneficiary, verification.beneficiaryCode, verification.notes]
      .join(' ')
      .toLowerCase()
      .includes(query);
  });
  const beneficiariesPagination = useTablePagination(beneficiaries, undefined, [searchQuery, campaignFilter, provinceFilter, statusFilter, activeTab]);
  const verificationPagination = useTablePagination(filteredFieldVerifications, undefined, [searchQuery, activeTab]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant?: "default" | "secondary" | "outline" | "success" | "warning" | "destructive" }> = {
      Active: { variant: "success" },
      Pending: { variant: "warning" },
      Suspended: { variant: "secondary" },
      Verified: { variant: "success" },
      Rejected: { variant: "destructive" }
    };
    return <Badge {...(variants[status] || {})}>{status}</Badge>;
  };

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case 'Verified':
        return <CheckCircle className="w-4 h-4" style={{ color: "var(--success)" }} />;
      case 'Rejected':
        return <XCircle className="w-4 h-4" style={{ color: "var(--destructive)" }} />;
      case 'Pending':
        return <Clock className="w-4 h-4" style={{ color: "var(--warning)" }} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 style={{ fontSize: 'var(--text-32)', fontWeight: 'var(--font-weight-semi-bold)' }}>Beneficiaries</h1>
          <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)', marginTop: '8px' }}>
            Manage beneficiary directory and field verification activities
          </p>
        </div>
        <div className="flex gap-3">
          {activeTab === "directory" && (
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Import CSV
            </Button>
          )}
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          {activeTab === "directory" && (
            <Button onClick={() => navigate("/backoffice/beneficiaries/form/new")}>
              <Plus className="w-4 h-4 mr-2" />
              Add Beneficiary
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="directory">Directory</TabsTrigger>
          <TabsTrigger value="field-verification">Field Verification</TabsTrigger>
        </TabsList>

        {/* DIRECTORY TAB */}
        <TabsContent value="directory">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--muted-foreground)" }} />
                  <Input
                    placeholder="Search by name or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="relative flex-1 max-w-sm">
                  <Select
                    value={campaignFilter}
                    onValueChange={setCampaignFilter}
                    className="w-full"
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Filter by campaign">
                        {campaignFilter === "all" ? "All Campaigns" : campaignFilter}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      <SelectItem value="all">All Campaigns</SelectItem>
                      {Array.from(new Set(beneficiaries.map((item) => item.campaign))).filter((item) => item && item !== '—').map((item) => (
                        <SelectItem key={item} value={item}>{item}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative flex-1 max-w-sm">
                  <Select
                    value={provinceFilter}
                    onValueChange={setProvinceFilter}
                    className="w-full"
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Filter by province">
                        {provinceFilter === "all" ? "All Provinces" : provinceFilter}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      <SelectItem value="all">All Provinces</SelectItem>
                      {Array.from(new Set(beneficiaries.map((item) => item.province))).filter((item) => item && item !== '—').map((item) => (
                        <SelectItem key={item} value={item}>{item}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative flex-1 max-w-sm">
                  <Select
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                    className="w-full"
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Filter by status">
                        {statusFilter === "all" ? "All Statuses" : statusFilter}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                      <SelectItem value="Verified">Verified</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {beneficiariesQuery.error ? (
                  <p style={{ fontSize: 'var(--text-13)', color: 'var(--error)' }}>
                    {beneficiariesQuery.error instanceof Error ? beneficiariesQuery.error.message : 'Beneficiaries could not be loaded.'}
                  </p>
                ) : null}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Beneficiary ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Province</TableHead>
                    <TableHead>District</TableHead>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Last Transaction</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {beneficiaries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="py-12 text-center">
                        <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }}>
                          {beneficiariesQuery.isPending ? 'Loading beneficiaries...' : 'No beneficiaries found'}
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : beneficiariesPagination.paginatedItems.map((beneficiary) => (
                    <TableRow key={beneficiary.id} className="cursor-pointer">
                      <TableCell>
                        <span style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--text-13)' }}>
                          {beneficiary.beneficiaryCode}
                        </span>
                      </TableCell>
                      <TableCell style={{ fontSize: 'var(--text-13)' }}>{beneficiary.fullName}</TableCell>
                      <TableCell style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-13)' }}>
                        {beneficiary.msisdn}
                      </TableCell>
                      <TableCell style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-13)' }}>
                        {beneficiary.province}
                      </TableCell>
                      <TableCell style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-13)' }}>
                        {beneficiary.district}
                      </TableCell>
                      <TableCell style={{ fontSize: 'var(--text-13)' }}>{beneficiary.campaign}</TableCell>
                      <TableCell style={{ fontSize: 'var(--text-13)' }}>{beneficiary.lastTransaction}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <DataTablePagination
                page={beneficiariesPagination.page}
                pageSize={beneficiariesPagination.pageSize}
                totalItems={beneficiariesPagination.totalItems}
                totalPages={beneficiariesPagination.totalPages}
                onPageChange={beneficiariesPagination.setPage}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* FIELD VERIFICATION TAB */}
        <TabsContent value="field-verification">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5" style={{ color: "var(--primary)" }} />
                  <div>
                    <h3 style={{ fontSize: 'var(--text-16)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                      Field Verification Records
                    </h3>
                    <p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)' }}>
                      Track on-site verification activities by enumerators
                    </p>
                  </div>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--muted-foreground)" }} />
                  <Input
                    placeholder="Search verifications..."
                    className="pl-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Verification ID</TableHead>
                    <TableHead>Beneficiary</TableHead>
                    <TableHead>Enumerator</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeTab === 'field-verification' && verificationQueries.some((query) => query.isPending) && filteredFieldVerifications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="py-12 text-center">
                        <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }}>
                          Loading field verification records...
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : filteredFieldVerifications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="py-12 text-center">
                        <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }}>
                          No field verification records found.
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : verificationPagination.paginatedItems.map((verification) => (
                    <TableRow key={verification.id} className="cursor-pointer">
                      <TableCell>
                        <span style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--text-12)', fontFamily: 'var(--font-mono)' }}>
                          {verification.id}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-medium)' }}>
                            {verification.beneficiary}
                          </p>
                          <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                            {verification.beneficiaryCode}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell style={{ fontSize: 'var(--text-13)' }}>
                        {verification.enumerator}
                      </TableCell>
                      <TableCell style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)' }}>
                        {verification.location}
                      </TableCell>
                      <TableCell style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                        {verification.date}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getVerificationIcon(verification.status)}
                          {getStatusBadge(verification.status)}
                        </div>
                      </TableCell>
                      <TableCell style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)' }}>
                        {verification.notes}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <DataTablePagination
                page={verificationPagination.page}
                pageSize={verificationPagination.pageSize}
                totalItems={verificationPagination.totalItems}
                totalPages={verificationPagination.totalPages}
                onPageChange={verificationPagination.setPage}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function mapVerificationStatus(status: string) {
  const value = status.toLowerCase();
  if (value === 'confirmed') return 'Verified';
  if (value === 'not_confirmed' || value === 'not_found') return 'Rejected';
  return 'Pending';
}

function buildEvidenceSummary(signatureUrl?: string | null, photoUrl?: string | null) {
  const parts = [];
  if (signatureUrl) parts.push('Signature attached');
  if (photoUrl) parts.push('Photo attached');
  return parts.join(' • ') || 'No notes';
}

function formatDisplayDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-CA').format(date);
}
