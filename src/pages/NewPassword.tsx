import { ErrorStateCard } from "@/components/ui/async-state";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { LoadingButton } from "@/components/ui/loading-button";
import { PasswordField } from "@/components/ui/password-field";
import { PasswordStrengthIndicator } from "@/components/ui/password-strength";
import { type NewPasswordForm, newPasswordSchema } from "@/helper/auth";
import { useAuthForm } from "@/hooks/auth/use-auth-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export default function NewPassword() {
  const { t } = useTranslation("auth");
  const { handleResetPassword } = useAuthForm();
  const form = useForm<NewPasswordForm>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });
  const password = form.watch("password");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function onSubmit(data: NewPasswordForm) {
    setErrorMessage(null);
    const result = await handleResetPassword(data.password);
    if (!result.ok) setErrorMessage(result.message ?? t("fallback.newPassword"));
  }

  return (
    <div className="page-shell relative min-h-screen flex items-center justify-center px-4 py-10 overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -left-20 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-secondary/25 blur-3xl" />

      <Card className="w-full max-w-md border-glass bg-card/80 shadow-strong reveal-up">
        <CardHeader className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-hero flex items-center justify-center mb-4">
            <LockKeyhole className="text-white w-8 h-8" />
          </div>
          <CardTitle className="text-2xl">{t("newPasswordTitle")}</CardTitle>
          <CardDescription>{t("newPasswordDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {errorMessage ? <ErrorStateCard message={errorMessage} onRetry={() => setErrorMessage(null)} /> : null}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <PasswordField control={form.control} name="password" label={t("newPasswordLabel")} placeholder="••••••••">
                {password.length > 0 && <PasswordStrengthIndicator password={password} />}
              </PasswordField>

              <PasswordField control={form.control} name="confirmPassword" label={t("confirmPasswordLabel")} placeholder="••••••••" />

              <LoadingButton type="submit" className="w-full" isLoading={form.formState.isSubmitting} loadingText={t("saving")}>
                {t("saveNewPassword")}
              </LoadingButton>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
