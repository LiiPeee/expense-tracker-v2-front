import {
  AuthResponse,
  ResetPasswordRequest,
  SignInRequest,
  SignUpRequest,
  ValidateResetCodeRequest,
  VerifyEmailRequest,
  VerifyTokenRequest,
} from "@/helper/auth";
import { BASE_URL, clearAuth, getAccessToken, getResponseErrorMessage, readJsonOrThrow } from "@/lib/api";

async function postVoid(url: string, body?: unknown, fallbackMessage = "Falha na requisição"): Promise<void> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body == null ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(await getResponseErrorMessage(response, fallbackMessage));
  }
}

async function postJson<TResponse>(url: string, body: unknown, fallbackMessage: string): Promise<TResponse> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return readJsonOrThrow<TResponse>(response, fallbackMessage);
}

export async function signUp(input: SignUpRequest): Promise<void> {
  await postVoid(`${BASE_URL}/Auth/SignUp`, input, "Falha ao criar conta");
}

export async function signIn(input: SignInRequest): Promise<AuthResponse> {
  return postJson<AuthResponse>(`${BASE_URL}/Auth/SignIn`, input, "Email ou senha incorretos");
}

export async function signInWithGoogle(idToken: string): Promise<AuthResponse> {
  return postJson<AuthResponse>(`${BASE_URL}/Auth/SignInGoogle`, { idToken }, "Falha ao entrar com Google");
}

export async function logOut(): Promise<void> {
  const token = getAccessToken();

  if (token) {
    // Best-effort server-side revocation — ignore failures
    await fetch(`${BASE_URL}/Auth/LogOut`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).catch(() => undefined);
  }

  clearAuth();
}

export async function verifyEmail(input: VerifyEmailRequest): Promise<void> {
  await postVoid(`${BASE_URL}/Auth/VerifyEmail`, input, "Token inválido ou expirado");
}

export async function verifyToken(input: VerifyTokenRequest): Promise<void> {
  const params = new URLSearchParams({ id: input.id, token: input.token });
  await postVoid(`${BASE_URL}/Auth/VerifyToken?${params.toString()}`, undefined, "Código inválido ou expirado");
}

export async function forgotPassword(email: string): Promise<void> {
  await postVoid(`${BASE_URL}/Auth/EmailVerifycation`, email, "Falha ao enviar email de recuperação");
}

export async function validateResetCode(input: ValidateResetCodeRequest): Promise<void> {
  await postVoid(`${BASE_URL}/Auth/ValidateResetCode?email=${encodeURIComponent(input.email)}`, input.token, "Código inválido ou expirado");
}

export async function resetPassword(input: ResetPasswordRequest): Promise<void> {
  await postVoid(`${BASE_URL}/Auth/ResetPassword`, input, "Falha ao redefinir senha");
}
