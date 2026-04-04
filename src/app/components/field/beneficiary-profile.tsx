import { useNavigate, useParams } from "@/lib/router";
import { useFieldDisbursementQuery } from "@/features/field/hooks/use-field-queries";
import { formatMetical } from "@/lib/format/currency";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ArrowLeft, Phone, MapPin, Calendar, DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";

export function BeneficiaryProfile() {
  const { t } = useTranslation();
  const { campaignId, campaignBeneficiaryId } = useParams<{ campaignId?: string; campaignBeneficiaryId?: string }>();
  const navigate = useNavigate();
  const numericCampaignId = Number(campaignId);
  const numericCampaignBeneficiaryId = Number(campaignBeneficiaryId);
  const query = useFieldDisbursementQuery(numericCampaignId, numericCampaignBeneficiaryId);

  if (query.isPending) {
    return <div className="p-6 pb-24"><Card><CardContent className="p-8 text-center"><p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }}>{t('fieldBeneficiaryPage.loadingRecord')}</p></CardContent></Card></div>;
  }

  if (query.error || !query.data) {
    return <div className="p-6 pb-24"><Card><CardContent className="p-8 text-center"><p style={{ fontSize: 'var(--text-14)', color: 'var(--error)' }}>{query.error instanceof Error ? query.error.message : t('fieldBeneficiaryPage.loadError')}</p></CardContent></Card></div>;
  }

  const beneficiary = {
    id: `CB-${query.data.id}`,
    name: query.data.beneficiary?.name ?? t('fieldBeneficiaryPage.beneficiary'),
    phone: query.data.beneficiary?.msisdn ?? '—',
    address: t('fieldBeneficiaryPage.addressUnavailable'),
    status: formatDisbursementStatus(query.data.disbursementStatus, t),
    campaign: query.data.campaign?.name ?? t('fieldBeneficiaryPage.campaignUnavailable'),
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
          {t('fieldBeneficiaryPage.back')}
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
          <CardTitle style={{ fontSize: 'var(--text-18)' }}>{t('fieldBeneficiaryPage.personalInformation')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                {t('fieldBeneficiaryPage.phoneNumber')}
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
                {t('fieldBeneficiaryPage.address')}
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
          <CardTitle style={{ fontSize: 'var(--text-18)' }}>{t('fieldBeneficiaryPage.programDetails')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
              {t('fieldBeneficiaryPage.campaign')}
            </p>
            <p style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)' }}>
              {beneficiary.campaign}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                {t('fieldBeneficiaryPage.enrolled')}
              </p>
              <p style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)' }}>
                {beneficiary.enrollmentDate ? new Date(beneficiary.enrollmentDate).toLocaleDateString() : '—'}
              </p>
            </div>
            <div>
              <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                {t('fieldBeneficiaryPage.lastPayment')}
              </p>
              <p style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)' }}>
                {beneficiary.lastPayment ? new Date(beneficiary.lastPayment).toLocaleDateString() : '—'}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-border">
            <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
              {t('fieldBeneficiaryPage.totalReceived')}
            </p>
            <p style={{ fontSize: 'var(--text-24)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--accent)' }}>
              {beneficiary.totalReceived}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle style={{ fontSize: 'var(--text-18)' }}>{t('fieldBeneficiaryPage.verificationAction')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-[--radius] border border-border p-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)' }}>
                  {t('fieldBeneficiaryPage.disbursementAmount')}
                </p>
                <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                  {t('fieldBeneficiaryPage.currentStatus', { status: beneficiary.status })}
                </p>
              </div>
            </div>
            <p style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-semi-bold)' }}>
              {beneficiary.totalReceived}
            </p>
          </div>

          <Button className="w-full" onClick={() => navigate(`/field/beneficiary/${numericCampaignId}/${numericCampaignBeneficiaryId}/verify`)}>
            {t('fieldBeneficiaryPage.startVerification')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function formatDisbursementStatus(status: string, t: (key: string) => string) {
  switch (status) {
    case 'confirmed':
      return t('fieldSearchPage.confirmed');
    case 'not_confirmed':
      return t('fieldSearchPage.notConfirmed');
    case 'not_found':
      return t('fieldSearchPage.notFound');
    case 'pending':
      return t('fieldSearchPage.pending');
    default:
      return status;
  }
}

function formatMzn(amount: number) {
  return formatMetical(amount);
}
