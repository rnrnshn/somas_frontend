import { useState } from 'react'
import { Alert, AlertDescription } from '../ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { useNavigate, useParams } from '@/lib/router'
import { useAuth } from '@/lib/auth/auth-context'
import { normalizeRole } from '@/lib/auth/roles'
import { HttpError } from '@/lib/api/http-error'
import { formatMetical } from '@/lib/format/currency'
import {
  useAllCampaignBeneficiariesQuery,
  useCampaignProgressQuery,
  useCampaignQuery,
} from '@/features/campaigns/hooks/use-campaign-queries'
import { useAddCampaignBeneficiaryMutation, useExecuteCampaignDisbursementMutation } from '@/features/campaigns/hooks/use-campaign-mutations'
import { adaptCampaignDetail, adaptCampaignProgressSeries } from '@/features/campaigns/adapters/campaigns'
import {
  buildDisbursementProgressFromTransactions,
  formatCampaignCurrency,
  formatDisbursementStatus,
  type CampaignBeneficiaryItem,
  type CampaignTransactionItem,
} from '@/features/campaigns/components/campaign-detail-shared'
import { CampaignBeneficiariesTab } from '@/features/campaigns/components/campaign-beneficiaries-tab'
import { CampaignAddBeneficiaryDialog } from '@/features/campaigns/components/campaign-add-beneficiary-dialog'
import { CampaignDetailDialogs } from '@/features/campaigns/components/campaign-detail-dialogs'
import { CampaignDetailHeader } from '@/features/campaigns/components/campaign-detail-header'
import { CampaignDetailSkeleton } from '@/features/campaigns/components/campaign-detail-skeleton'
import { CampaignOverviewTab } from '@/features/campaigns/components/campaign-overview-tab'
import { CampaignReportsTab } from '@/features/campaigns/components/campaign-reports-tab'
import { CampaignTransactionsTab } from '@/features/campaigns/components/campaign-transactions-tab'
import { useFieldSearchQuery } from '@/features/field/hooks/use-field-queries'
import { adaptTransaction } from '@/features/transactions/adapters/transactions'
import { useCampaignTransactionsQuery } from '@/features/transactions/hooks/use-transaction-queries'
import { useTablePagination } from '../ui/table-pagination'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

