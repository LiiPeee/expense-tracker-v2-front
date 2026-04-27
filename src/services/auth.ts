import { clearAuth, GOOGLE_AUTH_KEY, REFRESH_TOKEN_KEY, TOKEN_KEY, USER_KEY } from "@/lib/api";

export const BASE_URL = import.meta.env.VITE_API_URL;

export interface SignUpRequest {
  email: string;
  password: string;
  lastName: string;
  firstName: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

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

export interface VerifyEmailRequest {
  token: string;
}

export async function verifyEmail(input: VerifyEmailRequest): Promise<void> {
  const response = await fetch(`${BASE_URL}/Auth/VerifyEmail`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) throw new Error("Token inválido ou expirado");
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ValidateResetCodeRequest {
  email: string;
  code: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
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
