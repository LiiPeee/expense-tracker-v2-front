import { logOut, signIn, SignInRequest, signUp, SignUpRequest } from "@/services/auth";
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

      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);

      toast({
        title: "Login realizado com sucesso!",
      });

      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Erro ao fazer login",
        description: error instanceof Error ? error.message : "Tente novamente",
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

      // Armazena tokens e informações do usuário de forma segura
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      toast({
        title: "LogOut realizado com sucesso!",
      });

      navigate("/auth");
    } catch (error) {
      toast({
        title: "Erro ao fazer LogOut",
        description: error instanceof Error ? error.message : "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (data: SignUpRequest) => {
    try {
      setIsLoading(true);
      const response = await signUp(data);

      // Armazena tokens e informações do usuário de forma segura
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.user));

      toast({
        title: "Conta criada com sucesso!",
        description: `Bem-vindo, ${response.user.name}`,
      });

      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Erro ao criar conta",
        description: error instanceof Error ? error.message : "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSignIn,
    handleSignUp,
    handleLogOut,
  };
}
