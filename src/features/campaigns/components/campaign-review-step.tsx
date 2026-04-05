import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { useTranslation } from 'react-i18next'

type Props = {
  name: string
  programLabel: string
  regionLabel: string
  paymentChannelLabel: string
  validBeneficiaries: number
  totalDisbursementLabel: string
  executionDate: string
  savingsEnabled: boolean
}

export function CampaignReviewStep({
  name,
  programLabel,
  regionLabel,
  paymentChannelLabel,
  validBeneficiaries,
  totalDisbursementLabel,
  executionDate,
  savingsEnabled,
}: Props) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle style={{ fontSize: 'var(--text-20)' }}>
          {t('createCampaignPage.reviewConfirm')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <ReviewItem label={t('createCampaignPage.campaignName')} value={name || '—'} />
          <ReviewItem label={t('campaignsPage.program')} value={programLabel || '—'} />
          <ReviewItem label={t('createCampaignPage.region')} value={regionLabel || '—'} />
          <ReviewItem label={t('createCampaignPage.paymentChannel')} value={paymentChannelLabel || '—'} />
          <ReviewItem
            label={t('createCampaignPage.totalBeneficiaries')}
            value={validBeneficiaries.toLocaleString()}
          />
          <ReviewItem label={t('createCampaignPage.totalDisbursementAmount')} value={totalDisbursementLabel} />
          <ReviewItem label={t('createCampaignPage.executionDate')} value={executionDate || '—'} />
          <ReviewItem
            label={t('createCampaignPage.savingsEnabled')}
            value={savingsEnabled ? t('createCampaignPage.yes') : t('createCampaignPage.no')}
          />
        </div>
      </CardContent>
    </Card>
  )
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)', marginBottom: '4px' }}>
        {label}
      </p>
      <p style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)' }}>{value}</p>
    </div>
  )
}
