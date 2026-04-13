import { useGoogleLogin } from "@react-oauth/google";
import { GOOGLE_AUTH_KEY } from "@/lib/api";
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
        if (!res.ok) throw new Error("Falha ao buscar perfil do Google");

        const profile = await res.json();

        // Store only the necessary profile fields — never persist the OAuth token
        const safeProfile = {
          name: profile.name as string,
          email: profile.email as string,
          picture: profile.picture as string,
        };
        localStorage.setItem(GOOGLE_AUTH_KEY, JSON.stringify({ provider: "google", profile: safeProfile }));

        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => setIsLoading(false),
    onNonOAuthError: () => setIsLoading(false),
  });

  return { handleGoogleSignIn, isLoading };
}
