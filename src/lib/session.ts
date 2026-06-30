/**
 * Session helpers: JWT parsing and account ID resolution.
 * Kept separate from api.ts so non-fetch code doesn't pull in the full
 * HTTP/auth infrastructure.
 */
import { getAccessToken } from "@/lib/token-store";

function normalizeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4;
  return padding === 0 ? normalized : normalized.padEnd(normalized.length + (4 - padding), "=");
}

export function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    return JSON.parse(atob(normalizeBase64Url(parts[1]))) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function parsePositiveNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim();
    if (!normalized) return null;
    const parsed = Number(normalized);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }

  return null;
}

export function getCurrentAccountId(): number | null {
  const token = getAccessToken();
  if (!token) return null;

  const payload = parseJwtPayload(token);
  if (!payload) return null;

  for (const candidate of [
    payload.accountId,
    payload.account_id,
    payload.AccountId,
    payload.nameid,
    payload.nameidentifier,
    payload.sub,
    payload.id,
    payload.userId,
    payload.user_id,
  ]) {
    const parsed = parsePositiveNumber(candidate);
    if (parsed != null) return parsed;
  }

  return null;
}
