import { Navigate, Outlet, useNavigate, useLocation } from "@/lib/router";
import { LayoutDashboard, Search, WifiOff, ChevronLeft, Menu } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { getDefaultRouteForRole, isFieldRole, normalizeRole } from "@/lib/auth/roles";
import { Button } from "../ui/button";
import { Suspense, useState } from "react";
import { LanguageSwitcher } from "../language-switcher";
import { Skeleton } from "../ui/skeleton";
import { useTranslation } from "react-i18next";

export function FieldLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isBootstrapping, signOut, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useTranslation();
  const normalizedRole = normalizeRole(user?.role);

  const navItems = [
    { path: '/field/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { path: '/field/search', label: t('search'), icon: Search },
    { path: '/field/status', label: t('status'), icon: WifiOff },
  ];

  if (isBootstrapping) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/field/login" />;
  }

  if (!isFieldRole(user?.role)) {
    return <Navigate to={getDefaultRouteForRole(user?.role)} />;
  }

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-background">
      {/* Mobile Header */}
      <header className="bg-card border-b border-border p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 style={{ fontSize: 'var(--text-18)' }}>{t('fieldHeader')}</h2>
            <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
              {t(`roles.${normalizedRole ?? 'fallback'}`)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 hover:bg-accent rounded-[--radius]"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="mt-4 pt-4 border-t border-border space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-[--radius] transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent'
                  }`}
                  style={{ fontSize: 'var(--text-16)' }}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={async () => {
                await signOut();
                navigate('/');
              }}
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              {t('backToGateway')}
            </Button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Suspense fallback={<FieldRouteSkeleton />}>
          <Outlet />
        </Suspense>
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-card border-t border-border sticky bottom-0">
        <div className="flex items-center justify-around p-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-[--radius] transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span style={{ fontSize: 'var(--text-12)' }}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function FieldRouteSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  )
}
