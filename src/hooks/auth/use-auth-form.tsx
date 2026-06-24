import { SignInRequest, SignUpRequest } from "@/helper/auth";
import { getErrorMessage, setSession } from "@/lib/api";
import { forgotPassword, logOut, resetPassword, signIn, signInWithGoogle, signUp, validateResetCode, verifyToken } from "@/services/auth";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useToast } from "../use-toast";

type AuthActionResult = {
  ok: boolean;
  message?: string;
};

export function useAuthForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const { id = "" } = useParams<{ id: string }>();

  useEffect(() => {
    const state = location.state as { email?: string } | null;
    if (location.pathname === "/new-password" && !state?.email) {
      navigate("/forgot-password", { replace: true });
    }
  }, [navigate, location]);

  const handleSignIn = useCallback(
    async (data: SignInRequest) => {
      try {
        setIsLoading(true);
        const response = await signIn(data);

        setSession(response);

        toast({ title: "Login realizado com sucesso!" });
        navigate("/dashboard");
      } catch (error: unknown) {
        toast({
          title: "Erro ao fazer login",
          description: getErrorMessage(error, "Email ou senha incorretos. Tente novamente."),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, toast],
  );

  const handleGoogleSignIn = useCallback(
    async (idToken: string) => {
      try {
        setIsLoading(true);
        const response = await signInWithGoogle(idToken);

        setSession(response);

        toast({ title: "Login realizado com sucesso!" });
        navigate("/dashboard");
      } catch (error: unknown) {
        toast({
          title: "Erro ao entrar com Google",
          description: getErrorMessage(error, "Não foi possível entrar com o Google. Tente novamente."),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, toast],
  );

  const handleLogOut = useCallback(async () => {
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
  }, [navigate, toast]);

  const handleSignUp = useCallback(
    async (data: SignUpRequest) => {
      try {
        setIsLoading(true);
        await signUp(data);

        toast({
          title: "Enviamos um email de confirmação para o seu email!",
          description: `Email: ${data.email}`,
        });
      } catch (error: unknown) {
        toast({
          title: "Erro ao criar conta",
          description: getErrorMessage(error, "Não foi possível criar a conta. Verifique os dados e tente novamente."),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast],
  );

  const handleForgotPassword = useCallback(
    async (forgotEmail: string): Promise<AuthActionResult> => {
      try {
        setIsLoading(true);
        await forgotPassword(forgotEmail);
        toast({
          title: "Email enviado!",
          description: "Verifique sua caixa de entrada e insira o código recebido.",
        });
        navigate(`/reset-code?email=${encodeURIComponent(forgotEmail)}`);
        return { ok: true };
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Não foi possível enviar o email de recuperação. Verifique o endereço e tente novamente.");
        toast({ title: "Erro ao enviar email", description: message, variant: "destructive" });
        return { ok: false, message };
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, toast],
  );

  const handleSendCode = useCallback(
    async (code: string): Promise<AuthActionResult> => {
      try {
        setIsLoading(true);
        await validateResetCode({ email, token: code });
        // Carry the validated code to the new-password step — the backend revalidates it on reset.
        navigate("/new-password", { state: { email, code } });
        return { ok: true };
      } catch (error: unknown) {
        const message = getErrorMessage(error, "O código informado é inválido ou expirou. Verifique seu email e tente novamente.");
        toast({ title: "Código inválido", description: message, variant: "destructive" });
        return { ok: false, message };
      } finally {
        setIsLoading(false);
      }
    },
    [email, navigate, toast],
  );

  const handleVerifyEmailToken = useCallback(
    async (code: string): Promise<AuthActionResult> => {
      if (!id) {
        const message = "O link de verificação é inválido. Solicite um novo email.";
        toast({ title: "Link inválido", description: message, variant: "destructive" });
        return { ok: false, message };
      }

      try {
        setIsLoading(true);
        await verifyToken({ id, token: code });
        toast({ title: "Email verificado!", description: "Sua conta foi confirmada com sucesso." });
        navigate("/auth");
        return { ok: true };
      } catch (error: unknown) {
        const message = getErrorMessage(error, "O código informado é inválido ou expirou. Verifique seu email e tente novamente.");
        toast({ title: "Código inválido", description: message, variant: "destructive" });
        return { ok: false, message };
      } finally {
        setIsLoading(false);
      }
    },
    [id, navigate, toast],
  );

  const handleResetPassword = useCallback(
    async (newPassword: string): Promise<AuthActionResult> => {
      const state = location.state as { email?: string; code?: string } | null;
      if (!state?.email || !state?.code) {
        navigate("/forgot-password", { replace: true });
        return { ok: false, message: "Sessão expirada. Solicite um novo código." };
      }

      try {
        setIsLoading(true);
        await resetPassword({ email: state.email, newPassword, token: state.code });
        toast({ title: "Senha redefinida com sucesso!", description: "Faça login com sua nova senha." });
        navigate("/auth", { replace: true });
        return { ok: true };
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Não foi possível redefinir sua senha. Tente o processo novamente.");
        toast({ title: "Erro ao redefinir senha", description: message, variant: "destructive" });
        return { ok: false, message };
      } finally {
        setIsLoading(false);
      }
    },
    [location.state, navigate, toast],
  );

  return {
    isLoading,
    handleForgotPassword,
    handleResetPassword,
    handleSignIn,
    handleGoogleSignIn,
    handleSignUp,
    handleLogOut,
    handleSendCode,
    handleVerifyEmailToken,
  };
}
