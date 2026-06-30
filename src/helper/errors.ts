import i18n from "@/i18n";

const backendErrorKeys: Record<string, string> = {
  "email is invalid": "emailInvalid",
  "password is invalid": "passwordInvalid",
  "account is not active": "accountInactive",
  "email is not verified": "emailNotVerified",
  "account not found": "accountNotFound",
  "invalid refresh token": "invalidRefreshToken",
  "token expiry": "tokenExpiry",
  "exceeds attempts": "exceedsAttempts",
  "account is already exist": "accountExists",
  "password must not be empty": "passwordEmpty",
  "password must be at least 8 characters": "passwordMin",
  "password must be less than 20 characters": "passwordMax",
  "password must contain at least one uppercase letter": "passwordUpper",
  "password must contain at least one lowercase letter": "passwordLower",
  "we cannot find contact or category for this transaction": "contactOrCategoryNotFound",
  "transaction not found or access denied": "transactionNotFound",
  "we cannot find transactions": "noTransactions",
  "something wrong happen": "somethingWrong",
  "contact not found or access denied": "contactNotFound",
  "contactid inválido": "contactIdInvalid",
};

export function translateBackendError(raw: string | undefined | null, fallback: string): string {
  if (!raw?.trim()) return fallback;

  const lower = raw.trim().toLowerCase();

  for (const [needle, key] of Object.entries(backendErrorKeys)) {
    if (lower === needle || lower.includes(needle)) return i18n.t(`errors:${key}`);
  }

  return fallback;
}
