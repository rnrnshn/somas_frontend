import { Card, CardContent } from '@/app/components/ui/card'
import { useTranslation } from 'react-i18next'

type Props = {
  name: string
  programLabel: string
  regionLabel: string
  provinceLabel: string
  districtLabel: string
  paymentChannelLabel: string
  validBeneficiaries: number
  totalDisbursementLabel: string
  executionDate: string
}

export function CampaignReviewStep({
  name,
  programLabel,
  regionLabel,
  provinceLabel,
  districtLabel,
  paymentChannelLabel,
  validBeneficiaries,
  totalDisbursementLabel,
  executionDate}: Props) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-2 gap-6">
          <ReviewItem label={t('createCampaignPage.campaignName')} value={name || '—'} />
          <ReviewItem label={t('campaignsPage.program')} value={programLabel || '—'} />
          <ReviewItem label={t('createCampaignPage.region')} value={regionLabel || '—'} />
          <ReviewItem label={t('createCampaignPage.province')} value={provinceLabel || '—'} />
          <ReviewItem label={t('createCampaignPage.district')} value={districtLabel || '—'} />
          <ReviewItem label={t('createCampaignPage.paymentChannel')} value={paymentChannelLabel || '—'} />
          <ReviewItem
            label={t('createCampaignPage.totalBeneficiaries')}
            value={validBeneficiaries.toLocaleString()}
          />
          <ReviewItem label={t('createCampaignPage.totalDisbursementAmount')} value={totalDisbursementLabel} />
          <ReviewItem label={t('createCampaignPage.executionDate')} value={executionDate || '—'} />
        </div>
      </CardContent>
    </Card>
  )
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  const cleanedLabel = label.replace(/\s*\*\s*$/, '')

  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground mb-1">
        {cleanedLabel}
      </p>
      <p className="font-medium">{value}</p>
    </div>
  )
}
