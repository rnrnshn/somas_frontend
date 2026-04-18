import { useState, type ReactNode } from 'react'
import { Button } from '@/app/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select'
import { Textarea } from '@/app/components/ui/textarea'
import { normalizeDateOfBirth } from '@/features/campaigns/components/create-campaign-shared'
import type { AddCampaignBeneficiaryPayload } from '@/features/campaigns/types/campaign'
import { useTranslation } from 'react-i18next'

type Props = {
  open: boolean
  isPending: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (payload: AddCampaignBeneficiaryPayload) => Promise<void> | void
}

const EMPTY_FORM: AddCampaignBeneficiaryPayload = {
  name: '',
  msisdn: '',
  disbursementAmount: 0,
  testimony: null,
  gender: null,
  dateOfBirth: null,
  email: null,
  location: null,
  province: null,
  district: null,
  community: null,
  documentIdType: null,
  documentIdNumber: null,
  mobileMoneyProvider: null,
  mobileMoneyAccountName: null,
  mobileMoneyAccountNumber: null,
  notes: null,
}

export function CampaignAddBeneficiaryDialog({ open, isPending, onOpenChange, onSubmit }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open ? (
        <CampaignAddBeneficiaryDialogForm
          isPending={isPending}
          onOpenChange={onOpenChange}
          onSubmit={onSubmit}
        />
      ) : null}
    </Dialog>
  )
}

function CampaignAddBeneficiaryDialogForm({ isPending, onOpenChange, onSubmit }: Omit<Props, 'open'>) {
  const { t } = useTranslation()
  const [form, setForm] = useState<AddCampaignBeneficiaryPayload>(EMPTY_FORM)

  return (
    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
      <DialogHeader>
        <DialogTitle>{t('campaignDetailPage.addBeneficiary')}</DialogTitle>
      </DialogHeader>

      <div className="grid gap-4 py-2 sm:grid-cols-2">
        <Field label={t('createCampaignPage.name')}>
          <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        </Field>

          <Field label="MSISDN">
            <Input value={form.msisdn} onChange={(event) => setForm({ ...form, msisdn: event.target.value })} />
          </Field>

          <Field label={t('createCampaignPage.amount')}>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={form.disbursementAmount || ''}
              onChange={(event) =>
                setForm({
                  ...form,
                  disbursementAmount: event.target.value === '' ? 0 : Number(event.target.value),
                })
              }
            />
          </Field>

          <Field label={t('createCampaignPage.location')}>
            <Input value={form.location ?? ''} onChange={(event) => setForm({ ...form, location: optionalText(event.target.value) })} />
          </Field>

          <Field label={t('createCampaignPage.gender')}>
            <Select value={form.gender ?? 'empty'} onValueChange={(value) => setForm({ ...form, gender: value === 'empty' ? null : value })}>
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
            <Input
              type="date"
              value={form.dateOfBirth ?? ''}
              onChange={(event) => setForm({ ...form, dateOfBirth: optionalText(event.target.value) })}
            />
          </Field>

          <Field label="Email">
            <Input type="email" value={form.email ?? ''} onChange={(event) => setForm({ ...form, email: optionalText(event.target.value) })} />
          </Field>

          <Field label={t('createCampaignPage.province')}>
            <Input value={form.province ?? ''} onChange={(event) => setForm({ ...form, province: optionalText(event.target.value) })} />
          </Field>

          <Field label={t('createCampaignPage.district')}>
            <Input value={form.district ?? ''} onChange={(event) => setForm({ ...form, district: optionalText(event.target.value) })} />
          </Field>

          <Field label={t('createCampaignPage.community')}>
            <Input value={form.community ?? ''} onChange={(event) => setForm({ ...form, community: optionalText(event.target.value) })} />
          </Field>

          <Field label={t('createCampaignPage.documentIdType')}>
            <Input value={form.documentIdType ?? ''} onChange={(event) => setForm({ ...form, documentIdType: optionalText(event.target.value) })} />
          </Field>

          <Field label={t('createCampaignPage.documentIdNumber')}>
            <Input value={form.documentIdNumber ?? ''} onChange={(event) => setForm({ ...form, documentIdNumber: optionalText(event.target.value) })} />
          </Field>

          <Field label={t('createCampaignPage.mobileMoneyProvider')}>
            <Input value={form.mobileMoneyProvider ?? ''} onChange={(event) => setForm({ ...form, mobileMoneyProvider: optionalText(event.target.value) })} />
          </Field>

          <Field label={t('createCampaignPage.mobileMoneyAccountName')}>
            <Input value={form.mobileMoneyAccountName ?? ''} onChange={(event) => setForm({ ...form, mobileMoneyAccountName: optionalText(event.target.value) })} />
          </Field>

          <Field label={t('createCampaignPage.mobileMoneyAccountNumber')}>
            <Input value={form.mobileMoneyAccountNumber ?? ''} onChange={(event) => setForm({ ...form, mobileMoneyAccountNumber: optionalText(event.target.value) })} />
          </Field>

          <Field className="sm:col-span-2" label={t('createCampaignPage.testimony')}>
            <Textarea value={form.testimony ?? ''} onChange={(event) => setForm({ ...form, testimony: optionalText(event.target.value) })} rows={3} />
          </Field>

          <Field className="sm:col-span-2" label={t('createCampaignPage.notes')}>
            <Textarea value={form.notes ?? ''} onChange={(event) => setForm({ ...form, notes: optionalText(event.target.value) })} rows={3} />
          </Field>
        </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
          {t('createCampaignPage.cancel')}
        </Button>
        <Button
          onClick={() =>
            void onSubmit({
              ...form,
              name: form.name.trim(),
              msisdn: form.msisdn.trim(),
              dateOfBirth: normalizeDateOfBirth(form.dateOfBirth),
            })
          }
          disabled={isPending}
        >
          {t('campaignDetailPage.addBeneficiary')}
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
