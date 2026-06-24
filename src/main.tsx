import { GoogleOAuthProvider } from "@react-oauth/google";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./i18n";
import "./index.css";

const googleClientId = import.meta.env.VITE_CLIENT_ID as string | undefined;

const app = <App />;

createRoot(document.getElementById("root")!).render(
  googleClientId ? <GoogleOAuthProvider clientId={googleClientId}>{app}</GoogleOAuthProvider> : app,
);
