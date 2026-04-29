import { clearAuth, getAccessToken, GOOGLE_AUTH_KEY, isTokenValid, onAuthUnauthorized } from "@/lib/api";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function checkAuth(): boolean {
  const token = getAccessToken();
  if (token) {
    if (!isTokenValid(token)) {
      clearAuth();
      return false;
    }
    return true;
  }

  // Google OAuth path — validate stored data structure
  const googleAuth = localStorage.getItem(GOOGLE_AUTH_KEY);
  if (!googleAuth) return false;
  try {
    const parsed = JSON.parse(googleAuth) as Record<string, unknown>;
    if (parsed.provider !== "google" || typeof parsed.profile !== "object" || parsed.profile === null) {
      clearAuth();
      return false;
    }
    return true;
  } catch {
    clearAuth();
    return false;
  }
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
