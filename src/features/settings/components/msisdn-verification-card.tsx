import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'

export function AddMsisdnCard({ feedback, isPending = false, onSubmit }: { feedback?: string | null; isPending?: boolean; onSubmit: (payload: { msisdn: string }) => Promise<void> | void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add MSISDN</CardTitle>
        <CardDescription>Add a Mozambican phone number and trigger verification.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            const form = new FormData(event.currentTarget)
            void onSubmit({ msisdn: String(form.get('msisdn') ?? '').trim() })
          }}
        >
          {feedback ? <p className="text-sm text-muted-foreground">{feedback}</p> : null}
          <div>
            <Label>MSISDN</Label>
            <div className="mt-2"><Input name="msisdn" placeholder={"25884..."} /></div>
          </div>
          <Button disabled={isPending} type="submit">Send verification code</Button>
        </form>
      </CardContent>
    </Card>
  )
}

export function ConfirmMsisdnCard({ feedback, isPending = false, onSubmit, onResend }: { feedback?: string | null; isPending?: boolean; onSubmit: (payload: { token: string }) => Promise<void> | void; onResend: () => Promise<void> | void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Confirm MSISDN</CardTitle>
        <CardDescription>Enter the 6-digit code received by SMS.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            const form = new FormData(event.currentTarget)
            void onSubmit({ token: String(form.get('token') ?? '').trim() })
          }}
        >
          {feedback ? <p className="text-sm text-muted-foreground">{feedback}</p> : null}
          <div>
            <Label>Verification code</Label>
            <div className="mt-2"><Input inputMode="numeric" name="token" placeholder={"123456"} /></div>
          </div>
          <div className="flex gap-3">
            <Button disabled={isPending} type="submit">Confirm number</Button>
            <Button disabled={isPending} onClick={() => void onResend()} type="button" variant="outline">Resend code</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
