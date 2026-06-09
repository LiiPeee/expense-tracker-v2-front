import { clearAuth, getAccessToken, isTokenValid, onAuthUnauthorized } from "@/lib/api";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function checkAuth(): boolean {
  const token = getAccessToken();
  if (!token) {
    clearAuth();
    return false;
  }

  if (!isTokenValid(token)) {
    clearAuth();
    return false;
  }

  return true;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = checkAuth();

  useEffect(() => {
    return onAuthUnauthorized(() => window.location.replace("/auth"));
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
