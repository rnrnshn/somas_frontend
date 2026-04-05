import { ArrowLeft, Check } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Progress } from '@/app/components/ui/progress'
import { useTranslation } from 'react-i18next'

type Props = {
  currentStep: number
  totalSteps: number
  isEditMode: boolean
  onBackToCampaigns: () => void
}

export function CreateCampaignHeader({
  currentStep,
  totalSteps,
  isEditMode,
  onBackToCampaigns,
}: Props) {
  const { t } = useTranslation()
  const progressPercentage = (currentStep / totalSteps) * 100
  const steps = [
    { step: 1, label: t('createCampaignPage.campaignDetails') },
    { step: 2, label: t('createCampaignPage.beneficiaryUpload') },
    { step: 3, label: t('createCampaignPage.disbursementConfig') },
    { step: 4, label: t('createCampaignPage.reviewConfirm') },
  ]

  return (
    <>
      <div className="mb-8">
        <Button variant="ghost" onClick={onBackToCampaigns} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('createCampaignPage.backToCampaigns')}
        </Button>
        <h1 style={{ fontSize: 'var(--text-32)', fontWeight: 'var(--font-weight-semi-bold)' }}>
          {isEditMode ? t('createCampaignPage.editCampaign') : t('createCampaignPage.createCampaign')}
        </h1>
        <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)', marginTop: '8px' }}>
          {t('createCampaignPage.stepOf', { current: currentStep, total: totalSteps })}
        </p>
      </div>

      <div className="mb-8">
        <Progress value={progressPercentage} className="h-2" />
        <div className="mt-4 grid grid-cols-4 gap-4">
          {steps.map((item) => (
            <div key={item.step} className="text-center">
              <div
                className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full"
                style={{
                  backgroundColor: currentStep >= item.step ? 'var(--primary)' : 'var(--muted)',
                  color:
                    currentStep >= item.step
                      ? 'var(--primary-foreground)'
                      : 'var(--muted-foreground)',
                }}
              >
                {currentStep > item.step ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span
                    style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-medium)' }}
                  >
                    {item.step}
                  </span>
                )}
              </div>
              <p
                style={{
                  fontSize: 'var(--text-12)',
                  color: currentStep >= item.step ? 'var(--foreground)' : 'var(--muted-foreground)',
                  fontWeight:
                    currentStep === item.step
                      ? 'var(--font-weight-medium)'
                      : 'var(--font-weight-regular)',
                }}
              >
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
