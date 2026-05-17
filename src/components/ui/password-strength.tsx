import { Check, X } from "lucide-react";

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

const requirements = [
  { key: "minLength" as const, label: "Mínimo 8 caracteres" },
  { key: "uppercase" as const, label: "Letra maiúscula" },
  { key: "lowercase" as const, label: "Letra minúscula" },
  { key: "number" as const, label: "Número" },
  { key: "special" as const, label: "Caractere especial (!@#$...)" },
];

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  if (password.length === 0) return null;

  const strength = getPasswordStrength(password);

  return (
    <ul className="space-y-1 text-sm mt-2">
      {requirements.map(({ key, label }) => (
        <li key={key} className={`flex items-center gap-2 ${strength[key] ? "text-green-600" : "text-muted-foreground"}`}>
          {strength[key] ? <Check className="w-3.5 h-3.5 shrink-0" /> : <X className="w-3.5 h-3.5 shrink-0" />}
          {label}
        </li>
      ))}
    </ul>
  );
}
