import { useState } from "react";
import { Navigate, Outlet, useNavigate, useLocation } from "@/lib/router";
import { useAuth } from "@/lib/auth/auth-context";
import { 
  LayoutDashboard, 
  Megaphone, 
  PiggyBank,
  Users, 
  Receipt, 
  BarChart3,
  Settings
} from "lucide-react";
import { Button } from "../ui/button";
import { TenantSwitcher } from "./tenant-switcher";

type NavItem = {
  path: string;
  label: string;
  icon: any;
};

export function BackofficeLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isBootstrapping, signOut } = useAuth();

  const navItems: NavItem[] = [
    { path: '/backoffice/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/backoffice/campaigns', label: 'Campaigns', icon: Megaphone },
    { path: '/backoffice/savings', label: 'Savings Programs', icon: PiggyBank },
    { path: '/backoffice/beneficiaries', label: 'Beneficiaries', icon: Users },
    { path: '/backoffice/transactions', label: 'Transactions', icon: Receipt },
    { path: '/backoffice/metrics', label: 'Insights', icon: BarChart3 },
    { path: '/backoffice/settings', label: 'Settings', icon: Settings }
  ];

  const isPathActive = (path: string) => {
    // Special handling for certain paths
    if (path === '/backoffice/metrics') {
      return location.pathname === path || 
             location.pathname.startsWith('/backoffice/reports') ||
             location.pathname.startsWith('/backoffice/metrics');
    }
    if (path === '/backoffice/transactions') {
      return location.pathname === path || 
             location.pathname.startsWith('/backoffice/transactions') ||
             location.pathname.startsWith('/backoffice/disbursements');
    }
    if (path === '/backoffice/beneficiaries') {
      return location.pathname === path || 
             location.pathname.startsWith('/backoffice/beneficiaries') ||
             location.pathname.startsWith('/backoffice/field-verification');
    }
    if (path === '/backoffice/settings') {
      return location.pathname === path || 
             location.pathname.startsWith('/backoffice/settings') ||
             location.pathname.startsWith('/backoffice/users') ||
             location.pathname.startsWith('/backoffice/roles') ||
             location.pathname.startsWith('/backoffice/permissions') ||
             location.pathname.startsWith('/backoffice/audit') ||
             location.pathname.startsWith('/backoffice/sessions') ||
             location.pathname.startsWith('/backoffice/system-events') ||
             location.pathname.startsWith('/backoffice/sms-templates');
    }
    
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  if (isBootstrapping) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/backoffice/login" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <h2 style={{ fontSize: 'var(--text-20)', fontWeight: 'var(--font-weight-semi-bold)' }}>
            SOMAS
          </h2>
          <TenantSwitcher />
        </div>
        <div className="flex items-center gap-3">
          
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {/* Dashboard - no section */}
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isPathActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-[--radius] transition-colors ${
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  }`}
                  style={{ fontSize: 'var(--text-14)' }}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-sidebar-border">
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={async () => {
                await signOut();
                navigate('/');
              }}
            >
              Back to Gateway
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
