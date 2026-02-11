import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import useAuth from "@/hooks/useAuth";
import { Chrome } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const navigate = useNavigate();
  const { isLoading, handleGoogleSignIn } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero px-4">
      <Card className="w-full max-w-md shadow-strong">
        <CardHeader className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-hero flex items-center justify-center mb-4">
            <span className="text-white font-bold text-3xl">F</span>
          </div>
          <CardTitle className="text-2xl">Bem-vindo de volta</CardTitle>
          <CardDescription>Faça login para acessar seu controle financeiro</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full gap-2 h-12" disabled={isLoading} onClick={() => handleGoogleSignIn()}>
            <Chrome className="w-5 h-5" />
            {isLoading ? "Conectando..." : "Continuar com Google"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">ou</span>
            </div>
          </div>

          <Button variant="secondary" className="w-full h-12" onClick={() => navigate("/dashboard")}>
            Continuar sem login (teste)
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Ao continuar, você concorda com nossos Termos de Serviço e Política de Privacidade
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
