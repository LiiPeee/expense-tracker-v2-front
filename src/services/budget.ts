import type { CreateBudgetLimitRequest, PagedBudgetLimitsResponse } from "@/helper/budget";
import { authFetch, BASE_URL, getResponseErrorMessage, readJsonOrThrow } from "@/lib/api";

export async function createBudgetLimit(input: CreateBudgetLimitRequest): Promise<void> {
  const response = await authFetch(`${BASE_URL}/BudgetLimit/Create`, {
    method: "POST",
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await getResponseErrorMessage(response, "Falha ao criar orçamento"));
  }
}

export async function getBudgetLimitsByAccountPage(pageNumber = 1): Promise<PagedBudgetLimitsResponse> {
  const url = `${BASE_URL}/BudgetLimit/GetByAccountId?pageNumber=${encodeURIComponent(pageNumber)}`;
  const response = await authFetch(url);
  return readJsonOrThrow<PagedBudgetLimitsResponse>(response, "Falha ao buscar orçamentos");
}
