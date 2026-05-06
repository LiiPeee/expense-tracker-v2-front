import { SignInRequest, SignUpRequest } from "@/helper/auth";
import { getErrorMessage, REFRESH_TOKEN_KEY, TOKEN_KEY } from "@/lib/api";
import { forgotPassword, logOut, signIn, signUp, validateResetCode, verifyToken } from "@/services/auth";
import { type FormEvent, useCallback, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useToast } from "../use-toast";

const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value.trim());

type AuthActionResult = {
  ok: boolean;
  message?: string;
};

export function useAuthForm() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const { toast } = useToast();
  const [emailForgot, setEmail] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const { id = "" } = useParams<{ id: string }>();

  const handleSignIn = useCallback(
    async (data: SignInRequest) => {
      try {
        setIsLoading(true);
        const response = await signIn(data);

        localStorage.setItem(TOKEN_KEY, response.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);

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
        await validateResetCode({ email, code: normalizedCode });
        navigate("/new-password", { state: { email, code: normalizedCode } });
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
      await forgotPassword({ email: normalizedEmail });
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

  return {
    isLoading,
    code,
    emailForgot,
    setEmail,
    setCode,
    handleForgotPassword,
    handleSignIn,
    handleSignUp,
    handleLogOut,
    handleSendCode,
    handleVerifyEmailToken,
  };
}
