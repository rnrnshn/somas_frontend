import { useState } from 'react'
import { useNavigate, useParams } from '@/lib/router'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Alert, AlertDescription } from '../ui/alert'
import { ArrowLeft, CheckCircle, Clock, MapPin, Upload } from 'lucide-react'
import { useConfirmFieldBeneficiaryMutation, useFieldDisbursementQuery } from '@/features/field/hooks/use-field-queries'
import { queueOfflineConfirmation } from '@/features/field/lib/offline-queue'
import { HttpError } from '@/lib/api/http-error'
import { formatMetical } from '@/lib/format/currency'
import { useTranslation } from 'react-i18next'

type VerificationStatus = 'confirmed' | 'not_confirmed' | 'not_found'

export function FieldBeneficiaryVerification() {
  const { t } = useTranslation()
  const { campaignId, campaignBeneficiaryId } = useParams<{ campaignId?: string; campaignBeneficiaryId?: string }>()
  const navigate = useNavigate()
  const numericCampaignId = Number(campaignId)
  const numericCampaignBeneficiaryId = Number(campaignBeneficiaryId)
  const query = useFieldDisbursementQuery(numericCampaignId, numericCampaignBeneficiaryId)
  const mutation = useConfirmFieldBeneficiaryMutation(numericCampaignId, numericCampaignBeneficiaryId)
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('confirmed')
  const [notes, setNotes] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)

  if (query.isPending) {
    return <div className="p-6 pb-24"><Card><CardContent className="p-8 text-center"><p style={{  color: 'var(--muted-foreground)' }}>{t('fieldVerificationPage.loadingRecord')}</p></CardContent></Card></div>
  }

  if (query.error || !query.data) {
    return <div className="p-6 pb-24"><Card><CardContent className="p-8 text-center"><p style={{  color: 'var(--error)' }}>{query.error instanceof Error ? query.error.message : t('fieldVerificationPage.loadError')}</p></CardContent></Card></div>
  }

  const beneficiaryName = query.data.beneficiary?.name ?? t('fieldVerificationPage.beneficiary')

  async function getCoordinates() {
    if (!navigator.geolocation) return {}

    return new Promise<{ latitude?: number; longitude?: number }>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
        () => resolve({}),
        { timeout: 5000 }
      )
    })
  }

  async function submitOnline() {
    try {
      const coordinates = await getCoordinates()
      await mutation.mutateAsync({
        status: verificationStatus,
        verifiedAt: new Date().toISOString(),
        ...coordinates})
      setFeedback(t('fieldVerificationPage.submittedSuccess'))
      navigate(`/field/beneficiary/${numericCampaignId}/${numericCampaignBeneficiaryId}`)
    } catch (error) {
      setFeedback(error instanceof HttpError ? error.message : t('fieldVerificationPage.submitFailed'))
    }
  }

  async function saveOffline() {
    const coordinates = await getCoordinates()
    queueOfflineConfirmation({
      beneficiaryName,
      campaignId: numericCampaignId,
      campaignBeneficiaryId: numericCampaignBeneficiaryId,
      status: verificationStatus,
      verifiedAt: new Date().toISOString(),
      ...coordinates})
    setFeedback(t('fieldVerificationPage.savedOffline'))
    navigate('/field/status')
  }

  return (
    <div className="p-6 pb-24">
      <div className="mb-6">
        <Button variant="ghost" className="mb-4 -ml-3" onClick={() => navigate(`/field/beneficiary/${numericCampaignId}/${numericCampaignBeneficiaryId}`)}>
          <ArrowLeft className="w-5 h-5 mr-2" />
          {t('fieldVerificationPage.back')}
        </Button>
        <h1>{t('fieldVerificationPage.title')}</h1>
        <p style={{  color: 'var(--muted-foreground)' }} className="mt-1">
          {beneficiaryName}
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t('fieldVerificationPage.recordSummary')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span style={{ color: 'var(--muted-foreground)' }}>{t('fieldVerificationPage.msisdn')}</span>
            <span>{query.data.beneficiary?.msisdn ?? '—'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span style={{ color: 'var(--muted-foreground)' }}>{t('fieldVerificationPage.campaign')}</span>
            <span>{query.data.campaign?.name ?? '—'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span style={{ color: 'var(--muted-foreground)' }}>{t('fieldVerificationPage.amount')}</span>
            <span>{formatMetical(query.data.disbursementAmount)}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t('fieldVerificationPage.verificationDecision')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={verificationStatus} onValueChange={(value: VerificationStatus) => setVerificationStatus(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
               <SelectItem value="confirmed">{t('fieldVerificationPage.confirmed')}</SelectItem>
               <SelectItem value="not_confirmed">{t('fieldVerificationPage.notConfirmed')}</SelectItem>
               <SelectItem value="not_found">{t('fieldVerificationPage.notFound')}</SelectItem>
            </SelectContent>
          </Select>

          <Textarea
            placeholder={t('fieldVerificationPage.notesPlaceholder')}
            rows={5}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />

          <div className="rounded-[var(--radius)] border border-border p-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4" />{t('fieldVerificationPage.gpsCaptured')}</div>
            <div className="mt-2 flex items-center gap-2"><Clock className="h-4 w-4" />{t('fieldVerificationPage.timestampAttached')}</div>
          </div>

          {feedback ? (
            <Alert variant={feedback.includes('successfully') ? 'default' : 'destructive'}>
              <AlertDescription>{feedback}</AlertDescription>
            </Alert>
          ) : null}
        </CardContent>
      </Card>

      <div className="space-y-3">
        <Button className="w-full" disabled={mutation.isPending} onClick={() => void submitOnline()}>
          <CheckCircle className="w-4 h-4 mr-2" />
          {t('fieldVerificationPage.submitOnline')}
        </Button>
        <Button className="w-full" variant="outline" onClick={() => void saveOffline()}>
          <Upload className="w-4 h-4 mr-2" />
          {t('fieldVerificationPage.saveOffline')}
        </Button>
      </div>
    </div>
  )
}
