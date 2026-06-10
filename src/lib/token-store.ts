/**
 * Fonte única do token de autenticação.
 *
 * Estratégia de hardening (sem httpOnly, que exigiria backend):
 * - accessToken vive APENAS em memória (variável de módulo) — nunca toca o disco,
 *   some no reload e é renovado via refresh.
 * - refreshToken e user ficam em sessionStorage — sobrevivem ao F5, somem ao
 *   fechar a aba (não persistem indefinidamente como o localStorage).
 *
 * Nenhuma abordagem só-front é imune a XSS; isto reduz a janela/superfície de
 * exposição, não a elimina.
 */
import type { AuthResponse } from "@/helper/auth";

export type StoredUser = {
  id?: string | number;
  accountId?: string | number;
  email?: string;
  name?: string;
};

const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "user";

// Chaves legadas do localStorage — limpas defensivamente para resíduos de
// sessões anteriores ao deploy desta mudança.
const LEGACY_LOCALSTORAGE_KEYS = ["accessToken", "refreshToken", "user", "auth"] as const;

let accessToken: string | null = null;
let bootstrapDone = false;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function getRefreshToken(): string | null {
  return sessionStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(token: string | null): void {
  if (token == null) {
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    return;
  }
  sessionStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export function hasRefreshToken(): boolean {
  return getRefreshToken() != null;
}

export function getStoredUser(): StoredUser | null {
  const raw = sessionStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export function setStoredUser(user: StoredUser | null): void {
  if (user == null) {
    sessionStorage.removeItem(USER_KEY);
    return;
  }
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
}

/** Persiste uma sessão recém-obtida (login ou refresh). */
export function setSession(auth: AuthResponse): void {
  setAccessToken(auth.accessToken);
  setRefreshToken(auth.refreshToken);
  setStoredUser(auth.user);
}

/** Limpa toda a sessão: memória, sessionStorage e resíduos legados do localStorage. */
export function clearAuth(): void {
  accessToken = null;
  bootstrapDone = false;
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  for (const key of LEGACY_LOCALSTORAGE_KEYS) {
    localStorage.removeItem(key);
  }
}

/**
 * Marca que a tentativa de bootstrap (renovar a sessão a partir do refreshToken
 * no F5) já foi feita nesta sessão de página — evita re-tentar a cada navegação.
 */
export function isBootstrapDone(): boolean {
  return bootstrapDone;
}

export function markBootstrapDone(): void {
  bootstrapDone = true;
}
