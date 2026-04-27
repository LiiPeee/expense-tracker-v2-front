import { REFRESH_TOKEN_KEY, TOKEN_KEY } from "@/lib/api";
import { logOut, signIn, SignInRequest, signUp, SignUpRequest, validateResetCode } from "@/services/auth";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "../use-toast";

export function useAuthForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [code, setCode] = useState("");

  const handleSignIn = async (data: SignInRequest) => {
    try {
      setIsLoading(true);
      const response = await signIn(data);

      localStorage.setItem(TOKEN_KEY, response.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);

      toast({ title: "Login realizado com sucesso!" });
      navigate("/dashboard");
    } catch {
      toast({
        title: "Erro ao fazer login",
        description: "Email ou senha incorretos. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogOut = async () => {
    try {
      setIsLoading(true);
      await logOut();
      toast({ title: "Logout realizado com sucesso!" });
      navigate("/auth");
    } catch {
      // logOut already clears local storage; redirect anyway
      navigate("/auth");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (data: SignUpRequest) => {
    try {
      setIsLoading(true);
      await signUp(data);

      // localStorage.setItem(TOKEN_KEY, response.accessToken);
      // localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
      // localStorage.setItem(USER_KEY, JSON.stringify(response.user));

      toast({
        title: "Enviamos um email de confirmação para o seu email!",
        description: `Email: ${data.email}`,
      });

      navigate("/auth");
    } catch {
      toast({
        title: "Erro ao criar conta",
        description: "Não foi possível criar a conta. Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await validateResetCode({ email, code });
      sessionStorage.setItem("resetPasswordSession", JSON.stringify({ email, code }));
      navigate("/new-password");
    } catch {
      toast({
        title: "Código inválido",
        description: "O código informado é inválido ou expirou. Verifique seu email e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, code, setCode, handleSignIn, handleSignUp, handleLogOut, handleSendCode };
}
