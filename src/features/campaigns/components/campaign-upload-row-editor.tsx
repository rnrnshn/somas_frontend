import { useState, type ReactNode } from 'react'
import type { CampaignBeneficiaryUploadPreviewRow } from '@/features/campaigns/types/campaign'
import { normalizeDateOfBirth } from '@/features/campaigns/components/create-campaign-shared'
import { Button } from '@/app/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Textarea } from '@/app/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select'
import { useTranslation } from 'react-i18next'

type Props = {
  open: boolean
  row: CampaignBeneficiaryUploadPreviewRow | null
  isPending?: boolean
  onOpenChange: (open: boolean) => void
  onSave: (row: CampaignBeneficiaryUploadPreviewRow) => Promise<void> | void
}

export function CampaignUploadRowEditor({ open, row, isPending = false, onOpenChange, onSave }: Props) {
  if (!open || !row) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <CampaignUploadRowEditorForm
        key={row.id}
        row={row}
        isPending={isPending}
        onOpenChange={onOpenChange}
        onSave={onSave}
      />
    </Dialog>
  )
}

function CampaignUploadRowEditorForm({ row, isPending = false, onOpenChange, onSave }: Omit<Props, 'open'>) {
  const { t } = useTranslation()
  const [draft, setDraft] = useState<CampaignBeneficiaryUploadPreviewRow>({
    ...row!,
    dateOfBirth: normalizeDateOfBirth(row!.dateOfBirth),
  })

  return (
    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
      <DialogHeader>
        <DialogTitle>{t('createCampaignPage.editBeneficiary')}</DialogTitle>
      </DialogHeader>

        <div className="grid gap-4 py-2 sm:grid-cols-2">
          <Field label={t('createCampaignPage.name')}>
            <Input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
          </Field>

          <Field label="MSISDN">
            <Input value={draft.msisdn} onChange={(event) => setDraft({ ...draft, msisdn: event.target.value })} />
          </Field>

          <Field label={t('createCampaignPage.amount')}>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={draft.disbursementAmount ?? ''}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  disbursementAmount: event.target.value === '' ? null : Number(event.target.value),
                })
              }
            />
          </Field>

          <Field label={t('createCampaignPage.location')}>
            <Input value={draft.location ?? ''} onChange={(event) => setDraft({ ...draft, location: optionalText(event.target.value) })} />
          </Field>

          <Field label={t('createCampaignPage.gender')}>
            <Select value={draft.gender ?? 'empty'} onValueChange={(value) => setDraft({ ...draft, gender: value === 'empty' ? null : value })}>
              <SelectTrigger>
                <SelectValue placeholder={t('createCampaignPage.selectGender')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="empty">{t('createCampaignPage.notSet')}</SelectItem>
                <SelectItem value="male">{t('createCampaignPage.male')}</SelectItem>
                <SelectItem value="female">{t('createCampaignPage.female')}</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label={t('createCampaignPage.dateOfBirth')}>
            <Input type="date" value={draft.dateOfBirth ?? ''} onChange={(event) => setDraft({ ...draft, dateOfBirth: optionalText(event.target.value) })} />
          </Field>

          <Field label="Email">
            <Input type="email" value={draft.email ?? ''} onChange={(event) => setDraft({ ...draft, email: optionalText(event.target.value) })} />
          </Field>

          <Field label={t('createCampaignPage.province')}>
            <Input value={draft.province ?? ''} onChange={(event) => setDraft({ ...draft, province: optionalText(event.target.value) })} />
          </Field>

          <Field label={t('createCampaignPage.district')}>
            <Input value={draft.district ?? ''} onChange={(event) => setDraft({ ...draft, district: optionalText(event.target.value) })} />
          </Field>

          <Field label={t('createCampaignPage.community')}>
            <Input value={draft.community ?? ''} onChange={(event) => setDraft({ ...draft, community: optionalText(event.target.value) })} />
          </Field>

          <Field label={t('createCampaignPage.documentIdType')}>
            <Input value={draft.documentIdType ?? ''} onChange={(event) => setDraft({ ...draft, documentIdType: optionalText(event.target.value) })} />
          </Field>

          <Field label={t('createCampaignPage.documentIdNumber')}>
            <Input value={draft.documentIdNumber ?? ''} onChange={(event) => setDraft({ ...draft, documentIdNumber: optionalText(event.target.value) })} />
          </Field>

          <Field label={t('createCampaignPage.mobileMoneyProvider')}>
            <Input value={draft.mobileMoneyProvider ?? ''} onChange={(event) => setDraft({ ...draft, mobileMoneyProvider: optionalText(event.target.value) })} />
          </Field>

          <Field label={t('createCampaignPage.mobileMoneyAccountName')}>
            <Input value={draft.mobileMoneyAccountName ?? ''} onChange={(event) => setDraft({ ...draft, mobileMoneyAccountName: optionalText(event.target.value) })} />
          </Field>

          <Field label={t('createCampaignPage.mobileMoneyAccountNumber')}>
            <Input value={draft.mobileMoneyAccountNumber ?? ''} onChange={(event) => setDraft({ ...draft, mobileMoneyAccountNumber: optionalText(event.target.value) })} />
          </Field>

          <Field className="sm:col-span-2" label={t('createCampaignPage.testimony')}>
            <Textarea value={draft.testimony ?? ''} onChange={(event) => setDraft({ ...draft, testimony: optionalText(event.target.value) })} rows={3} />
          </Field>

          <Field className="sm:col-span-2" label={t('createCampaignPage.notes')}>
            <Textarea value={draft.notes ?? ''} onChange={(event) => setDraft({ ...draft, notes: optionalText(event.target.value) })} rows={3} />
          </Field>
        </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
          {t('createCampaignPage.cancel')}
        </Button>
        <Button
          onClick={() =>
            void onSave({
              ...draft,
              dateOfBirth: normalizeDateOfBirth(draft.dateOfBirth),
            })
          }
          disabled={isPending}
        >
          {t('createCampaignPage.saveRow')}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

function Field({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <Label className="mb-2 block">{label}</Label>
      {children}
    </div>
  )
}

function optionalText(value: string) {
  const trimmed = value.trim()
  return trimmed ? trimmed : null
}
