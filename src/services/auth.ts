import {
  AuthResponse,
  ResetPasswordRequest,
  SignInRequest,
  SignUpRequest,
  ValidateResetCodeRequest,
  VerifyTokenRequest,
} from "@/helper/auth";
import { clearAuth, getAccessToken, postJson, postVoid } from "@/lib/api";

const PUBLIC = { auth: false } as const;

const REQUEST_PASSWORD_RESET_PATH = "/Auth/EmailVerifycation";

export async function signUp(input: SignUpRequest): Promise<void> {
  await postVoid("/Auth/SignUp", input, { ...PUBLIC, fallback: "Falha ao criar conta" });
}

export async function signIn(input: SignInRequest): Promise<AuthResponse> {
  return postJson<AuthResponse>("/Auth/SignIn", input, { ...PUBLIC, fallback: "Email ou senha incorretos" });
}

export async function signInWithGoogle(idToken: string): Promise<AuthResponse> {
  return postJson<AuthResponse>("/Auth/SignInGoogle", { idToken }, { ...PUBLIC, fallback: "Falha ao entrar com Google" });
}

export async function logOut(): Promise<void> {
  const token = getAccessToken();

  // Best-effort server-side revocation — the authed token is attached automatically; ignore failures.
  if (token) {
    await postVoid("/Auth/LogOut").catch(() => undefined);
  }

  clearAuth();
}

export async function verifyToken(input: VerifyTokenRequest): Promise<void> {
  await postVoid("/Auth/VerifyToken", undefined, {
    ...PUBLIC,
    params: { id: input.id, token: input.token },
    fallback: "Código inválido ou expirado",
  });
}

export async function forgotPassword(email: string): Promise<void> {
  // Backend expects the email as a raw JSON string body (not an object) — confirmed contract.
  await postVoid(REQUEST_PASSWORD_RESET_PATH, email, { ...PUBLIC, fallback: "Falha ao enviar email de recuperação" });
}

export async function validateResetCode(input: ValidateResetCodeRequest): Promise<void> {
  await postVoid("/Auth/ValidateResetCode", input.token, {
    ...PUBLIC,
    params: { email: input.email },
    fallback: "Código inválido ou expirado",
  });
}

export async function resetPassword(input: ResetPasswordRequest): Promise<void> {
  await postVoid("/Auth/ResetPassword", input, { ...PUBLIC, fallback: "Falha ao redefinir senha" });
}
