import type { Dispatch, SetStateAction } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Alert, AlertDescription } from '@/app/components/ui/alert'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select'
import { Textarea } from '@/app/components/ui/textarea'
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
  submitError,
  catalogsError,
  campaignError,
}: Props) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle style={{ fontSize: 'var(--text-20)' }}>
          {t('createCampaignPage.campaignDetails')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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
              <SelectTrigger>
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
              <SelectTrigger>
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
              <SelectTrigger>
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
              onValueChange={(value) => setFormData((current) => ({ ...current, district: value }))}
            >
              <SelectTrigger>
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
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(event) =>
                setFormData((current) => ({ ...current, startDate: event.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">{t('createCampaignPage.endDate')}</Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(event) => setFormData((current) => ({ ...current, endDate: event.target.value }))}
            />
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
