import { ErrorStateCard } from "@/components/ui/async-state";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { FormTextField } from "@/components/ui/form-text-field";
import { LoadingButton } from "@/components/ui/loading-button";
import { type ForgotPasswordForm, forgotPasswordSchema } from "@/helper/auth";
import { useAuthForm } from "@/hooks/auth/use-auth-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const { handleForgotPassword } = useAuthForm();
  const form = useForm<ForgotPasswordForm>({ resolver: zodResolver(forgotPasswordSchema), defaultValues: { email: "" } });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function onSubmit(data: ForgotPasswordForm) {
    setErrorMessage(null);
    const result = await handleForgotPassword(data.email);
    if (!result.ok) setErrorMessage(result.message ?? "Não foi possível enviar o código de recuperação.");
  }

  return (
    <div className="page-shell relative min-h-screen flex items-center justify-center px-4 py-10 overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -left-20 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-secondary/25 blur-3xl" />

      <Card className="w-full max-w-md border-glass bg-card/80 shadow-strong reveal-up">
        <CardHeader className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-hero flex items-center justify-center mb-4">
            <Mail className="text-white w-8 h-8" />
          </div>
          <CardTitle className="text-2xl">Recuperar Senha</CardTitle>
          <CardDescription>Informe seu email e enviaremos um código para redefinir sua senha.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {errorMessage ? <ErrorStateCard message={errorMessage} onRetry={() => setErrorMessage(null)} /> : null}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormTextField control={form.control} name="email" label="Email" type="email" placeholder="seu@email.com" />
              <LoadingButton type="submit" className="w-full" isLoading={form.formState.isSubmitting} loadingText="Enviando...">
                Enviar código de recuperação
              </LoadingButton>
            </form>
          </Form>

          <div className="text-center">
            <Link
              to="/auth"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para o login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
