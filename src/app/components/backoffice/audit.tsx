import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../ui/table";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export function BackofficeAudit() {
  const [searchQuery, setSearchQuery] = useState("");
  const [entityFilter, setEntityFilter] = useState("all");

  const auditLogs = [
    {
      id: 'AUD-12345',
      user: 'admin@somas.gov',
      action: 'UPDATE',
      entity: 'Campaign',
      entityId: 'CMP-001',
      dataBefore: { status: 'Planning', budget: 1000000 },
      dataAfter: { status: 'Active', budget: 1250000 },
      timestamp: '2026-03-02 09:45:23'
    },
    {
      id: 'AUD-12346',
      user: 'operator@somas.gov',
      action: 'CREATE',
      entity: 'Beneficiary',
      entityId: 'BEN-45682',
      dataBefore: null,
      dataAfter: { name: 'Carmen Lopez', nationalId: 'NAT-321654987', phone: '+63 920 456 7890' },
      timestamp: '2026-03-02 09:32:15'
    },
    {
      id: 'AUD-12347',
      user: 'admin@somas.gov',
      action: 'DELETE',
      entity: 'User',
      entityId: 'USR-789',
      dataBefore: { email: 'inactive@somas.gov', role: 'Operator' },
      dataAfter: null,
      timestamp: '2026-03-02 09:18:42'
    },
    {
      id: 'AUD-12348',
      user: 'finance@somas.gov',
      action: 'UPDATE',
      entity: 'Transaction',
      entityId: 'TXN-45678901',
      dataBefore: { status: 'Pending' },
      dataAfter: { status: 'Confirmed', executedAt: '2026-03-02 09:45:23' },
      timestamp: '2026-03-02 09:45:25'
    },
    {
      id: 'AUD-12349',
      user: 'admin@somas.gov',
      action: 'UPDATE',
      entity: 'Permission',
      entityId: 'PERM-456',
      dataBefore: { userId: 'USR-123', permission: 'beneficiary:read' },
      dataAfter: { userId: 'USR-123', permission: 'beneficiary:write' },
      timestamp: '2026-03-02 08:55:10'
    },
  ];

  const getActionBadge = (action: string) => {
    const styles = {
      CREATE: { backgroundColor: 'var(--success)' },
      UPDATE: { backgroundColor: 'var(--warning)', color: 'var(--warning-foreground)' },
      DELETE: { backgroundColor: 'var(--error)' }
    };
    return <Badge style={styles[action as keyof typeof styles]}>{action}</Badge>;
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 style={{ fontSize: 'var(--text-32)' }}>Audit Logs</h1>
        <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }} className="mt-2">
          Complete audit trail of all system actions and changes
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by user, entity, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={entityFilter} onValueChange={setEntityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Entity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Entities</SelectItem>
                <SelectItem value="campaign">Campaign</SelectItem>
                <SelectItem value="beneficiary">Beneficiary</SelectItem>
                <SelectItem value="transaction">Transaction</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Entity ID</TableHead>
                <TableHead>Changes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow key={log.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell style={{ fontSize: 'var(--text-12)', fontFamily: 'monospace' }}>
                    {log.timestamp}
                  </TableCell>
                  <TableCell>
                    <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{log.user}</span>
                  </TableCell>
                  <TableCell>{getActionBadge(log.action)}</TableCell>
                  <TableCell>{log.entity}</TableCell>
                  <TableCell>
                    <span style={{ fontFamily: 'monospace', fontSize: 'var(--text-12)' }}>
                      {log.entityId}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-md">
                      {log.action === 'CREATE' && (
                        <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                          Created new {log.entity.toLowerCase()}
                        </p>
                      )}
                      {log.action === 'DELETE' && (
                        <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                          Deleted {log.entity.toLowerCase()}
                        </p>
                      )}
                      {log.action === 'UPDATE' && log.dataBefore && log.dataAfter && (
                        <div style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                          {Object.keys(log.dataAfter).map((key) => (
                            <div key={key}>
                              <span className="font-medium">{key}:</span>{' '}
                              {log.dataBefore?.[key as keyof typeof log.dataBefore] !== undefined && (
                                <span className="line-through opacity-60">
                                  {String(log.dataBefore[key as keyof typeof log.dataBefore])}
                                </span>
                              )}{' '}
                              → {String(log.dataAfter[key as keyof typeof log.dataAfter])}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
