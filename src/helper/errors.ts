const backendErrorMap: Record<string, string> = {
  // Auth
  "email is invalid": "Email inválido.",
  "password is invalid": "Senha incorreta.",
  "account is not active": "Conta inativa. Entre em contato com o suporte.",
  "email is not verified": "Email ainda não verificado. Verifique sua caixa de entrada.",
  "account not found": "Conta não encontrada.",
  "invalid refresh token": "Sessão expirada. Faça login novamente.",
  "token expiry": "Código expirado. Solicite um novo.",
  "exceeds attempts": "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
  "account is already exist": "Já existe uma conta com este email.",

  // Password rules (can come from backend validation)
  "password must not be empty": "A senha não pode estar vazia.",
  "password must be at least 8 characters": "A senha deve ter pelo menos 8 caracteres.",
  "password must be less than 20 characters": "A senha deve ter no máximo 20 caracteres.",
  "password must contain at least one uppercase letter": "A senha deve conter pelo menos uma letra maiúscula.",
  "password must contain at least one lowercase letter": "A senha deve conter pelo menos uma letra minúscula.",

  // Transactions
  "we cannot find contact or category for this transaction": "Contato ou categoria não encontrado para esta transação.",
  "transaction not found or access denied": "Transação não encontrada ou sem permissão de acesso.",
  "we cannot find transactions": "Nenhuma transação encontrada.",
  "something wrong happen": "Ocorreu um erro inesperado. Tente novamente mais tarde.",

  // Contacts
  "contact not found or access denied": "Contato não encontrado ou sem permissão de acesso.",
  "contactid inválido": "ID de contato inválido.",
};

/**
 * Translates a raw backend error message to a user-friendly Portuguese string.
 * If the message is not recognized, returns the provided fallback.
 */
export function translateBackendError(raw: string | undefined | null, fallback: string): string {
  if (!raw?.trim()) return fallback;

  const lower = raw.trim().toLowerCase();

  for (const [key, value] of Object.entries(backendErrorMap)) {
    if (lower === key || lower.includes(key)) return value;
  }

  return fallback;
}
