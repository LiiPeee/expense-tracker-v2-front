import { translateBackendError } from "@/helper/errors";
import { clearAuth, getAccessToken } from "@/lib/token-store";

// Re-export da fonte única de token, para manter a superfície pública estável.
export { clearAuth, getAccessToken, setSession } from "@/lib/token-store";

const _apiUrl = import.meta.env.VITE_API_URL as string | undefined;
if (!_apiUrl) throw new Error("[Config] VITE_API_URL is not set. All API calls will fail.");
export const BASE_URL: string = _apiUrl;

// Secret known only to this module — prevents external scripts from triggering auth:unauthorized
const AUTH_EVENT_SECRET = crypto.randomUUID();

/**
 * Registers a handler for the internal "auth:unauthorized" event.
 * Returns a cleanup function to remove the listener.
 */
export function onAuthUnauthorized(handler: () => void): () => void {
  const listener = (e: Event) => {
    if ((e as CustomEvent<{ secret: string }>).detail?.secret !== AUTH_EVENT_SECRET) return;
    handler();
  };
  window.addEventListener("auth:unauthorized", listener);
  return () => window.removeEventListener("auth:unauthorized", listener);
}

export function getAuthHeaders(): Record<string, string> {
  const token = getAccessToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

/**
 * Wrapper around fetch that:
 * - Injects the Authorization header automatically (access token from sessionStorage)
 * - Clears auth state and fires "auth:unauthorized" on 401
 */
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...((options.headers as Record<string, string>) ?? {}),
    },
  });

  if (response.status === 401) {
    clearAuth();
    window.dispatchEvent(new CustomEvent("auth:unauthorized", { detail: { secret: AUTH_EVENT_SECRET } }));
  }

  return response;
}

type ApiErrorLike = {
  message?: string;
  response?: {
    data?: {
      error?: { message?: string };
      message?: string;
    };
  };
};

type ApiErrorBody = {
  error?: { message?: string };
  message?: string;
};

export function getErrorMessage(error: unknown, fallback: string): string {
  const typed = error as ApiErrorLike;
  const raw = typed?.response?.data?.error?.message ?? typed?.response?.data?.message ?? typed?.message;
  return translateBackendError(raw, fallback);
}

export async function getResponseErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const payload = (await response.json()) as ApiErrorBody;
    const raw = payload.error?.message?.trim() || payload.message?.trim();
    return translateBackendError(raw, fallback);
  } catch {
    return fallback;
  }
}

export async function readJsonOrThrow<T>(response: Response, fallbackMessage: string): Promise<T> {
  if (!response.ok) {
    throw new Error(await getResponseErrorMessage(response, fallbackMessage));
  }

  return (await response.json()) as T;
}
