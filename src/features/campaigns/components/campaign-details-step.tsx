import { useState, type Dispatch, type SetStateAction } from 'react'
import { Card, CardContent } from '@/app/components/ui/card'
import { Alert, AlertDescription } from '@/app/components/ui/alert'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select'
import { Textarea } from '@/app/components/ui/textarea'
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
  programs: Option[]
  regions: Option[]
  provinces: Option[]
  districts: Option[]
  programsLoading: boolean
  regionsLoading: boolean
  provincesLoading: boolean
  districtsLoading: boolean
  submitError: string | null
  catalogsError: unknown
  campaignError: unknown
}

export function CampaignDetailsStep({
  formData,
  setFormData,
  programs,
  regions,
  provinces,
  districts,
  programsLoading,
  regionsLoading,
  provincesLoading,
  districtsLoading,
  submitError,
  catalogsError,
  campaignError}: Props) {
  const { t } = useTranslation()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [isStartDateOpen, setIsStartDateOpen] = useState(false)
  const [isEndDateOpen, setIsEndDateOpen] = useState(false)

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
        {catalogsError || submitError ? (
          <Alert variant="destructive">
            <AlertDescription>
              {submitError ??
                (catalogsError instanceof Error
                  ? catalogsError.message
                  : campaignError instanceof Error
                    ? campaignError.message
                    : t('createCampaignPage.catalogsLoadError'))}
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="name">{t('createCampaignPage.campaignName')}</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
            placeholder={t('createCampaignPage.campaignNamePlaceholder')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="program">{t('createCampaignPage.programName')}</Label>
            <Select
              value={formData.program}
              onValueChange={(value) => setFormData((current) => ({ ...current, program: value }))}
            >
              <SelectTrigger isLoading={programsLoading}>
                <SelectValue placeholder={t('createCampaignPage.selectProgram')} />
              </SelectTrigger>
              <SelectContent>
                {programs.map((option) => (
                  <SelectItem key={option.id} value={String(option.id)}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">{t('createCampaignPage.region')}</Label>
            <Select
              value={formData.region}
              onValueChange={(value) => setFormData((current) => ({ ...current, region: value }))}
            >
              <SelectTrigger isLoading={regionsLoading}>
                <SelectValue placeholder={t('createCampaignPage.selectRegion')} />
              </SelectTrigger>
              <SelectContent>
                {regions.map((option) => (
                  <SelectItem key={option.id} value={String(option.id)}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="province">{t('createCampaignPage.province')}</Label>
            <Select
              value={formData.province}
              onValueChange={(value) =>
                setFormData((current) => ({ ...current, province: value, district: '' }))
              }
            >
              <SelectTrigger isLoading={provincesLoading}>
                <SelectValue placeholder={t('createCampaignPage.province')} />
              </SelectTrigger>
              <SelectContent>
                {provinces.map((option) => (
                  <SelectItem key={option.id} value={String(option.id)}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="district">{t('createCampaignPage.district')}</Label>
            <Select
              value={formData.district}
              disabled={!formData.province || districtsLoading}
              onValueChange={(value) => setFormData((current) => ({ ...current, district: value }))}
            >
              <SelectTrigger isLoading={districtsLoading}>
                <SelectValue placeholder={t('createCampaignPage.district')} />
              </SelectTrigger>
              <SelectContent>
                {districts.map((option) => (
                  <SelectItem key={option.id} value={String(option.id)}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">{t('createCampaignPage.startDate')}</Label>
            <Popover open={isStartDateOpen} onOpenChange={setIsStartDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="startDate"
                  variant="outline"
                  className="group w-full justify-between bg-input-background font-normal"
                >
                  {formData.startDate ? formatDateLabel(formData.startDate) : t('createCampaignPage.startDate')}
                  <CalendarIcon className="h-4 w-4 text-muted-foreground group-hover:text-white" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="p-0 w-auto">
                <Calendar
                  mode="single"
                  selected={parseDate(formData.startDate)}
                  onSelect={(date) => {
                    setFormData((current) => ({ ...current, startDate: formatDateValue(date) }));
                    setIsStartDateOpen(false);
                  }}
                  disabled={{ before: today }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">{t('createCampaignPage.endDate')}</Label>
            <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="endDate"
                  variant="outline"
                  className="group w-full justify-between bg-input-background font-normal"
                >
                  {formData.endDate ? formatDateLabel(formData.endDate) : t('createCampaignPage.endDate')}
                  <CalendarIcon className="h-4 w-4 text-muted-foreground group-hover:text-white" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="p-0 w-auto">
                <Calendar
                  mode="single"
                  selected={parseDate(formData.endDate)}
                  onSelect={(date) => {
                    setFormData((current) => ({ ...current, endDate: formatDateValue(date) }));
                    setIsEndDateOpen(false);
                  }}
                  disabled={{ before: today }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">{t('createCampaignPage.descriptionOptional')}</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(event) =>
              setFormData((current) => ({ ...current, description: event.target.value }))
            }
            placeholder={t('createCampaignPage.descriptionPlaceholder')}
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  )
}
