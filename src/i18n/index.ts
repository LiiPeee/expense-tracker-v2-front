import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import es from "./locales/es.json";
import ptBR from "./locales/pt-BR.json";

export const SUPPORTED_LANGUAGES = [
  { code: "pt-BR", label: "Português" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
] as const;

export const DEFAULT_LANGUAGE = "pt-BR";

export const NAMESPACES = ["common", "auth", "dashboard", "errors", "stocks", "validation", "transactions", "budgets", "contacts", "reports", "cdiCalculator", "tour"] as const;

const resources = {
  "pt-BR": ptBR,
  en,
  es,
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: DEFAULT_LANGUAGE,
    ns: NAMESPACES,
    defaultNS: "common",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
    // Resources are bundled, so initialize synchronously and skip Suspense — t() is
    // usable on first render (and deterministic in tests).
    initImmediate: false,
    returnNull: false,
    react: { useSuspense: false },
  });

export default i18n;
