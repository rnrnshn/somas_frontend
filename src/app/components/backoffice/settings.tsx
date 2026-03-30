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

export function Settings() {
  const [activeTab, setActiveTab] = useState("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [language, setLanguage] = useState("pt-MZ");

  // Mock data
  const users = [
    {
      id: 'USR-001',
      name: 'Maria Santos',
      email: 'maria.santos@somas.gov',
      role: 'Administrator',
      status: 'Active',
      lastLogin: '2026-03-05 09:30:00'
    },
    {
      id: 'USR-002',
      name: 'John Smith',
      email: 'john.smith@somas.gov',
      role: 'Field Manager',
      status: 'Active',
      lastLogin: '2026-03-05 08:15:00'
    },
    {
      id: 'USR-003',
      name: 'Jane Doe',
      email: 'jane.doe@somas.gov',
      role: 'Enumerator',
      status: 'Active',
      lastLogin: '2026-03-04 16:45:00'
    },
    {
      id: 'USR-004',
      name: 'Carlos Garcia',
      email: 'carlos.garcia@somas.gov',
      role: 'Finance Officer',
      status: 'Inactive',
      lastLogin: '2026-02-28 11:20:00'
    },
  ];

  const roles = [
    {
      id: 'ROL-001',
      name: 'Administrator',
      description: 'Full system access and control',
      usersCount: 3,
      permissionsCount: 48
    },
    {
      id: 'ROL-002',
      name: 'Field Manager',
      description: 'Manage field operations and enumerators',
      usersCount: 8,
      permissionsCount: 24
    },
    {
      id: 'ROL-003',
      name: 'Finance Officer',
      description: 'Manage disbursements and financial operations',
      usersCount: 5,
      permissionsCount: 18
    },
    {
      id: 'ROL-004',
      name: 'Enumerator',
      description: 'Field data collection and beneficiary verification',
      usersCount: 45,
      permissionsCount: 12
    },
  ];

  const permissions = [
    { module: 'Campaigns', view: true, create: true, edit: true, delete: true },
    { module: 'Savings Programs', view: true, create: true, edit: true, delete: false },
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
      message: 'Your payment of ${amount} has been processed. Ref: ${ref_number}',
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
    {
      id: 'TPL-003',
      name: 'Savings Milestone',
      message: 'Congratulations! You reached ${milestone} in savings.',
      campaign: 'Savings Program',
      status: 'Draft'
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
        <h1 style={{ fontSize: 'var(--text-32)', fontWeight: 'var(--font-weight-semi-bold)' }}>
          Settings
        </h1>
        <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)', marginTop: '8px' }}>
          Manage platform configuration and governance features
        </p>
      </div>

      <BackendSettingsPanel />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="events">System Events</TabsTrigger>
          <TabsTrigger value="sms">SMS Templates</TabsTrigger>
          <TabsTrigger value="tenant">Tenant Settings</TabsTrigger>
        </TabsList>

        {/* USERS TAB */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  
                  <div>
                    <h3 style={{ fontSize: 'var(--text-16)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                      System Users
                    </h3>
                    <p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)' }}>
                      Manage user accounts and access control
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--muted-foreground)" }} />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersPagination.paginatedItems.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <span style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--text-12)', fontFamily: 'var(--font-mono)' }}>
                          {user.id}
                        </span>
                      </TableCell>
                      <TableCell style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-medium)' }}>
                        {user.name}
                      </TableCell>
                      <TableCell style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)' }}>
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(user.status)}
                      </TableCell>
                      <TableCell style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
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
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5" style={{ color: "var(--primary)" }} />
                  <div>
                    <h3 style={{ fontSize: 'var(--text-16)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                      Role Management
                    </h3>
                    <p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)' }}>
                      Define and manage user roles and access levels
                    </p>
                  </div>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Role
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role ID</TableHead>
                    <TableHead>Role Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Users</TableHead>
                    <TableHead className="text-right">Permissions</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rolesPagination.paginatedItems.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>
                        <span style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--text-12)', fontFamily: 'var(--font-mono)' }}>
                          {role.id}
                        </span>
                      </TableCell>
                      <TableCell style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-medium)' }}>
                        {role.name}
                      </TableCell>
                      <TableCell style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)' }}>
                        {role.description}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-medium)' }}>
                        {role.usersCount}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontSize: 'var(--text-13)' }}>
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
        </TabsContent>

        {/* PERMISSIONS TAB */}
        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5" style={{ color: "var(--primary)" }} />
                  <div>
                    <h3 style={{ fontSize: 'var(--text-16)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                      Permission Matrix
                    </h3>
                    <p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)' }}>
                      Configure module-level permissions for Administrator role
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
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead style={{ width: '30%' }}>Module</TableHead>
                    <TableHead className="text-center">View</TableHead>
                    <TableHead className="text-center">Create</TableHead>
                    <TableHead className="text-center">Edit</TableHead>
                    <TableHead className="text-center">Delete</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissionsPagination.paginatedItems.map((perm, index) => (
                    <TableRow key={index}>
                      <TableCell style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-medium)' }}>
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
                  Save Permissions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AUDIT LOGS TAB */}
        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5" style={{ color: "var(--primary)" }} />
                  <div>
                    <h3 style={{ fontSize: 'var(--text-16)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                      Audit Logs
                    </h3>
                    <p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)' }}>
                      Track administrative actions and system changes
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Select defaultValue="all-users">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-users">All Users</SelectItem>
                      <SelectItem value="maria">Maria Santos</SelectItem>
                      <SelectItem value="john">John Smith</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Log ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Entity ID</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogsPagination.paginatedItems.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <span style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--text-12)', fontFamily: 'var(--font-mono)' }}>
                          {log.id}
                        </span>
                      </TableCell>
                      <TableCell style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-medium)' }}>
                        {log.user}
                      </TableCell>
                      <TableCell style={{ fontSize: 'var(--text-13)' }}>
                        {log.action}
                      </TableCell>
                      <TableCell style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)' }}>
                        {log.entity}
                      </TableCell>
                      <TableCell>
                        <span style={{ fontSize: 'var(--text-12)', fontFamily: 'var(--font-mono)' }}>
                          {log.entityId}
                        </span>
                      </TableCell>
                      <TableCell style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
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
        </TabsContent>

        {/* SESSIONS TAB */}
        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Monitor className="w-5 h-5" style={{ color: "var(--primary)" }} />
                <div>
                  <h3 style={{ fontSize: 'var(--text-16)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                    Active Sessions
                  </h3>
                  <p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)' }}>
                    Monitor and manage active user sessions
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Session ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>Expires At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessionsPagination.paginatedItems.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>
                        <span style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--text-12)', fontFamily: 'var(--font-mono)' }}>
                          {session.id}
                        </span>
                      </TableCell>
                      <TableCell style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-medium)' }}>
                        {session.user}
                      </TableCell>
                      <TableCell style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)' }}>
                        {session.device}
                      </TableCell>
                      <TableCell>
                        <span style={{ fontSize: 'var(--text-12)', fontFamily: 'var(--font-mono)' }}>
                          {session.ipAddress}
                        </span>
                      </TableCell>
                      <TableCell style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                        {session.lastActivity}
                      </TableCell>
                      <TableCell style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                        {session.expiresAt}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          <Button variant="ghost" size="sm">
                            <X className="w-4 h-4 mr-1" />
                            Revoke
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
        </TabsContent>

        {/* SYSTEM EVENTS TAB */}
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5" style={{ color: "var(--primary)" }} />
                  <div>
                    <h3 style={{ fontSize: 'var(--text-16)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                      System Events
                    </h3>
                    <p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)' }}>
                      Monitor technical system events and operations
                    </p>
                  </div>
                </div>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Logs
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event ID</TableHead>
                    <TableHead>Event Type</TableHead>
                    <TableHead>Payload</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {systemEventsPagination.paginatedItems.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <span style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--text-12)', fontFamily: 'var(--font-mono)' }}>
                          {event.id}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" style={{ fontSize: 'var(--text-11)' }}>
                          {event.eventType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <code style={{ fontSize: 'var(--text-12)', fontFamily: 'var(--font-mono)', color: 'var(--muted-foreground)' }}>
                          {event.payload}
                        </code>
                      </TableCell>
                      <TableCell style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
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
        </TabsContent>

        {/* SMS TEMPLATES TAB */}
        <TabsContent value="sms">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5" style={{ color: "var(--primary)" }} />
                  <div>
                    <h3 style={{ fontSize: 'var(--text-16)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                      SMS Templates
                    </h3>
                    <p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)' }}>
                      Manage message templates for beneficiary communication
                    </p>
                  </div>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Template
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template ID</TableHead>
                    <TableHead>Template Name</TableHead>
                    <TableHead>Message Content</TableHead>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {smsTemplatesPagination.paginatedItems.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell>
                        <span style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--text-12)', fontFamily: 'var(--font-mono)' }}>
                          {template.id}
                        </span>
                      </TableCell>
                      <TableCell style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-medium)' }}>
                        {template.name}
                      </TableCell>
                      <TableCell style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)', maxWidth: '300px' }}>
                        <div className="truncate">
                          {template.message}
                        </div>
                      </TableCell>
                      <TableCell style={{ fontSize: 'var(--text-13)' }}>
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
        </TabsContent>

        {/* TENANT SETTINGS TAB */}
        <TabsContent value="tenant">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <SettingsIcon className="w-5 h-5" style={{ color: "var(--primary)" }} />
                  <div>
                    <h3 style={{ fontSize: 'var(--text-16)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                      Tenant Identity
                    </h3>
                    <p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)' }}>
                      Configure organization branding and identity
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-medium)' }}>
                      Tenant Name
                    </label>
                    <Input defaultValue="Department of Social Welfare - Region V" />
                  </div>
                  <div className="space-y-2">
                    <label style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-medium)' }}>
                      Short Code
                    </label>
                    <Input defaultValue="DSWD-R5" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-medium)' }}>
                    Tenant Logo
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
                      Upload Logo
                    </Button>
                  </div>
                  <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                    Recommended: 256x256px PNG with transparent background
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5" style={{ color: "var(--primary)" }} />
                  <div>
                    <h3 style={{ fontSize: 'var(--text-16)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                      Definições Regionais
                    </h3>
                    <p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)' }}>
                      Configurar fuso horário e preferências regionais
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-medium)' }}>
                      Província Principal
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
                    <label style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-medium)' }}>
                      Fuso Horário
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
                    <label style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-medium)' }}>
                      Moeda
                    </label>
                    <Select defaultValue="mzn">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mzn">Metical Moçambicano (MZN)</SelectItem>
                        <SelectItem value="usd">Dólar Americano (USD)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-medium)' }}>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <span>Idioma</span>
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
                  <p style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-medium)', marginBottom: '4px' }}>
                    Idioma Selecionado: {language === 'pt-MZ' ? 'Português (Moçambique)' : language === 'en' ? 'English' : 'Português (Portugal)'}
                  </p>
                  <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                    Esta definição será aplicada a toda a interface do sistema após salvar as configurações.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <SettingsIcon className="w-5 h-5" style={{ color: "var(--primary)" }} />
                  <div>
                    <h3 style={{ fontSize: 'var(--text-16)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                      Notification Settings
                    </h3>
                    <p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)' }}>
                      Configure system notifications and alerts
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--muted)', borderRadius: 'var(--radius)' }}>
                  <div>
                    <p style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-medium)' }}>
                      Email Notifications
                    </p>
                    <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                      Receive email alerts for critical system events
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--muted)', borderRadius: 'var(--radius)' }}>
                  <div>
                    <p style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-medium)' }}>
                      SMS Gateway Alerts
                    </p>
                    <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                      Get notified when SMS delivery fails
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--muted)', borderRadius: 'var(--radius)' }}>
                  <div>
                    <p style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-medium)' }}>
                      Transaction Notifications
                    </p>
                    <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                      Receive updates on disbursement status changes
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
              <Button variant="outline">Cancel</Button>
              <Button>Save Settings</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
