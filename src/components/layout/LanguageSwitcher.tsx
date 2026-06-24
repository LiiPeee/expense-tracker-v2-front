import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from "@/i18n";
import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { t, i18n } = useTranslation();
  const current = i18n.resolvedLanguage ?? DEFAULT_LANGUAGE;

  return (
    <Select value={current} onValueChange={(value) => void i18n.changeLanguage(value)}>
      <SelectTrigger className={className} aria-label={t("language")}>
        <Languages className="w-4 h-4" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {SUPPORTED_LANGUAGES.map((language) => (
          <SelectItem key={language.code} value={language.code}>
            {language.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
