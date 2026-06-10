import { onAuthUnauthorized } from "@/lib/api";
import { useAuthBootstrap } from "@/hooks/auth/use-auth-bootstrap";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const status = useAuthBootstrap();

  useEffect(() => {
    return onAuthUnauthorized(() => window.location.replace("/auth"));
  }, []);

  if (status === "checking") {
    return <div className="min-h-screen bg-background" />;
  }

  if (status === "unauthenticated") {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
