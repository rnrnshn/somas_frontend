import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

export function AccountStatusDemo() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2">Account Status Variants</h3>
        <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }}>
          Visual representation of different account states
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status Badge Variants</CardTitle>
          <CardDescription>
            Professional, subtle status indicators for account states
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                className="p-4 rounded-[--radius]" 
                style={{ backgroundColor: 'var(--muted)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)' }}>
                    Active Account
                  </span>
                  <Badge variant="active">Active</Badge>
                </div>
                <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                  Account is in good standing and fully operational
                </p>
              </div>

              <div 
                className="p-4 rounded-[--radius]" 
                style={{ backgroundColor: 'var(--muted)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)' }}>
                    Locked Account
                  </span>
                  <Badge variant="locked">Locked</Badge>
                </div>
                <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                  Too many failed login attempts - contact administrator
                </p>
              </div>

              <div 
                className="p-4 rounded-[--radius]" 
                style={{ backgroundColor: 'var(--muted)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)' }}>
                    Disabled Account
                  </span>
                  <Badge variant="disabled">Disabled</Badge>
                </div>
                <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                  Account has been administratively disabled
                </p>
              </div>

              <div 
                className="p-4 rounded-[--radius]" 
                style={{ backgroundColor: 'var(--muted)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span style={{ fontSize: 'var(--text-14)', fontWeight: 'var(--font-weight-medium)' }}>
                    Pending Confirmation
                  </span>
                  <Badge variant="pending">Pending</Badge>
                </div>
                <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                  Awaiting email verification or administrator approval
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
