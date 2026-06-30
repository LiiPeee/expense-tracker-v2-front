import {
  type PagedTransactionsResponseRaw,
  type RecurrenceLabel,
  type TransactionResponse,
} from "@/helper/transaction";
import { getDefaultYearMonth, monthResponse, recurrenceResponse } from "@/helper/utils";
import {
  getAllTransactionsPaged,
  getTransactionsByCategoryPaged,
  getTransactionsByTypeAndContactPaged,
  getTransactionsByTypePaged,
} from "@/services/transaction";
import { fetchAllPages } from "@/lib/paginate";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { QUERY_STALE_TIME } from "@/constants/query";

export type TransactionListQuery =
  | { kind: "all"; month: number; year: number }
  | { kind: "type"; typeName: string; month: number; year: number }
  | { kind: "categoryType"; category: string; typeName: string; month: number; year: number }
  | { kind: "contactType"; contactId: string; typeName: string; month: number; year: number };

function normalizeRecurrence(value: number | string | null): RecurrenceLabel {
  if (value == null) return "-";
  if (typeof value === "number") return recurrenceResponse(value);
  const allowed: RecurrenceLabel[] = ["Não", "Semanal", "Quinzenal", "Mensal", "-"];
  return allowed.includes(value as RecurrenceLabel) ? (value as RecurrenceLabel) : "-";
}

async function fetchTransactions(query: TransactionListQuery, page: number): Promise<PagedTransactionsResponseRaw> {
  switch (query.kind) {
    case "all":
      return getAllTransactionsPaged(query.month, query.year, page) as Promise<PagedTransactionsResponseRaw>;
    case "type":
      return getTransactionsByTypePaged(query.typeName, query.month, query.year, page) as Promise<PagedTransactionsResponseRaw>;
    case "categoryType":
      return getTransactionsByCategoryPaged(query.category, query.typeName, query.month, query.year, page) as Promise<PagedTransactionsResponseRaw>;
    case "contactType":
      return getTransactionsByTypeAndContactPaged(query.typeName, query.contactId, query.month, query.year, page) as Promise<PagedTransactionsResponseRaw>;
  }
}

export async function fetchAllTransactions(query: TransactionListQuery): Promise<TransactionResponse[]> {
  const items = await fetchAllPages((page) => fetchTransactions(query, page));
  return items.map((item) => ({ ...item, recurrence: normalizeRecurrence(item.recurrence) })) as TransactionResponse[];
}

export function resolveQueryPeriod(monthStr: string, yearStr: string): { month: number; year: number } {
  const queryMonth = monthResponse(monthStr);
  const queryYear = Number(yearStr);
  const defaults = getDefaultYearMonth();
  return {
    month: queryMonth || defaults.month,
    year: queryYear || defaults.year,
  };
}

export function useTransactionsList(query: TransactionListQuery, page: number) {
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["transactions", "list", query, page],
    queryFn: () => fetchTransactions(query, page),
    staleTime: QUERY_STALE_TIME,
    placeholderData: keepPreviousData,
  });

  const pageSize = data?.pageSize ?? 10;
  const totalRecords = data?.totalRecords ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

  const transactions = (data?.items ?? []).map((x) => ({
    ...x,
    recurrence: normalizeRecurrence(x.recurrence),
  })) as TransactionResponse[];

  return {
    transactions,
    currentPage: data?.pageNumber ?? page,
    pageSize,
    totalRecords,
    totalPages,
    isLoading,
    isRefreshing: isFetching,
    refetch,
  };
}
