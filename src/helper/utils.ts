import { RecurrenceLabel } from "@/helper/transaction";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const categories = [
  "MORADIA",
  "TRANSPORTE",
  "ALIMENTACAO",
  "SAUDE",
  "EDUCACAO",
  "LAZER",
  "BENS_PESSOAIS",
  "INVESTIMENTO",
  "OUTROS",
  "RENDA_VARIAVEL",
  "BENEFICIOS",
  "SALARIO",
  "CONFORTO",
];
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
export function recurrence(rec: RecurrenceLabel): number {
  switch (rec) {
    case "Não":
      return 1;
    case "Semanal":
      return 2;
    case "Quinzenal":
      return 3;
    case "Mensal":
      return 4;
    default: {
      const _exhaustive: never = rec;
      return _exhaustive;
    }
  }
}
export function recurrenceResponse(rec: number): RecurrenceLabel {
  switch (rec) {
    case 1:
      return "Não";
    case 2:
      return "Semanal";
    case 3:
      return "Quinzenal";
    case 4:
      return "Mensal";
    default: {
      return "Não";
    }
  }
}

export function monthResponse(rec: string): number {
  switch (rec) {
    case "janeiro":
      return 0;
    case "fevereiro":
      return 1;
    case "março":
      return 2;
    case "abril":
      return 3;
    case "maio":
      return 4;
    case "junho":
      return 5;
    case "julho":
      return 6;
    case "agosto":
      return 7;
    case "setembro":
      return 8;
    case "outubro":
      return 9;
    case "Novembro":
      return 10;
    case "Dezembro":
      return 11;
    default: {
      return 0;
    }
  }
}
