import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow} from "../ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle} from "../ui/alert-dialog";
import { Monitor, Smartphone, Tablet, AlertCircle } from "lucide-react";
import { DataTablePagination, useTablePagination } from "../ui/table-pagination";

interface Session {
  id: string;
  user: string;
  tenant: string;
  device: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  ipAddress: string;
  lastActivity: string;
  expiresAt: string;
  status: 'active' | 'expired';
}

const MOCK_SESSIONS: Session[] = [
  {
    id: "1",
    user: "admin@somas.gov",
    tenant: "Ministry of Social Affairs",
    device: "Chrome on Windows",
    deviceType: 'desktop',
    ipAddress: "192.168.1.100",
    lastActivity: "2 minutes ago",
    expiresAt: "In 6 hours",
    status: 'active'},
  {
    id: "2",
    user: "john.doe@somas.gov",
    tenant: "National Relief Program",
    device: "Safari on iPhone",
    deviceType: 'mobile',
    ipAddress: "192.168.1.101",
    lastActivity: "15 minutes ago",
    expiresAt: "In 5 hours 45 minutes",
    status: 'active'},
  {
    id: "3",
    user: "jane.smith@somas.gov",
    tenant: "Regional Development Authority",
    device: "Firefox on Ubuntu",
    deviceType: 'desktop',
    ipAddress: "192.168.1.102",
    lastActivity: "1 hour ago",
    expiresAt: "In 5 hours",
    status: 'active'},
  {
    id: "4",
    user: "mike.wilson@somas.gov",
    tenant: "Emergency Response Unit",
    device: "Chrome on Android",
    deviceType: 'tablet',
    ipAddress: "192.168.1.103",
    lastActivity: "3 hours ago",
    expiresAt: "Expired",
    status: 'expired'},
];

const DeviceIcon = ({ type }: { type: 'desktop' | 'mobile' | 'tablet' }) => {
  switch (type) {
    case 'desktop':
      return <Monitor className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />;
    case 'mobile':
      return <Smartphone className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />;
    case 'tablet':
      return <Tablet className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />;
  }
};

export function SessionManagement() {
  const [sessions, setSessions] = useState<Session[]>(MOCK_SESSIONS);
  const [sessionToRevoke, setSessionToRevoke] = useState<Session | null>(null);
  const sessionsPagination = useTablePagination(sessions);

  const handleRevokeSession = () => {
    if (sessionToRevoke) {
      setSessions(sessions.filter(s => s.id !== sessionToRevoke.id));
      setSessionToRevoke(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2">Session Management</h3>
        <p style={{  color: 'var(--muted-foreground)' }}>
          Monitor and manage active user sessions across the platform
        </p>
      </div>

      <div className="space-y-2">
        <div>
          <h3 style={{  fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>Active Sessions</h3>
          <p style={{  color: 'var(--foreground)', opacity: 0.7 }}>
            View and revoke user sessions for security and compliance
          </p>
        </div>
        <Card>
          <CardContent>
          <div className="rounded-[var(--radius-card)] border border-[--border]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Expiration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessionsPagination.paginatedItems.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell style={{  fontWeight: 'var(--font-weight-medium)' }}>
                      {session.user}
                    </TableCell>
                    <TableCell style={{  color: 'var(--muted-foreground)' }}>
                      {session.tenant}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <DeviceIcon type={session.deviceType} />
                        <span style={{  color: 'var(--muted-foreground)' }}>
                          {session.device}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell style={{  color: 'var(--muted-foreground)' }}>
                      {session.ipAddress}
                    </TableCell>
                    <TableCell style={{  color: 'var(--muted-foreground)' }}>
                      {session.lastActivity}
                    </TableCell>
                    <TableCell style={{  color: 'var(--muted-foreground)' }}>
                      {session.expiresAt}
                    </TableCell>
                    <TableCell>
                      <Badge variant={session.status === 'active' ? 'active' : 'disabled'}>
                        {session.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSessionToRevoke(session)}
                        disabled={session.status === 'expired'}
                      >
                        Revoke
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <DataTablePagination
              page={sessionsPagination.page}
              pageSize={sessionsPagination.pageSize}
              totalItems={sessionsPagination.totalItems}
              totalPages={sessionsPagination.totalPages}
              onPageChange={sessionsPagination.setPage}
            />
          </div>
        </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!sessionToRevoke} onOpenChange={() => setSessionToRevoke(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" style={{ color: 'var(--destructive)' }} />
              Revoke Session
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to revoke this session? The user will be immediately logged out
              and will need to sign in again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {sessionToRevoke && (
            <div 
              className="p-4 rounded-[var(--radius)]" 
              style={{ backgroundColor: 'var(--muted)' }}
            >
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span style={{  color: 'var(--muted-foreground)' }}>
                    User:
                  </span>
                  <span style={{  fontWeight: 'var(--font-weight-medium)' }}>
                    {sessionToRevoke.user}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{  color: 'var(--muted-foreground)' }}>
                    Device:
                  </span>
                  <span style={{  fontWeight: 'var(--font-weight-medium)' }}>
                    {sessionToRevoke.device}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{  color: 'var(--muted-foreground)' }}>
                    IP:
                  </span>
                  <span style={{  fontWeight: 'var(--font-weight-medium)' }}>
                    {sessionToRevoke.ipAddress}
                  </span>
                </div>
              </div>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRevokeSession}>
              Revoke Session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
