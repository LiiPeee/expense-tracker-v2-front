import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthForm } from "@/hooks/auth/use-auth-form";
import { ArrowLeft, KeyRound } from "lucide-react";
import { Link } from "react-router-dom";

export default function ResetCode() {
  const { handleSendCode, isLoading, code, setCode } = useAuthForm();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero px-4">
      <Card className="w-full max-w-md shadow-strong">
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
          <form onSubmit={handleSendCode} className="space-y-4">
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
