import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Shield, Clock, AlertTriangle, Monitor, LogOut } from "lucide-react";

interface UserSecurityData {
  lastLogin: string;
  failedAttempts: number;
  accountStatus: 'active' | 'locked' | 'disabled' | 'pending';
  activeSessions: number;
  lastPasswordChange: string;
  twoFactorEnabled: boolean;
}

const MOCK_SECURITY_DATA: UserSecurityData = {
  lastLogin: "2024-03-02 14:30:00",
  failedAttempts: 0,
  accountStatus: 'active',
  activeSessions: 2,
  lastPasswordChange: "2024-02-01 10:15:00",
  twoFactorEnabled: false,
};

export function UserSecurityOverview() {
  const [securityData] = useState<UserSecurityData>(MOCK_SECURITY_DATA);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleForceLogout = () => {
    console.log("Force logout all sessions");
    setShowLogoutDialog(false);
    // In real app, call API to revoke all sessions
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'active';
      case 'locked':
        return 'locked';
      case 'disabled':
        return 'disabled';
      case 'pending':
        return 'pending';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2">Security Overview</h3>
        <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }}>
          Monitor account security and session activity
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Last Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p style={{ fontSize: 'var(--text-24)', fontWeight: 'var(--font-weight-semi-bold)' }}>
              {securityData.lastLogin}
            </p>
            <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)', marginTop: '8px' }}>
              From IP: 192.168.1.100
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Failed Login Attempts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p style={{ fontSize: 'var(--text-24)', fontWeight: 'var(--font-weight-semi-bold)' }}>
              {securityData.failedAttempts}
            </p>
            <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)', marginTop: '8px' }}>
              Since last successful login
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-success" />
              Account Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant={getStatusVariant(securityData.accountStatus)}>
                {securityData.accountStatus}
              </Badge>
            </div>
            <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)', marginTop: '8px' }}>
              Last password change: {securityData.lastPasswordChange}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5 text-accent" />
              Active Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p style={{ fontSize: 'var(--text-24)', fontWeight: 'var(--font-weight-semi-bold)' }}>
              {securityData.activeSessions}
            </p>
            <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)', marginTop: '8px' }}>
              Devices currently logged in
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session Management</CardTitle>
          <CardDescription>
            Control all active sessions for this account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div 
              className="p-4 rounded-[--radius]" 
              style={{ backgroundColor: 'var(--muted)' }}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0" style={{ marginTop: '2px' }} />
                <div>
                  <p style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)' }}>
                    Force Logout
                  </p>
                  <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)', marginTop: '4px' }}>
                    This action will immediately terminate all active sessions and require the user to sign in again on all devices.
                  </p>
                </div>
              </div>
            </div>

            <Button 
              variant="destructive" 
              onClick={() => setShowLogoutDialog(true)}
              className="w-full md:w-auto"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Force Logout All Sessions
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <LogOut className="h-5 w-5" style={{ color: 'var(--destructive)' }} />
              Force Logout Confirmation
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will immediately terminate all {securityData.activeSessions} active session(s). 
              The user will need to sign in again on all devices. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleForceLogout}>
              Force Logout All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
