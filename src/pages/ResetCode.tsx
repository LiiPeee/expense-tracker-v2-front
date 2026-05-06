import { ErrorStateCard, LoadingStateCard } from "@/components/ui/async-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthForm } from "@/hooks/auth/use-auth-form";
import { ArrowLeft, KeyRound } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function ResetCode() {
  const { handleSendCode, isLoading, code, setCode } = useAuthForm();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    setErrorMessage(null);
    const result = await handleSendCode(e);
    if (!result.ok) {
      setErrorMessage(result.message ?? "Não foi possível validar o código informado.");
    }
  };

  return (
    <div className="page-shell relative min-h-screen flex items-center justify-center px-4 py-10 overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -left-20 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-secondary/25 blur-3xl" />

      <Card className="w-full max-w-md border-white/60 bg-white/80 shadow-strong reveal-up">
        <CardHeader className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-hero flex items-center justify-center mb-4">
            <KeyRound className="text-white w-8 h-8" />
          </div>
          <CardTitle className="text-2xl">Inserir Código</CardTitle>
          <CardDescription>
            Insira o código de 6 dígitos enviado para <span className="font-medium text-foreground">{"seu email"}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {errorMessage ? <ErrorStateCard message={errorMessage} onRetry={() => setErrorMessage(null)} /> : null}

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Código de verificação</Label>
              <Input
                id="code"
                type="text"
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                required
                disabled={isLoading}
                maxLength={6}
                className="tracking-widest text-center text-lg font-mono"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || code.length < 6}>
              {isLoading ? "Verificando..." : "Verificar código"}
            </Button>
          </form>

          {isLoading ? <LoadingStateCard lines={2} /> : null}

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Não recebeu o código?{" "}
              <Link to={`/forgot-password`} className="text-primary hover:underline">
                Reenviar
              </Link>
            </p>
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
