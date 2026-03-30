import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { CurrentUserCard } from '@/features/settings/components/current-user-card'
import { EmailActionForm } from '@/features/settings/components/email-action-form'
import { AddMsisdnCard, ConfirmMsisdnCard } from '@/features/settings/components/msisdn-verification-card'
import { CatalogAdminCard } from '@/features/settings/components/catalog-admin-card'
import { useCampaignCatalogs } from '@/features/catalogs/hooks/use-catalog-queries'
import { useCatalogAdminMutations } from '@/features/catalogs/hooks/use-catalog-admin-mutations'
import {
  useAddMsisdnMutation,
  useConfirmMsisdnMutation,
  useResendConfirmationEmailMutation,
  useResendConfirmationMsisdnMutation,
} from '@/features/auth/hooks/use-auth-actions'
import { HttpError } from '@/lib/api/http-error'

export function BackendSettingsPanel() {
  const { programs, regions, paymentChannels, disbursementTypes, isPending, error } = useCampaignCatalogs()
  const mutations = useCatalogAdminMutations()
  const addMsisdnMutation = useAddMsisdnMutation()
  const confirmMsisdnMutation = useConfirmMsisdnMutation()
  const resendMsisdnMutation = useResendConfirmationMsisdnMutation()
  const resendEmailMutation = useResendConfirmationEmailMutation()
  const [feedback, setFeedback] = useState<string | null>(null)

  function message(err: unknown, fallback: string) {
    return err instanceof HttpError ? err.message : fallback
  }

  async function run(action: () => Promise<unknown>, success: string, fallback: string) {
    try {
      await action()
      setFeedback(success)
    } catch (err) {
      setFeedback(message(err, fallback))
    }
  }

  return (
    <div className="space-y-6 mb-8">
      <div>
        <h2 style={{ fontSize: 'var(--text-20)', fontWeight: 'var(--font-weight-semi-bold)' }}>Backend-supported settings</h2>
        <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)', marginTop: '8px' }}>
          These actions are connected to the live backend. Demo governance tabs remain below unchanged.
        </p>
        {feedback ? <p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)', marginTop: '8px' }}>{feedback}</p> : null}
        {error ? <p style={{ fontSize: 'var(--text-13)', color: 'var(--error)', marginTop: '8px' }}>{error instanceof Error ? error.message : 'Settings could not be loaded.'}</p> : null}
      </div>

      <CurrentUserCard />

      <div className="grid gap-6 xl:grid-cols-3">
        <EmailActionForm
          defaultEmail=""
          description="Resend the account confirmation email for a given address."
          feedback={feedback}
          isPending={resendEmailMutation.isPending}
          onSubmit={async (payload) => run(() => resendEmailMutation.mutateAsync(payload), 'Confirmation email was requested successfully.', 'Confirmation email could not be requested.')}
          submitLabel="Resend confirmation email"
          title="Email verification"
        />
        <AddMsisdnCard
          feedback={feedback}
          isPending={addMsisdnMutation.isPending}
          onSubmit={async (payload) => run(() => addMsisdnMutation.mutateAsync(payload), 'Verification code sent to the provided MSISDN.', 'MSISDN could not be added.')}
        />
        <ConfirmMsisdnCard
          feedback={feedback}
          isPending={confirmMsisdnMutation.isPending || resendMsisdnMutation.isPending}
          onResend={async () => run(() => resendMsisdnMutation.mutateAsync(), 'MSISDN verification code resent successfully.', 'Verification code could not be resent.')}
          onSubmit={async (payload) => run(() => confirmMsisdnMutation.mutateAsync(payload), 'MSISDN confirmed successfully.', 'MSISDN could not be confirmed.')}
        />
      </div>

      {!isPending ? (
        <div className="grid gap-6 xl:grid-cols-2">
          <CatalogAdminCard
            feedback={feedback}
            includeDescription
            isPending={mutations.createProgram.isPending || mutations.updateProgram.isPending || mutations.deleteProgram.isPending}
            items={programs.data ?? []}
            onCreate={async (payload) => run(() => mutations.createProgram.mutateAsync(payload), 'Program created successfully.', 'Program could not be created.')}
            onDelete={async (id) => run(() => mutations.deleteProgram.mutateAsync(id), 'Program deleted successfully.', 'Program could not be deleted.')}
            onUpdate={async (id, payload) => run(() => mutations.updateProgram.mutateAsync({ id, payload }), 'Program updated successfully.', 'Program could not be updated.')}
            title="Programs"
          />
          <CatalogAdminCard
            feedback={feedback}
            isPending={mutations.createRegion.isPending || mutations.updateRegion.isPending || mutations.deleteRegion.isPending}
            items={regions.data ?? []}
            onCreate={async (payload) => run(() => mutations.createRegion.mutateAsync({ name: payload.name }), 'Region created successfully.', 'Region could not be created.')}
            onDelete={async (id) => run(() => mutations.deleteRegion.mutateAsync(id), 'Region deleted successfully.', 'Region could not be deleted.')}
            onUpdate={async (id, payload) => run(() => mutations.updateRegion.mutateAsync({ id, payload: { name: payload.name } }), 'Region updated successfully.', 'Region could not be updated.')}
            title="Regions"
          />
          <Card>
            <CardHeader>
              <CardTitle>Payment channels</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Payment channels are now backend-managed and exposed here as an active read-only list.
              </p>
              <div className="space-y-2 rounded-[--radius] border border-border p-4">
                <p className="text-sm font-medium text-foreground">Current active entries</p>
                <div className="space-y-2">
                  {(paymentChannels.data ?? []).map((item) => (
                    <div className="rounded-[--radius] border border-border px-3 py-2" key={item.id}>
                      <p className="font-medium text-foreground">{item.name}</p>
                      {item.code ? <p className="text-xs text-muted-foreground">Code: {item.code}</p> : null}
                      {item.description ? <p className="text-xs text-muted-foreground">{item.description}</p> : null}
                    </div>
                  ))}
                  {(paymentChannels.data ?? []).length === 0 ? (
                    <p className="text-sm text-muted-foreground">No active payment channels are currently available.</p>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>
          <CatalogAdminCard
            feedback={feedback}
            includeDescription
            isPending={mutations.createDisbursementType.isPending || mutations.updateDisbursementType.isPending || mutations.deleteDisbursementType.isPending}
            items={disbursementTypes.data ?? []}
            onCreate={async (payload) => run(() => mutations.createDisbursementType.mutateAsync(payload), 'Disbursement type created successfully.', 'Disbursement type could not be created.')}
            onDelete={async (id) => run(() => mutations.deleteDisbursementType.mutateAsync(id), 'Disbursement type deleted successfully.', 'Disbursement type could not be deleted.')}
            onUpdate={async (id, payload) => run(() => mutations.updateDisbursementType.mutateAsync({ id, payload }), 'Disbursement type updated successfully.', 'Disbursement type could not be updated.')}
            title="Disbursement types"
          />
        </div>
      ) : null}
    </div>
  )
}
