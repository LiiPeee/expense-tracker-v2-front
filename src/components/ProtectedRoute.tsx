import { getAccessToken, onAuthUnauthorized } from "@/lib/api";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // O accessToken vive em sessionStorage, então sobrevive ao F5 e pode ser
  // lido de forma síncrona — não há estado de "checando" a resolver.
  const isAuthenticated = getAccessToken() != null;

  useEffect(() => {
    return onAuthUnauthorized(() => window.location.replace("/auth"));
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
