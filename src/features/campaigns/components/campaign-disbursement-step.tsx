import { useState, type Dispatch, type SetStateAction } from 'react'
import { Card, CardContent } from '@/app/components/ui/card'
import { Label } from '@/app/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select'
import { Switch } from '@/app/components/ui/switch'
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover'
import { Calendar } from '@/app/components/ui/calendar'
import { Button } from '@/app/components/ui/button'
import { Calendar as CalendarIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { CampaignFormData } from '@/features/campaigns/components/create-campaign-shared'

type Option = { id: number; name: string }

type Props = {
  formData: CampaignFormData
  setFormData: Dispatch<SetStateAction<CampaignFormData>>
  paymentChannels: Option[]
  disbursementTypes: Option[]
  paymentChannelsLoading: boolean
  disbursementTypesLoading: boolean
}

export function CampaignDisbursementStep({
  formData,
  setFormData,
  paymentChannels,
  disbursementTypes,
  paymentChannelsLoading,
  disbursementTypesLoading}: Props) {
  const { t } = useTranslation()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [isExecutionDateOpen, setIsExecutionDateOpen] = useState(false)

  const parseDate = (value: string) => {
    if (!value) return undefined
    const [year, month, day] = value.split('-').map((part) => Number(part))
    if (!year || !month || !day) return undefined
    return new Date(year, month - 1, day)
  }

  const formatDateValue = (date?: Date) => {
    if (!date) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const formatDateLabel = (value: string) => {
    const date = parseDate(value)
    return date ? date.toLocaleDateString() : ''
  }

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-2">
          <Label>{t('createCampaignPage.paymentChannel')}</Label>
          <Select
            value={formData.paymentChannel}
            onValueChange={(value) =>
              setFormData((current) => ({ ...current, paymentChannel: value }))
            }
          >
            <SelectTrigger isLoading={paymentChannelsLoading}>
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
            <SelectTrigger isLoading={disbursementTypesLoading}>
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
          <Popover open={isExecutionDateOpen} onOpenChange={setIsExecutionDateOpen}>
            <PopoverTrigger asChild>
              <Button
                id="executionDate"
                variant="outline"
                className="group w-full justify-between bg-input-background font-normal"
              >
                {formData.executionDate ? formatDateLabel(formData.executionDate) : t('createCampaignPage.executionDate')}
                <CalendarIcon className="h-4 w-4 text-muted-foreground group-hover:text-white" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="p-0 w-auto">
              <Calendar
                mode="single"
                selected={parseDate(formData.executionDate)}
                onSelect={(date) => {
                  setFormData((current) => ({ ...current, executionDate: formatDateValue(date) }));
                  setIsExecutionDateOpen(false);
                }}
                disabled={{ before: today }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div
          className="flex items-center justify-between rounded-[var(--radius)] border p-4"
          style={{ borderColor: 'var(--border)' }}
        >
          <div>
            <p style={{  fontWeight: 'var(--font-weight-medium)' }}>
              {t('createCampaignPage.enableStagedDisbursement')}
            </p>
            <p style={{  color: 'var(--muted-foreground)' }}>
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
