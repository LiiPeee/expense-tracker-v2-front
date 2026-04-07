import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem("accessToken");
  const googleAuth = localStorage.getItem("auth");

  // Verifica se há autenticação (token padrão ou Google)
  const isAuthenticated = !!token || !!googleAuth;

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
