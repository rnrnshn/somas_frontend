import { ArrowLeft, Pause, Play, SquarePen, XCircle } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { useTranslation } from 'react-i18next'
import { CampaignStatusBadge } from '@/features/campaigns/components/campaign-detail-shared'

type CampaignHeaderData = {
  id: number | string
  name: string
  status: string
  program: string
  region: string
}

type Props = {
  campaign: CampaignHeaderData | null
  isLoading: boolean
  isAnalyticsOnly: boolean
  canExecuteDisbursement: boolean
  isExecuting: boolean
  onBack: () => void
  onEdit: () => void
  onExecute: () => void
  onSuspend: () => void
  onClose: () => void
}

export function CampaignDetailHeader({
  campaign,
  isLoading,
  isAnalyticsOnly,
  canExecuteDisbursement,
  isExecuting,
  onBack,
  onEdit,
  onExecute,
  onSuspend,
  onClose,
}: Props) {
  const { t } = useTranslation()

  return (
    <div className="mb-8">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t('campaignDetailPage.backToCampaigns')}
      </Button>
      <div className="flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <h1 style={{ fontSize: 'var(--text-32)', fontWeight: 'var(--font-weight-semi-bold)' }}>
              {campaign?.name ??
                (isLoading
                  ? t('campaignDetailPage.loadingCampaign')
                  : t('campaignDetailPage.campaignUnavailable'))}
            </h1>
            {campaign ? <CampaignStatusBadge status={campaign.status} /> : null}
          </div>
          <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }}>
            {campaign
              ? `${campaign.id} • ${campaign.program} • ${campaign.region}`
              : t('campaignDetailPage.loadingDetails')}
          </p>
        </div>

        {isAnalyticsOnly ? null : (
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onEdit}>
              <SquarePen className="mr-2 h-4 w-4" />
              {t('campaignDetailPage.edit')}
            </Button>
            <Button onClick={onExecute} disabled={!canExecuteDisbursement || isExecuting}>
              <Play className="mr-2 h-4 w-4" />
              {isExecuting ? t('campaignDetailPage.executing') : t('campaignDetailPage.executeDisbursement')}
            </Button>
            <Button variant="outline" onClick={onSuspend}>
              <Pause className="mr-2 h-4 w-4" />
              {t('campaignDetailPage.suspend')}
            </Button>
            <Button variant="outline" onClick={onClose}>
              <XCircle className="mr-2 h-4 w-4" />
              {t('campaignDetailPage.close')}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
