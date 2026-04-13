// Centralized keys — never scatter these strings across the codebase
export const TOKEN_KEY = "accessToken";
export const REFRESH_TOKEN_KEY = "refreshToken";
export const USER_KEY = "user";
export const GOOGLE_AUTH_KEY = "auth";

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(GOOGLE_AUTH_KEY);
}

export function getAuthHeaders(): Record<string, string> {
  const token = getAccessToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

/**
 * Wrapper around fetch that:
 * - Injects the Authorization header automatically
 * - Clears local auth state and fires "auth:unauthorized" on 401
 */
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const mergedHeaders: Record<string, string> = {
    ...getAuthHeaders(),
    ...((options.headers as Record<string, string>) ?? {}),
  };

  const response = await fetch(url, { ...options, headers: mergedHeaders });

  if (response.status === 401) {
    clearAuth();
    window.dispatchEvent(new Event("auth:unauthorized"));
  }

  return response;
}

/**
 * Checks whether a JWT access token is still valid (not expired / not malformed).
 * Falls back to true when the token has no "exp" claim.
 */
export function isTokenValid(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const payload = JSON.parse(atob(parts[1]));
    if (!payload.exp) return true;
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}
