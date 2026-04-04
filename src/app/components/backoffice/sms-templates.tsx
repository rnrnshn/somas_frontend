import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Plus, Eye } from "lucide-react";

export function BackofficeSMSTemplates() {
  const templates = [
    {
      id: 'SMS-001',
      name: 'Payment Confirmation',
      campaign: 'All Campaigns',
      message: 'Hello {name}, your payment of MZN {amount} has been processed. Campaign: {campaign}. Thank you.',
      usageCount: 45678,
      status: 'Active'
    },
    {
      id: 'SMS-002',
      name: 'Verification Reminder',
      campaign: 'Flood Relief 2024',
      message: 'Dear {name}, please verify your details for {campaign}. Visit: {link}',
      usageCount: 12500,
      status: 'Active'
    },
    {
      id: 'SMS-003',
      name: 'Savings Update',
      campaign: 'All Campaigns',
      message: '{name}, your total savings is now MZN {savings}. Keep saving! Campaign: {campaign}',
      usageCount: 34567,
      status: 'Active'
    },
    {
      id: 'SMS-004',
      name: 'Welcome Message',
      campaign: 'All Campaigns',
      message: 'Welcome to {campaign}! You have been enrolled as a beneficiary. ID: {beneficiaryId}',
      usageCount: 89012,
      status: 'Active'
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 style={{ fontSize: 'var(--text-32)' }}>SMS Templates</h1>
          <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }} className="mt-2">
            Manage messaging templates for campaigns
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 style={{ fontSize: 'var(--text-18)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                      {template.name}
                    </h3>
                    <Badge style={{ backgroundColor: 'var(--success)', color: 'var(--success-foreground)' }}>{template.status}</Badge>
                  </div>
                  <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                    {template.id} • {template.campaign} • {template.usageCount.toLocaleString()} sent
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div>
              <div className="p-4 bg-muted rounded-[--radius]">
                <p style={{ fontSize: 'var(--text-14)' }}>{template.message}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
