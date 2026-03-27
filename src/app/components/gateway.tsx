import { useState } from "react";
import { useNavigate } from "@/lib/router";
import { Card, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Building2, Smartphone, Key } from "lucide-react";

export function Gateway() {
  const navigate = useNavigate();
  const [showCredentials, setShowCredentials] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="mb-4">SOMAS</h1>
          <p style={{ fontSize: 'var(--text-20)', fontWeight: 'var(--font-weight-regular)', color: 'var(--muted-foreground)' }}>
            Social Mass Payments & Savings Platform
          </p>
          <p style={{ fontSize: 'var(--text-16)', color: 'var(--muted-foreground)', marginTop: '24px' }}>
            Select your operational environment
          </p>
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
              <CardTitle className="mb-4">Backoffice Platform</CardTitle>
              <CardDescription className="space-y-1">
                <span className="block">Campaign Management</span>
                <span className="block">Monitoring & Reporting</span>
                <span className="block">Governance & Audit</span>
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
              <CardTitle className="mb-4">Field Operations App</CardTitle>
              <CardDescription className="space-y-1">
                <span className="block">Beneficiary Verification</span>
                <span className="block">Offline Sync</span>
                <span className="block">Field Confirmation</span>
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
            Credenciais de Demo
          </Button>
        </div>

        {/* Demo Credentials Modal */}
        <Dialog open={showCredentials} onOpenChange={setShowCredentials}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle style={{ fontSize: 'var(--text-20)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                Credenciais de Demo
              </DialogTitle>
              <DialogDescription style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }}>
                Use estas credenciais para testar o sistema SOMAS
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6" style={{ marginTop: '24px' }}>
              {/* Backoffice Platform Users */}
              <div>
                <h3 style={{ fontSize: 'var(--text-16)', fontWeight: 'var(--font-weight-semi-bold)', marginBottom: '12px' }}>
                  Backoffice Platform
                </h3>
                <p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)', marginBottom: '12px' }}>
                  Senha para todos: <span style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>demo</span>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div style={{ 
                    padding: '12px', 
                    borderRadius: 'var(--radius)', 
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--muted)'
                  }}>
                    <p style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                      Admin
                    </p>
                    <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)', marginTop: '4px' }}>
                      admin@somas.gov
                    </p>
                    <p style={{ fontSize: 'var(--text-11)', color: 'var(--muted-foreground)', marginTop: '4px' }}>
                      Acesso completo ao sistema
                    </p>
                  </div>
                  <div style={{ 
                    padding: '12px', 
                    borderRadius: 'var(--radius)', 
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--muted)'
                  }}>
                    <p style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                      Analyst
                    </p>
                    <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)', marginTop: '4px' }}>
                      miguel@somas.gov
                    </p>
                    <p style={{ fontSize: 'var(--text-11)', color: 'var(--muted-foreground)', marginTop: '4px' }}>
                      Leitura de dashboards e relatórios
                    </p>
                  </div>
                  <div style={{ 
                    padding: '12px', 
                    borderRadius: 'var(--radius)', 
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--muted)'
                  }}>
                    <p style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                      Content Manager
                    </p>
                    <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)', marginTop: '4px' }}>
                      lucia@somas.gov
                    </p>
                    <p style={{ fontSize: 'var(--text-11)', color: 'var(--muted-foreground)', marginTop: '4px' }}>
                      Gestão de conteúdo
                    </p>
                  </div>
                </div>
              </div>

              {/* Field Operations Users */}
              <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: 'var(--text-16)', fontWeight: 'var(--font-weight-semi-bold)', marginBottom: '12px' }}>
                  Field Operations App
                </h3>
                <p style={{ fontSize: 'var(--text-13)', color: 'var(--muted-foreground)', marginBottom: '12px' }}>
                  PIN para todos: <span style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>1234</span>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div style={{ 
                    padding: '12px', 
                    borderRadius: 'var(--radius)', 
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--muted)'
                  }}>
                    <p style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                      Enumerator
                    </p>
                    <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)', marginTop: '4px' }}>
                      enumerator.001
                    </p>
                    <p style={{ fontSize: 'var(--text-11)', color: 'var(--muted-foreground)', marginTop: '4px' }}>
                      Verificação no campo
                    </p>
                  </div>
                  <div style={{ 
                    padding: '12px', 
                    borderRadius: 'var(--radius)', 
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--muted)'
                  }}>
                    <p style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                      Enumerator
                    </p>
                    <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)', marginTop: '4px' }}>
                      enumerator.002
                    </p>
                    <p style={{ fontSize: 'var(--text-11)', color: 'var(--muted-foreground)', marginTop: '4px' }}>
                      Verificação no campo
                    </p>
                  </div>
                  <div style={{ 
                    padding: '12px', 
                    borderRadius: 'var(--radius)', 
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--muted)'
                  }}>
                    <p style={{ fontSize: 'var(--text-13)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                      Regional
                    </p>
                    <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)', marginTop: '4px' }}>
                      regional.001
                    </p>
                    <p style={{ fontSize: 'var(--text-11)', color: 'var(--muted-foreground)', marginTop: '4px' }}>
                      Supervisão regional
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
                  Testar Estados de Conta
                </p>
                <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                  Use emails contendo "locked" ou "disabled" para testar diferentes estados de conta (ex: locked@somas.gov)
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
