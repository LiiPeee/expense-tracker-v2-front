import { type RecurrenceLabel, TransactionResponse } from "@/helper/transaction";
import { getDefaultYearMonth, monthResponse, recurrenceResponse } from "@/helper/utils";
import {
  getAllTransactionsPaged,
  getEconomy,
  getExpenseValue,
  getIncomeValue,
  getTransactionsByCategoryPaged,
  getTransactionsByMonthAndYear,
  getTransactionsByTypeAndContactPaged,
  getTransactionsByTypePaged,
} from "@/services/transaction";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type PagedBackendResponse<T> = {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  items: T[];
};

type BackendTransactionResponse = Omit<TransactionResponse, "recurrence"> & {
  recurrence: number | string | null;
};

type QueryPeriod = {
  month: number;
  year: number;
};

function normalizeRecurrence(value: number | string | null): RecurrenceLabel {
  if (value == null) return "-";
  if (typeof value === "number") return recurrenceResponse(value);

  const allowed: RecurrenceLabel[] = ["Não", "Semanal", "Quinzenal", "Mensal", "-"];
  return allowed.includes(value as RecurrenceLabel) ? (value as RecurrenceLabel) : "-";
}

export function useGetAll() {
  const queryClient = useQueryClient();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expenseMonthTotal, setExpenseMonthTotal] = useState<number>(0);
  const [incomeMonthTotal, setIncomeMonthTotal] = useState<number>(0);
  const [economyMonthTotal, setEconomyMonthTotal] = useState<number>(0);
  const [transactions, setGetAllTransaction] = useState<TransactionResponse[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [month, setMonth] = useState<string>("all");
  const [year, setYear] = useState<string>("");

  function resolveQueryPeriod(): QueryPeriod {
    let queryMonth = monthResponse(month);
    let queryYear = Number(year);

    if (queryMonth === 0 && queryYear === 0) {
      const ym = getDefaultYearMonth();
      queryMonth = ym.month;
      queryYear = ym.year;
    }

    return { month: queryMonth, year: queryYear };
  }

  async function getAllExpenseAndIncome() {
    try {
      setIsRefreshing(true);

      const [expense, income, economy] = await Promise.all([getExpenseValue(), getIncomeValue(), getEconomy()]);

      setExpenseMonthTotal(Number(expense) || 0);
      setIncomeMonthTotal(Number(income) || 0);
      setEconomyMonthTotal(Number(economy) || 0);
    } catch (error) {
      console.error("Erro no service:", error);
      throw error;
    } finally {
      setIsRefreshing(false);
    }
  }

  function applyPagedResult(backend: PagedBackendResponse<BackendTransactionResponse>) {
    const mapped: TransactionResponse[] = backend.items.map((x) => ({
      ...x,
      recurrence: normalizeRecurrence(x.recurrence),
    }));

    setGetAllTransaction(mapped);
    setCurrentPage(backend.pageNumber);
    setPageSize(backend.pageSize);
    setTotalRecords(backend.totalRecords);
    setTotalPages(Math.max(1, Math.ceil(backend.totalRecords / backend.pageSize)));
  }

  function prefetchIfPossible<T>(queryKeyBase: readonly unknown[], nextPage: number, queryFn: () => Promise<PagedBackendResponse<T>>) {
    if (nextPage > totalPages) return;

    void queryClient.prefetchQuery({
      queryKey: [...queryKeyBase, nextPage],
      queryFn,
      staleTime: 60_000,
    });
  }

  async function getAllTransaction(pageNumber = 1) {
    setIsRefreshing(true);
    try {
      const keyBase = ["transactions", "all"] as const;

      const backend = await queryClient.fetchQuery({
        queryKey: [...keyBase, pageNumber],
        queryFn: async () => await getAllTransactionsPaged(pageNumber),
        staleTime: 60_000,
      });

      applyPagedResult(backend);

      prefetchIfPossible(keyBase, pageNumber + 1, async () => await getAllTransactionsPaged(pageNumber + 1));
    } finally {
      setIsRefreshing(false);
    }
  }

  async function getByType(typeName: string, pageNumber = 1) {
    setIsRefreshing(true);
    try {
      const period = resolveQueryPeriod();
      const keyBase = ["transactions", "type", typeName, period.month, period.year] as const;

      const backend = await queryClient.fetchQuery({
        queryKey: [...keyBase, pageNumber],
        queryFn: async () => await getTransactionsByTypePaged(typeName, period.month, period.year, pageNumber),
        staleTime: 60_000,
      });

      applyPagedResult(backend);

      prefetchIfPossible(
        keyBase,
        pageNumber + 1,
        async () => await getTransactionsByTypePaged(typeName, period.month, period.year, pageNumber + 1),
      );
    } finally {
      setIsRefreshing(false);
    }
  }
  async function getByContactAndType(id: string, typeName: string, pageNumber = 1) {
    setIsRefreshing(true);
    try {
      const period = resolveQueryPeriod();
      const keyBase = ["transactions", "type", "contact", typeName, id, period.month, period.year] as const;

      const backend = await queryClient.fetchQuery({
        queryKey: [...keyBase, pageNumber],
        queryFn: async () => await getTransactionsByTypeAndContactPaged(typeName, id, period.month, period.year, pageNumber),
        staleTime: 60_000,
      });

      applyPagedResult(backend);

      prefetchIfPossible(
        keyBase,
        pageNumber + 1,
        async () => await getTransactionsByTypeAndContactPaged(typeName, id, period.month, period.year, pageNumber + 1),
      );
    } finally {
      setIsRefreshing(false);
    }
  }
  async function getByCategoryAndType(category: string, typeName: string, pageNumber = 1) {
    setIsRefreshing(true);
    try {
      const period = resolveQueryPeriod();
      const keyBase = ["transactions", "categoryType", category, typeName, period.month, period.year] as const;

      const backend = await queryClient.fetchQuery({
        queryKey: [...keyBase, pageNumber],
        queryFn: async () => await getTransactionsByCategoryPaged(category, typeName, period.month, period.year, pageNumber),
        staleTime: 60_000,
      });

      applyPagedResult(backend);

      prefetchIfPossible(
        keyBase,
        pageNumber + 1,
        async () => await getTransactionsByCategoryPaged(category, typeName, period.month, period.year, pageNumber + 1),
      );
    } finally {
      setIsRefreshing(false);
    }
  }

  async function getByMontAndYear(pageNumber = 1) {
    setIsRefreshing(true);
    try {
      const period = resolveQueryPeriod();
      const keyBase = ["transactions", "monthYear", period.month, period.year] as const;

      const backend = await queryClient.fetchQuery({
        queryKey: [...keyBase, pageNumber],
        queryFn: async () => await getTransactionsByMonthAndYear(period.month, period.year, pageNumber),
        staleTime: 60_000,
      });

      applyPagedResult(backend);

      prefetchIfPossible(
        keyBase,
        pageNumber + 1,
        async () => await getTransactionsByMonthAndYear(period.month, period.year, pageNumber + 1),
      );
    } finally {
      setIsRefreshing(false);
    }
  }

  return {
    getAllExpenseAndIncome,
    getAllTransaction,
    getByCategoryAndType,
    getByMontAndYear,
    getByType,
    getByContactAndType,

    currentPage,
    totalPages,
    totalRecords,
    pageSize,
    isRefreshing,
    expenseMonthTotal,
    incomeMonthTotal,
    economyMonthTotal,
    transactions,
    year,
    month,

    setMonth,
    setYear,
  };
}
