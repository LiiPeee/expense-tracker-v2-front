import { getPasswordStrength, isStrongPassword } from "@/components/ui/password-strength";
import { SignInRequest, SignUpRequest } from "@/helper/auth";
import { getErrorMessage, markBootstrapDone, setSession } from "@/lib/api";
import { forgotPassword, logOut, resetPassword, signIn, signUp, validateResetCode, verifyToken } from "@/services/auth";
import { type FormEvent, useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useToast } from "../use-toast";

const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value.trim());

type AuthActionResult = {
  ok: boolean;
  message?: string;
};

export function useAuthForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState("");
  const { toast } = useToast();
  const [emailForgot, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const { id = "" } = useParams<{ id: string }>();

  const strength = getPasswordStrength(password);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

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
        markBootstrapDone();

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

  const handleSendCode = useCallback(
    async (e: FormEvent): Promise<AuthActionResult> => {
      e.preventDefault();

      const normalizedCode = code.trim();
      if (!normalizedCode) {
        const message = "Informe o código recebido no email.";
        toast({
          title: "Código obrigatório",
          description: message,
          variant: "destructive",
        });
        return { ok: false, message };
      }

      try {
        setIsLoading(true);
        await validateResetCode({ email, token: normalizedCode });
        navigate("/new-password", { state: { email } });
        return { ok: true };
      } catch (error: unknown) {
        const message = getErrorMessage(error, "O código informado é inválido ou expirou. Verifique seu email e tente novamente.");
        toast({
          title: "Código inválido",
          description: message,
          variant: "destructive",
        });
        return { ok: false, message };
      } finally {
        setIsLoading(false);
      }
    },
    [code, email, navigate, toast],
  );

  const handleVerifyEmailToken = useCallback(
    async (e: FormEvent): Promise<AuthActionResult> => {
      e.preventDefault();

      if (!id) {
        const message = "O link de verificação é inválido. Solicite um novo email.";
        toast({
          title: "Link inválido",
          description: message,
          variant: "destructive",
        });
        return { ok: false, message };
      }

      const normalizedCode = code.trim();
      if (!normalizedCode) {
        const message = "Informe o código de verificação.";
        toast({
          title: "Código obrigatório",
          description: message,
          variant: "destructive",
        });
        return { ok: false, message };
      }

      try {
        setIsLoading(true);
        await verifyToken({ id, token: normalizedCode });
        toast({ title: "Email verificado!", description: "Sua conta foi confirmada com sucesso." });
        navigate("/auth");
        return { ok: true };
      } catch (error: unknown) {
        const message = getErrorMessage(error, "O código informado é inválido ou expirou. Verifique seu email e tente novamente.");
        toast({
          title: "Código inválido",
          description: message,
          variant: "destructive",
        });
        return { ok: false, message };
      } finally {
        setIsLoading(false);
      }
    },
    [code, id, navigate, toast],
  );

  const handleForgotPassword = useCallback(async (): Promise<AuthActionResult> => {
    const normalizedEmail = emailForgot.trim();
    if (!isValidEmail(normalizedEmail)) {
      const message = "Informe um email válido para recuperar a senha.";
      toast({
        title: "Email inválido",
        description: message,
        variant: "destructive",
      });
      return { ok: false, message };
    }

    try {
      setIsLoading(true);
      await forgotPassword(normalizedEmail);
      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada e insira o código recebido.",
      });
      navigate(`/reset-code?email=${encodeURIComponent(normalizedEmail)}`);
      return { ok: true };
    } catch (error: unknown) {
      const message = getErrorMessage(error, "Não foi possível enviar o email de recuperação. Verifique o endereço e tente novamente.");
      toast({
        title: "Erro ao enviar email",
        description: message,
        variant: "destructive",
      });
      return { ok: false, message };
    } finally {
      setIsLoading(false);
    }
  }, [emailForgot, navigate, toast]);

  const handleResetPassword = useCallback(
    async (e: FormEvent): Promise<AuthActionResult> => {
      e.preventDefault();

      if (!isStrongPassword(strength)) {
        const message = "A senha não atende todos os requisitos de segurança.";
        toast({ title: "Senha fraca", description: message, variant: "destructive" });
        return { ok: false, message };
      }

      if (!passwordsMatch) {
        const message = "As senhas digitadas não conferem.";
        toast({ title: "Senhas diferentes", description: message, variant: "destructive" });
        return { ok: false, message };
      }

      const state = location.state as { email?: string } | null;
      if (!state?.email) {
        navigate("/forgot-password", { replace: true });
        return { ok: false, message: "Sessão expirada. Solicite um novo código." };
      }

      try {
        setIsLoading(true);
        await resetPassword({ email: state.email, newPassword: password });
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
    [strength, passwordsMatch, password, location.state, navigate, toast],
  );

  return {
    isLoading,
    code,
    emailForgot,
    password,
    confirmPassword,
    strength,
    passwordsMatch,
    setEmail,
    setCode,
    setPassword,
    setConfirmPassword,
    handleForgotPassword,
    handleResetPassword,
    handleSignIn,
    handleSignUp,
    handleLogOut,
    handleSendCode,
    handleVerifyEmailToken,
  };
}
