import { clearAuth, GOOGLE_AUTH_KEY, REFRESH_TOKEN_KEY, TOKEN_KEY, USER_KEY } from "@/lib/api";

export const BASE_URL = import.meta.env.VITE_API_URL;

export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
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

export async function signUp(input: SignUpRequest): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/Auth/SignUp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) throw new Error("Falha ao criar conta");

  return response.json();
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

export { TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY, GOOGLE_AUTH_KEY };
