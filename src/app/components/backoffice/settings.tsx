import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../ui/table";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  RotateCcw,
  UserX,
  Shield,
  FileText,
  Monitor,
  Activity,
  MessageSquare,
  Settings as SettingsIcon,
  Upload,
  Download,
  X,
  CheckCircle,
  XCircle,
  Globe
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { BackendSettingsPanel } from "@/features/settings/components/backend-settings-panel";
import { DataTablePagination, useTablePagination } from "../ui/table-pagination";
import { useTranslation } from "react-i18next";

export function Settings() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [language, setLanguage] = useState("pt-MZ");

  // Mock data
  const users = [
    {
      id: 'USR-001',
      name: 'Maria Santos',
      email: 'admin@somas.app',
      role: 'admin',
      status: 'Active',
      lastLogin: '2026-03-05 09:30:00'
    },
    {
      id: 'USR-002',
      name: 'Content Manager',
      email: 'content@somas.app',
      role: 'content_manager',
      status: 'Active',
      lastLogin: '2026-03-05 08:15:00'
    },
    {
      id: 'USR-003',
      name: 'Analytics',
      email: 'analytic@somas.app',
      role: 'analytics',
      status: 'Active',
      lastLogin: '2026-03-04 16:45:00'
    },
    {
      id: 'USR-004',
      name: 'Inquiridor',
      email: 'inquirer@somas.app',
      role: 'inquirer',
      status: 'Active',
      lastLogin: '2026-02-28 11:20:00'
    },
  ];

  const roles = [
    {
      id: 'ROL-001',
      name: 'admin',
      description: 'Full system access and control',
      usersCount: 1,
      permissionsCount: 48
    },
    {
      id: 'ROL-002',
      name: 'content_manager',
      description: 'Manage campaigns, beneficiaries, and inquirers',
      usersCount: 1,
      permissionsCount: 24
    },
    {
      id: 'ROL-003',
      name: 'analytics',
      description: 'View dashboards, reports, and analytics',
      usersCount: 1,
      permissionsCount: 18
    },
    {
      id: 'ROL-004',
      name: 'inquirer',
      description: 'Verify and confirm beneficiaries in the field',
      usersCount: 1,
      permissionsCount: 12
    },
  ];

  const permissions = [
    { module: 'Campaigns', view: true, create: true, edit: true, delete: true },
    // { module: 'Savings Programs', view: true, create: true, edit: true, delete: false },
    { module: 'Beneficiaries', view: true, create: true, edit: true, delete: false },
    { module: 'Transactions', view: true, create: false, edit: false, delete: false },
    { module: 'Reports', view: true, create: true, edit: false, delete: false },
    { module: 'Users', view: true, create: true, edit: true, delete: true },
  ];

  const auditLogs = [
    {
      id: 'AUD-12345',
      user: 'Maria Santos',
      action: 'Created Campaign',
      entity: 'Campaign',
      entityId: 'CMP-045',
      timestamp: '2026-03-05 10:15:23'
    },
    {
      id: 'AUD-12344',
      user: 'John Smith',
      action: 'Updated Beneficiary',
      entity: 'Beneficiary',
      entityId: 'BEN-45678',
      timestamp: '2026-03-05 09:42:10'
    },
    {
      id: 'AUD-12343',
      user: 'Carlos Garcia',
      action: 'Approved Disbursement',
      entity: 'Disbursement Batch',
      entityId: 'BATCH-001234',
      timestamp: '2026-03-05 08:30:05'
    },
    {
      id: 'AUD-12342',
      user: 'Maria Santos',
      action: 'Deleted User',
      entity: 'User',
      entityId: 'USR-099',
      timestamp: '2026-03-04 15:20:18'
    },
  ];

  const sessions = [
    {
      id: 'SES-789012',
      user: 'Maria Santos',
      device: 'Chrome on Windows',
      ipAddress: '192.168.1.45',
      lastActivity: '2026-03-05 10:45:00',
      expiresAt: '2026-03-05 18:45:00'
    },
    {
      id: 'SES-789011',
      user: 'John Smith',
      device: 'Safari on MacOS',
      ipAddress: '192.168.1.67',
      lastActivity: '2026-03-05 10:30:00',
      expiresAt: '2026-03-05 18:30:00'
    },
    {
      id: 'SES-789010',
      user: 'Jane Doe',
      device: 'Mobile App on Android',
      ipAddress: '10.0.2.15',
      lastActivity: '2026-03-05 09:15:00',
      expiresAt: '2026-03-05 17:15:00'
    },
  ];

  const systemEvents = [
    {
      id: 'EVT-56789',
      eventType: 'DATABASE_BACKUP_COMPLETED',
      payload: '{"size": "2.4GB", "duration": "45s"}',
      timestamp: '2026-03-05 03:00:00'
    },
    {
      id: 'EVT-56788',
      eventType: 'PAYMENT_GATEWAY_ERROR',
      payload: '{"error": "timeout", "batch_id": "BATCH-001230"}',
      timestamp: '2026-03-05 02:15:23'
    },
    {
      id: 'EVT-56787',
      eventType: 'SMS_BATCH_SENT',
      payload: '{"count": 1250, "template": "DISBURSEMENT_NOTIFICATION"}',
      timestamp: '2026-03-04 18:30:45'
    },
  ];

  const smsTemplates = [
    {
      id: 'TPL-001',
      name: 'Disbursement Notification',
      message: 'Your payment of MZN ${amount} has been processed. Ref: ${ref_number}',
      campaign: 'All Campaigns',
      status: 'Active'
    },
    {
      id: 'TPL-002',
      name: 'Verification Reminder',
      message: 'Please complete your beneficiary verification by ${deadline}.',
      campaign: 'Flood Relief 2024',
      status: 'Active'
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant?: "default" | "secondary" | "outline" | "success" | "warning" | "destructive" }> = {
      Active: { variant: "success" },
      Inactive: { variant: "secondary" },
      Draft: { variant: "outline" }
    };
    return <Badge {...(variants[status] || {})}>{status}</Badge>;
  };
  const usersPagination = useTablePagination(users, undefined, [activeTab, searchQuery]);
  const rolesPagination = useTablePagination(roles, undefined, [activeTab]);
  const permissionsPagination = useTablePagination(permissions, undefined, [activeTab]);
  const auditLogsPagination = useTablePagination(auditLogs, undefined, [activeTab]);
  const sessionsPagination = useTablePagination(sessions, undefined, [activeTab]);
  const systemEventsPagination = useTablePagination(systemEvents, undefined, [activeTab]);
  const smsTemplatesPagination = useTablePagination(smsTemplates, undefined, [activeTab]);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 style={{  fontWeight: 'var(--font-weight-semi-bold)' }}>
          {t('settingsPage.title')}
        </h1>
        <p style={{  color: 'var(--muted-foreground)', marginTop: '8px' }}>
          {t('settingsPage.subtitle')}
        </p>
      </div>

      <BackendSettingsPanel />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="users">{t('settingsPage.users')}</TabsTrigger>
          <TabsTrigger value="roles">{t('settingsPage.roles')}</TabsTrigger>
          <TabsTrigger value="permissions">{t('settingsPage.permissions')}</TabsTrigger>
          <TabsTrigger value="audit">{t('settingsPage.auditLogs')}</TabsTrigger>
          <TabsTrigger value="sessions">{t('settingsPage.sessions')}</TabsTrigger>
          <TabsTrigger value="events">{t('settingsPage.systemEvents')}</TabsTrigger>
          <TabsTrigger value="sms">{t('settingsPage.smsTemplates')}</TabsTrigger>
          <TabsTrigger value="tenant">{t('settingsPage.tenantSettings')}</TabsTrigger>
        </TabsList>

        {/* USERS TAB */}
        <TabsContent value="users">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 style={{  fontWeight: 'var(--font-weight-semi-bold)' }}>
                      {t('settingsPage.systemUsers')}
                    </h3>
                    <p style={{  color: 'var(--muted-foreground)' }}>
                      {t('settingsPage.manageUsers')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--muted-foreground)" }} />
                    <Input
                      placeholder={t('settingsPage.searchUsers')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    {t('settingsPage.addUser')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('settingsPage.userId')}</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>{t('settingsPage.roles')}</TableHead>
                    <TableHead>{t('campaignsPage.status')}</TableHead>
                    <TableHead>{t('settingsPage.lastLogin')}</TableHead>
                    <TableHead className="text-right">{t('transactionsPage.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersPagination.paginatedItems.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <span style={{ fontWeight: 'var(--font-weight-medium)',  fontFamily: 'var(--font-mono)' }}>
                          {user.id}
                        </span>
                      </TableCell>
                      <TableCell style={{  fontWeight: 'var(--font-weight-medium)' }}>
                        {user.name}
                      </TableCell>
                      <TableCell style={{  color: 'var(--muted-foreground)' }}>
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role.replace(/_/g, ' ')}</Badge>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(user.status)}
                      </TableCell>
                      <TableCell style={{  color: 'var(--muted-foreground)' }}>
                        {user.lastLogin}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <UserX className="w-4 h-4" />
                          </Button>
                        </div>
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
        </TabsContent>

        {/* ROLES TAB */}
        <TabsContent value="roles">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5" style={{ color: "var(--primary)" }} />
                <div>
                  <h3 style={{  fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                    {t('settingsPage.roleManagement')}
                  </h3>
                  <p style={{  color: 'var(--foreground)', opacity: 0.7 }}>
                    {t('settingsPage.manageRoles')}
                  </p>
                </div>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                 {t('settingsPage.createRole')}
              </Button>
            </div>
            <Card>
              <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('settingsPage.roleId')}</TableHead>
                    <TableHead>{t('settingsPage.roleName')}</TableHead>
                    <TableHead>{t('settingsPage.description')}</TableHead>
                    <TableHead className="text-right">{t('settingsPage.users')}</TableHead>
                    <TableHead className="text-right">{t('settingsPage.permissions')}</TableHead>
                    <TableHead className="text-right">{t('transactionsPage.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rolesPagination.paginatedItems.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>
                        <span style={{ fontWeight: 'var(--font-weight-medium)',  fontFamily: 'var(--font-mono)' }}>
                          {role.id}
                        </span>
                      </TableCell>
                      <TableCell style={{  fontWeight: 'var(--font-weight-medium)' }}>
                        {role.name}
                      </TableCell>
                      <TableCell style={{  color: 'var(--muted-foreground)' }}>
                        {role.description}
                      </TableCell>
                      <TableCell className="text-right" style={{  fontWeight: 'var(--font-weight-medium)' }}>
                        {role.usersCount}
                      </TableCell>
                      <TableCell className="text-right">
                        {role.permissionsCount}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <DataTablePagination
                page={rolesPagination.page}
                pageSize={rolesPagination.pageSize}
                totalItems={rolesPagination.totalItems}
                totalPages={rolesPagination.totalPages}
                onPageChange={rolesPagination.setPage}
              />
            </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* PERMISSIONS TAB */}
        <TabsContent value="permissions">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5" style={{ color: "var(--primary)" }} />
                <div>
                  <h3 style={{  fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                    {t('settingsPage.permissionMatrix')}
                  </h3>
                  <p style={{  color: 'var(--foreground)', opacity: 0.7 }}>
                    {t('settingsPage.configurePermissions')}
                  </p>
                </div>
              </div>
              <Select defaultValue="administrator">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="administrator">Administrator</SelectItem>
                  <SelectItem value="field-manager">Field Manager</SelectItem>
                  <SelectItem value="finance-officer">Finance Officer</SelectItem>
                  <SelectItem value="enumerator">Enumerator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Card>
              <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead style={{ width: '30%' }}>{t('settingsPage.module')}</TableHead>
                    <TableHead className="text-center">{t('settingsPage.view')}</TableHead>
                    <TableHead className="text-center">{t('settingsPage.create')}</TableHead>
                    <TableHead className="text-center">{t('settingsPage.edit')}</TableHead>
                    <TableHead className="text-center">{t('settingsPage.delete')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissionsPagination.paginatedItems.map((perm, index) => (
                    <TableRow key={index}>
                      <TableCell style={{  fontWeight: 'var(--font-weight-medium)' }}>
                        {perm.module}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          {perm.view ? (
                            <CheckCircle className="w-5 h-5" style={{ color: "var(--success)" }} />
                          ) : (
                            <XCircle className="w-5 h-5" style={{ color: "var(--muted-foreground)", opacity: 0.3 }} />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          {perm.create ? (
                            <CheckCircle className="w-5 h-5" style={{ color: "var(--success)" }} />
                          ) : (
                            <XCircle className="w-5 h-5" style={{ color: "var(--muted-foreground)", opacity: 0.3 }} />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          {perm.edit ? (
                            <CheckCircle className="w-5 h-5" style={{ color: "var(--success)" }} />
                          ) : (
                            <XCircle className="w-5 h-5" style={{ color: "var(--muted-foreground)", opacity: 0.3 }} />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          {perm.delete ? (
                            <CheckCircle className="w-5 h-5" style={{ color: "var(--success)" }} />
                          ) : (
                            <XCircle className="w-5 h-5" style={{ color: "var(--muted-foreground)", opacity: 0.3 }} />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <DataTablePagination
                page={permissionsPagination.page}
                pageSize={permissionsPagination.pageSize}
                totalItems={permissionsPagination.totalItems}
                totalPages={permissionsPagination.totalPages}
                onPageChange={permissionsPagination.setPage}
              />
              <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <Button>
                  {t('settingsPage.savePermissions')}
                </Button>
              </div>
            </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AUDIT LOGS TAB */}
        <TabsContent value="audit">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5" style={{ color: "var(--primary)" }} />
                <div>
                  <h3 style={{  fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                    {t('settingsPage.auditLogsTitle')}
                  </h3>
                  <p style={{  color: 'var(--foreground)', opacity: 0.7 }}>
                    {t('settingsPage.trackAudit')}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Select defaultValue="all-users">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-users">{t('settingsPage.allUsers')}</SelectItem>
                    <SelectItem value="maria">Maria Santos</SelectItem>
                    <SelectItem value="john">John Smith</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  {t('transactionsPage.export')}
                </Button>
              </div>
            </div>
            <Card>
              <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('settingsPage.logId')}</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>{t('settingsPage.entityId')}</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogsPagination.paginatedItems.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <span style={{ fontWeight: 'var(--font-weight-medium)',  fontFamily: 'var(--font-mono)' }}>
                          {log.id}
                        </span>
                      </TableCell>
                      <TableCell style={{  fontWeight: 'var(--font-weight-medium)' }}>
                        {log.user}
                      </TableCell>
                      <TableCell>
                        {log.action}
                      </TableCell>
                      <TableCell style={{  color: 'var(--muted-foreground)' }}>
                        {log.entity}
                      </TableCell>
                      <TableCell>
                        <span style={{  fontFamily: 'var(--font-mono)' }}>
                          {log.entityId}
                        </span>
                      </TableCell>
                      <TableCell style={{  color: 'var(--muted-foreground)' }}>
                        {log.timestamp}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <DataTablePagination
                page={auditLogsPagination.page}
                pageSize={auditLogsPagination.pageSize}
                totalItems={auditLogsPagination.totalItems}
                totalPages={auditLogsPagination.totalPages}
                onPageChange={auditLogsPagination.setPage}
              />
            </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* SESSIONS TAB */}
        <TabsContent value="sessions">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Monitor className="w-5 h-5" style={{ color: "var(--primary)" }} />
              <div>
                <h3 style={{  fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                    {t('settingsPage.activeSessions')}
                </h3>
                <p style={{  color: 'var(--foreground)', opacity: 0.7 }}>
                    {t('settingsPage.manageSessions')}
                </p>
              </div>
            </div>
            <Card>
              <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('settingsPage.sessionId')}</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>{t('settingsPage.device')}</TableHead>
                    <TableHead>{t('settingsPage.ipAddress')}</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>{t('settingsPage.expiresAt')}</TableHead>
                    <TableHead className="text-right">{t('transactionsPage.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessionsPagination.paginatedItems.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>
                        <span style={{ fontWeight: 'var(--font-weight-medium)',  fontFamily: 'var(--font-mono)' }}>
                          {session.id}
                        </span>
                      </TableCell>
                      <TableCell style={{  fontWeight: 'var(--font-weight-medium)' }}>
                        {session.user}
                      </TableCell>
                      <TableCell style={{  color: 'var(--muted-foreground)' }}>
                        {session.device}
                      </TableCell>
                      <TableCell>
                        <span style={{  fontFamily: 'var(--font-mono)' }}>
                          {session.ipAddress}
                        </span>
                      </TableCell>
                      <TableCell style={{  color: 'var(--muted-foreground)' }}>
                        {session.lastActivity}
                      </TableCell>
                      <TableCell style={{  color: 'var(--muted-foreground)' }}>
                        {session.expiresAt}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          <Button variant="ghost" size="sm">
                            <X className="w-4 h-4 mr-1" />
                            {t('settingsPage.revoke')}
                          </Button>
                        </div>
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
            </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* SYSTEM EVENTS TAB */}
        <TabsContent value="events">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5" style={{ color: "var(--primary)" }} />
                <div>
                  <h3 style={{  fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                    {t('settingsPage.systemEventsTitle')}
                  </h3>
                  <p style={{  color: 'var(--foreground)', opacity: 0.7 }}>
                    {t('settingsPage.monitorEvents')}
                  </p>
                </div>
              </div>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                  {t('settingsPage.exportLogs')}
              </Button>
            </div>
            <Card>
              <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('settingsPage.eventId')}</TableHead>
                    <TableHead>{t('settingsPage.eventType')}</TableHead>
                    <TableHead>{t('settingsPage.payload')}</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {systemEventsPagination.paginatedItems.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <span style={{ fontWeight: 'var(--font-weight-medium)',  fontFamily: 'var(--font-mono)' }}>
                          {event.id}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {event.eventType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <code style={{  fontFamily: 'var(--font-mono)', color: 'var(--muted-foreground)' }}>
                          {event.payload}
                        </code>
                      </TableCell>
                      <TableCell style={{  color: 'var(--muted-foreground)' }}>
                        {event.timestamp}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <DataTablePagination
                page={systemEventsPagination.page}
                pageSize={systemEventsPagination.pageSize}
                totalItems={systemEventsPagination.totalItems}
                totalPages={systemEventsPagination.totalPages}
                onPageChange={systemEventsPagination.setPage}
              />
            </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* SMS TEMPLATES TAB */}
        <TabsContent value="sms">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5" style={{ color: "var(--primary)" }} />
                <div>
                  <h3 style={{  fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                    {t('settingsPage.smsTemplates')}
                  </h3>
                  <p style={{  color: 'var(--foreground)', opacity: 0.7 }}>
                    {t('settingsPage.manageTemplates')}
                  </p>
                </div>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                 {t('settingsPage.createTemplate')}
              </Button>
            </div>
            <Card>
              <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('settingsPage.templateId')}</TableHead>
                    <TableHead>{t('settingsPage.templateName')}</TableHead>
                    <TableHead>{t('settingsPage.messageContent')}</TableHead>
                    <TableHead>Campaign</TableHead>
                    <TableHead>{t('campaignsPage.status')}</TableHead>
                    <TableHead className="text-right">{t('transactionsPage.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {smsTemplatesPagination.paginatedItems.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell>
                        <span style={{ fontWeight: 'var(--font-weight-medium)',  fontFamily: 'var(--font-mono)' }}>
                          {template.id}
                        </span>
                      </TableCell>
                      <TableCell style={{  fontWeight: 'var(--font-weight-medium)' }}>
                        {template.name}
                      </TableCell>
                      <TableCell style={{  color: 'var(--muted-foreground)', maxWidth: '300px' }}>
                        <div className="truncate">
                          {template.message}
                        </div>
                      </TableCell>
                      <TableCell>
                        {template.campaign}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(template.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <DataTablePagination
                page={smsTemplatesPagination.page}
                pageSize={smsTemplatesPagination.pageSize}
                totalItems={smsTemplatesPagination.totalItems}
                totalPages={smsTemplatesPagination.totalPages}
                onPageChange={smsTemplatesPagination.setPage}
              />
            </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TENANT SETTINGS TAB */}
        <TabsContent value="tenant">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <SettingsIcon className="w-5 h-5" style={{ color: "var(--primary)" }} />
                  <div>
                    <h3 style={{  fontWeight: 'var(--font-weight-semi-bold)' }}>
                      {t('settingsPage.tenantIdentity')}
                    </h3>
                    <p style={{  color: 'var(--muted-foreground)' }}>
                      {t('settingsPage.configureIdentity')}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label style={{  fontWeight: 'var(--font-weight-medium)' }}>
                      {t('settingsPage.tenantName')}
                    </label>
                    <Input defaultValue="Department of Social Welfare - Region V" />
                  </div>
                  <div className="space-y-2">
                    <label style={{  fontWeight: 'var(--font-weight-medium)' }}>
                      {t('settingsPage.shortCode')}
                    </label>
                    <Input defaultValue="DSWD-R5" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label style={{  fontWeight: 'var(--font-weight-medium)' }}>
                    {t('settingsPage.tenantLogo')}
                  </label>
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-20 h-20 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: 'var(--muted)' }}
                    >
                      <SettingsIcon className="w-8 h-8" style={{ color: 'var(--muted-foreground)' }} />
                    </div>
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      {t('settingsPage.uploadLogo')}
                    </Button>
                  </div>
                  <p style={{  color: 'var(--muted-foreground)' }}>
                    {t('settingsPage.logoRecommendation')}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5" style={{ color: "var(--primary)" }} />
                  <div>
                    <h3 style={{  fontWeight: 'var(--font-weight-semi-bold)' }}>
                      {t('settingsPage.regionalSettings')}
                    </h3>
                    <p style={{  color: 'var(--muted-foreground)' }}>
                      {t('settingsPage.configureRegional')}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label style={{  fontWeight: 'var(--font-weight-medium)' }}>
                      {t('settingsPage.primaryProvince')}
                    </label>
                    <Select defaultValue="maputo-cidade">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maputo-cidade">Maputo Cidade</SelectItem>
                        <SelectItem value="maputo-provincia">Maputo Província</SelectItem>
                        <SelectItem value="gaza">Gaza</SelectItem>
                        <SelectItem value="inhambane">Inhambane</SelectItem>
                        <SelectItem value="sofala">Sofala</SelectItem>
                        <SelectItem value="manica">Manica</SelectItem>
                        <SelectItem value="tete">Tete</SelectItem>
                        <SelectItem value="zambezia">Zambézia</SelectItem>
                        <SelectItem value="nampula">Nampula</SelectItem>
                        <SelectItem value="cabo-delgado">Cabo Delgado</SelectItem>
                        <SelectItem value="niassa">Niassa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label style={{  fontWeight: 'var(--font-weight-medium)' }}>
                      {t('settingsPage.timezone')}
                    </label>
                    <Select defaultValue="africa-maputo">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="africa-maputo">África/Maputo (CAT, GMT+2)</SelectItem>
                        <SelectItem value="utc">UTC (GMT+0)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label style={{  fontWeight: 'var(--font-weight-medium)' }}>
                      {t('settingsPage.currency')}
                    </label>
                    <Select defaultValue="mzn">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mzn">Metical Moçambicano (MZN)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label style={{  fontWeight: 'var(--font-weight-medium)' }}>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <span>{t('settingsPage.language')}</span>
                      </div>
                    </label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-MZ">Português (Moçambique)</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="pt-PT">Português (Portugal)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--muted)', borderRadius: 'var(--radius)' }}>
                  <p style={{  fontWeight: 'var(--font-weight-medium)', marginBottom: '4px' }}>
                     {t('settingsPage.selectedLanguage', { language: language === 'pt-MZ' ? 'Português (Moçambique)' : language === 'en' ? 'English' : 'Português (Portugal)' })}
                  </p>
                  <p style={{  color: 'var(--muted-foreground)' }}>
                     {t('settingsPage.selectedLanguageHelp')}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <SettingsIcon className="w-5 h-5" style={{ color: "var(--primary)" }} />
                  <div>
                    <h3 style={{  fontWeight: 'var(--font-weight-semi-bold)' }}>
                      {t('settingsPage.notificationSettings')}
                    </h3>
                    <p style={{  color: 'var(--muted-foreground)' }}>
                      {t('settingsPage.configureNotifications')}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--muted)', borderRadius: 'var(--radius)' }}>
                  <div>
                    <p style={{  fontWeight: 'var(--font-weight-medium)' }}>
                      {t('settingsPage.emailNotifications')}
                    </p>
                    <p style={{  color: 'var(--muted-foreground)' }}>
                      {t('settingsPage.emailNotificationsHelp')}
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--muted)', borderRadius: 'var(--radius)' }}>
                  <div>
                    <p style={{  fontWeight: 'var(--font-weight-medium)' }}>
                      {t('settingsPage.smsAlerts')}
                    </p>
                    <p style={{  color: 'var(--muted-foreground)' }}>
                      {t('settingsPage.smsAlertsHelp')}
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--muted)', borderRadius: 'var(--radius)' }}>
                  <div>
                    <p style={{  fontWeight: 'var(--font-weight-medium)' }}>
                      {t('settingsPage.transactionNotifications')}
                    </p>
                    <p style={{  color: 'var(--muted-foreground)' }}>
                      {t('settingsPage.transactionNotificationsHelp')}
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
              <Button variant="outline">{t('settingsPage.cancel')}</Button>
              <Button>{t('settingsPage.saveSettings')}</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
