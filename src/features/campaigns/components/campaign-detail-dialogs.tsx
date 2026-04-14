import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription } from '@/app/components/ui/alert'
import { Button } from '@/app/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle} from '@/app/components/ui/dialog'
import { useTranslation } from 'react-i18next'

type Props = {
  showExecuteDialog: boolean
  showSuspendDialog: boolean
  showCloseDialog: boolean
  setShowExecuteDialog: (open: boolean) => void
  setShowSuspendDialog: (open: boolean) => void
  setShowCloseDialog: (open: boolean) => void
  executePendingCount: number | null
  canExecuteDisbursement: boolean
  isExecuting: boolean
  onExecuteDisbursement: () => void
}

export function CampaignDetailDialogs({
  showExecuteDialog,
  showSuspendDialog,
  showCloseDialog,
  setShowExecuteDialog,
  setShowSuspendDialog,
  setShowCloseDialog,
  executePendingCount,
  canExecuteDisbursement,
  isExecuting,
  onExecuteDisbursement}: Props) {
  const { t } = useTranslation()

  return (
    <>
      <Dialog open={showExecuteDialog} onOpenChange={setShowExecuteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('campaignDetailPage.executeTitle')}</DialogTitle>
            <DialogDescription style={{  color: 'var(--muted-foreground)' }}>
              {t('campaignDetailPage.executeDescription')}
            </DialogDescription>
          </DialogHeader>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {typeof executePendingCount === 'number'
                ? executePendingCount === 1
                  ? t('campaignDetailPage.executePending', { count: executePendingCount })
                  : t('campaignDetailPage.executePendingPlural', { count: executePendingCount })
                : t('campaignDetailPage.executePendingFallback')}
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExecuteDialog(false)} disabled={isExecuting}>
              {t('campaignDetailPage.cancel')}
            </Button>
            <Button onClick={onExecuteDisbursement} disabled={!canExecuteDisbursement || isExecuting}>
              {isExecuting ? t('campaignDetailPage.executing') : t('campaignDetailPage.executeTitle')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={showSuspendDialog}
        onOpenChange={setShowSuspendDialog}
        title={t('campaignDetailPage.suspendTitle')}
        description={t('campaignDetailPage.suspendDescription')}
        warning={t('campaignDetailPage.suspendWarning')}
      />

      <ConfirmDialog
        open={showCloseDialog}
        onOpenChange={setShowCloseDialog}
        title={t('campaignDetailPage.closeTitle')}
        description={t('campaignDetailPage.closeDescription')}
        warning={t('campaignDetailPage.closeWarning')}
      />
    </>
  )
}

function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  warning}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  warning: string
}) {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription style={{  color: 'var(--muted-foreground)' }}>
            {description}
          </DialogDescription>
        </DialogHeader>
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{warning}</AlertDescription>
        </Alert>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('campaignDetailPage.cancel')}
          </Button>
          <Button variant="destructive" onClick={() => onOpenChange(false)}>
            {title}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
