import { useState } from "react";
import { Navigate, useNavigate, Link } from "@/lib/router";
import { HttpError } from "@/lib/api/http-error";
import { useAuth } from "@/lib/auth/auth-context";
import { useBackofficeLoginMutation } from "@/features/auth/hooks/use-login-mutation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";
import { Building2, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

type AccountStatus = 'active' | 'locked' | 'disabled' | null;

export function BackofficeLogin() {
  const navigate = useNavigate();
  const { isAuthenticated, signIn } = useAuth();
  const loginMutation = useBackofficeLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [accountStatus, setAccountStatus] = useState<AccountStatus>(null);
  const [detectedTenant, setDetectedTenant] = useState<string | null>(null);
  const isLoading = loginMutation.isPending;

  const handleEmailBlur = () => {
    // Simulate tenant detection after email is entered
    if (email && email.includes('@')) {
      const domain = email.split('@')[1];
      if (domain) {
        setDetectedTenant(domain.split('.')[0].toUpperCase());
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setAccountStatus(null);

    try {
      const response = await loginMutation.mutateAsync({
        email,
        password,
      });
      signIn(response.token, response.user);
      toast.success('Signed in successfully.');
      navigate('/backoffice/dashboard');
    } catch (requestError) {
      if (email.includes('locked')) {
        setAccountStatus('locked');
        setError('Account locked due to multiple failed login attempts. Contact your administrator.');
      } else if (email.includes('disabled')) {
        setAccountStatus('disabled');
        setError('This account has been disabled. Contact your administrator.');
      } else {
        setError(requestError instanceof HttpError ? requestError.message : 'Invalid email or password. Please try again.');
      }
      toast.error(requestError instanceof HttpError ? requestError.message : 'Invalid email or password. Please try again.');
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/backoffice/dashboard" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-[--radius-card] bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-primary" />
          </div>
          <h2 className="mb-2">Backoffice Platform</h2>
          <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }}>
            Sign in to access the admin portal
          </p>
        </div>

        <Card>
          <form onSubmit={handleLogin}>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Enter your credentials to continue
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant={accountStatus === 'locked' || accountStatus === 'disabled' ? 'destructive' : 'default'}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@somas.gov"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleEmailBlur}
                  disabled={isLoading || accountStatus === 'locked' || accountStatus === 'disabled'}
                  required
                />
                {detectedTenant && (
                  <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)', marginTop: '4px' }}>
                    Tenant: {detectedTenant}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link 
                    to="/backoffice/forgot-password" 
                    style={{ fontSize: 'var(--text-12)', color: 'var(--primary)' }}
                    className="hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading || accountStatus === 'locked' || accountStatus === 'disabled'}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || accountStatus === 'locked' || accountStatus === 'disabled'}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
              <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)', textAlign: 'center' }}>
                Access is monitored for compliance.
              </p>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => navigate('/')}
                disabled={isLoading}
              >
                Back to Gateway
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
