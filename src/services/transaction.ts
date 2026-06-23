import { PagedTransactionsResponse, TransactionRequest, TransactionResponse } from "@/helper/transaction";
import { getDefaultYearMonth } from "@/helper/utils";
import { del, getJson, postVoid } from "@/lib/api";

export async function createTransaction(data: TransactionRequest): Promise<void> {
  await postVoid("/Transaction/Create", data, { fallback: "Falha ao criar transação" });
}

export async function updateTransaction(id: number, data: TransactionRequest): Promise<void> {
  await postVoid("/Transaction/EditTransaction", data, { params: { id }, fallback: "Falha ao editar transação" });
}

export async function getExpenseValue(month?: number, year?: number): Promise<number> {
  const ym = month != null && year != null ? { month, year } : getDefaultYearMonth();
  const value = await getJson<number>("/Transaction/GetExpenseByMonthAndYear", ym, "Falha ao buscar despesas");
  return value ?? 0;
}

export async function getIncomeValue(month?: number, year?: number): Promise<number> {
  const ym = month != null && year != null ? { month, year } : getDefaultYearMonth();
  const value = await getJson<number>("/Transaction/GetIncomeByMonthAndYear", ym, "Falha ao buscar receitas");
  return value ?? 0;
}

export async function getEconomy(month?: number, year?: number): Promise<number> {
  const ym = month != null && year != null ? { month, year } : getDefaultYearMonth();
  const value = await getJson<number>("/Transaction/GetEconomy", ym, "Falha ao buscar economia");
  return value ?? 0;
}

export async function getAllTransactionsPaged(month: number, year: number, pageNumber: number): Promise<PagedTransactionsResponse> {
  return getJson<PagedTransactionsResponse>("/Transaction/GetByMonthAndYear", { month, year, pageNumber }, "Falha ao buscar transações");
}

export async function getTransactionsByCategoryPaged(
  category: string,
  typeName: string,
  month: number,
  year: number,
  pageNumber: number,
): Promise<PagedTransactionsResponse> {
  return getJson<PagedTransactionsResponse>(
    "/Transaction/GetByCategory",
    { categoryName: category, type: typeName, month, year, pageNumber },
    "Falha ao buscar transações por categoria",
  );
}

export async function getTransactionsByTypePaged(
  typeName: string,
  month: number,
  year: number,
  pageNumber: number,
): Promise<PagedTransactionsResponse> {
  return getJson<PagedTransactionsResponse>(
    "/Transaction/GetByType",
    { type: typeName, month, year, pageNumber },
    "Falha ao buscar transações por tipo",
  );
}

export async function getTransactionsByTypeAndContactPaged(
  typeName: string,
  id: string,
  month: number,
  year: number,
  pageNumber: number,
): Promise<PagedTransactionsResponse> {
  // Backend returns a bare list (no paging wrapper) for this endpoint, so we wrap it
  // into a single synthetic page to keep the paged contract the hook/UI expect.
  const items = await getJson<TransactionResponse[]>(
    "/Transaction/GetByContact",
    { contactId: id, type: typeName, month, year, pageNumber },
    "Falha ao buscar transações por contato e tipo",
  );
  const list = Array.isArray(items) ? items : [];
  return { pageNumber: 1, pageSize: Math.max(list.length, 1), totalRecords: list.length, items: list };
}

export async function deleteTransactions(id: number): Promise<void> {
  await del("/Transaction/DeleteTransaction", { id }, "Falha ao excluir transação");
}
