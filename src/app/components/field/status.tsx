import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Wifi, WifiOff, Database, Upload, Download } from "lucide-react";
import { useOfflineConfirmations } from "@/features/field/hooks/use-offline-confirmations";
import { clearOfflineConfirmations, removeOfflineConfirmation } from "@/features/field/lib/offline-queue";
import { useSyncFieldConfirmationsMutation } from "@/features/field/hooks/use-field-queries";
import { useTranslation } from "react-i18next";

export function FieldStatus() {
  const { t } = useTranslation();
  const items = useOfflineConfirmations();
  const syncMutation = useSyncFieldConfirmationsMutation();
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const syncStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', syncStatus);
    window.addEventListener('offline', syncStatus);
    return () => {
      window.removeEventListener('online', syncStatus);
      window.removeEventListener('offline', syncStatus);
    };
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1>{t('fieldStatusPage.title')}</h1>
        <p style={{  color: 'var(--muted-foreground)' }} className="mt-1">
          {t('fieldStatusPage.subtitle')}
        </p>
      </div>

      {/* Connection Status */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t('fieldStatusPage.connection')}</CardTitle>
            <Badge
              variant={isOnline ? 'default' : 'outline'}
              style={{
                backgroundColor: isOnline ? 'var(--success)' : 'var(--error)',
                color: isOnline ? 'var(--success-foreground)' : 'var(--error-foreground)',
                borderColor: 'transparent'
              }}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3 h-3 mr-1" />
                  {t('fieldStatusPage.online')}
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 mr-1" />
                  {t('fieldStatusPage.offline')}
                </>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p style={{  color: 'var(--muted-foreground)' }}>
            {isOnline
               ? t('fieldStatusPage.onlineMessage')
               : t('fieldStatusPage.offlineMessage')}
          </p>
        </CardContent>
      </Card>

      {/* Local Data */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t('fieldStatusPage.localData')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border border-border rounded-[var(--radius)]">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-primary" />
              <div>
                <p style={{  fontWeight: 'var(--font-weight-medium)' }}>
                  {t('fieldStatusPage.cachedRecords')}
                </p>
                <p style={{  color: 'var(--muted-foreground)' }}>
                  {t('fieldStatusPage.availableOffline')}
                </p>
              </div>
            </div>
            <span style={{  fontWeight: 'var(--font-weight-semi-bold)' }}>
                  {items.length}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 border border-border rounded-[var(--radius)]">
            <div className="flex items-center gap-3">
              <Upload className="w-5 h-5 text-accent" />
              <div>
                <p style={{  fontWeight: 'var(--font-weight-medium)' }}>
                  {t('fieldStatusPage.pendingUpload')}
                </p>
                <p style={{  color: 'var(--muted-foreground)' }}>
                  {t('fieldStatusPage.waitingToSync')}
                </p>
              </div>
            </div>
            <span style={{  fontWeight: 'var(--font-weight-semi-bold)' }}>
                  {items.length}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Sync Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('fieldStatusPage.syncActions')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full justify-start" size="lg" disabled={!isOnline}>
            <Download className="w-5 h-5 mr-2" />
            {t('fieldStatusPage.downloadLatest')}
          </Button>
          <Button
            className="w-full justify-start"
            size="lg"
            variant="outline"
            disabled={!isOnline || items.length === 0 || syncMutation.isPending}
            onClick={async () => {
              const result = await syncMutation.mutateAsync(items.map((item) => ({
                campaignBeneficiaryId: item.campaignBeneficiaryId,
                status: item.status,
                latitude: item.latitude,
                longitude: item.longitude,
                verifiedAt: item.verifiedAt,
                signatureUrl: item.signatureUrl,
                photoUrl: item.photoUrl})));
              if (result.processed > 0) {
                clearOfflineConfirmations();
              }
            }}
          >
            <Upload className="w-5 h-5 mr-2" />
            {t('fieldStatusPage.uploadPending')}
          </Button>
          <p style={{  color: 'var(--muted-foreground)' }} className="text-center">
            {items.length > 0 ? t('fieldStatusPage.queuedCount', { count: items.length }) : t('fieldStatusPage.noQueued')}
          </p>
          {items.length > 0 ? (
            <div className="space-y-2 pt-2">
              {items.map((item) => (
                <div key={item.localId} className="flex items-center justify-between rounded-[var(--radius)] border border-border p-3">
                  <div>
                    <p style={{  fontWeight: 'var(--font-weight-medium)' }}>{item.beneficiaryName}</p>
                    <p style={{  color: 'var(--muted-foreground)' }}>{item.status} • {new Date(item.createdAt).toLocaleString()}</p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => removeOfflineConfirmation(item.localId)}>{t('fieldStatusPage.remove')}</Button>
                </div>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
