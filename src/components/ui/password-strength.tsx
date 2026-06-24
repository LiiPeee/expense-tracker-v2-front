import { Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";

export type PasswordStrength = {
  minLength: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
};

export function getPasswordStrength(password: string): PasswordStrength {
  return {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
}

export function isStrongPassword(strength: PasswordStrength): boolean {
  return Object.values(strength).every(Boolean);
}

const REQUIREMENT_KEYS = ["minLength", "uppercase", "lowercase", "number", "special"] as const;

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const { t } = useTranslation("auth");

  if (password.length === 0) return null;

  const strength = getPasswordStrength(password);

  return (
    <ul className="space-y-1 text-sm mt-2">
      {REQUIREMENT_KEYS.map((key) => (
        <li key={key} className={`flex items-center gap-2 ${strength[key] ? "text-green-600" : "text-muted-foreground"}`}>
          {strength[key] ? <Check className="w-3.5 h-3.5 shrink-0" /> : <X className="w-3.5 h-3.5 shrink-0" />}
          {t(`passwordRules.${key}`)}
        </li>
      ))}
    </ul>
  );
}
