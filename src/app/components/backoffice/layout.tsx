import { Suspense } from "react";
import { Navigate, Outlet, useNavigate, useLocation } from "@/lib/router";
import { useAuth } from "@/lib/auth/auth-context";
import { canAccessBackofficePath, getDefaultRouteForRole, isBackofficeRole, normalizeRole } from "@/lib/auth/roles";
import { 
  LayoutDashboard, 
  Megaphone, 
  Users, 
  Receipt, 
  BarChart3,
  Settings,
  LogOut,
  User
} from "lucide-react";
import { Button } from "../ui/button";
import { LanguageSwitcher } from "../language-switcher";
import { Skeleton } from "../ui/skeleton";
import { TenantSwitcher } from "./tenant-switcher";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger} from "../ui/dropdown-menu";

type NavItem = {
  path: string;
  label: string;
  icon: any;
};

export function BackofficeLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isBootstrapping, signOut, user } = useAuth();
  const { t } = useTranslation();
  const normalizedRole = normalizeRole(user?.role);

  const navItems: NavItem[] = [
    { path: '/backoffice/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { path: '/backoffice/campaigns', label: t('campaigns'), icon: Megaphone },
    { path: '/backoffice/beneficiaries', label: t('beneficiaries'), icon: Users },
    { path: '/backoffice/users', label: t('inquirers'), icon: Users },
    { path: '/backoffice/transactions', label: t('transactions'), icon: Receipt },
    { path: '/backoffice/metrics', label: t('insights'), icon: BarChart3 },
    { path: '/backoffice/settings', label: t('settings'), icon: Settings }
  ].filter((item) => canAccessBackofficePath(user?.role, item.path));

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
    if (path === '/backoffice/users') {
      return location.pathname === path;
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
    return <BackofficeRouteSkeleton />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/backoffice/login" />;
  }

  if (!isBackofficeRole(user?.role)) {
    return <Navigate to={getDefaultRouteForRole(user?.role)} />;
  }

  if (!canAccessBackofficePath(user?.role, location.pathname)) {
    return <Navigate to={getDefaultRouteForRole(user?.role)} />;
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="h-16 bg-card px-6 flex items-center justify-between sticky top-0 z-10 shadow-[0_6px_20px_rgba(15,23,42,0.08)]">
        <div className="flex items-center gap-6">
          <h2 style={{  fontWeight: 'var(--font-weight-semi-bold)' }}>
            {t('brand')}
          </h2>
          <TenantSwitcher />
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher className="w-[96px]" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>
                    {user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? <User className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="space-y-1">
                <p className="truncate text-sm font-medium">{user?.name ?? user?.email ?? t('brand')}</p>
                <p className="truncate text-xs font-normal text-muted-foreground">{t(`roles.${normalizedRole ?? 'fallback'}`)}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  navigate('/profile');
                }}
              >
                <User className="h-4 w-4" />
                {t('profile')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  await signOut();
                  navigate('/');
                }}
              >
                <LogOut className="h-4 w-4" />
                {t('logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Sidebar */}
        <aside className="flex h-full w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {/* Dashboard - no section */}
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isPathActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-[var(--radius)] transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="min-h-0 flex-1 overflow-auto">
          <Suspense fallback={<BackofficeRouteSkeleton />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

function BackofficeRouteSkeleton() {
  return (
    <div className="space-y-6 p-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
      <Skeleton className="h-80" />
    </div>
  )
}
