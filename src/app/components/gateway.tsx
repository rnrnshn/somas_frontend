import { useState } from "react";
import { useNavigate } from "@/lib/router";
import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Building2, Smartphone, Key } from "lucide-react";

export function Gateway() {
  const navigate = useNavigate();
  const [showCredentials, setShowCredentials] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        <div className="mb-12">
          <div className="text-center">
            <h1 className="mb-4">{t('brand')}</h1>
          <p style={{ fontSize: 'var(--text-20)', fontWeight: 'var(--font-weight-regular)', color: 'var(--muted-foreground)' }}>
            {t('socialMassPlatform')}
          </p>
          <p style={{ fontSize: 'var(--text-16)', color: 'var(--muted-foreground)', marginTop: '24px' }}>
            {t('selectEnvironment')}
          </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card 
            className="cursor-pointer transition-all hover:border-primary hover:shadow-[var(--elevation-sm)]"
            onClick={() => navigate('/backoffice/login')}
          >
            <CardHeader className="items-center text-center p-12">
              <div className="w-16 h-16 rounded-[--radius-card] bg-primary/10 flex items-center justify-center mb-6">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="mb-4">{t('backofficePlatform')}</CardTitle>
              <CardDescription className="space-y-1">
                <span className="block">{t('campaignManagement')}</span>
                <span className="block">{t('monitoringReporting')}</span>
                <span className="block">{t('governanceAudit')}</span>
              </CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className="cursor-pointer transition-all hover:border-primary hover:shadow-[var(--elevation-sm)]"
            onClick={() => navigate('/field/login')}
          >
            <CardHeader className="items-center text-center p-12">
              <div className="w-16 h-16 rounded-[--radius-card] bg-accent/10 flex items-center justify-center mb-6">
                <Smartphone className="w-8 h-8 text-accent" />
              </div>
              <CardTitle className="mb-4">{t('fieldApp')}</CardTitle>
              <CardDescription className="space-y-1">
                <span className="block">{t('beneficiaryVerification')}</span>
                <span className="block">{t('offlineSync')}</span>
                <span className="block">{t('fieldConfirmation')}</span>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Demo Credentials Button */}
        <div className="mt-8 text-center">
          <Button 
            variant="outline" 
            onClick={() => setShowCredentials(true)}
            className="gap-2"
          >
            <Key className="w-4 h-4" />
            {t('demoCredentials')}
          </Button>
        </div>

        {/* Demo Credentials Modal */}
        <Dialog open={showCredentials} onOpenChange={setShowCredentials}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle style={{ fontSize: 'var(--text-20)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                {t('demoCredentials')}
              </DialogTitle>
              <DialogDescription style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }}>
                {t('useDemoCredentials')}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6" style={{ marginTop: '24px' }}>
              {/* Backoffice Platform Users */}
              <div>
                <h3 style={{ fontSize: 'var(--text-16)', fontWeight: 'var(--font-weight-semi-bold)', marginBottom: '12px' }}>
                  {t('backofficePlatform')}
                </h3>
                <p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)', marginBottom: '12px' }}>
                  {t('passwordForAll')} <span style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>1234567890</span>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div style={{ 
                    padding: '12px', 
                    borderRadius: 'var(--radius)', 
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--muted)'
                  }}>
                    <p style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                      {t('adminRole')}
                    </p>
                    <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)', marginTop: '4px' }}>
                      admin@somas.app
                    </p>
                    <p style={{ fontSize: 'var(--text-11)', color: 'var(--muted-foreground)', marginTop: '4px' }}>
                      {t('fullSystemAccess')}
                    </p>
                  </div>
                  <div style={{ 
                    padding: '12px', 
                    borderRadius: 'var(--radius)', 
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--muted)'
                  }}>
                    <p style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                      {t('analyticsRole')}
                    </p>
                    <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)', marginTop: '4px' }}>
                      analytic@somas.app
                    </p>
                    <p style={{ fontSize: 'var(--text-11)', color: 'var(--muted-foreground)', marginTop: '4px' }}>
                      {t('dashboardReportsRead')}
                    </p>
                  </div>
                  <div style={{ 
                    padding: '12px', 
                    borderRadius: 'var(--radius)', 
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--muted)'
                  }}>
                    <p style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                      {t('contentManagerRole')}
                    </p>
                    <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)', marginTop: '4px' }}>
                      content@somas.app
                    </p>
                    <p style={{ fontSize: 'var(--text-11)', color: 'var(--muted-foreground)', marginTop: '4px' }}>
                      {t('contentManagement')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Field Operations Users */}
              <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: 'var(--text-16)', fontWeight: 'var(--font-weight-semi-bold)', marginBottom: '12px' }}>
                  {t('fieldApp')}
                </h3>
                <p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)', marginBottom: '12px' }}>
                  {t('passwordForAll')} <span style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>1234567890</span>
                </p>
                <div className="grid grid-cols-1 gap-4">
                  <div style={{ 
                    padding: '12px', 
                    borderRadius: 'var(--radius)', 
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--muted)'
                  }}>
                    <p style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                      {t('inquirerRole')}
                    </p>
                    <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)', marginTop: '4px' }}>
                      inquirer@somas.app
                    </p>
                    <p style={{ fontSize: 'var(--text-11)', color: 'var(--muted-foreground)', marginTop: '4px' }}>
                      {t('fieldVerificationCopy')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account State Testing */}
              <div style={{ 
                paddingTop: '16px', 
                borderTop: '1px solid var(--border)',
                padding: '12px',
                borderRadius: 'var(--radius)',
                backgroundColor: 'var(--muted)/50'
              }}>
                <p style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-semi-bold)', marginBottom: '4px' }}>
                  {t('testAccountStates')}
                </p>
                <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                  {t('testAccountStatesCopy')}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
