import { logOut, signIn, SignInRequest, signUp, SignUpRequest } from "@/services/auth";
import { REFRESH_TOKEN_KEY, TOKEN_KEY, USER_KEY } from "@/lib/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../use-toast";

export function useAuthForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

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
      const response = await signUp(data);

      localStorage.setItem(TOKEN_KEY, response.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));

      toast({
        title: "Conta criada com sucesso!",
        description: `Bem-vindo, ${response.user.name}`,
      });
      navigate("/dashboard");
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

  return { isLoading, handleSignIn, handleSignUp, handleLogOut };
}
