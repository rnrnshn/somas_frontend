import { useState } from "react";
import { Navigate, useNavigate } from "@/lib/router";
import { HttpError } from "@/lib/api/http-error";
import { useAuth } from "@/lib/auth/auth-context";
import { useFieldLoginMutation } from "@/features/auth/hooks/use-login-mutation";
import { getDefaultRouteForRole, isFieldRole, normalizeAuthUser } from "@/lib/auth/roles";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";
import { Smartphone, Loader2, AlertCircle } from "lucide-react";

export function FieldLogin() {
  const navigate = useNavigate();
  const { isAuthenticated, signIn, user } = useAuth();
  const loginMutation = useFieldLoginMutation();
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const isLoading = loginMutation.isPending;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await loginMutation.mutateAsync({
        email: username,
        password: pin,
      });
      const normalizedUser = normalizeAuthUser(response.user);
      const normalizedRole = normalizedUser?.role;

      if (!isFieldRole(normalizedRole)) {
        throw new Error('Esta conta nao tem acesso ao app de Inquiridor.');
      }

      signIn(response.token, normalizedUser);
      navigate(getDefaultRouteForRole(normalizedRole));
    } catch (requestError) {
      setError(
        requestError instanceof HttpError
          ? requestError.message
          : requestError instanceof Error
            ? requestError.message
            : 'Invalid credentials. Please try again.'
      );
    }
  };

  if (isAuthenticated) {
    return <Navigate to={getDefaultRouteForRole(user?.role)} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 max-w-md mx-auto">
      <div className="w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-[--radius-card] bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <Smartphone className="w-8 h-8 text-accent" />
          </div>
          <h2 className="mb-2">Field Operations</h2>
          <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }}>
            Sign in to access field tools
          </p>
        </div>

        <Card>
          <form onSubmit={handleLogin}>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Enter your field credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="default">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">Email</Label>
                <Input
                  id="username"
                  type="email"
                  placeholder="inquirer@somas.app"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pin">Password</Label>
                <Input
                  id="pin"
                  type="password"
                  placeholder="••••••••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
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
