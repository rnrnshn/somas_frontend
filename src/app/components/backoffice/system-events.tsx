import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

export function BackofficeSystemEvents() {
  const events = [
    {
      id: 'EVT-12345',
      type: 'transaction.confirmed',
      payload: {
        transactionId: 'TXN-45678901',
        beneficiaryId: 'BEN-45678',
        amount: 150,
        campaignId: 'CMP-001'
      },
      createdAt: '2026-03-02 09:45:23'
    },
    {
      id: 'EVT-12346',
      type: 'beneficiary.created',
      payload: {
        beneficiaryId: 'BEN-45682',
        name: 'Carmen Lopez',
        campaignId: 'CMP-001'
      },
      createdAt: '2026-03-02 09:32:15'
    },
    {
      id: 'EVT-12347',
      type: 'campaign.updated',
      payload: {
        campaignId: 'CMP-001',
        changes: {
          status: { from: 'Planning', to: 'Active' }
        }
      },
      createdAt: '2026-03-02 09:18:42'
    },
    {
      id: 'EVT-12348',
      type: 'user.login',
      payload: {
        userId: 'USR-001',
        email: 'admin@somas.gov',
        ip: '192.168.1.100'
      },
      createdAt: '2026-03-02 09:05:10'
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 style={{ fontSize: 'var(--text-32)' }}>System Events</h1>
        <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }} className="mt-2">
          Real-time system event log for developers and debugging
        </p>
      </div>

      <div className="space-y-4">
        {events.map((event) => (
          <Card key={event.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{event.type}</Badge>
                  <span style={{ fontSize: 'var(--text-12)', fontFamily: 'monospace', color: 'var(--muted-foreground)' }}>
                    {event.id}
                  </span>
                </div>
                <span style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                  {event.createdAt}
                </span>
              </div>
              <div className="p-4 bg-muted rounded-[--radius]">
                <pre style={{ fontSize: 'var(--text-12)', fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {JSON.stringify(event.payload, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
