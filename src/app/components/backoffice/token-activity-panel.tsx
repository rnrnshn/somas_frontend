import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { LogIn, AlertCircle, Key, RefreshCcw } from "lucide-react";

interface TokenActivityData {
  totalLogins: number;
  failedAttempts: number;
  activeTokens: number;
  refreshTokenExpiry: string;
}

const MOCK_ACTIVITY_DATA: TokenActivityData = {
  totalLogins: 1247,
  failedAttempts: 23,
  activeTokens: 8,
  refreshTokenExpiry: "2024-03-09 14:30:00",
};

export function TokenActivityPanel() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2">Authentication Activity</h3>
        <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }}>
          Monitor authentication tokens and login activity across the platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2" style={{ fontSize: 'var(--text-14)' }}>
              <LogIn className="h-4 w-4 text-primary" />
              Total Logins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p style={{ fontSize: 'var(--text-32)', fontWeight: 'var(--font-weight-semi-bold)', lineHeight: '1' }}>
                {MOCK_ACTIVITY_DATA.totalLogins.toLocaleString()}
              </p>
              <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)', marginTop: '8px' }}>
                All time successful logins
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2" style={{ fontSize: 'var(--text-14)' }}>
              <AlertCircle className="h-4 w-4 text-warning" />
              Failed Attempts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p style={{ fontSize: 'var(--text-32)', fontWeight: 'var(--font-weight-semi-bold)', lineHeight: '1' }}>
                {MOCK_ACTIVITY_DATA.failedAttempts}
              </p>
              <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)', marginTop: '8px' }}>
                Last 7 days
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2" style={{ fontSize: 'var(--text-14)' }}>
              <Key className="h-4 w-4 text-accent" />
              Active Tokens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p style={{ fontSize: 'var(--text-32)', fontWeight: 'var(--font-weight-semi-bold)', lineHeight: '1' }}>
                {MOCK_ACTIVITY_DATA.activeTokens}
              </p>
              <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)', marginTop: '8px' }}>
                Currently valid access tokens
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2" style={{ fontSize: 'var(--text-14)' }}>
              <RefreshCcw className="h-4 w-4 text-success" />
              Token Expiry
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p style={{ fontSize: 'var(--text-16)', fontWeight: 'var(--font-weight-semi-bold)', lineHeight: '1.2' }}>
                {MOCK_ACTIVITY_DATA.refreshTokenExpiry}
              </p>
              <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)', marginTop: '8px' }}>
                Refresh token expiration
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Authentication Insights</CardTitle>
          <CardDescription>
            Platform-wide authentication statistics and token management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                className="p-4 rounded-[--radius]" 
                style={{ backgroundColor: 'var(--muted)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)' }}>
                    Success Rate
                  </span>
                  <span style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--success)' }}>
                    98.2%
                  </span>
                </div>
                <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                  Successful logins vs total attempts
                </p>
              </div>

              <div 
                className="p-4 rounded-[--radius]" 
                style={{ backgroundColor: 'var(--muted)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)' }}>
                    Avg. Session Duration
                  </span>
                  <span style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--primary)' }}>
                    4.3 hours
                  </span>
                </div>
                <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                  Average active session time
                </p>
              </div>

              <div 
                className="p-4 rounded-[--radius]" 
                style={{ backgroundColor: 'var(--muted)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)' }}>
                    Peak Login Time
                  </span>
                  <span style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--accent)' }}>
                    9:00 AM
                  </span>
                </div>
                <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                  Most common login hour
                </p>
              </div>

              <div 
                className="p-4 rounded-[--radius]" 
                style={{ backgroundColor: 'var(--muted)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)' }}>
                    Unique Users (30d)
                  </span>
                  <span style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--primary)' }}>
                    342
                  </span>
                </div>
                <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                  Distinct users in last 30 days
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
