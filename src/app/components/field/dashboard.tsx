import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useOfflineConfirmations } from "@/features/field/hooks/use-offline-confirmations";
import { useTranslation } from "react-i18next";

export function FieldDashboard() {
  const { t } = useTranslation();
  const queue = useOfflineConfirmations();
  const confirmed = queue.filter((item) => item.status === 'confirmed').length;
  const pending = queue.length;
  const issues = queue.filter((item) => item.status !== 'confirmed').length;

  const todayStats = [
    { label: t('fieldDashboardPage.verified'), value: String(confirmed), icon: CheckCircle2, color: 'text-[--success]' },
    { label: t('fieldDashboardPage.pendingSync'), value: String(pending), icon: Clock, color: 'text-[--warning]' },
    { label: t('fieldDashboardPage.issues'), value: String(issues), icon: AlertCircle, color: 'text-[--error]' },
  ];

  const recentActivity = queue.slice(-5).reverse().map((item) => ({
    id: `CB-${item.campaignBeneficiaryId}`,
    name: item.beneficiaryName,
    action: item.status === 'confirmed' ? t('fieldDashboardPage.actionVerified') : item.status === 'not_confirmed' ? t('fieldDashboardPage.actionFlagged') : t('fieldDashboardPage.actionNotFound'),
    time: new Date(item.createdAt).toLocaleString(),
    status: item.status === 'confirmed' ? 'success' : 'warning'
  }));

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1>{t('fieldDashboardPage.title')}</h1>
        <p style={{  color: 'var(--muted-foreground)' }} className="mt-1">
          Monday, March 2, 2026
        </p>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {todayStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <Icon className={`w-5 h-5 ${stat.color} mb-2`} />
                <div style={{  fontWeight: 'var(--font-weight-semi-bold)' }}>
                  {stat.value}
                </div>
                <p style={{  color: 'var(--muted-foreground)' }}>
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>{t('fieldDashboardPage.recentActivity')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentActivity.length === 0 ? (
            <p style={{  color: 'var(--muted-foreground)' }}>
               {t('fieldDashboardPage.noActivity')}
             </p>
          ) : recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start justify-between p-3 border border-border rounded-[var(--radius)]"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p style={{  fontWeight: 'var(--font-weight-medium)' }}>
                    {activity.name}
                  </p>
                  <Badge
                    variant="outline"
                    style={{
                      backgroundColor:
                        activity.status === 'success'
                          ? 'var(--success)'
                          : 'var(--warning)',
                      color: activity.status === 'success' ? 'var(--success-foreground)' : 'var(--warning-foreground)',
                      borderColor: 'transparent'
                    }}
                  >
                    {activity.action}
                  </Badge>
                </div>
                <p style={{  color: 'var(--muted-foreground)' }}>
                  {activity.id} • {activity.time}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
