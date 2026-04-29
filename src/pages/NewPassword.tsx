import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { resetPassword } from "@/services/auth";
import { Check, Eye, EyeOff, LockKeyhole, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface PasswordStrength {
  minLength: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

function getPasswordStrength(password: string): PasswordStrength {
  return {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
}

function isStrongPassword(strength: PasswordStrength): boolean {
  return Object.values(strength).every(Boolean);
}

const requirements = [
  { key: "minLength" as const, label: "Mínimo 8 caracteres" },
  { key: "uppercase" as const, label: "Letra maiúscula" },
  { key: "lowercase" as const, label: "Letra minúscula" },
  { key: "number" as const, label: "Número" },
  { key: "special" as const, label: "Caractere especial (!@#$...)" },
];

export default function NewPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    } catch {
      toast({
        title: "Erro ao redefinir senha",
        description: "Não foi possível redefinir sua senha. Tente o processo novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero px-4">
      <Card className="w-full max-w-md shadow-strong">
        <CardHeader className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-hero flex items-center justify-center mb-4">
            <LockKeyhole className="text-white w-8 h-8" />
          </div>
          <CardTitle className="text-2xl">Nova Senha</CardTitle>
          <CardDescription>Crie uma senha forte para proteger sua conta.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
              <ul className="space-y-1 text-sm">
                {requirements.map(({ key, label }) => (
                  <li key={key} className={`flex items-center gap-2 ${strength[key] ? "text-green-600" : "text-muted-foreground"}`}>
                    {strength[key] ? <Check className="w-3.5 h-3.5 shrink-0" /> : <X className="w-3.5 h-3.5 shrink-0" />}
                    {label}
                  </li>
                ))}
              </ul>
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
        </CardContent>
      </Card>
    </div>
  );
}
