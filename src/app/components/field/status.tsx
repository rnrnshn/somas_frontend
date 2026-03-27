import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Wifi, WifiOff, Database, Upload, Download } from "lucide-react";
import { useOfflineConfirmations } from "@/features/field/hooks/use-offline-confirmations";
import { clearOfflineConfirmations, removeOfflineConfirmation } from "@/features/field/lib/offline-queue";
import { useSyncFieldConfirmationsMutation } from "@/features/field/hooks/use-field-queries";

export function FieldStatus() {
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
        <h1 style={{ fontSize: 'var(--text-24)' }}>System Status</h1>
        <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }} className="mt-1">
          Connection and sync information
        </p>
      </div>

      {/* Connection Status */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle style={{ fontSize: 'var(--text-18)' }}>Connection</CardTitle>
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
                  Online
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 mr-1" />
                  Offline
                </>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }}>
            {isOnline
              ? 'Connected to SOMAS server. All data is being synchronized.'
              : 'No connection available. Working in offline mode.'}
          </p>
        </CardContent>
      </Card>

      {/* Local Data */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle style={{ fontSize: 'var(--text-18)' }}>Local Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border border-border rounded-[--radius]">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-primary" />
              <div>
                <p style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)' }}>
                  Cached Records
                </p>
                <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                  Available offline
                </p>
              </div>
            </div>
            <span style={{ fontSize: 'var(--text-18)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                  {items.length}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 border border-border rounded-[--radius]">
            <div className="flex items-center gap-3">
              <Upload className="w-5 h-5 text-accent" />
              <div>
                <p style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)' }}>
                  Pending Upload
                </p>
                <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                  Waiting to sync
                </p>
              </div>
            </div>
            <span style={{ fontSize: 'var(--text-18)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                  {items.length}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Sync Actions */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontSize: 'var(--text-18)' }}>Sync Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full justify-start" size="lg" disabled={!isOnline}>
            <Download className="w-5 h-5 mr-2" />
            Download Latest Data
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
                photoUrl: item.photoUrl,
              })));
              if (result.processed > 0) {
                clearOfflineConfirmations();
              }
            }}
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload Pending Changes
          </Button>
          <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }} className="text-center">
            {items.length > 0 ? `${items.length} confirmation(s) queued on this device` : 'No queued confirmations'}
          </p>
          {items.length > 0 ? (
            <div className="space-y-2 pt-2">
              {items.map((item) => (
                <div key={item.localId} className="flex items-center justify-between rounded-[--radius] border border-border p-3">
                  <div>
                    <p style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-medium)' }}>{item.beneficiaryName}</p>
                    <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>{item.status} • {new Date(item.createdAt).toLocaleString()}</p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => removeOfflineConfirmation(item.localId)}>Remove</Button>
                </div>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
