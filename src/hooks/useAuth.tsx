import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useAuth() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = useGoogleLogin({
    scope: "openid email profile",
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);

        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        if (!res.ok) throw new Error("Falha ao buscar userinfo");

        const profile = await res.json();

        localStorage.setItem("auth", JSON.stringify({ provider: "google", token: tokenResponse, profile }));

        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => setIsLoading(false),
    onNonOAuthError: () => setIsLoading(false),
  });

  return {
    handleGoogleSignIn,
    isLoading,
  };
}
