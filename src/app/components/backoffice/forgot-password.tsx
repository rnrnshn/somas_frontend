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
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export function ForgotPassword() {
  const navigate = useNavigate();
  const forgotPasswordMutation = useForgotPasswordMutation();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isLoading = forgotPasswordMutation.isPending;
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await forgotPasswordMutation.mutateAsync({ email });
      toast.success(t('auth.resetInstructionsSent'));
      setIsSubmitted(true);
    } catch (requestError) {
      toast.error(requestError instanceof HttpError ? requestError.message : t('auth.resetInstructionsFailed'));
      setError(requestError instanceof HttpError ? requestError.message : t('auth.resetInstructionsFailed'));
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
            <h2 className="mb-2">{t('auth.passwordReset')}</h2>
            <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }}>
              {t('auth.checkEmailInstructions')}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('auth.checkEmail')}</CardTitle>
              <CardDescription>
                {t('auth.resetLinkSent')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  {t('auth.resetMessage', { email })}
                </AlertDescription>
              </Alert>
              <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }}>
                {t('auth.resetExpiry')}
              </p>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button
                type="button"
                className="w-full"
                onClick={() => navigate('/backoffice/login')}
              >
                {t('auth.backToSignIn')}
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
          <h2 className="mb-2">{t('auth.resetPassword')}</h2>
          <p style={{ fontSize: 'var(--text-14)', color: 'var(--muted-foreground)' }}>
            {t('auth.resetPasswordSubtitle')}
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>{t('auth.forgotPasswordTitle')}</CardTitle>
              <CardDescription>
                {t('auth.forgotPasswordDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error ? (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.emailAddress')}</Label>
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
                    {t('auth.sending')}
                  </>
                ) : (
                  t('auth.sendResetLink')
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => navigate('/backoffice/login')}
                disabled={isLoading}
              >
                {t('auth.backToSignIn')}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
