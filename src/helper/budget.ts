import type { Category } from "@/helper/category";
import { getDefaultYearMonth, monthNames } from "@/helper/utils";

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

export function validateBudgetForm(form: BudgetLimitForm): string[] {
  const errors: string[] = [];
  const month = Number(form.month);
  const year = Number(form.year);
  const amount = Number.parseFloat(form.limitAmount.replace(",", "."));

  if (!form.categoryName.trim()) errors.push("Categoria é obrigatória");
  if (!Number.isInteger(month) || month < 1 || month > 12) errors.push("Mês inválido");
  if (!Number.isInteger(year) || year < 2000) errors.push("Ano inválido");
  if (!Number.isFinite(amount) || amount <= 0) errors.push("Limite deve ser maior que zero");

  return errors;
}

export function getBudgetCategoryName(budget: BudgetLimit): string {
  return budget.category?.name?.trim() || "Sem categoria";
}

export function formatBudgetMonthYear(budget: Pick<BudgetLimit, "month" | "year">): string {
  const monthLabel = monthNames[budget.month - 1] ?? String(budget.month);
  return `${monthLabel}/${budget.year}`;
}
