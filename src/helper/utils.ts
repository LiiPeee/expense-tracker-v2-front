import { RecurrenceLabel } from "@/helper/transaction";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatBRL = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export const HIDDEN_VALUE_PLACEHOLDER = "••••••";

export const formatBRLMasked = (value: number, isHidden: boolean) => (isHidden ? HIDDEN_VALUE_PLACEHOLDER : formatBRL(value));

export const monthNames = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export function getMonthNames(locale: string): string[] {
  // Format in UTC — otherwise Date.UTC(2000, 0, 1) is read in local time and a
  // negative-offset timezone shifts January back to December.
  const formatter = new Intl.DateTimeFormat(locale, { month: "long", timeZone: "UTC" });
  return Array.from({ length: 12 }, (_, index) => {
    const name = formatter.format(new Date(Date.UTC(2000, index, 1)));
    return name.charAt(0).toUpperCase() + name.slice(1);
  });
}

export const RECURRENCE_LABEL_KEY: Record<Exclude<RecurrenceLabel, "-">, string> = {
  Não: "none",
  Diário: "daily",
  Quinzenal: "biweekly",
  Mensal: "monthly",
  Ocasionalmente: "occasionally",
};
export function recurrence(rec: RecurrenceLabel): number {
  switch (rec) {
    case "Não":
      return 1;
    case "Diário":
      return 2;
    case "Quinzenal":
      return 3;
    case "Mensal":
      return 4;
    case "Ocasionalmente":
      return 5;
    default: {
      const _exhaustive: string = rec;
      return _exhaustive as never;
    }
  }
}
export function recurrenceResponse(rec: number): RecurrenceLabel {
  switch (rec) {
    case 1:
      return "Não";
    case 2:
      return "Diário";
    case 3:
      return "Quinzenal";
    case 4:
      return "Mensal";
    case 5:
      return "Ocasionalmente";
    default: {
      return "-";
    }
  }
}

type YearMonth = { year?: number; month?: number };

export function getDefaultYearMonth(): Required<YearMonth> {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

export function monthResponse(rec: string): number {
  switch (rec) {
    case "Janeiro":
      return 1;
    case "Fevereiro":
      return 2;
    case "Março":
      return 3;
    case "Abril":
      return 4;
    case "Maio":
      return 5;
    case "Junho":
      return 6;
    case "Julho":
      return 7;
    case "Agosto":
      return 8;
    case "Setembro":
      return 9;
    case "Outubro":
      return 10;
    case "Novembro":
      return 11;
    case "Dezembro":
      return 12;
    default: {
      return 0;
    }
  }
}

export const maskPhone = (event: string) => {
  return event
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{4})/, "$1-$2");
};
