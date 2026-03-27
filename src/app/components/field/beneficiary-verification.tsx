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

type VerificationStatus = 'confirmed' | 'not_confirmed' | 'not_found'

export function FieldBeneficiaryVerification() {
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
    return <div className="p-6 pb-24"><Card><CardContent className="p-8 text-center"><p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }}>Loading verification record...</p></CardContent></Card></div>
  }

  if (query.error || !query.data) {
    return <div className="p-6 pb-24"><Card><CardContent className="p-8 text-center"><p style={{ fontSize: 'var(--text-14)', color: 'var(--error)' }}>{query.error instanceof Error ? query.error.message : 'Verification record could not be loaded.'}</p></CardContent></Card></div>
  }

  const beneficiaryName = query.data.beneficiary?.name ?? 'Beneficiary'

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
        ...coordinates,
      })
      setFeedback('Verification submitted successfully.')
      navigate(`/field/beneficiary/${numericCampaignId}/${numericCampaignBeneficiaryId}`)
    } catch (error) {
      setFeedback(error instanceof HttpError ? error.message : 'Verification could not be submitted online.')
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
      ...coordinates,
    })
    setFeedback('Verification saved offline. Open Status to sync when connected.')
    navigate('/field/status')
  }

  return (
    <div className="p-6 pb-24">
      <div className="mb-6">
        <Button variant="ghost" className="mb-4 -ml-3" onClick={() => navigate(`/field/beneficiary/${numericCampaignId}/${numericCampaignBeneficiaryId}`)}>
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        <h1 style={{ fontSize: 'var(--text-24)' }}>Verification</h1>
        <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }} className="mt-1">
          {beneficiaryName}
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle style={{ fontSize: 'var(--text-18)' }}>Record Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span style={{ color: 'var(--muted-foreground)' }}>MSISDN</span>
            <span>{query.data.beneficiary?.msisdn ?? '—'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span style={{ color: 'var(--muted-foreground)' }}>Campaign</span>
            <span>{query.data.campaign?.name ?? '—'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span style={{ color: 'var(--muted-foreground)' }}>Amount</span>
            <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MZN', maximumFractionDigits: 0 }).format(query.data.disbursementAmount)}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle style={{ fontSize: 'var(--text-18)' }}>Verification Decision</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={verificationStatus} onValueChange={(value: VerificationStatus) => setVerificationStatus(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="not_confirmed">Not confirmed</SelectItem>
              <SelectItem value="not_found">Not found</SelectItem>
            </SelectContent>
          </Select>

          <Textarea
            placeholder="Add enumerator notes for this verification..."
            rows={5}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />

          <div className="rounded-[--radius] border border-border p-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4" />GPS coordinates are captured when available.</div>
            <div className="mt-2 flex items-center gap-2"><Clock className="h-4 w-4" />A verification timestamp is attached automatically.</div>
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
          Submit Online
        </Button>
        <Button className="w-full" variant="outline" onClick={() => void saveOffline()}>
          <Upload className="w-4 h-4 mr-2" />
          Save Offline
        </Button>
      </div>
    </div>
  )
}
