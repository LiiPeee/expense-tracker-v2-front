import { Navigate } from "react-router-dom";
import { clearAuth, getAccessToken, GOOGLE_AUTH_KEY, isTokenValid } from "@/lib/api";
import { useEffect } from "react";

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

  // Google OAuth path — no JWT to validate, only existence check
  const googleAuth = localStorage.getItem(GOOGLE_AUTH_KEY);
  return !!googleAuth;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = checkAuth();

  useEffect(() => {
    const handleUnauthorized = () => {
      window.location.replace("/auth");
    };
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
