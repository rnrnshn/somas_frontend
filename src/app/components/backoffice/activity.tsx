import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Users, LogIn, AlertCircle, Clock } from "lucide-react";

export function BackofficeActivity() {
  const stats = [
    {
      label: 'Active Sessions',
      value: '23',
      icon: Users,
      color: 'text-primary'
    },
    {
      label: 'Logins Today',
      value: '156',
      icon: LogIn,
      color: 'text-[--success]'
    },
    {
      label: 'Failed Logins',
      value: '8',
      icon: AlertCircle,
      color: 'text-[--warning]'
    },
    {
      label: 'Avg Session Time',
      value: '2.5h',
      icon: Clock,
      color: 'text-accent'
    },
  ];

  const recentActivity = [
    {
      user: 'admin@somas.gov',
      action: 'Logged in',
      timestamp: '2026-03-02 09:45:23',
      ip: '192.168.1.100'
    },
    {
      user: 'lucia@somas.gov',
      action: 'Updated campaign CMP-001',
      timestamp: '2026-03-02 09:32:15',
      ip: '192.168.1.101'
    },
    {
      user: 'miguel@somas.gov',
      action: 'Downloaded report',
      timestamp: '2026-03-02 09:18:42',
      ip: '192.168.1.102'
    },
    {
      user: 'unknown@example.com',
      action: 'Failed login attempt',
      timestamp: '2026-03-02 09:05:10',
      ip: '203.45.67.89',
      failed: true
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1>User Activity</h1>
        <p style={{  color: 'var(--muted-foreground)' }} className="mt-2">
          Monitor user sessions, logins, and system activity
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle style={{  fontWeight: 'var(--font-weight-medium)', color: 'var(--muted-foreground)' }}>
                  {stat.label}
                </CardTitle>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div style={{  fontWeight: 'var(--font-weight-semi-bold)' }}>
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className={`p-4 border rounded-[var(--radius)] ${
                  activity.failed ? 'border-[--error] bg-[--error]/5' : 'border-border'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p style={{ fontWeight: 'var(--font-weight-medium)' }}>
                      {activity.action}
                    </p>
                    <p style={{  color: 'var(--muted-foreground)' }}>
                      {activity.user} • IP: {activity.ip}
                    </p>
                  </div>
                  <span style={{  color: 'var(--muted-foreground)' }}>
                    {activity.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
