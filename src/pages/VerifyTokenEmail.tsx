import { ErrorStateCard } from "@/components/ui/async-state";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { LoadingButton } from "@/components/ui/loading-button";
import { VerificationCodeField } from "@/components/ui/verification-code-field";
import { type VerificationCodeForm, verificationCodeSchema } from "@/helper/auth";
import { useAuthForm } from "@/hooks/auth/use-auth-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function VerifyTokenEmail() {
  const { t } = useTranslation("auth");
  const { handleVerifyEmailToken } = useAuthForm();
  const form = useForm<VerificationCodeForm>({ resolver: zodResolver(verificationCodeSchema), defaultValues: { code: "" } });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function onSubmit(data: VerificationCodeForm) {
    setErrorMessage(null);
    const result = await handleVerifyEmailToken(data.code);
    if (!result.ok) setErrorMessage(result.message ?? t("fallback.verifyEmail"));
  }

  return (
    <div className="page-shell relative min-h-screen flex items-center justify-center px-4 py-10 overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -left-20 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-secondary/25 blur-3xl" />

      <Card className="w-full max-w-md border-glass bg-card/80 shadow-strong reveal-up">
        <CardHeader className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-hero flex items-center justify-center mb-4">
            <MailCheck className="text-white w-8 h-8" />
          </div>
          <CardTitle className="text-2xl">{t("verifyEmailTitle")}</CardTitle>
          <CardDescription>
            <Trans t={t} i18nKey="verifyEmailDescription" components={{ strong: <span className="font-medium text-foreground" /> }} />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {errorMessage ? <ErrorStateCard message={errorMessage} onRetry={() => setErrorMessage(null)} /> : null}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <VerificationCodeField control={form.control} name="code" label={t("codeLabel")} />
              <LoadingButton type="submit" className="w-full" isLoading={form.formState.isSubmitting} loadingText={t("verifying")}>
                {t("verifyCode")}
              </LoadingButton>
            </form>
          </Form>

          <div className="text-center">
            <Link
              to="/auth"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("backToLogin")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
