import { useState } from "react";
import { useNavigate } from "@/lib/router";
import { HttpError } from "@/lib/api/http-error";
import { useResetPasswordMutation } from "@/features/auth/hooks/use-auth-actions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";
import { Building2, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "../../../lib/utils";

type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

export function ResetPassword() {
  const navigate = useNavigate();
  const resetPasswordMutation = useResetPasswordMutation();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const isLoading = resetPasswordMutation.isPending;
  const resetToken = new URLSearchParams(window.location.search).get('token') ?? '';

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    if (password.length === 0) return 'weak';
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 1) return 'weak';
    if (strength === 2) return 'fair';
    if (strength === 3) return 'good';
    return 'strong';
  };

  const passwordStrength = calculatePasswordStrength(newPassword);
  const passwordsMatch = newPassword === confirmPassword && newPassword.length > 0;

  const getStrengthColor = (strength: PasswordStrength) => {
    switch (strength) {
      case 'weak': return 'var(--destructive)';
      case 'fair': return 'var(--warning)';
      case 'good': return 'var(--accent)';
      case 'strong': return 'var(--success)';
    }
  };

  const getStrengthWidth = (strength: PasswordStrength) => {
    switch (strength) {
      case 'weak': return '25%';
      case 'fair': return '50%';
      case 'good': return '75%';
      case 'strong': return '100%';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (passwordStrength === 'weak') {
      setError("Password is too weak. Please choose a stronger password.");
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({
        token: resetToken,
        password: newPassword,
      });
      setIsSuccess(true);
    } catch (requestError) {
      setError(requestError instanceof HttpError ? requestError.message : 'Password could not be reset.');
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-[--radius-card] bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <h2 className="mb-2">Password Reset</h2>
            <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }}>
              Your password has been updated
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Success</CardTitle>
              <CardDescription>
                You can now sign in with your new password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  Your password has been successfully reset. You can now use your new password to sign in.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <Button
                type="button"
                className="w-full"
                onClick={() => navigate('/backoffice/login')}
              >
                Continue to Sign In
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
            Create a new secure password
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>New Password</CardTitle>
              <CardDescription>
                Choose a strong password for your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
                {newPassword && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                        Password strength:
                      </span>
                      <span 
                        style={{ 
                          fontSize: 'var(--text-12)', 
                          fontWeight: 'var(--font-weight-medium)',
                          color: getStrengthColor(passwordStrength),
                          textTransform: 'capitalize'
                        }}
                      >
                        {passwordStrength}
                      </span>
                    </div>
                    <div 
                      className="h-1 rounded-full overflow-hidden" 
                      style={{ backgroundColor: 'var(--muted)' }}
                    >
                      <div
                        className="h-full transition-all duration-300"
                        style={{
                          width: getStrengthWidth(passwordStrength),
                          backgroundColor: getStrengthColor(passwordStrength)
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
                {confirmPassword && (
                  <div className="flex items-center gap-2">
                    {passwordsMatch ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" style={{ color: 'var(--success)' }} />
                        <span style={{ fontSize: 'var(--text-12)', color: 'var(--success)' }}>
                          Passwords match
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4" style={{ color: 'var(--destructive)' }} />
                        <span style={{ fontSize: 'var(--text-12)', color: 'var(--destructive)' }}>
                          Passwords do not match
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div 
                className="p-3 rounded-[--radius]" 
                style={{ backgroundColor: 'var(--muted)' }}
              >
                <p style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)' }}>
                  Password requirements:
                </p>
                <ul style={{ fontSize: 'var(--text-12)', color: 'var(--muted-foreground)', marginTop: '8px' }} className="space-y-1">
                  <li>• At least 8 characters long</li>
                  <li>• Mix of uppercase and lowercase letters</li>
                  <li>• Include numbers and special characters</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || !resetToken.trim() || !passwordsMatch || passwordStrength === 'weak'}
                >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  'Reset Password'
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
