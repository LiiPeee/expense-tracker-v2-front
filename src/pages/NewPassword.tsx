import { ErrorStateCard, LoadingStateCard } from "@/components/ui/async-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getPasswordStrength, isStrongPassword, PasswordStrengthIndicator } from "@/components/ui/password-strength";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/api";
import { resetPassword } from "@/services/auth";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function NewPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const strength = getPasswordStrength(password);
  const passwordsMatch = password === confirm && confirm.length > 0;

  useEffect(() => {
    const state = location.state as { email?: string; code?: string } | null;
    if (!state?.email || !state?.code) {
      navigate("/forgot-password", { replace: true });
    }
  }, [navigate, location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isStrongPassword(strength)) {
      toast({
        title: "Senha fraca",
        description: "A senha não atende todos os requisitos de segurança.",
        variant: "destructive",
      });
      return;
    }

    if (!passwordsMatch) {
      toast({
        title: "Senhas diferentes",
        description: "As senhas digitadas não conferem.",
        variant: "destructive",
      });
      return;
    }

    const state = location.state as { email?: string; code?: string } | null;
    if (!state?.email || !state?.code) {
      navigate("/forgot-password", { replace: true });
      return;
    }

    try {
      setIsLoading(true);
      const { email, code } = state as { email: string; code: string };
      await resetPassword({ email, code, newPassword: password });
      toast({ title: "Senha redefinida com sucesso!", description: "Faça login com sua nova senha." });
      navigate("/auth", { replace: true });
    } catch (error: unknown) {
      const message = getErrorMessage(error, "Não foi possível redefinir sua senha. Tente o processo novamente.");
      setErrorMessage(message);
      toast({
        title: "Erro ao redefinir senha",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-shell relative min-h-screen flex items-center justify-center px-4 py-10 overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -left-20 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-secondary/25 blur-3xl" />

      <Card className="w-full max-w-md border-white/60 bg-white/80 shadow-strong reveal-up">
        <CardHeader className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-hero flex items-center justify-center mb-4">
            <LockKeyhole className="text-white w-8 h-8" />
          </div>
          <CardTitle className="text-2xl">Nova Senha</CardTitle>
          <CardDescription>Crie uma senha forte para proteger sua conta.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {errorMessage ? <ErrorStateCard message={errorMessage} onRetry={() => setErrorMessage(null)} /> : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">Nova senha</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {password.length > 0 && (
              <PasswordStrengthIndicator password={password} />
            )}

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar senha</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  disabled={isLoading}
                  className={`pr-10 ${confirm.length > 0 ? (passwordsMatch ? "border-green-500 focus-visible:ring-green-500" : "border-destructive focus-visible:ring-destructive") : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isLoading}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirm.length > 0 && !passwordsMatch && <p className="text-xs text-destructive">As senhas não conferem.</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || !isStrongPassword(strength) || !passwordsMatch}>
              {isLoading ? "Salvando..." : "Salvar nova senha"}
            </Button>
          </form>

          {isLoading ? <LoadingStateCard lines={2} /> : null}
        </CardContent>
      </Card>
    </div>
  );
}
