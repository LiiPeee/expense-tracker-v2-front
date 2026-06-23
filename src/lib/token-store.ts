/**
 * Fonte única dos tokens de autenticação.
 *
 * accessToken e refreshToken ficam em sessionStorage: sobrevivem ao F5 (reload),
 * mas somem ao fechar a aba — não persistem indefinidamente como o localStorage.
 * Reduz a janela/superfície de exposição (nenhuma abordagem só-front é imune a XSS).
 *
 * O refreshToken é persistido para o refresh reativo: ao receber 401, o front
 * chama POST /Auth/RefreshToken com o accessToken (mesmo expirado) no header e o
 * refreshToken no corpo, recebendo um novo par (o backend faz rotação do token).
 */
import type { AuthResponse } from "@/helper/auth";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

// Chaves legadas — limpas defensivamente (sessões anteriores guardavam tokens
// no localStorage e o user no sessionStorage).
const LEGACY_LOCALSTORAGE_KEYS = ["accessToken", "refreshToken", "user", "auth"] as const;
const LEGACY_SESSIONSTORAGE_KEYS = ["user"] as const;

export function getAccessToken(): string | null {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return sessionStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setAccessToken(token: string | null): void {
  if (token == null) {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    return;
  }
  sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
}

function setRefreshToken(token: string | null): void {
  if (token == null) {
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    return;
  }
  sessionStorage.setItem(REFRESH_TOKEN_KEY, token);
}

/** Persiste a sessão recém-obtida (login ou rotação de refresh): accessToken + refreshToken. */
export function setSession(auth: AuthResponse): void {
  setAccessToken(auth.accessToken);
  setRefreshToken(auth.refreshToken ?? null);
}

/** Limpa a sessão: accessToken + refreshToken + resíduos legados de session/localStorage. */
export function clearAuth(): void {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  for (const key of LEGACY_SESSIONSTORAGE_KEYS) {
    sessionStorage.removeItem(key);
  }
  for (const key of LEGACY_LOCALSTORAGE_KEYS) {
    localStorage.removeItem(key);
  }
}
