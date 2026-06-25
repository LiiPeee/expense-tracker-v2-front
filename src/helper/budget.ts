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

// Usage thresholds (percentage of the limit already consumed).
export const BUDGET_WARNING_THRESHOLD = 80;
export const BUDGET_OVER_THRESHOLD = 100;

export type BudgetUsageStatus = "ok" | "warning" | "over";

export function parseBudgetPercentage(value: BudgetLimit["percentage"]): number | null {
  if (value == null || value === "") return null;
  const parsed = typeof value === "number" ? value : Number.parseFloat(String(value));
  return Number.isFinite(parsed) ? parsed : null;
}

/** Classifies how close a budget is to (or past) its limit. Unknown percentage → "ok". */
export function getBudgetUsageStatus(percentage: BudgetLimit["percentage"]): BudgetUsageStatus {
  const pct = parseBudgetPercentage(percentage);
  if (pct == null) return "ok";
  if (pct >= BUDGET_OVER_THRESHOLD) return "over";
  if (pct >= BUDGET_WARNING_THRESHOLD) return "warning";
  return "ok";
}

export function summarizeBudgetAlerts(budgets: BudgetLimit[]): { over: number; warning: number } {
  return budgets.reduce(
    (totals, budget) => {
      const status = getBudgetUsageStatus(budget.percentage);
      if (status === "over") totals.over += 1;
      else if (status === "warning") totals.warning += 1;
      return totals;
    },
    { over: 0, warning: 0 },
  );
}

export function getBudgetCategoryName(budget: BudgetLimit): string {
  return budget.category?.name?.trim() || "Sem categoria";
}

export function formatBudgetMonthYear(budget: Pick<BudgetLimit, "month" | "year">): string {
  const monthLabel = monthNames[budget.month - 1] ?? String(budget.month);
  return `${monthLabel}/${budget.year}`;
}
