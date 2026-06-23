import type { CreateBudgetLimitRequest, PagedBudgetLimitsResponse } from "@/helper/budget";
import { getJson, postVoid } from "@/lib/api";

export async function createBudgetLimit(input: CreateBudgetLimitRequest): Promise<void> {
  await postVoid("/BudgetLimit/Create", input, { fallback: "Falha ao criar orçamento" });
}

export async function getBudgetLimitsByAccountPage(pageNumber = 1): Promise<PagedBudgetLimitsResponse> {
  return getJson<PagedBudgetLimitsResponse>("/BudgetLimit/GetByAccountId", { pageNumber }, "Falha ao buscar orçamentos");
}
