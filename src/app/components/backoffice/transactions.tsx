import { useEffect, useState } from "react";
import {
  useDisbursementBatchesQuery,
  useFailedTransactionsQuery,
  useRetryTransactionsMutation,
  useTransactionAnalyticsSummaryQuery,
  useTransactionQuery,
  useTransactionsQuery,
} from "@/features/transactions/hooks/use-transaction-queries";
import { useCampaignCatalogs } from "@/features/catalogs/hooks/use-catalog-queries";
import { adaptAnalytics, adaptBatch, adaptTransaction } from "@/features/transactions/adapters/transactions";
import type { TransactionListFilters } from "@/features/transactions/types/transaction";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../ui/table";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search, Package, Download, Eye, RefreshCw, TrendingUp, Activity, CheckCircle, XCircle, Clock, AlertCircle, DollarSign, BarChart3 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { DataTablePagination, useTablePagination } from "../ui/table-pagination";
import { useAuth } from "@/lib/auth/auth-context";
import { normalizeRole } from "@/lib/auth/roles";
import { formatMetical } from "@/lib/format/currency";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export function BackofficeTransactions() {
  const { user } = useAuth();
  const isAnalyticsOnly = normalizeRole(user?.role) === 'analytics';
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [campaignFilter, setCampaignFilter] = useState("all");
  const [providerFilter, setProviderFilter] = useState("all");
  const [paymentChannelFilter, setPaymentChannelFilter] = useState("all");
  const [batchFilter, setBatchFilter] = useState("all");
  const [createdFrom, setCreatedFrom] = useState("");
  const [createdTo, setCreatedTo] = useState("");
  const [executedFrom, setExecutedFrom] = useState("");
  const [executedTo, setExecutedTo] = useState("");
  const [selectedFailedTransactionIds, setSelectedFailedTransactionIds] = useState<number[]>([]);
  const [selectedTransactionId, setSelectedTransactionId] = useState<number | null>(null);
  const [showTransactionDetail, setShowTransactionDetail] = useState(false);
  const { t } = useTranslation();
  const catalogs = useCampaignCatalogs();

  const filters: TransactionListFilters = {
    page: 1,
    pageSize: 100,
    q: searchQuery.trim() || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter.toLowerCase().replace(/\s+/g, '_'),
    type: typeFilter === 'all' ? undefined : typeFilter.toLowerCase(),
    paymentChannelId: paymentChannelFilter === 'all' ? undefined : Number(paymentChannelFilter),
    disbursementBatchId: batchFilter === 'all' ? undefined : Number(batchFilter),
    createdFrom: createdFrom || undefined,
    createdTo: createdTo || undefined,
    executedFrom: executedFrom || undefined,
    executedTo: executedTo || undefined,
  };
  const transactionsQuery = useTransactionsQuery(filters);
  const failedTransactionsQuery = useFailedTransactionsQuery({
    page: 1,
    pageSize: 100,
    q: searchQuery.trim() || undefined,
    campaignId: filters.campaignId,
    paymentChannelId: filters.paymentChannelId,
    disbursementBatchId: filters.disbursementBatchId,
    createdFrom: filters.createdFrom,
    createdTo: filters.createdTo,
    executedFrom: filters.executedFrom,
    executedTo: filters.executedTo,
  });
  const analyticsQuery = useTransactionAnalyticsSummaryQuery();
  const batchesQuery = useDisbursementBatchesQuery(1, 100);
  const selectedTransactionQuery = useTransactionQuery(selectedTransactionId ?? Number.NaN);
  const retryTransactionsMutation = useRetryTransactionsMutation();

  const analytics = adaptAnalytics(analyticsQuery.data);
  const transactions = (transactionsQuery.data?.data ?? []).map(adaptTransaction).filter((txn) => {
    const matchesCampaign = campaignFilter === 'all' || txn.campaignId === campaignFilter || txn.campaign === campaignFilter;
    const matchesProvider = providerFilter === 'all' || txn.mobileMoneyProvider === providerFilter;
    return matchesCampaign && matchesProvider;
  });
  const disbursementBatches = (batchesQuery.data?.data ?? []).map(adaptBatch);
  const failedTransactionsList = (failedTransactionsQuery.data?.data ?? []).map(adaptTransaction).filter((txn) => {
    const matchesCampaign = campaignFilter === 'all' || txn.campaignId === campaignFilter || txn.campaign === campaignFilter;
    return matchesCampaign;
  });
  const selectedTransaction = selectedTransactionQuery.data ? adaptTransaction(selectedTransactionQuery.data) : transactions.find((txn) => txn.numericId === selectedTransactionId) ?? null;
  const transactionsPagination = useTablePagination(transactions, undefined, [
    activeTab,
    searchQuery,
    statusFilter,
    typeFilter,
    campaignFilter,
    providerFilter,
    paymentChannelFilter,
    batchFilter,
    createdFrom,
    createdTo,
    executedFrom,
    executedTo,
  ]);
  const batchesPagination = useTablePagination(disbursementBatches, undefined, [activeTab]);
  const failedTransactionsPagination = useTablePagination(failedTransactionsList, undefined, [
    activeTab,
    searchQuery,
    campaignFilter,
    paymentChannelFilter,
    batchFilter,
    createdFrom,
    createdTo,
    executedFrom,
    executedTo,
  ]);

  useEffect(() => {
    if (isAnalyticsOnly && activeTab !== 'analytics') {
      setActiveTab('analytics');
    }
  }, [activeTab, isAnalyticsOnly]);

  useEffect(() => {
    const failedIds = new Set(failedTransactionsList.map((item) => item.numericId));
    setSelectedFailedTransactionIds((current) => current.filter((id) => failedIds.has(id)));
  }, [failedTransactionsList]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant?: "default" | "secondary" | "outline" | "success" | "warning" | "destructive" }> = {
      Successful: { variant: "success" },
      Confirmed: { variant: "success" },
      Pending: { variant: "warning" },
      Processing: { variant: "warning" },
      'Retry Scheduled': { variant: "outline" },
      Failed: { variant: "destructive" },
      Reversed: { variant: "destructive" },
      Completed: { variant: "success" },
      Scheduled: { variant: "outline" }
    };
    return <Badge {...(variants[status] || {})}>{status}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Successful':
      case 'Completed':
        return <CheckCircle className="w-4 h-4" style={{ color: 'var(--success)' }} />;
      case 'Failed':
      case 'Reversed':
        return <XCircle className="w-4 h-4" style={{ color: 'var(--destructive)' }} />;
      case 'Pending':
      case 'Processing':
      case 'Retry Scheduled':
        return <Clock className="w-4 h-4" style={{ color: 'var(--warning)' }} />;
      default:
        return <Activity className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />;
    }
  };

  const getTypeBadge = (type: string) => {
    return type === 'Savings' ? (
      <Badge variant="outline" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
        {type}
      </Badge>
    ) : (
      <Badge variant="outline">{type}</Badge>
    );
  };

  const handleViewTransaction = (txn: { numericId: number }) => {
    setSelectedTransactionId(txn.numericId);
    setShowTransactionDetail(true);
  };

  const toggleFailedTransaction = (transactionId: number, checked: boolean) => {
    setSelectedFailedTransactionIds((current) => {
      if (checked) return Array.from(new Set([...current, transactionId]));
      return current.filter((id) => id !== transactionId);
    });
  };

  const handleRetryTransactions = async (transactionIds: number[]) => {
    if (transactionIds.length === 0) return;

    try {
      const result = await retryTransactionsMutation.mutateAsync(transactionIds);
      const skipped = result.skipped?.length ?? 0;
      const scheduled = result.scheduled ?? 0;
      if (scheduled > 0) {
        toast.success(
          skipped > 0
            ? `${scheduled} transaction${scheduled === 1 ? '' : 's'} scheduled. ${skipped} skipped.`
            : `${scheduled} transaction${scheduled === 1 ? '' : 's'} scheduled for retry.`
        );
      } else {
        toast.error('No transactions were scheduled for retry.');
      }
      setSelectedFailedTransactionIds([]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Retry request failed.');
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 style={{ fontSize: 'var(--text-32)', fontWeight: 'var(--font-weight-semi-bold)' }}>{t('transactionsPage.title')}</h1>
        <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)', marginTop: '8px' }}>
          {t('transactionsPage.subtitle')}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          {!isAnalyticsOnly ? <TabsTrigger value="all">{t('transactionsPage.allTransactions')}</TabsTrigger> : null}
          {!isAnalyticsOnly ? <TabsTrigger value="batches">{t('transactionsPage.disbursementBatches')}</TabsTrigger> : null}
          {!isAnalyticsOnly ? <TabsTrigger value="failed">{t('transactionsPage.failedTransactions')}</TabsTrigger> : null}
          <TabsTrigger value="analytics">{t('transactionsPage.analytics')}</TabsTrigger>
        </TabsList>

        {/* ALL TRANSACTIONS TAB */}
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--muted-foreground)" }} />
                  <Input
                    placeholder={t('transactionsPage.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={campaignFilter} onValueChange={setCampaignFilter}>
                  <SelectTrigger className="w-52">
                    <SelectValue placeholder={t('transactionsPage.campaign')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('transactionsPage.allCampaigns')}</SelectItem>
                    {Array.from(new Set(transactions.map((txn) => txn.campaign))).filter((item) => item && item !== '—').map((item) => (
                      <SelectItem key={item} value={item}>{item}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder={t('transactionsPage.type')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('transactionsPage.allTypes')}</SelectItem>
                    <SelectItem value="Disbursement">Disbursement</SelectItem>
                    <SelectItem value="Savings">Savings</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder={t('campaignsPage.status')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('campaignsPage.allStatus')}</SelectItem>
                    <SelectItem value="Successful">Successful</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Retry Scheduled">Retry Scheduled</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                    <SelectItem value="Reversed">Reversed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={paymentChannelFilter} onValueChange={setPaymentChannelFilter}>
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder={t('transactionsPage.provider')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All payment channels</SelectItem>
                    {(catalogs.paymentChannels.data ?? []).map((item) => (
                      <SelectItem key={item.id} value={String(item.id)}>{item.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={batchFilter} onValueChange={setBatchFilter}>
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder={t('transactionsPage.batchId')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All batches</SelectItem>
                    {(batchesQuery.data?.data ?? []).map((item) => (
                      <SelectItem key={item.id} value={String(item.id)}>{item.code}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={providerFilter} onValueChange={setProviderFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder={t('transactionsPage.provider')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('transactionsPage.allProviders')}</SelectItem>
                    {Array.from(new Set(transactions.map((txn) => txn.mobileMoneyProvider))).filter((item) => item && item !== '—').map((item) => (
                      <SelectItem key={item} value={item}>{item}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input type="date" value={createdFrom} onChange={(e) => setCreatedFrom(e.target.value)} className="w-40" />
                <Input type="date" value={createdTo} onChange={(e) => setCreatedTo(e.target.value)} className="w-40" />
                <Input type="date" value={executedFrom} onChange={(e) => setExecutedFrom(e.target.value)} className="w-40" />
                <Input type="date" value={executedTo} onChange={(e) => setExecutedTo(e.target.value)} className="w-40" />
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  {t('transactionsPage.export')}
                </Button>
              </div>
              {transactionsQuery.error ? (
                <p style={{ fontSize: 'var(--text-13)', color: 'var(--error)' }}>
                  {transactionsQuery.error instanceof Error ? transactionsQuery.error.message : t('transactionsPage.loadError')}
                </p>
              ) : null}
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('transactionsPage.transactionRef')}</TableHead>
                    <TableHead>{t('transactionsPage.beneficiary')}</TableHead>
                    <TableHead>{t('transactionsPage.campaign')}</TableHead>
                    <TableHead>{t('transactionsPage.type')}</TableHead>
                    <TableHead className="text-right">{t('transactionsPage.amount')}</TableHead>
                    <TableHead>{t('transactionsPage.provider')}</TableHead>
                    <TableHead>{t('campaignsPage.status')}</TableHead>
                    <TableHead>{t('transactionsPage.created')}</TableHead>
                    <TableHead>{t('transactionsPage.executed')}</TableHead>
                    <TableHead>{t('transactionsPage.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="py-12 text-center">
                        <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }}>
                          {transactionsQuery.isPending ? t('transactionsPage.loadingTransactions') : t('transactionsPage.noTransactions')}
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : transactionsPagination.paginatedItems.map((txn) => (
                    <TableRow key={txn.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <span style={{ fontWeight: 'var(--font-weight-medium)', fontFamily: 'monospace', fontSize: 'var(--text-12)' }}>
                          {txn.reference}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--text-13)' }}>{txn.beneficiary}</p>
                          <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                            {txn.beneficiaryCode}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p style={{ fontSize: 'var(--text-13)' }}>{txn.campaign}</p>
                          <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                            {txn.campaignId}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{getTypeBadge(txn.type)}</TableCell>
                      <TableCell className="text-right" style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--text-13)' }}>
                        {formatMetical(txn.amount)}
                      </TableCell>
                      <TableCell>
                        <span style={{ fontSize: 'var(--text-13)' }}>{txn.mobileMoneyProvider}</span>
                      </TableCell>
                      <TableCell>{getStatusBadge(txn.status)}</TableCell>
                      <TableCell style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                        {txn.createdAt}
                      </TableCell>
                      <TableCell style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                        {txn.executedAt || '—'}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewTransaction(txn)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
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

        {/* DISBURSEMENT BATCHES TAB */}
        <TabsContent value="batches">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5" style={{ color: "var(--primary)" }} />
                  <div>
                    <h3 style={{ fontSize: 'var(--text-16)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                      {t('transactionsPage.disbursementBatches')}
                    </h3>
                    <p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)' }}>
                      {t('transactionsPage.batchSubtitle')}
                    </p>
                  </div>
                </div>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  {t('transactionsPage.exportReport')}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('transactionsPage.batchId')}</TableHead>
                    <TableHead>{t('transactionsPage.campaign')}</TableHead>
                    <TableHead className="text-right">{t('transactionsPage.totalAmount')}</TableHead>
                    <TableHead className="text-right">{t('transactionsPage.batchTransactions')}</TableHead>
                    <TableHead>{t('transactionsPage.successRate')}</TableHead>
                    <TableHead>{t('campaignsPage.status')}</TableHead>
                    <TableHead>{t('transactionsPage.executionDate')}</TableHead>
                    <TableHead>{t('transactionsPage.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {disbursementBatches.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="py-12 text-center">
                        <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }}>
                          {batchesQuery.isPending ? t('transactionsPage.loadingBatches') : t('transactionsPage.noBatches')}
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : batchesPagination.paginatedItems.map((batch) => {
                    const successRate = batch.transactions > 0 
                      ? ((batch.successful / batch.transactions) * 100).toFixed(1) 
                      : '0.0';
                    
                    return (
                      <TableRow key={batch.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell>
                          <span style={{ fontWeight: 'var(--font-weight-medium)', fontFamily: 'monospace', fontSize: 'var(--text-12)' }}>
                            {batch.id}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-medium)' }}>
                              {batch.campaign}
                            </p>
                            <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                              {batch.campaignId}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--text-13)' }}>
                          {formatMetical(batch.totalAmount)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div>
                            <p style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-medium)' }}>
                              {batch.transactions.toLocaleString()}
                            </p>
                            <p style={{ fontSize: 'var(--text-11)', color: 'var(--muted-foreground)' }}>
                               {batch.successful > 0 && `${batch.successful} ${t('transactionsPage.success')}`}
                               {batch.failed > 0 && ` • ${batch.failed} ${t('transactionsPage.failed')}`}
                               {batch.pending > 0 && ` • ${batch.pending} pending`}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div 
                              className="h-1.5 w-16 rounded-full overflow-hidden" 
                              style={{ backgroundColor: 'var(--muted)' }}
                            >
                              <div 
                                className="h-full" 
                                style={{ 
                                  width: `${successRate}%`, 
                                  backgroundColor: parseFloat(successRate) >= 95 ? 'var(--success)' : parseFloat(successRate) >= 80 ? 'var(--warning)' : 'var(--destructive)'
                                }}
                              />
                            </div>
                            <span style={{ fontSize: 'var(--text-12)', fontWeight: 'var(--font-weight-medium)' }}>
                              {successRate}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(batch.status)}</TableCell>
                        <TableCell style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                          {batch.executedAt || t('transactionsPage.notExecuted')}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <DataTablePagination
                page={batchesPagination.page}
                pageSize={batchesPagination.pageSize}
                totalItems={batchesPagination.totalItems}
                totalPages={batchesPagination.totalPages}
                onPageChange={batchesPagination.setPage}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAILED TRANSACTIONS TAB */}
        <TabsContent value="failed">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5" style={{ color: "var(--destructive)" }} />
                  <div>
                    <h3 style={{ fontSize: 'var(--text-16)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                      {t('transactionsPage.failedTransactions')}
                    </h3>
                    <p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)' }}>
                      {t('transactionsPage.failedSubtitle')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    {t('transactionsPage.export')}
                  </Button>
                  <Button
                    variant="default"
                    disabled={selectedFailedTransactionIds.length === 0 || retryTransactionsMutation.isPending}
                    onClick={() => void handleRetryTransactions(selectedFailedTransactionIds)}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {t('transactionsPage.retrySelected')}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={
                          failedTransactionsPagination.paginatedItems.length > 0 &&
                          failedTransactionsPagination.paginatedItems.every((item) =>
                            selectedFailedTransactionIds.includes(item.numericId)
                          )
                        }
                        onChange={(event) => {
                          const pageIds = failedTransactionsPagination.paginatedItems.map((item) => item.numericId);
                          if (event.target.checked) {
                            setSelectedFailedTransactionIds((current) => Array.from(new Set([...current, ...pageIds])));
                            return;
                          }
                          setSelectedFailedTransactionIds((current) => current.filter((id) => !pageIds.includes(id)));
                        }}
                      />
                    </TableHead>
                    <TableHead>{t('transactionsPage.transactionRef')}</TableHead>
                    <TableHead>{t('transactionsPage.beneficiary')}</TableHead>
                    <TableHead>{t('transactionsPage.campaign')}</TableHead>
                    <TableHead className="text-right">{t('transactionsPage.amount')}</TableHead>
                    <TableHead>{t('transactionsPage.errorMessage')}</TableHead>
                    <TableHead>{t('beneficiariesPage.date')}</TableHead>
                    <TableHead>{t('transactionsPage.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {failedTransactionsList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="py-12 text-center">
                        <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }}>
                          {failedTransactionsQuery.isPending ? t('transactionsPage.loadingFailed') : t('transactionsPage.noFailed')}
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : failedTransactionsPagination.paginatedItems.map((txn) => (
                    <TableRow key={txn.id} className="hover:bg-muted/50">
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedFailedTransactionIds.includes(txn.numericId)}
                          onChange={(event) => toggleFailedTransaction(txn.numericId, event.target.checked)}
                        />
                      </TableCell>
                      <TableCell>
                        <span style={{ fontWeight: 'var(--font-weight-medium)', fontFamily: 'monospace', fontSize: 'var(--text-12)' }}>
                          {txn.reference}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--text-13)' }}>{txn.beneficiary}</p>
                          <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                            {txn.beneficiaryCode}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p style={{ fontSize: 'var(--text-13)' }}>{txn.campaign}</p>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--text-13)' }}>
                        {formatMetical(txn.amount)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4" style={{ color: 'var(--destructive)' }} />
                          <span style={{ fontSize: 'var(--text-13)', color: 'var(--destructive)' }}>
                            {txn.errorMessage}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                        {txn.createdAt}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={retryTransactionsMutation.isPending}
                          onClick={() => void handleRetryTransactions([txn.numericId])}
                        >
                          <RefreshCw className="w-3 h-3 mr-1" />
                          {t('transactionsPage.retry')}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <DataTablePagination
                page={failedTransactionsPagination.page}
                pageSize={failedTransactionsPagination.pageSize}
                totalItems={failedTransactionsPagination.totalItems}
                totalPages={failedTransactionsPagination.totalPages}
                onPageChange={failedTransactionsPagination.setPage}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ANALYTICS TAB */}
        <TabsContent value="analytics">
          <div className="grid gap-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)' }}>
                      {t('transactionsPage.totalDisbursed')}
                    </p>
                    <DollarSign className="w-4 h-4" style={{ color: 'var(--success)' }} />
                  </div>
                  <p style={{ fontSize: 'var(--text-28)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                    {formatMetical(analytics.totalDisbursed)}
                  </p>
                  <p style={{ fontSize: 'var(--text-12)', color: 'var(--success)', marginTop: '4px' }}>
                    <TrendingUp className="inline w-3 h-3 mr-1" />
                    {t('transactionsPage.fromLastMonth')}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)' }}>
                      {t('transactionsPage.totalTransactions')}
                    </p>
                    <Activity className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                  </div>
                  <p style={{ fontSize: 'var(--text-28)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                    {analytics.totalTransactions}
                  </p>
                  <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)', marginTop: '4px' }}>
                    {t('transactionsPage.allTransactionTypes')}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)' }}>
                      {t('transactionsPage.successRate')}
                    </p>
                    <CheckCircle className="w-4 h-4" style={{ color: 'var(--success)' }} />
                  </div>
                  <p style={{ fontSize: 'var(--text-28)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                    {analytics.successRate}%
                  </p>
                  <p style={{ fontSize: 'var(--text-12)', color: 'var(--success)', marginTop: '4px' }}>
                    {t('transactionsPage.successfulCount', { count: analytics.successfulTransactions })}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)' }}>
                      Failed Transactions
                    </p>
                    <XCircle className="w-4 h-4" style={{ color: 'var(--destructive)' }} />
                  </div>
                  <p style={{ fontSize: 'var(--text-28)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                    {analytics.failedTransactions}
                  </p>
                  <p style={{ fontSize: 'var(--text-12)', color: 'var(--destructive)', marginTop: '4px' }}>
                    Requires attention
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                    <h3 style={{ fontSize: 'var(--text-16)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                      Transactions by Campaign
                    </h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                     {analytics.byCampaign.map((campaign) => (
                       <div key={campaign.name}>
                        <div className="flex items-center justify-between mb-2">
                          <p style={{ fontSize: 'var(--text-13)' }}>{campaign.name}</p>
                          <span style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-medium)' }}>
                            {campaign.count} txns
                          </span>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}>
                          <div 
                            className="h-full" 
                            style={{ 
                               width: `${analytics.totalTransactions > 0 ? (campaign.count / analytics.totalTransactions) * 100 : 0}%`, 
                               backgroundColor: campaign.color 
                             }}
                          />
                        </div>
                        <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)', marginTop: '4px' }}>
                          {formatMetical(campaign.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                    <h3 style={{ fontSize: 'var(--text-16)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                      Transaction Status Breakdown
                    </h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                     {analytics.byStatus.map((stat) => (
                       <div key={stat.status}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(stat.status)}
                            <p style={{ fontSize: 'var(--text-13)' }}>{stat.status}</p>
                          </div>
                          <span style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-medium)' }}>
                            {stat.count}
                          </span>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}>
                          <div 
                            className="h-full" 
                            style={{ 
                               width: `${analytics.totalTransactions > 0 ? (stat.count / analytics.totalTransactions) * 100 : 0}%`, 
                               backgroundColor: stat.color 
                             }}
                          />
                        </div>
                        <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)', marginTop: '4px' }}>
                           {analytics.totalTransactions > 0 ? ((stat.count / analytics.totalTransactions) * 100).toFixed(1) : '0.0'}% of total
                         </p>
                       </div>
                     ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Transaction Detail Dialog */}
      <Dialog open={showTransactionDetail} onOpenChange={setShowTransactionDetail}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle style={{ fontSize: 'var(--text-20)', fontWeight: 'var(--font-weight-semi-bold)' }}>
              Transaction Details
            </DialogTitle>
            <DialogDescription style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }}>
              Complete transaction information and lifecycle
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-6">
              {/* Transaction Header */}
              <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                <div>
                  <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)', marginBottom: '4px' }}>
                    Transaction Reference
                  </p>
                  <p style={{ fontSize: 'var(--text-16)', fontWeight: 'var(--font-weight-semi-bold)', fontFamily: 'monospace' }}>
                    {selectedTransaction.reference}
                  </p>
                </div>
                {getStatusBadge(selectedTransaction.status)}
              </div>

              {/* Transaction Details Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)', marginBottom: '6px' }}>
                    Beneficiary
                  </p>
                  <p style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)' }}>
                    {selectedTransaction.beneficiary}
                  </p>
                  <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                    {selectedTransaction.beneficiaryCode}
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)', marginBottom: '6px' }}>
                    Campaign
                  </p>
                  <p style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)' }}>
                    {selectedTransaction.campaign}
                  </p>
                  <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                    {selectedTransaction.campaignId}
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)', marginBottom: '6px' }}>
                    Transaction Type
                  </p>
                  <div className="mt-1">
                    {getTypeBadge(selectedTransaction.type)}
                  </div>
                </div>

                <div>
                  <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)', marginBottom: '6px' }}>
                    Amount
                  </p>
                  <p style={{ fontSize: 'var(--text-20)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                    {formatMetical(selectedTransaction.amount)}
                  </p>
                  <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                    {selectedTransaction.currency}
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)', marginBottom: '6px' }}>
                    Mobile Money Provider
                  </p>
                  <p style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)' }}>
                    {selectedTransaction.mobileMoneyProvider}
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)', marginBottom: '6px' }}>
                    External Transaction ID
                  </p>
                  <p style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)', fontFamily: 'monospace' }}>
                    {selectedTransaction.externalTxnId || '—'}
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)', marginBottom: '6px' }}>
                    Attempt Count
                  </p>
                  <p style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)' }}>
                    {selectedTransaction.attemptCount ?? '—'}
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)', marginBottom: '6px' }}>
                    Next Retry At
                  </p>
                  <p style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)' }}>
                    {selectedTransaction.nextRetryAt || '—'}
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)', marginBottom: '6px' }}>
                    Last Attempt At
                  </p>
                  <p style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)' }}>
                    {selectedTransaction.lastAttemptAt || '—'}
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)', marginBottom: '6px' }}>
                    Failure Code
                  </p>
                  <p style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)', fontFamily: 'monospace' }}>
                    {selectedTransaction.failureCode || '—'}
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)', marginBottom: '6px' }}>
                    Created Date
                  </p>
                  <p style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)' }}>
                    {selectedTransaction.createdAt}
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)', marginBottom: '6px' }}>
                    Execution Date
                  </p>
                  <p style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)' }}>
                    {selectedTransaction.executedAt || '—'}
                  </p>
                </div>
              </div>

              {/* Error Message */}
              {selectedTransaction.errorMessage && (
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--destructive)', color: 'var(--destructive-foreground)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="w-4 h-4" />
                    <p style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                      Error Message
                    </p>
                  </div>
                  <p style={{ fontSize: 'var(--text-13)' }}>
                    {selectedTransaction.errorMessage}
                  </p>
                </div>
              )}

              {/* Transaction Timeline */}
              <div>
                <p style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-semi-bold)', marginBottom: '12px' }}>
                  Transaction Lifecycle
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full" style={{ backgroundColor: 'var(--success)' }}>
                      <CheckCircle className="w-4 h-4" style={{ color: 'var(--success-foreground)' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-medium)' }}>Created</p>
                      <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                        {selectedTransaction.createdAt}
                      </p>
                    </div>
                  </div>
                  {selectedTransaction.executedAt && (
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full" style={{ backgroundColor: selectedTransaction.status === 'Successful' ? 'var(--success)' : 'var(--destructive)' }}>
                        {selectedTransaction.status === 'Successful' ? (
                          <CheckCircle className="w-4 h-4" style={{ color: 'var(--success-foreground)' }} />
                        ) : (
                          <XCircle className="w-4 h-4" style={{ color: 'var(--destructive-foreground)' }} />
                        )}
                      </div>
                      <div>
                        <p style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-medium)' }}>
                          {selectedTransaction.status}
                        </p>
                        <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                          {selectedTransaction.executedAt}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
