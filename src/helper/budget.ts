import type { Category } from "@/helper/category";
import { getDefaultYearMonth, monthNames } from "@/helper/utils";
import { z } from "zod";

export interface BudgetLimit {
  id?: number;
  isLimit?: boolean;
  month: number;
  year: number;
  categoryId?: number;
  percentage?: number | string;
  category?: Category | null;
  accountId: number;
  limitAmount: number | string;
}

export interface CreateBudgetLimitRequest {
  month: number;
  year: number;
  categoryName: string;
  limitAmount: number;
}

export type PagedBudgetLimitsResponse = {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  items: Array<BudgetLimit | null>;
};

export type BudgetLimitForm = {
  month: string;
  year: string;
  categoryName: string;
  limitAmount: string;
};

const currentYearMonth = getDefaultYearMonth();

export const budgetFormDefaults: BudgetLimitForm = {
  month: String(currentYearMonth.month),
  year: String(currentYearMonth.year),
  categoryName: "",
  limitAmount: "",
};

export function mapBudgetFormToRequest(form: BudgetLimitForm): CreateBudgetLimitRequest {
  const parsedAmount = Number.parseFloat(form.limitAmount.replace(",", "."));

  return {
    month: Number(form.month),
    year: Number(form.year),
    categoryName: form.categoryName.trim(),
    limitAmount: Number.isFinite(parsedAmount) ? parsedAmount : 0,
  };
}

// Mirrors the previous validateBudgetForm rules exactly — now surfaced inline via RHF.
export const budgetFormSchema = z.object({
  categoryName: z.string().trim().min(1, "Categoria é obrigatória"),
  month: z.string().refine((value) => {
    const month = Number(value);
    return Number.isInteger(month) && month >= 1 && month <= 12;
  }, "Mês inválido"),
  year: z.string().refine((value) => {
    const year = Number(value);
    return Number.isInteger(year) && year >= 2000;
  }, "Ano inválido"),
  limitAmount: z.string().refine((value) => {
    const amount = Number.parseFloat(value.replace(",", "."));
    return Number.isFinite(amount) && amount > 0;
  }, "Limite deve ser maior que zero"),
});

export function getBudgetCategoryName(budget: BudgetLimit): string {
  return budget.category?.name?.trim() || "Sem categoria";
}

export function formatBudgetMonthYear(budget: Pick<BudgetLimit, "month" | "year">): string {
  const monthLabel = monthNames[budget.month - 1] ?? String(budget.month);
  return `${monthLabel}/${budget.year}`;
}
