import { FileText, LoaderCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Alert, AlertDescription } from '@/app/components/ui/alert'
import { Button } from '@/app/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog'

type Props = {
  open: boolean
  isEditMode: boolean
  isPending: boolean
  totalSummary: string
  executionDate: string
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function CampaignConfirmDialog({
  open,
  isEditMode,
  isPending,
  totalSummary,
  executionDate,
  onOpenChange,
  onConfirm,
}: Props) {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle style={{ fontSize: 'var(--text-20)' }}>
            {isEditMode
              ? t('createCampaignPage.confirmCampaignUpdate')
              : t('createCampaignPage.confirmCampaignCreation')}
          </DialogTitle>
          <DialogDescription style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }}>
            {isEditMode
              ? t('createCampaignPage.confirmUpdateQuestion')
              : t('createCampaignPage.confirmCreateQuestion')}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription style={{ fontSize: 'var(--text-13)' }}>
              <p style={{ fontWeight: 'var(--font-weight-medium)' }}>{totalSummary}</p>
              <p style={{ color: 'var(--muted-foreground)', marginTop: '4px' }}>
                {isEditMode
                  ? t('createCampaignPage.settingsUpdated')
                  : t('createCampaignPage.activatedOn', { date: executionDate })}
              </p>
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('createCampaignPage.cancel')}
          </Button>
          <Button disabled={isPending} onClick={onConfirm}>
            {isPending ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isEditMode ? t('createCampaignPage.confirmUpdate') : t('createCampaignPage.confirmCreate')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
