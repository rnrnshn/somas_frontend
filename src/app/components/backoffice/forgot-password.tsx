import { useState } from "react";
import { useNavigate } from "@/lib/router";
import { HttpError } from "@/lib/api/http-error";
import { useForgotPasswordMutation } from "@/features/auth/hooks/use-auth-actions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";
import { Building2, Loader2, CheckCircle2 } from "lucide-react";

export function ForgotPassword() {
  const navigate = useNavigate();
  const forgotPasswordMutation = useForgotPasswordMutation();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isLoading = forgotPasswordMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await forgotPasswordMutation.mutateAsync({ email });
      setIsSubmitted(true);
    } catch (requestError) {
      setError(requestError instanceof HttpError ? requestError.message : 'Reset instructions could not be sent.');
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-[--radius-card] bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <h2 className="mb-2">Password Reset</h2>
            <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }}>
              Check your email for instructions
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Check Your Email</CardTitle>
              <CardDescription>
                Reset link sent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  If an account exists with the email <strong>{email}</strong>, a password reset link has been sent.
                </AlertDescription>
              </Alert>
              <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }}>
                Please check your email inbox and follow the instructions to reset your password. 
                The link will expire in 24 hours.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button
                type="button"
                className="w-full"
                onClick={() => navigate('/backoffice/login')}
              >
                Back to Sign In
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-[--radius-card] bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-primary" />
          </div>
          <h2 className="mb-2">Reset Password</h2>
          <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }}>
            Enter your email to receive reset instructions
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Forgot Password?</CardTitle>
              <CardDescription>
                We'll send you a secure reset link
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error ? (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@somas.gov"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => navigate('/backoffice/login')}
                disabled={isLoading}
              >
                Back to Sign In
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
