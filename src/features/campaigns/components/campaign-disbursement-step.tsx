import type { Dispatch, SetStateAction } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select'
import { Switch } from '@/app/components/ui/switch'
import { useTranslation } from 'react-i18next'
import type { CampaignFormData } from '@/features/campaigns/components/create-campaign-shared'

type Option = { id: number; name: string }

type Props = {
  formData: CampaignFormData
  setFormData: Dispatch<SetStateAction<CampaignFormData>>
  paymentChannels: Option[]
  disbursementTypes: Option[]
}

export function CampaignDisbursementStep({
  formData,
  setFormData,
  paymentChannels,
  disbursementTypes,
}: Props) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle style={{ fontSize: 'var(--text-20)' }}>
          {t('createCampaignPage.disbursementConfiguration')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>{t('createCampaignPage.paymentChannel')}</Label>
          <Select
            value={formData.paymentChannel}
            onValueChange={(value) =>
              setFormData((current) => ({ ...current, paymentChannel: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder={t('createCampaignPage.selectPaymentChannel')} />
            </SelectTrigger>
            <SelectContent>
              {paymentChannels.map((option) => (
                <SelectItem key={option.id} value={String(option.id)}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t('createCampaignPage.disbursementType')}</Label>
          <Select
            value={formData.disbursementType}
            onValueChange={(value) =>
              setFormData((current) => ({ ...current, disbursementType: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder={t('createCampaignPage.selectDisbursementType')} />
            </SelectTrigger>
            <SelectContent>
              {disbursementTypes.map((option) => (
                <SelectItem key={option.id} value={String(option.id)}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="executionDate">{t('createCampaignPage.executionDate')}</Label>
          <Input
            id="executionDate"
            type="date"
            value={formData.executionDate}
            onChange={(event) =>
              setFormData((current) => ({ ...current, executionDate: event.target.value }))
            }
          />
        </div>

        <div
          className="flex items-center justify-between rounded-[--radius] border p-4"
          style={{ borderColor: 'var(--border)' }}
        >
          <div>
            <p style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)' }}>
              {t('createCampaignPage.enableStagedDisbursement')}
            </p>
            <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
              {t('createCampaignPage.stagedDisbursementHelp')}
            </p>
          </div>
          <Switch
            checked={formData.stagedDisbursement}
            onCheckedChange={(checked) =>
              setFormData((current) => ({ ...current, stagedDisbursement: checked }))
            }
          />
        </div>
      </CardContent>
    </Card>
  )
}
