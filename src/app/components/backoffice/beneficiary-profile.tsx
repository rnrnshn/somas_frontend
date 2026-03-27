import { useState } from "react";
import { useParams, useNavigate } from "@/lib/router";
import { useBeneficiaryDetailQueries } from "@/features/beneficiaries/hooks/use-beneficiary-queries";
import {
  adaptBeneficiaryCampaigns,
  adaptBeneficiaryProfile,
  adaptBeneficiarySavings,
  adaptBeneficiaryTransactions,
} from "@/features/beneficiaries/adapters/beneficiaries";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../ui/table";
import { ArrowLeft, Phone, MapPin, CheckCircle } from "lucide-react";

export function BeneficiaryProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const beneficiaryId = Number(id);
  const queries = useBeneficiaryDetailQueries(beneficiaryId);
  const beneficiary = queries.withMetrics.data ? adaptBeneficiaryProfile(queries.withMetrics.data, queries.metrics.data) : null;
  const transactions = adaptBeneficiaryTransactions(queries.transactions.data?.data ?? []);
  const savings = adaptBeneficiarySavings(queries.savings.data?.data ?? []);
  const campaigns = adaptBeneficiaryCampaigns(queries.campaigns.data?.data ?? []);
  const verifications: Array<{ id: string; enumerator: string; date: string; status: string; notes: string }> = [];
  const errorMessage = queries.profile.error instanceof Error
    ? queries.profile.error.message
    : queries.withMetrics.error instanceof Error
      ? queries.withMetrics.error.message
      : queries.metrics.error instanceof Error
        ? queries.metrics.error.message
        : queries.transactions.error instanceof Error
          ? queries.transactions.error.message
          : queries.savings.error instanceof Error
            ? queries.savings.error.message
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
          Back to Beneficiaries
        </Button>
      </div>

      {errorMessage ? (
        <Card className="mb-6">
          <CardContent className="p-4">
            <p style={{ fontSize: 'var(--text-14)', color: 'var(--error)' }}>{errorMessage}</p>
          </CardContent>
        </Card>
      ) : null}

      {/* Beneficiary Information Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 style={{ fontSize: 'var(--text-28)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                  {beneficiary?.fullName ?? (queries.withMetrics.isPending ? 'Loading beneficiary...' : 'Beneficiary unavailable')}
                </h1>
                {beneficiary ? getStatusBadge(beneficiary.status) : null}
              </div>
              <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }}>
                {beneficiary?.beneficiaryCode ?? 'Loading beneficiary details'}
              </p>
            </div>
            <Button onClick={() => navigate(`/backoffice/beneficiaries/form/${id}`)}>
              Edit Profile
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 mt-1" style={{ color: 'var(--muted-foreground)' }} />
              <div>
                <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Phone Number
                </p>
                <p style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)', marginTop: '4px' }}>
                   {beneficiary?.msisdn ?? '—'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 mt-1" style={{ color: 'var(--muted-foreground)' }} />
              <div>
                <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Location
                </p>
                <p style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)', marginTop: '4px' }}>
                   {beneficiary ? `${beneficiary.district}, ${beneficiary.province}` : '—'}
                </p>
                <p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)' }}>
                   {beneficiary?.community ?? '—'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 mt-1" style={{ color: 'var(--success)' }} />
              <div>
                <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Verification Status
                </p>
                <p style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)', marginTop: '4px' }}>
                   {beneficiary?.verificationStatus ?? 'Pending'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)', marginBottom: '8px' }}>
              Total Received
            </p>
            <p style={{ fontSize: 'var(--text-32)', fontWeight: 'var(--font-weight-semi-bold)' }}>
               MT {beneficiary?.totalReceived.toLocaleString() ?? '0'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)', marginBottom: '8px' }}>
              Total Saved
            </p>
            <p style={{ fontSize: 'var(--text-32)', fontWeight: 'var(--font-weight-semi-bold)' }}>
               MT {beneficiary?.totalSaved.toLocaleString() ?? '0'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)', marginBottom: '8px' }}>
              Last Transaction
            </p>
            <p style={{ fontSize: 'var(--text-18)', fontWeight: 'var(--font-weight-semi-bold)' }}>
               {beneficiary?.lastTransaction ?? '—'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)', marginBottom: '8px' }}>
              Active Campaigns
            </p>
            <p style={{ fontSize: 'var(--text-32)', fontWeight: 'var(--font-weight-semi-bold)' }}>
               {beneficiary?.campaignCount ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      {beneficiary ? <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="savings">Savings</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <h3 style={{ fontSize: 'var(--text-18)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                  Personal Information
                </h3>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div>
                    <p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)', marginBottom: '6px' }}>
                      Full Name
                    </p>
                    <p style={{ fontSize: 'var(--text-15)', fontWeight: 'var(--font-weight-medium)' }}>
                      {beneficiary.fullName}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)', marginBottom: '6px' }}>
                      Gender
                    </p>
                    <p style={{ fontSize: 'var(--text-15)', fontWeight: 'var(--font-weight-medium)' }}>
                      {beneficiary.gender}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)', marginBottom: '6px' }}>
                      Date of Birth
                    </p>
                    <p style={{ fontSize: 'var(--text-15)', fontWeight: 'var(--font-weight-medium)' }}>
                      {beneficiary.dateOfBirth}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)', marginBottom: '6px' }}>
                      Phone Number (MSISDN)
                    </p>
                    <p style={{ fontSize: 'var(--text-15)', fontWeight: 'var(--font-weight-medium)' }}>
                      {beneficiary.msisdn}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)', marginBottom: '6px' }}>
                      Email
                    </p>
                    <p style={{ fontSize: 'var(--text-15)', fontWeight: 'var(--font-weight-medium)', color: beneficiary.email ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                      {beneficiary.email || '—'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 style={{ fontSize: 'var(--text-18)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                  Identity & Verification
                </h3>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div>
                    <p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)', marginBottom: '6px' }}>
                      National ID
                    </p>
                    <p style={{ fontSize: 'var(--text-15)', fontWeight: 'var(--font-weight-medium)', fontFamily: 'monospace' }}>
                      {beneficiary.nationalId}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)', marginBottom: '6px' }}>
                      ID Type
                    </p>
                    <p style={{ fontSize: 'var(--text-15)', fontWeight: 'var(--font-weight-medium)' }}>
                      {beneficiary.idType} (Bilhete de Identidade)
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)', marginBottom: '6px' }}>
                      ID Verification Status
                    </p>
                    <div className="flex items-center gap-2">
                      {beneficiary.nationalIdVerified ? (
                        <>
                          <CheckCircle className="w-4 h-4" style={{ color: 'var(--success)' }} />
                          <p style={{ fontSize: 'var(--text-15)', fontWeight: 'var(--font-weight-medium)', color: 'var(--success)' }}>
                            Verified
                          </p>
                        </>
                      ) : (
                        <p style={{ fontSize: 'var(--text-15)', fontWeight: 'var(--font-weight-medium)', color: 'var(--warning)' }}>
                          Pending Verification
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)', marginBottom: '6px' }}>
                      Verification Status
                    </p>
                    <div>
                      {getStatusBadge(beneficiary.verificationStatus)}
                    </div>
                  </div>
                  <div>
                    <p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)', marginBottom: '6px' }}>
                      Registration Date
                    </p>
                    <p style={{ fontSize: 'var(--text-15)', fontWeight: 'var(--font-weight-medium)' }}>
                      {beneficiary.createdAt}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 style={{ fontSize: 'var(--text-18)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                  Location Information
                </h3>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div>
                    <p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)', marginBottom: '6px' }}>
                      Province
                    </p>
                    <p style={{ fontSize: 'var(--text-15)', fontWeight: 'var(--font-weight-medium)' }}>
                      {beneficiary.province}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)', marginBottom: '6px' }}>
                      District
                    </p>
                    <p style={{ fontSize: 'var(--text-15)', fontWeight: 'var(--font-weight-medium)' }}>
                      {beneficiary.district}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)', marginBottom: '6px' }}>
                      Community
                    </p>
                    <p style={{ fontSize: 'var(--text-15)', fontWeight: 'var(--font-weight-medium)' }}>
                      {beneficiary.community}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 style={{ fontSize: 'var(--text-18)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                  Mobile Money Information
                </h3>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div>
                    <p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)', marginBottom: '6px' }}>
                      Mobile Money Provider
                    </p>
                    <p style={{ fontSize: 'var(--text-15)', fontWeight: 'var(--font-weight-medium)' }}>
                      {beneficiary.mobileMoneyProvider}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)', marginBottom: '6px' }}>
                      Account Name
                    </p>
                    <p style={{ fontSize: 'var(--text-15)', fontWeight: 'var(--font-weight-medium)' }}>
                      {beneficiary.mobileMoneyName}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)', marginBottom: '6px' }}>
                      Account Number
                    </p>
                    <p style={{ fontSize: 'var(--text-15)', fontWeight: 'var(--font-weight-medium)', fontFamily: 'monospace' }}>
                      {beneficiary.msisdn}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-2">
              <CardHeader>
                <h3 style={{ fontSize: 'var(--text-18)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                  Additional Notes
                </h3>
              </CardHeader>
              <CardContent>
                <p style={{ fontSize: 'var(--text-15)', lineHeight: '1.6' }}>
                  {beneficiary.notes}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <h3 style={{ fontSize: 'var(--text-18)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                Transaction History
              </h3>
            </CardHeader>
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
                        <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }}>No transactions found.</p>
                      </TableCell>
                    </TableRow>
                  ) : transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <span style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--text-13)', fontFamily: 'var(--font-mono)' }}>
                          {transaction.id}
                        </span>
                      </TableCell>
                      <TableCell style={{ fontSize: 'var(--text-13)' }}>
                        {transaction.campaign}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-medium)' }}>
                        MT {transaction.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(transaction.status)}
                      </TableCell>
                      <TableCell style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)' }}>
                        {transaction.date}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Savings Tab */}
        <TabsContent value="savings">
          <Card>
            <CardHeader>
              <h3 style={{ fontSize: 'var(--text-18)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                Savings Contributions
              </h3>
              <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }}>
                Total Saved: MT {beneficiary.totalSaved.toLocaleString()}
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Savings ID</TableHead>
                    <TableHead>Campaign</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {savings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-12 text-center">
                        <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }}>No savings records found.</p>
                      </TableCell>
                    </TableRow>
                  ) : savings.map((saving) => (
                    <TableRow key={saving.id}>
                      <TableCell>
                        <span style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--text-13)', fontFamily: 'var(--font-mono)' }}>
                          {saving.id}
                        </span>
                      </TableCell>
                      <TableCell style={{ fontSize: 'var(--text-13)' }}>
                        {saving.campaign}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-medium)' }}>
                        MT {saving.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(saving.status)}
                      </TableCell>
                      <TableCell style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)' }}>
                        {saving.date}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <h3 style={{ fontSize: 'var(--text-18)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                Campaign Participation
              </h3>
            </CardHeader>
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
                        <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }}>No campaign participation found.</p>
                      </TableCell>
                    </TableRow>
                  ) : campaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell>
                        <span style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--text-13)', fontFamily: 'var(--font-mono)' }}>
                          {campaign.id}
                        </span>
                      </TableCell>
                      <TableCell style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-medium)' }}>
                        {campaign.name}
                      </TableCell>
                      <TableCell style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)' }}>
                        {campaign.program}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(campaign.status)}
                      </TableCell>
                      <TableCell style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)' }}>
                        {campaign.enrolled}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Verification Tab */}
        <TabsContent value="verification">
          <Card>
            <CardHeader>
              <h3 style={{ fontSize: 'var(--text-18)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                Field Verification Activity
              </h3>
            </CardHeader>
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
                        <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }}>
                          Verification history is not wired yet for this screen.
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : verifications.map((verification) => (
                    <TableRow key={verification.id}>
                      <TableCell>
                        <span style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--text-13)', fontFamily: 'var(--font-mono)' }}>
                          {verification.id}
                        </span>
                      </TableCell>
                      <TableCell style={{ fontSize: 'var(--text-13)' }}>
                        {verification.enumerator}
                      </TableCell>
                      <TableCell style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)' }}>
                        {verification.date}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(verification.status)}
                      </TableCell>
                      <TableCell style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)' }}>
                        {verification.notes}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs> : null}
    </div>
  );
}
