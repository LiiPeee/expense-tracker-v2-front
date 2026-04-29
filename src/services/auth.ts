import {
  AuthResponse,
  ForgotPasswordRequest,
  RefreshTokenRequest,
  ResetPasswordRequest,
  SignInRequest,
  SignUpRequest,
  ValidateResetCodeRequest,
  VerifyEmailRequest,
  VerifyTokenRequest,
} from "@/helper/auth";
import { BASE_URL, clearAuth, GOOGLE_AUTH_KEY, REFRESH_TOKEN_KEY, TOKEN_KEY, USER_KEY } from "@/lib/api";

export async function signUp(input: SignUpRequest): Promise<void> {
  const response = await fetch(`${BASE_URL}/Auth/SignUp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) throw new Error("Falha ao criar conta");
}

export async function signIn(input: SignInRequest): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/Auth/SignIn`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) throw new Error("Email ou senha incorretos");

  return response.json();
}

export async function refreshToken(input: RefreshTokenRequest): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/Auth/RefreshToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) throw new Error("Falha ao renovar token");

  return response.json();
}

export async function logOut(): Promise<void> {
  const token = localStorage.getItem(TOKEN_KEY);

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
  const response = await fetch(`${BASE_URL}/Auth/VerifyEmail`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) throw new Error("Token inválido ou expirado");
}

export async function verifyToken(input: VerifyTokenRequest): Promise<void> {
  const params = new URLSearchParams({ id: input.id, token: input.token });
  const response = await fetch(`${BASE_URL}/Auth/VerifyToken?${params.toString()}`, {
    method: "POST",
  });

  if (!response.ok) throw new Error("Código inválido ou expirado");
}

export async function forgotPassword(input: ForgotPasswordRequest): Promise<void> {
  const response = await fetch(`${BASE_URL}/Auth/ForgotPassword`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) throw new Error("Falha ao enviar email de recuperação");
}

export async function validateResetCode(input: ValidateResetCodeRequest): Promise<void> {
  const response = await fetch(`${BASE_URL}/Auth/ValidateResetCode`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) throw new Error("Código inválido ou expirado");
}

export async function resetPassword(input: ResetPasswordRequest): Promise<void> {
  const response = await fetch(`${BASE_URL}/Auth/ResetPassword`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) throw new Error("Falha ao redefinir senha");
}

export { GOOGLE_AUTH_KEY, REFRESH_TOKEN_KEY, TOKEN_KEY, USER_KEY };