export function CampaignDetail() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { id } = useParams()
  const campaignId = Number(id)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuspendDialog, setShowSuspendDialog] = useState(false)
  const [showCloseDialog, setShowCloseDialog] = useState(false)
  const [showExecuteDialog, setShowExecuteDialog] = useState(false)
  const [showAddBeneficiaryDialog, setShowAddBeneficiaryDialog] = useState(false)
  const { t } = useTranslation()

  const isAnalyticsOnly = normalizeRole(user?.role) === 'analytics'
  const beneficiarySearch = searchQuery.trim()

  const campaignQuery = useCampaignQuery(campaignId)
  const progressQuery = useCampaignProgressQuery(campaignId)
  const campaignBeneficiariesListQuery = useAllCampaignBeneficiariesQuery(campaignId)
  const campaignBeneficiariesQuery = useFieldSearchQuery(
    {
      campaignId,
      name: beneficiarySearch || undefined,
      msisdn: beneficiarySearch || undefined,
    },
    Number.isFinite(campaignId) && beneficiarySearch.length > 0
  )
  const campaignTransactionsQuery = useCampaignTransactionsQuery(campaignId)
  const addBeneficiaryMutation = useAddCampaignBeneficiaryMutation(campaignId)
  const executeDisbursementMutation = useExecuteCampaignDisbursementMutation(campaignId)

  const campaign = campaignQuery.data ? adaptCampaignDetail(campaignQuery.data, progressQuery.data) : null
  const listedBeneficiaries = mapListedBeneficiaries(campaignBeneficiariesListQuery.data?.data ?? [])
  const searchedBeneficiaries = mapSearchedBeneficiaries(campaignBeneficiariesQuery.data ?? [])
  const beneficiaries = beneficiarySearch.length > 0 ? searchedBeneficiaries : listedBeneficiaries
  const transactions = mapTransactions(campaignTransactionsQuery.data?.data ?? [])

  const beneficiaryBudget = listedBeneficiaries.reduce((sum, beneficiary) => sum + beneficiary.amount, 0)
  const fallbackBudget = Math.max(
    beneficiaryBudget,
    searchedBeneficiaries.reduce((sum, beneficiary) => sum + beneficiary.amount, 0)
  )
  const totalBudget = campaign ? Math.max(campaign.totalBudget, fallbackBudget) : fallbackBudget
  const totalBeneficiaries = campaign ? campaign.totalBeneficiaries : beneficiaries.length

  const successfulTransactions = transactions.filter((item) => item.status === 'Successful')
  const failedTransactions = transactions.filter((item) => ['Failed', 'Reversed'].includes(item.status))
  const processingTransactions = transactions.filter((item) => ['Pending', 'Processing'].includes(item.status))
  const amountDisbursed =
    successfulTransactions.length > 0
      ? successfulTransactions.reduce((sum, item) => sum + item.amount, 0)
      : campaign?.amountDisbursed ?? 0
  const pendingPayments =
    transactions.length > 0
      ? Math.max(totalBeneficiaries - successfulTransactions.length - failedTransactions.length, processingTransactions.length)
      : campaign?.pendingPayments ?? 0
  const failedPayments = transactions.length > 0 ? failedTransactions.length : campaign?.failedPayments ?? 0
  const successRate =
    transactions.length > 0 && totalBeneficiaries > 0
      ? Math.round((successfulTransactions.length / totalBeneficiaries) * 100)
      : campaign?.successRate ?? 0
  const effectiveTotalBudget = Math.max(totalBudget, amountDisbursed)
  const completionPercentage =
    effectiveTotalBudget > 0 ? Math.min((amountDisbursed / effectiveTotalBudget) * 100, 100) : 0
  const disbursementProgress =
    transactions.length > 0
      ? buildDisbursementProgressFromTransactions(successfulTransactions)
      : campaignQuery.data
        ? adaptCampaignProgressSeries(campaignQuery.data)
        : []
  const beneficiariesPagination = useTablePagination(beneficiaries, undefined, [activeTab, searchQuery])
  const transactionsPagination = useTablePagination(transactions, undefined, [activeTab])

  const errorMessage =
    campaignQuery.error instanceof Error
      ? campaignQuery.error.message
      : progressQuery.error instanceof Error
        ? progressQuery.error.message
        : null
  const hasPaymentChannel = Boolean(campaignQuery.data?.paymentChannel?.id)
  const canExecuteDisbursement = campaign ? !['Closed', 'Suspended'].includes(campaign.status) && hasPaymentChannel : false
  const canAddBeneficiary = !isAnalyticsOnly && Number.isFinite(campaignId)

  const handleExecuteDisbursement = async () => {
    try {
      const result = await executeDisbursementMutation.mutateAsync()
      const transactionsCount = typeof result?.transactionsCount === 'number' ? result.transactionsCount : null

      toast.success(
        transactionsCount !== null
          ? `Disbursement batch ${result.code ?? result.batchId ?? ''} started for ${transactionsCount} transaction${transactionsCount === 1 ? '' : 's'}.`.trim()
          : t('campaignDetailPage.executionStarted')
      )
      setShowExecuteDialog(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('campaignDetailPage.executionFailed'))
    }
  }

  const handleAddBeneficiary = async (
    payload: Parameters<typeof addBeneficiaryMutation.mutateAsync>[0]
  ) => {
    try {
      await addBeneficiaryMutation.mutateAsync(payload)
      toast.success(t('campaignDetailPage.addBeneficiarySuccess'))
      setShowAddBeneficiaryDialog(false)
    } catch (error) {
      toast.error(
        error instanceof HttpError ? error.message : t('campaignDetailPage.addBeneficiaryError')
      )
    }
  }

  const handleImportBeneficiaries = () => {
    navigate(`/backoffice/campaigns/${campaignId}/edit`)
  }

  const handleExportBeneficiaries = () => {
    const rows = listedBeneficiaries.map((beneficiary) => [
      beneficiary.name,
      beneficiary.msisdn,
      beneficiary.location,
      beneficiary.amount,
      beneficiary.status,
      beneficiary.lastActivity,
    ])

    const csv = [
      ['name', 'msisdn', 'location', 'disbursementAmount', 'status', 'lastActivity'].join(','),
      ...rows.map((row) => row.map(escapeCsvCell).join(',')),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${campaign?.name ?? 'campaign'}-beneficiaries.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (campaignQuery.isPending && !campaignQuery.data) {
    return <CampaignDetailSkeleton />
  }

  return (
    <div className="p-8">
      <CampaignDetailHeader
        campaign={campaign}
        isLoading={campaignQuery.isPending}
        isAnalyticsOnly={isAnalyticsOnly}
        canExecuteDisbursement={canExecuteDisbursement}
        isExecuting={executeDisbursementMutation.isPending}
        onBack={() => navigate('/backoffice/campaigns')}
        onEdit={() => navigate(`/backoffice/campaigns/${campaignId}/edit`)}
        onExecute={() => setShowExecuteDialog(true)}
        onSuspend={() => setShowSuspendDialog(true)}
        onClose={() => setShowCloseDialog(true)}
      />

      {errorMessage ? (
        <Alert className="mb-6" variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      {campaign && !hasPaymentChannel ? (
        <Alert className="mb-6" variant="destructive">
          <AlertDescription>{t('campaignDetailPage.paymentChannelRequired')}</AlertDescription>
        </Alert>
      ) : null}

      {campaign ? (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">{t('campaignDetailPage.overview')}</TabsTrigger>
            <TabsTrigger value="beneficiaries">{t('campaignDetailPage.beneficiaries')}</TabsTrigger>
            <TabsTrigger value="transactions">{t('campaignDetailPage.transactions')}</TabsTrigger>
            <TabsTrigger value="reports">{t('campaignDetailPage.reports')}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <CampaignOverviewTab
              totalBeneficiaries={totalBeneficiaries}
              amountDisbursed={amountDisbursed}
              successRate={successRate}
              pendingPayments={pendingPayments}
              failedPayments={failedPayments}
              effectiveTotalBudget={effectiveTotalBudget}
              completionPercentage={completionPercentage}
              disbursementProgress={disbursementProgress}
              formatCurrency={formatCampaignCurrency}
            />
          </TabsContent>

          <TabsContent value="beneficiaries">
            <CampaignBeneficiariesTab
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              beneficiarySearch={beneficiarySearch}
              beneficiaries={beneficiaries}
              beneficiariesPagination={beneficiariesPagination}
              searchPending={campaignBeneficiariesQuery.isPending}
              searchError={campaignBeneficiariesQuery.error}
              listPending={campaignBeneficiariesListQuery.isPending}
              listError={campaignBeneficiariesListQuery.error}
              canAddBeneficiary={canAddBeneficiary}
              onAddBeneficiary={() => setShowAddBeneficiaryDialog(true)}
              onImportCsv={handleImportBeneficiaries}
              onExportCsv={handleExportBeneficiaries}
              onViewBeneficiary={(beneficiaryId) => navigate(`/backoffice/beneficiaries/profile/${beneficiaryId}`)}
            />
          </TabsContent>

          <TabsContent value="transactions">
            <CampaignTransactionsTab
              transactions={transactions}
              transactionsPagination={transactionsPagination}
              isPending={campaignTransactionsQuery.isPending}
              error={campaignTransactionsQuery.error}
            />
          </TabsContent>

          <TabsContent value="reports">
            <CampaignReportsTab showSavingsExport={false} />
          </TabsContent>
        </Tabs>
      ) : null}

      <CampaignDetailDialogs
        showExecuteDialog={showExecuteDialog}
        showSuspendDialog={showSuspendDialog}
        showCloseDialog={showCloseDialog}
        setShowExecuteDialog={setShowExecuteDialog}
        setShowSuspendDialog={setShowSuspendDialog}
        setShowCloseDialog={setShowCloseDialog}
        executePendingCount={campaign?.pendingPayments ?? null}
        canExecuteDisbursement={canExecuteDisbursement}
        isExecuting={executeDisbursementMutation.isPending}
        onExecuteDisbursement={() => void handleExecuteDisbursement()}
      />

      <CampaignAddBeneficiaryDialog
        open={showAddBeneficiaryDialog}
        isPending={addBeneficiaryMutation.isPending}
        onOpenChange={setShowAddBeneficiaryDialog}
        onSubmit={handleAddBeneficiary}
      />
    </div>
  )
}

function escapeCsvCell(value: unknown) {
  const text = value == null ? '' : String(value)
  if (text.includes(',') || text.includes('"') || text.includes('\n')) {
    return `"${text.replaceAll('"', '""')}"`
  }
  return text
}

function mapSearchedBeneficiaries(items: any[]): CampaignBeneficiaryItem[] {
  return items.map((item) => ({
    id: `CB-${item.id}`,
    campaignBeneficiaryId: item.id,
    beneficiaryId: item.beneficiaryId,
    name: item.beneficiary?.name ?? 'Beneficiary',
    msisdn: item.beneficiary?.msisdn ?? '—',
    location: 'Not available',
    amount: Number(item.disbursementAmount ?? 0),
    status: formatDisbursementStatus(item.disbursementStatus),
    lastActivity: '—',
  }))
}

function mapListedBeneficiaries(items: any[]): CampaignBeneficiaryItem[] {
  return items.map((item) => ({
    id: `CB-${item.id}`,
    campaignBeneficiaryId: item.id,
    beneficiaryId: item.beneficiaryId,
    name: item.beneficiary?.name ?? 'Beneficiary',
    msisdn: item.beneficiary?.msisdn ?? '—',
    location: '—',
    amount: Number(item.disbursementAmount ?? 0),
    status: formatDisbursementStatus(item.disbursementStatus),
    lastActivity: '—',
  }))
}

function mapTransactions(items: any[]): CampaignTransactionItem[] {
  return items.map((item) => {
    const transaction = adaptTransaction(item)

    return {
      id: transaction.id,
      beneficiary: transaction.beneficiary,
      amount: transaction.amount,
      status: transaction.status,
      errorMessage: transaction.errorMessage,
      executedAtRaw: item.executedAt ?? item.createdAt,
      executionDate: transaction.executedAt ?? transaction.createdAt ?? '—',
    }
  })
}
