import { useState } from 'react'
import { Alert, AlertDescription } from '../ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { useNavigate, useParams } from '@/lib/router'
import { useAuth } from '@/lib/auth/auth-context'
import { normalizeRole } from '@/lib/auth/roles'
import { formatMetical } from '@/lib/format/currency'
import {
  useAllCampaignBeneficiariesQuery,
  useCampaignProgressQuery,
  useCampaignQuery,
} from '@/features/campaigns/hooks/use-campaign-queries'
import { useExecuteCampaignDisbursementMutation } from '@/features/campaigns/hooks/use-campaign-mutations'
import { adaptCampaignDetail, adaptCampaignProgressSeries } from '@/features/campaigns/adapters/campaigns'
import {
  buildDisbursementProgressFromTransactions,
  formatCampaignCurrency,
  formatCampaignDate,
  formatDisbursementStatus,
  type CampaignBeneficiaryItem,
  type CampaignSavingsItem,
  type CampaignTransactionItem,
} from '@/features/campaigns/components/campaign-detail-shared'
import { CampaignBeneficiariesTab } from '@/features/campaigns/components/campaign-beneficiaries-tab'
import { CampaignDetailDialogs } from '@/features/campaigns/components/campaign-detail-dialogs'
import { CampaignDetailHeader } from '@/features/campaigns/components/campaign-detail-header'
import { CampaignDetailSkeleton } from '@/features/campaigns/components/campaign-detail-skeleton'
import { CampaignOverviewTab } from '@/features/campaigns/components/campaign-overview-tab'
import { CampaignReportsTab } from '@/features/campaigns/components/campaign-reports-tab'
import { CampaignSavingsTab } from '@/features/campaigns/components/campaign-savings-tab'
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
  const executeDisbursementMutation = useExecuteCampaignDisbursementMutation(campaignId)

  const campaign = campaignQuery.data ? adaptCampaignDetail(campaignQuery.data, progressQuery.data) : null
  const listedBeneficiaries = mapListedBeneficiaries(campaignBeneficiariesListQuery.data?.data ?? [])
  const searchedBeneficiaries = mapSearchedBeneficiaries(campaignBeneficiariesQuery.data ?? [])
  const beneficiaries = beneficiarySearch.length > 0 ? searchedBeneficiaries : listedBeneficiaries
  const transactions = mapTransactions(campaignTransactionsQuery.data?.data ?? [])
  const savingsData: CampaignSavingsItem[] = []

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
  const savingsParticipation = campaign
    ? [
        { category: 'Participating', count: Math.round(campaign.totalBeneficiaries * (successRate / 100)) },
        {
          category: 'Not Participating',
          count: Math.max(campaign.totalBeneficiaries - Math.round(campaign.totalBeneficiaries * (successRate / 100)), 0),
        },
      ]
    : []

  const beneficiariesPagination = useTablePagination(beneficiaries, undefined, [activeTab, searchQuery])
  const transactionsPagination = useTablePagination(transactions, undefined, [activeTab])
  const savingsPagination = useTablePagination(savingsData, undefined, [activeTab])

  const errorMessage =
    campaignQuery.error instanceof Error
      ? campaignQuery.error.message
      : progressQuery.error instanceof Error
        ? progressQuery.error.message
        : null
  const hasPaymentChannel = Boolean(campaignQuery.data?.paymentChannel?.id)
  const canExecuteDisbursement = campaign ? !['Closed', 'Suspended'].includes(campaign.status) && hasPaymentChannel : false

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
            {campaign.enabledSavings && !isAnalyticsOnly ? (
              <TabsTrigger value="savings">{t('campaignDetailPage.savings')}</TabsTrigger>
            ) : null}
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

          {campaign.enabledSavings && !isAnalyticsOnly ? (
            <TabsContent value="savings">
              <CampaignSavingsTab
                amountDisbursed={amountDisbursed}
                savingsParticipation={savingsParticipation}
                savingsData={savingsData}
                savingsPagination={savingsPagination}
                formatCurrency={formatCampaignCurrency}
                formatDate={formatCampaignDate}
              />
            </TabsContent>
          ) : null}

          <TabsContent value="reports">
            <CampaignReportsTab showSavingsExport={campaign.enabledSavings && !isAnalyticsOnly} />
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
    </div>
  )
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
