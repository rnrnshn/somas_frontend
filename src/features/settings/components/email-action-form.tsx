import type { ReactNode } from 'react'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'

export function EmailActionForm({
  title,
  description,
  submitLabel,
  defaultEmail = '',
  isPending = false,
  feedback,
  onSubmit,
  footer,
}: {
  title: string
  description: string
  submitLabel: string
  defaultEmail?: string
  isPending?: boolean
  feedback?: string | null
  onSubmit: (payload: { email: string }) => Promise<void> | void
  footer?: ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            const form = new FormData(event.currentTarget)
            void onSubmit({ email: String(form.get('email') ?? '').trim() })
          }}
        >
          {feedback ? <p className="text-sm text-muted-foreground">{feedback}</p> : null}
          <div>
            <Label>Email</Label>
            <div className="mt-2">
              <Input defaultValue={defaultEmail} name="email" type="email" />
            </div>
          </div>
          <Button disabled={isPending} type="submit">{submitLabel}</Button>
        </form>
        {footer ? <div className="mt-4">{footer}</div> : null}
      </CardContent>
    </Card>
  )
}
