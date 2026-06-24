import { SignInRequest, SignUpRequest } from "@/helper/auth";
import { getErrorMessage, setSession } from "@/lib/api";
import { forgotPassword, logOut, resetPassword, signIn, signInWithGoogle, signUp, validateResetCode, verifyToken } from "@/services/auth";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useToast } from "../use-toast";

type AuthActionResult = {
  ok: boolean;
  message?: string;
};

export function useAuthForm() {
  const { t } = useTranslation("auth");
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

        toast({ title: t("toast.loginSuccess") });
        navigate("/dashboard");
      } catch (error: unknown) {
        toast({
          title: t("toast.loginErrorTitle"),
          description: getErrorMessage(error, t("toast.loginErrorDescription")),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, toast, t],
  );

  const handleGoogleSignIn = useCallback(
    async (idToken: string) => {
      try {
        setIsLoading(true);
        const response = await signInWithGoogle(idToken);

        setSession(response);

        toast({ title: t("toast.loginSuccess") });
        navigate("/dashboard");
      } catch (error: unknown) {
        toast({
          title: t("toast.googleErrorTitle"),
          description: getErrorMessage(error, t("toast.googleErrorDescription")),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, toast, t],
  );

  const handleLogOut = useCallback(async () => {
    try {
      setIsLoading(true);
      await logOut();
      toast({ title: t("toast.logoutSuccess") });
      navigate("/auth");
    } catch {
      // logOut already clears local storage; redirect anyway
      navigate("/auth");
    } finally {
      setIsLoading(false);
    }
  }, [navigate, toast, t]);

  const handleSignUp = useCallback(
    async (data: SignUpRequest) => {
      try {
        setIsLoading(true);
        await signUp(data);

        toast({
          title: t("toast.signupSuccessTitle"),
          description: t("toast.signupSuccessDescription", { email: data.email }),
        });
      } catch (error: unknown) {
        toast({
          title: t("toast.signupErrorTitle"),
          description: getErrorMessage(error, t("toast.signupErrorDescription")),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast, t],
  );

  const handleForgotPassword = useCallback(
    async (forgotEmail: string): Promise<AuthActionResult> => {
      try {
        setIsLoading(true);
        await forgotPassword(forgotEmail);
        toast({
          title: t("toast.emailSentTitle"),
          description: t("toast.emailSentDescription"),
        });
        navigate(`/reset-code?email=${encodeURIComponent(forgotEmail)}`);
        return { ok: true };
      } catch (error: unknown) {
        const message = getErrorMessage(error, t("toast.forgotErrorDescription"));
        toast({ title: t("toast.forgotErrorTitle"), description: message, variant: "destructive" });
        return { ok: false, message };
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, toast, t],
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
        const message = getErrorMessage(error, t("toast.codeInvalidDescription"));
        toast({ title: t("toast.codeInvalidTitle"), description: message, variant: "destructive" });
        return { ok: false, message };
      } finally {
        setIsLoading(false);
      }
    },
    [email, navigate, toast, t],
  );

  const handleVerifyEmailToken = useCallback(
    async (code: string): Promise<AuthActionResult> => {
      if (!id) {
        const message = t("toast.linkInvalidDescription");
        toast({ title: t("toast.linkInvalidTitle"), description: message, variant: "destructive" });
        return { ok: false, message };
      }

      try {
        setIsLoading(true);
        await verifyToken({ id, token: code });
        toast({ title: t("toast.emailVerifiedTitle"), description: t("toast.emailVerifiedDescription") });
        navigate("/auth");
        return { ok: true };
      } catch (error: unknown) {
        const message = getErrorMessage(error, t("toast.codeInvalidDescription"));
        toast({ title: t("toast.codeInvalidTitle"), description: message, variant: "destructive" });
        return { ok: false, message };
      } finally {
        setIsLoading(false);
      }
    },
    [id, navigate, toast, t],
  );

  const handleResetPassword = useCallback(
    async (newPassword: string): Promise<AuthActionResult> => {
      const state = location.state as { email?: string; code?: string } | null;
      if (!state?.email || !state?.code) {
        navigate("/forgot-password", { replace: true });
        return { ok: false, message: t("toast.sessionExpired") };
      }

      try {
        setIsLoading(true);
        await resetPassword({ email: state.email, newPassword, token: state.code });
        toast({ title: t("toast.resetSuccessTitle"), description: t("toast.resetSuccessDescription") });
        navigate("/auth", { replace: true });
        return { ok: true };
      } catch (error: unknown) {
        const message = getErrorMessage(error, t("toast.resetErrorDescription"));
        toast({ title: t("toast.resetErrorTitle"), description: message, variant: "destructive" });
        return { ok: false, message };
      } finally {
        setIsLoading(false);
      }
    },
    [location.state, navigate, toast, t],
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
