import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { useAuth } from '@/lib/auth/auth-context'

export function CurrentUserCard() {
  const { user } = useAuth()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current user</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <Field label="Name" value={user?.fullName || user?.name || '-'} />
        <Field label="Email" value={user?.email || '-'} />
      </CardContent>
    </Card>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--radius)] border border-border p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 font-medium text-foreground">{value}</p>
    </div>
  )
}
