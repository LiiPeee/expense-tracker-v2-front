import { PagedTransactionsResponse, TransactionRequest } from "@/helper/transaction";
import { getDefaultYearMonth } from "@/helper/utils";
import { authFetch, BASE_URL, getResponseErrorMessage, readJsonOrThrow } from "@/lib/api";

export async function createTransaction(data: TransactionRequest): Promise<void> {
  const response = await authFetch(`${BASE_URL}/Transaction/Create`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(await getResponseErrorMessage(response, "Falha ao criar transação"));
  }
}

export async function updateTransaction(id: number, data: TransactionRequest): Promise<void> {
  const response = await authFetch(`${BASE_URL}/Transaction/EditTransaction?id=${encodeURIComponent(id)}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(await getResponseErrorMessage(response, "Falha ao editar transação"));
  }
}

export async function getExpenseValue(): Promise<number> {
  const ym = getDefaultYearMonth();
  const url = `${BASE_URL}/Transaction/GetExpenseByMonthAndYear?month=${encodeURIComponent(ym.month)}&year=${encodeURIComponent(ym.year)}`;

  const response = await authFetch(url);
  const value = await readJsonOrThrow<number>(response, "Falha ao buscar despesas");
  return value ?? 0;
}

export async function getIncomeValue(): Promise<number> {
  const ym = getDefaultYearMonth();
  const url = `${BASE_URL}/Transaction/GetIncomeByMonthAndYear?month=${encodeURIComponent(ym.month)}&year=${encodeURIComponent(ym.year)}`;

  const response = await authFetch(url);
  const value = await readJsonOrThrow<number>(response, "Falha ao buscar receitas");
  return value ?? 0;
}

export async function getEconomy(): Promise<number> {
  const ym = getDefaultYearMonth();
  const url = `${BASE_URL}/Transaction/GetEconomy?month=${encodeURIComponent(ym.month)}&year=${encodeURIComponent(ym.year)}`;

  const response = await authFetch(url);
  const value = await readJsonOrThrow<number>(response, "Falha ao buscar economia");
  return value ?? 0;
}

export async function getAllTransactionsPaged(month: number, year: number, pageNumber: number): Promise<PagedTransactionsResponse> {
  const url = `${BASE_URL}/Transaction/GetByMonthAndYear?month=${encodeURIComponent(month)}&year=${encodeURIComponent(year)}&pageNumber=${encodeURIComponent(pageNumber)}`;

  const response = await authFetch(url);
  return readJsonOrThrow<PagedTransactionsResponse>(response, "Falha ao buscar transações");
}

export async function getTransactionsByCategoryPaged(
  category: string,
  typeName: string,
  month: number,
  year: number,
  pageNumber: number,
): Promise<PagedTransactionsResponse> {
  const url = `${BASE_URL}/Transaction/GetByCategory?categoryName=${encodeURIComponent(category)}&type=${encodeURIComponent(typeName)}&month=${encodeURIComponent(month)}&year=${encodeURIComponent(year)}&pageNumber=${encodeURIComponent(pageNumber)}`;

  const response = await authFetch(url);
  return readJsonOrThrow<PagedTransactionsResponse>(response, "Falha ao buscar transações por categoria");
}

export async function getTransactionsByTypePaged(
  typeName: string,
  month: number,
  year: number,
  pageNumber: number,
): Promise<PagedTransactionsResponse> {
  const url = `${BASE_URL}/Transaction/GetByType?type=${encodeURIComponent(typeName)}&month=${encodeURIComponent(month)}&year=${encodeURIComponent(year)}&pageNumber=${encodeURIComponent(pageNumber)}`;

  const response = await authFetch(url);
  return readJsonOrThrow<PagedTransactionsResponse>(response, "Falha ao buscar transações por tipo");
}
export async function getTransactionsByTypeAndContactPaged(
  typeName: string,
  id: string,
  month: number,
  year: number,
  pageNumber: number,
): Promise<PagedTransactionsResponse> {
  const url = `${BASE_URL}/Transaction/GetByContact?id=${encodeURIComponent(id)}&type=${encodeURIComponent(typeName)}&month=${encodeURIComponent(month)}&year=${encodeURIComponent(year)}&pageNumber=${encodeURIComponent(pageNumber)}`;

  const response = await authFetch(url);
  return readJsonOrThrow<PagedTransactionsResponse>(response, "Falha ao buscar transações por contato e tipo");
}
export async function deleteTransactions(id: number): Promise<void> {
  const url = `${BASE_URL}/Transaction/DeleteTransaction?id=${encodeURIComponent(id)}`;

  const response = await authFetch(url, { method: "DELETE" });
  if (!response.ok) {
    throw new Error(await getResponseErrorMessage(response, "Falha ao excluir transação"));
  }
}
