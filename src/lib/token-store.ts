/**
 * Fonte única do token de autenticação.
 *
 * O accessToken fica em sessionStorage: sobrevive ao F5 (reload), mas some ao
 * fechar a aba — não persiste indefinidamente como o localStorage. Reduz a
 * janela/superfície de exposição (nenhuma abordagem só-front é imune a XSS).
 *
 * Não usamos refresh token: o endpoint de refresh do backend exige um
 * accessToken válido no header, o que o torna inviável após o reload — então
 * não há ganho em persistir o refreshToken.
 */
import type { AuthResponse } from "@/helper/auth";

const ACCESS_TOKEN_KEY = "accessToken";

// Chaves legadas — limpas defensivamente (sessões anteriores guardavam tokens
// no localStorage e o refreshToken/user no sessionStorage).
const LEGACY_LOCALSTORAGE_KEYS = ["accessToken", "refreshToken", "user", "auth"] as const;
const LEGACY_SESSIONSTORAGE_KEYS = ["refreshToken", "user"] as const;

export function getAccessToken(): string | null {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string | null): void {
  if (token == null) {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    return;
  }
  sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
}

/** Persiste a sessão recém-obtida no login. */
export function setSession(auth: AuthResponse): void {
  setAccessToken(auth.accessToken);
}

/** Limpa a sessão: accessToken + resíduos legados de session/localStorage. */
export function clearAuth(): void {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  for (const key of LEGACY_SESSIONSTORAGE_KEYS) {
    sessionStorage.removeItem(key);
  }
  for (const key of LEGACY_LOCALSTORAGE_KEYS) {
    localStorage.removeItem(key);
  }
}
