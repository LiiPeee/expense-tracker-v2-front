import { PagedTransactionsResponse, TransactionRequest } from "@/helper/transaction";
import { getDefaultYearMonth } from "@/helper/utils";
import { authFetch, BASE_URL } from "@/lib/api";

export async function createTransaction(data: TransactionRequest): Promise<boolean> {
  const response = await authFetch(`${BASE_URL}/Transaction/Create`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.ok;
}

export async function getExpenseValue(): Promise<number> {
  const ym = getDefaultYearMonth();
  const url = `${BASE_URL}/Transaction/GetExpenseByMonthAndYear?month=${encodeURIComponent(ym.month)}&year=${encodeURIComponent(ym.year)}`;

  const response = await authFetch(url);
  if (!response.ok) throw new Error("Falha ao buscar despesas");

  return (await response.json()) ?? 0;
}

export async function getIncomeValue(): Promise<number> {
  const ym = getDefaultYearMonth();
  const url = `${BASE_URL}/Transaction/GetIncomeByMonthAndYear?month=${encodeURIComponent(ym.month)}&year=${encodeURIComponent(ym.year)}`;

  const response = await authFetch(url);
  if (!response.ok) throw new Error("Falha ao buscar receitas");

  return (await response.json()) ?? 0;
}

export async function getEconomy(): Promise<number> {
  const ym = getDefaultYearMonth();
  const url = `${BASE_URL}/Transaction/GetEconomy?month=${encodeURIComponent(ym.month)}&year=${encodeURIComponent(ym.year)}`;

  const response = await authFetch(url);
  if (!response.ok) throw new Error("Falha ao buscar economia");

  return (await response.json()) ?? 0;
}

export async function getAllTransactionsPaged(pageNumber: number): Promise<PagedTransactionsResponse> {
  const ym = getDefaultYearMonth();
  const url = `${BASE_URL}/Transaction/GetByMonthAndYear?month=${encodeURIComponent(ym.month)}&year=${encodeURIComponent(ym.year)}&pageNumber=${encodeURIComponent(pageNumber)}`;

  const response = await authFetch(url);
  if (!response.ok) throw new Error("Falha ao buscar transações");

  return response.json() as unknown as PagedTransactionsResponse;
}

export async function getAllTransactions(pageNumber: number) {
  const paged = await getAllTransactionsPaged(pageNumber);
  return Array.isArray(paged.items) ? paged.items : [];
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
  if (!response.ok) throw new Error("Falha ao buscar transações por categoria");

  return response.json() as unknown as PagedTransactionsResponse;
}

export async function getTransactionsByTypePaged(
  typeName: string,
  month: number,
  year: number,
  pageNumber: number,
): Promise<PagedTransactionsResponse> {
  const url = `${BASE_URL}/Transaction/GetByType?type=${encodeURIComponent(typeName)}&month=${encodeURIComponent(month)}&year=${encodeURIComponent(year)}&pageNumber=${encodeURIComponent(pageNumber)}`;

  const response = await authFetch(url);
  if (!response.ok) throw new Error("Falha ao buscar transações por tipo");

  return response.json() as unknown as PagedTransactionsResponse;
}
export async function getTransactionsByTypeAndContactPaged(
  typeName: string,
  contactName: string,
  month: number,
  year: number,
  pageNumber: number,
): Promise<PagedTransactionsResponse> {
  const url = `${BASE_URL}/Transaction/GetByContact?contactName=${encodeURIComponent(contactName)}&type=${encodeURIComponent(typeName)}&month=${encodeURIComponent(month)}&year=${encodeURIComponent(year)}&pageNumber=${encodeURIComponent(pageNumber)}`;

  const response = await authFetch(url);
  if (!response.ok) throw new Error("Falha ao buscar transações por tipo");

  return response.json() as unknown as PagedTransactionsResponse;
}
export async function getTransactionsByMonthAndYear(month: number, year: number, pageNumber: number): Promise<PagedTransactionsResponse> {
  const url = `${BASE_URL}/Transaction/GetByMonthAndYear?month=${encodeURIComponent(month)}&year=${encodeURIComponent(year)}&pageNumber=${encodeURIComponent(pageNumber)}`;

  const response = await authFetch(url);
  if (!response.ok) throw new Error("Falha ao buscar transações");

  return response.json() as unknown as PagedTransactionsResponse;
}

export async function deleteTransactions(id: number): Promise<boolean> {
  const url = `${BASE_URL}/Transaction/DeleteTransaction?id=${encodeURIComponent(id)}`;

  const response = await authFetch(url);
  return response.ok;
}
