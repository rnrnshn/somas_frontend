import { useNavigate, useParams } from "@/lib/router";
import { useFieldDisbursementQuery } from "@/features/field/hooks/use-field-queries";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ArrowLeft, Phone, MapPin, Calendar, DollarSign } from "lucide-react";

export function BeneficiaryProfile() {
  const { campaignId, campaignBeneficiaryId } = useParams<{ campaignId?: string; campaignBeneficiaryId?: string }>();
  const navigate = useNavigate();
  const numericCampaignId = Number(campaignId);
  const numericCampaignBeneficiaryId = Number(campaignBeneficiaryId);
  const query = useFieldDisbursementQuery(numericCampaignId, numericCampaignBeneficiaryId);

  if (query.isPending) {
    return <div className="p-6 pb-24"><Card><CardContent className="p-8 text-center"><p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }}>Loading beneficiary record...</p></CardContent></Card></div>;
  }

  if (query.error || !query.data) {
    return <div className="p-6 pb-24"><Card><CardContent className="p-8 text-center"><p style={{ fontSize: 'var(--text-14)', color: 'var(--error)' }}>{query.error instanceof Error ? query.error.message : 'Beneficiary record could not be loaded.'}</p></CardContent></Card></div>;
  }

  const beneficiary = {
    id: `CB-${query.data.id}`,
    name: query.data.beneficiary?.name ?? 'Beneficiary',
    phone: query.data.beneficiary?.msisdn ?? '—',
    address: 'Address details are not available in the field disbursement endpoint.',
    status: formatDisbursementStatus(query.data.disbursementStatus),
    campaign: query.data.campaign?.name ?? 'Campaign unavailable',
    enrollmentDate: null,
    lastPayment: null,
    totalReceived: formatMzn(query.data.disbursementAmount),
  };

  return (
    <div className="p-6 pb-24">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          className="mb-4 -ml-3"
          onClick={() => navigate('/field/search')}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <h1 style={{ fontSize: 'var(--text-24)' }}>{beneficiary.name}</h1>
            <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }} className="mt-1">
              {beneficiary.id}
            </p>
          </div>
          <Badge variant={query.data.disbursementStatus === 'confirmed' ? 'default' : 'outline'} style={{ backgroundColor: query.data.disbursementStatus === 'confirmed' ? 'var(--success)' : undefined, color: query.data.disbursementStatus === 'confirmed' ? 'var(--success-foreground)' : undefined }}>
            {beneficiary.status}
          </Badge>
        </div>
      </div>

      {/* Profile Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle style={{ fontSize: 'var(--text-18)' }}>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                Phone Number
              </p>
              <p style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)' }}>
                {beneficiary.phone}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                Address
              </p>
              <p style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)' }}>
                {beneficiary.address}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Program Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle style={{ fontSize: 'var(--text-18)' }}>Program Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
              Campaign
            </p>
            <p style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)' }}>
              {beneficiary.campaign}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                Enrolled
              </p>
              <p style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)' }}>
                {beneficiary.enrollmentDate ? new Date(beneficiary.enrollmentDate).toLocaleDateString() : '—'}
              </p>
            </div>
            <div>
              <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                Last Payment
              </p>
              <p style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)' }}>
                {beneficiary.lastPayment ? new Date(beneficiary.lastPayment).toLocaleDateString() : '—'}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-border">
            <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
              Total Received
            </p>
            <p style={{ fontSize: 'var(--text-24)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--accent)' }}>
              {beneficiary.totalReceived}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle style={{ fontSize: 'var(--text-18)' }}>Verification Action</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-[--radius] border border-border p-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)' }}>
                  Disbursement amount
                </p>
                <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                  Current status: {beneficiary.status}
                </p>
              </div>
            </div>
            <p style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-semi-bold)' }}>
              {beneficiary.totalReceived}
            </p>
          </div>

          <Button className="w-full" onClick={() => navigate(`/field/beneficiary/${numericCampaignId}/${numericCampaignBeneficiaryId}/verify`)}>
            Start Verification
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function formatDisbursementStatus(status: string) {
  switch (status) {
    case 'confirmed':
      return 'Confirmed';
    case 'not_confirmed':
      return 'Not confirmed';
    case 'not_found':
      return 'Not found';
    case 'pending':
      return 'Pending';
    default:
      return status;
  }
}

function formatMzn(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MZN', maximumFractionDigits: 0 }).format(amount);
}
