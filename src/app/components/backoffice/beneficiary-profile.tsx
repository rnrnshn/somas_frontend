import { useState } from "react";
import { useParams, useNavigate } from "@/lib/router";
import { useBeneficiaryDetailQueries } from "@/features/beneficiaries/hooks/use-beneficiary-queries";
import {
  adaptBeneficiaryCampaigns,
  adaptBeneficiaryProfile,
  adaptBeneficiaryTransactions} from "@/features/beneficiaries/adapters/beneficiaries";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../ui/table";
import { ArrowLeft, Phone, MapPin, CheckCircle } from "lucide-react";
import { DataTablePagination, useTablePagination } from "../ui/table-pagination";
import { formatMetical } from "@/lib/format/currency";
import { useTranslation } from "react-i18next";

export function BeneficiaryProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("overview");
  const beneficiaryId = Number(id);
  const queries = useBeneficiaryDetailQueries(beneficiaryId);
  const beneficiary = queries.withMetrics.data ? adaptBeneficiaryProfile(queries.withMetrics.data, queries.metrics.data) : null;
  const transactions = adaptBeneficiaryTransactions(queries.transactions.data?.data ?? []);
  const campaigns = adaptBeneficiaryCampaigns(queries.campaigns.data?.data ?? []);
  const verifications: Array<{ id: string; enumerator: string; date: string; status: string; notes: string }> = [];
  const transactionsPagination = useTablePagination(transactions, undefined, [activeTab]);
  const campaignsPagination = useTablePagination(campaigns, undefined, [activeTab]);
  const verificationsPagination = useTablePagination(verifications, undefined, [activeTab]);
  const errorMessage = queries.profile.error instanceof Error
    ? queries.profile.error.message
    : queries.withMetrics.error instanceof Error
      ? queries.withMetrics.error.message
      : queries.metrics.error instanceof Error
        ? queries.metrics.error.message
        : queries.transactions.error instanceof Error
          ? queries.transactions.error.message
          : queries.campaigns.error instanceof Error
            ? queries.campaigns.error.message
            : null;

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant?: "default" | "secondary" | "outline" | "success" | "warning" | "destructive" }> = {
      Active: { variant: "success" },
      Pending: { variant: "warning" },
      Suspended: { variant: "secondary" },
      Completed: { variant: "success" },
      Verified: { variant: "success" },
      Rejected: { variant: "destructive" }
    };
    return <Badge {...(variants[status] || {})}>{status}</Badge>;
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/backoffice/beneficiaries")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('beneficiaryProfilePage.backToBeneficiaries')}
        </Button>
      </div>

      {errorMessage ? (
        <Card className="mb-6">
          <CardContent className="p-4">
            <p style={{  color: 'var(--error)' }}>{errorMessage}</p>
          </CardContent>
        </Card>
      ) : null}

      {/* Beneficiary Information Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 style={{  fontWeight: 'var(--font-weight-semi-bold)' }}>
                  {beneficiary?.fullName ?? (queries.withMetrics.isPending ? t('beneficiaryProfilePage.loadingBeneficiary') : t('beneficiaryProfilePage.beneficiaryUnavailable'))}
                </h1>
                {beneficiary ? getStatusBadge(beneficiary.status) : null}
              </div>
              <p style={{  color: 'var(--muted-foreground)' }}>
                 {beneficiary?.beneficiaryCode ?? t('beneficiaryProfilePage.loadingDetails')}
              </p>
            </div>
            <Button onClick={() => navigate(`/backoffice/beneficiaries/form/${id}`)}>
              {t('beneficiaryProfilePage.editProfile')}
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 mt-1" style={{ color: 'var(--muted-foreground)' }} />
              <div>
                <p style={{  color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {t('beneficiaryProfilePage.phoneNumber')}
                </p>
                <p style={{  fontWeight: 'var(--font-weight-medium)', marginTop: '4px' }}>
                   {beneficiary?.msisdn ?? '—'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 mt-1" style={{ color: 'var(--muted-foreground)' }} />
              <div>
                <p style={{  color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {t('beneficiaryProfilePage.location')}
                </p>
                <p style={{  fontWeight: 'var(--font-weight-medium)', marginTop: '4px' }}>
                   {beneficiary ? `${beneficiary.district}, ${beneficiary.province}` : '—'}
                </p>
                <p style={{  color: 'var(--muted-foreground)' }}>
                   {beneficiary?.community ?? '—'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 mt-1" style={{ color: 'var(--success)' }} />
              <div>
                <p style={{  color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {t('beneficiaryProfilePage.verificationStatus')}
                </p>
                <p style={{  fontWeight: 'var(--font-weight-medium)', marginTop: '4px' }}>
                   {beneficiary?.verificationStatus ?? 'Pending'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <p style={{  color: 'var(--muted-foreground)', marginBottom: '8px' }}>
              {t('beneficiaryProfilePage.totalReceived')}
            </p>
            <p style={{  fontWeight: 'var(--font-weight-semi-bold)' }}>
               {formatMetical(beneficiary?.totalReceived ?? 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p style={{  color: 'var(--muted-foreground)', marginBottom: '8px' }}>
              {t('beneficiaryProfilePage.lastTransaction')}
            </p>
            <p style={{  fontWeight: 'var(--font-weight-semi-bold)' }}>
               {beneficiary?.lastTransaction ?? '—'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p style={{  color: 'var(--muted-foreground)', marginBottom: '8px' }}>
              {t('beneficiaryProfilePage.activeCampaigns')}
            </p>
            <p style={{  fontWeight: 'var(--font-weight-semi-bold)' }}>
               {beneficiary?.campaignCount ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      {beneficiary ? <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">{t('beneficiaryProfilePage.overview')}</TabsTrigger>
          <TabsTrigger value="transactions">{t('beneficiaryProfilePage.transactions')}</TabsTrigger>
          <TabsTrigger value="campaigns">{t('beneficiaryProfilePage.campaigns')}</TabsTrigger>
          <TabsTrigger value="verification">{t('beneficiaryProfilePage.verification')}</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <h3 style={{  fontWeight: 'var(--font-weight-semi-bold)' }}>
                  {t('beneficiaryProfilePage.personalInformation')}
                </h3>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div>
                    <p style={{  color: 'var(--muted-foreground)', marginBottom: '6px' }}>
                      {t('beneficiaryProfilePage.fullName')}
                    </p>
                    <p style={{  fontWeight: 'var(--font-weight-medium)' }}>
                      {beneficiary.fullName}
                    </p>
                  </div>
                  <div>
                    <p style={{  color: 'var(--muted-foreground)', marginBottom: '6px' }}>
                      Gender
                    </p>
                    <p style={{  fontWeight: 'var(--font-weight-medium)' }}>
                      {beneficiary.gender}
                    </p>
                  </div>
                  <div>
                    <p style={{  color: 'var(--muted-foreground)', marginBottom: '6px' }}>
                      Date of Birth
                    </p>
                    <p style={{  fontWeight: 'var(--font-weight-medium)' }}>
                      {beneficiary.dateOfBirth}
                    </p>
                  </div>
                  <div>
                    <p style={{  color: 'var(--muted-foreground)', marginBottom: '6px' }}>
                      Phone Number (MSISDN)
                    </p>
                    <p style={{  fontWeight: 'var(--font-weight-medium)' }}>
                      {beneficiary.msisdn}
                    </p>
                  </div>
                  <div>
                    <p style={{  color: 'var(--muted-foreground)', marginBottom: '6px' }}>
                      Email
                    </p>
                    <p style={{  fontWeight: 'var(--font-weight-medium)', color: beneficiary.email ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                      {beneficiary.email || '—'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 style={{  fontWeight: 'var(--font-weight-semi-bold)' }}>
                  Identity & Verification
                </h3>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div>
                    <p style={{  color: 'var(--muted-foreground)', marginBottom: '6px' }}>
                      National ID
                    </p>
                    <p style={{  fontWeight: 'var(--font-weight-medium)', fontFamily: 'monospace' }}>
                      {beneficiary.nationalId}
                    </p>
                  </div>
                  <div>
                    <p style={{  color: 'var(--muted-foreground)', marginBottom: '6px' }}>
                      ID Type
                    </p>
                    <p style={{  fontWeight: 'var(--font-weight-medium)' }}>
                      {beneficiary.idType} (Bilhete de Identidade)
                    </p>
                  </div>
                  <div>
                    <p style={{  color: 'var(--muted-foreground)', marginBottom: '6px' }}>
                      ID Verification Status
                    </p>
                    <div className="flex items-center gap-2">
                      {beneficiary.nationalIdVerified ? (
                        <>
                          <CheckCircle className="w-4 h-4" style={{ color: 'var(--success)' }} />
                          <p style={{  fontWeight: 'var(--font-weight-medium)', color: 'var(--success)' }}>
                            Verified
                          </p>
                        </>
                      ) : (
                        <p style={{  fontWeight: 'var(--font-weight-medium)', color: 'var(--warning)' }}>
                          Pending Verification
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <p style={{  color: 'var(--muted-foreground)', marginBottom: '6px' }}>
                      Verification Status
                    </p>
                    <div>
                      {getStatusBadge(beneficiary.verificationStatus)}
                    </div>
                  </div>
                  <div>
                    <p style={{  color: 'var(--muted-foreground)', marginBottom: '6px' }}>
                      Registration Date
                    </p>
                    <p style={{  fontWeight: 'var(--font-weight-medium)' }}>
                      {beneficiary.createdAt}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 style={{  fontWeight: 'var(--font-weight-semi-bold)' }}>
                  Location Information
                </h3>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div>
                    <p style={{  color: 'var(--muted-foreground)', marginBottom: '6px' }}>
                      Province
                    </p>
                    <p style={{  fontWeight: 'var(--font-weight-medium)' }}>
                      {beneficiary.province}
                    </p>
                  </div>
                  <div>
                    <p style={{  color: 'var(--muted-foreground)', marginBottom: '6px' }}>
                      District
                    </p>
                    <p style={{  fontWeight: 'var(--font-weight-medium)' }}>
                      {beneficiary.district}
                    </p>
                  </div>
                  <div>
                    <p style={{  color: 'var(--muted-foreground)', marginBottom: '6px' }}>
                      Community
                    </p>
                    <p style={{  fontWeight: 'var(--font-weight-medium)' }}>
                      {beneficiary.community}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 style={{  fontWeight: 'var(--font-weight-semi-bold)' }}>
                  Mobile Money Information
                </h3>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div>
                    <p style={{  color: 'var(--muted-foreground)', marginBottom: '6px' }}>
                      Mobile Money Provider
                    </p>
                    <p style={{  fontWeight: 'var(--font-weight-medium)' }}>
                      {beneficiary.mobileMoneyProvider}
                    </p>
                  </div>
                  <div>
                    <p style={{  color: 'var(--muted-foreground)', marginBottom: '6px' }}>
                      Account Name
                    </p>
                    <p style={{  fontWeight: 'var(--font-weight-medium)' }}>
                      {beneficiary.mobileMoneyName}
                    </p>
                  </div>
                  <div>
                    <p style={{  color: 'var(--muted-foreground)', marginBottom: '6px' }}>
                      Account Number
                    </p>
                    <p style={{  fontWeight: 'var(--font-weight-medium)', fontFamily: 'monospace' }}>
                      {beneficiary.msisdn}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-2">
              <CardHeader>
                <h3 style={{  fontWeight: 'var(--font-weight-semi-bold)' }}>
                  Additional Notes
                </h3>
              </CardHeader>
              <CardContent>
                <p style={{  lineHeight: '1.6' }}>
                  {beneficiary.notes}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <div className="space-y-3">
            <h3 style={{  fontWeight: 'var(--font-weight-semi-bold)' }}>
              Transaction History
            </h3>
            <Card>
              <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Campaign</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-12 text-center">
                        <p style={{  color: 'var(--muted-foreground)' }}>No transactions found.</p>
                      </TableCell>
                    </TableRow>
                  ) : transactionsPagination.paginatedItems.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <span style={{ fontWeight: 'var(--font-weight-medium)',  fontFamily: 'var(--font-mono)' }}>
                          {transaction.id}
                        </span>
                      </TableCell>
                      <TableCell>
                        {transaction.campaign}
                      </TableCell>
                      <TableCell className="text-right" style={{  fontWeight: 'var(--font-weight-medium)' }}>
                        {formatMetical(transaction.amount)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(transaction.status)}
                      </TableCell>
                      <TableCell style={{  color: 'var(--muted-foreground)' }}>
                        {transaction.date}
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
          </div>
        </TabsContent>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns">
          <div className="space-y-3">
            <h3 style={{  fontWeight: 'var(--font-weight-semi-bold)' }}>
              Campaign Participation
            </h3>
            <Card>
              <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign ID</TableHead>
                    <TableHead>Campaign Name</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Enrolled Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-12 text-center">
                        <p style={{  color: 'var(--muted-foreground)' }}>No campaign participation found.</p>
                      </TableCell>
                    </TableRow>
                  ) : campaignsPagination.paginatedItems.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell>
                        <span style={{ fontWeight: 'var(--font-weight-medium)',  fontFamily: 'var(--font-mono)' }}>
                          {campaign.id}
                        </span>
                      </TableCell>
                      <TableCell style={{  fontWeight: 'var(--font-weight-medium)' }}>
                        {campaign.name}
                      </TableCell>
                      <TableCell style={{  color: 'var(--muted-foreground)' }}>
                        {campaign.program}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(campaign.status)}
                      </TableCell>
                      <TableCell style={{  color: 'var(--muted-foreground)' }}>
                        {campaign.enrolled}
                      </TableCell>
                    </TableRow>
                  ))}
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
        </TabsContent>

        {/* Verification Tab */}
        <TabsContent value="verification">
          <div className="space-y-3">
            <h3 style={{  fontWeight: 'var(--font-weight-semi-bold)' }}>
              Field Verification Activity
            </h3>
            <Card>
              <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Verification ID</TableHead>
                    <TableHead>Enumerator</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {verifications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-12 text-center">
                        <p style={{  color: 'var(--muted-foreground)' }}>
                          Verification history is not wired yet for this screen.
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : verificationsPagination.paginatedItems.map((verification) => (
                    <TableRow key={verification.id}>
                      <TableCell>
                        <span style={{ fontWeight: 'var(--font-weight-medium)',  fontFamily: 'var(--font-mono)' }}>
                          {verification.id}
                        </span>
                      </TableCell>
                      <TableCell>
                        {verification.enumerator}
                      </TableCell>
                      <TableCell style={{  color: 'var(--muted-foreground)' }}>
                        {verification.date}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(verification.status)}
                      </TableCell>
                      <TableCell style={{  color: 'var(--muted-foreground)' }}>
                        {verification.notes}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <DataTablePagination
                page={verificationsPagination.page}
                pageSize={verificationsPagination.pageSize}
                totalItems={verificationsPagination.totalItems}
                totalPages={verificationsPagination.totalPages}
                onPageChange={verificationsPagination.setPage}
              />
            </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs> : null}
    </div>
  );
}
