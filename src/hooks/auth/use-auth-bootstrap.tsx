import { getAccessToken, hasRefreshToken, isBootstrapDone, markBootstrapDone, refreshSession, clearAuth } from "@/lib/api";
import { useEffect, useState } from "react";

export type AuthStatus = "checking" | "authenticated" | "unauthenticated";

function resolveInitialStatus(): AuthStatus {
  if (getAccessToken()) return "authenticated"; // navegação normal — access em memória
  if (isBootstrapDone()) return "unauthenticated"; // já tentamos renovar e falhou
  if (hasRefreshToken()) return "checking"; // F5 com refresh disponível — tentar renovar
  return "unauthenticated";
}

/**
 * Resolve o estado de autenticação para o gating de rotas.
 *
 * Como o accessToken vive só em memória, ele some no reload (F5). Quando há um
 * refreshToken em sessionStorage, este hook renova a sessão antes de liberar a
 * rota — evitando redirecionar para /auth durante o reload de um usuário logado.
 */
export function useAuthBootstrap(): AuthStatus {
  const [status, setStatus] = useState<AuthStatus>(resolveInitialStatus);

  useEffect(() => {
    if (status !== "checking") return;

    let alive = true;
    void refreshSession().then((renewed) => {
      markBootstrapDone();
      if (!alive) return;
      if (!renewed) clearAuth();
      setStatus(renewed ? "authenticated" : "unauthenticated");
    });

    return () => {
      alive = false;
    };
  }, [status]);

  return status;
}
