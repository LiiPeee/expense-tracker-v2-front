import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { verifyEmail } from "@/services/auth";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

type Status = "loading" | "success" | "error";

export default function VerifyTokenEmail() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<Status>("loading");
  const [errorDetail, setErrorDetail] = useState("");
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    console.log("[VerifyTokenEmail] token from params:", token);

    if (!token) {
      setErrorDetail("Token não encontrado na URL.");
      setStatus("error");
      return;
    }

    verifyEmail({ token })
      .then(() => {
        setStatus("success");
        toast({ title: "Email verificado!", description: "Sua conta foi confirmada com sucesso." });
        setTimeout(() => navigate("/auth"), 3000);
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err);
        console.error("[VerifyTokenEmail] error:", msg);
        setErrorDetail(msg);
        setStatus("error");
      });
  }, [token, navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero px-4">
      <Card className="w-full max-w-md shadow-strong">
        <CardHeader className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-hero flex items-center justify-center mb-4">
            {status === "loading" && <Loader2 className="text-white w-8 h-8 animate-spin" />}
            {status === "success" && <CheckCircle2 className="text-white w-8 h-8" />}
            {status === "error" && <XCircle className="text-white w-8 h-8" />}
          </div>
          <CardTitle className="text-2xl">
            {status === "loading" && "Verificando..."}
            {status === "success" && "Email verificado!"}
            {status === "error" && "Link inválido"}
          </CardTitle>
          <CardDescription>
            {status === "loading" && "Aguarde enquanto confirmamos sua conta."}
            {status === "success" && "Sua conta foi confirmada. Você será redirecionado para o login em instantes."}
            {status === "error" && (
              <>
                Este link é inválido ou já expirou.
                {errorDetail && (
                  <span className="block mt-2 text-xs font-mono text-destructive break-all">{errorDetail}</span>
                )}
              </>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-3">
          {status === "success" && (
            <Button className="w-full" onClick={() => navigate("/auth")}>
              Ir para o login
            </Button>
          )}
          {status === "error" && (
            <Link to="/auth">
              <Button variant="outline" className="w-full">
                Voltar para o login
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
