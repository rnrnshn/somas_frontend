import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../ui/table";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { Plus, Shield } from "lucide-react";
import { DataTablePagination, useTablePagination } from "../ui/table-pagination";

export function BackofficeUsers() {
  const users = [
    {
      id: 'USR-001',
      email: 'admin@somas.app',
      name: 'Domingas',
      role: 'admin',
      enabled: true,
      lastLogin: '2026-03-02 09:45:00',
      failedLogins: 0
    },
    {
      id: 'USR-002',
      email: 'content@somas.app',
      name: 'Content Manager',
      role: 'content_manager',
      enabled: true,
      lastLogin: '2026-03-02 08:30:00',
      failedLogins: 0
    },
    {
      id: 'USR-003',
      email: 'analytic@somas.app',
      name: 'Analytics',
      role: 'analytics',
      enabled: true,
      lastLogin: '2026-03-01 16:20:00',
      failedLogins: 0
    },
    {
      id: 'USR-004',
      email: 'inquirer@somas.app',
      name: 'Inquiridor',
      role: 'inquirer',
      enabled: true,
      lastLogin: '2026-02-28 14:15:00',
      failedLogins: 0
    },
  ];

  const getRoleBadge = (role: string) => {
    const config: Record<string, { style?: React.CSSProperties; variant?: "default" | "secondary" | "outline" | "success" | "warning" | "destructive" }> = {
      admin: { style: { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' } },
      content_manager: { style: { backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' } },
      analytics: { style: { backgroundColor: 'var(--chart-3)', color: 'var(--warning-foreground)' } },
      inquirer: { variant: 'outline' as const },
    };
    const props = config[role] || {};
    return <Badge {...props}>{role.replace(/_/g, ' ')}</Badge>;
  };
  const usersPagination = useTablePagination(users);

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 style={{ fontSize: 'var(--text-32)' }}>Users & Permissions</h1>
          <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }} className="mt-2">
            Manage system users, roles, and access control
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Shield className="w-4 h-4 mr-2" />
            Permission Matrix
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Failed Logins</TableHead>
                <TableHead>Enabled</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersPagination.paginatedItems.map((user) => (
                <TableRow key={user.id} className="cursor-pointer">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--muted)' }}>
                        <span style={{ fontSize: 'var(--text-12)', fontWeight: 'var(--font-weight-medium)' }}>
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p style={{ fontWeight: 'var(--font-weight-medium)' }}>{user.name}</p>
                        <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    {user.enabled ? (
                      <Badge style={{ backgroundColor: 'var(--success)', color: 'var(--success-foreground)' }}>Active</Badge>
                    ) : (
                      <Badge variant="outline">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                    {user.lastLogin}
                  </TableCell>
                  <TableCell>
                    {user.failedLogins > 0 ? (
                      <span style={{ color: 'var(--error)', fontWeight: 'var(--font-weight-medium)' }}>
                        {user.failedLogins}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--muted-foreground)' }}>0</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Switch checked={user.enabled} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <DataTablePagination
            page={usersPagination.page}
            pageSize={usersPagination.pageSize}
            totalItems={usersPagination.totalItems}
            totalPages={usersPagination.totalPages}
            onPageChange={usersPagination.setPage}
          />
        </CardContent>
      </Card>
    </div>
  );
}
