import type { ReactNode } from 'react'
import { FileText, PiggyBank } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { useTranslation } from 'react-i18next'

type Props = {
  showSavingsExport: boolean
}

export function CampaignReportsTab({ showSavingsExport }: Props) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('campaignDetailPage.exportReports')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ReportRow
          icon={<FileText className="h-5 w-5" style={{ color: 'var(--muted-foreground)' }} />}
          title={t('campaignDetailPage.exportBeneficiaries')}
          description={t('campaignDetailPage.exportBeneficiariesHelp')}
        />
        <ReportRow
          icon={<FileText className="h-5 w-5" style={{ color: 'var(--muted-foreground)' }} />}
          title={t('campaignDetailPage.exportTransactions')}
          description={t('campaignDetailPage.exportTransactionsHelp')}
        />
        <ReportRow
          icon={<FileText className="h-5 w-5" style={{ color: 'var(--muted-foreground)' }} />}
          title={t('campaignDetailPage.exportCampaignSummary')}
          description={t('campaignDetailPage.exportCampaignSummaryHelp')}
        />
        {showSavingsExport ? (
          <ReportRow
            icon={<PiggyBank className="h-5 w-5" style={{ color: 'var(--muted-foreground)' }} />}
            title={t('campaignDetailPage.exportSavingsData')}
            description={t('campaignDetailPage.exportSavingsHelp')}
          />
        ) : null}
      </CardContent>
    </Card>
  )
}

function ReportRow({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-center justify-between rounded-[var(--radius)] border p-4" style={{ borderColor: 'var(--border)' }}>
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p style={{  fontWeight: 'var(--font-weight-medium)' }}>{title}</p>
          <p style={{  color: 'var(--muted-foreground)' }}>{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">CSV</Button>
        <Button variant="outline" size="sm">Excel</Button>
      </div>
    </div>
  )
}
