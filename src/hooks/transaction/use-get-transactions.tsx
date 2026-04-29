import { TransactionResponse } from "@/helper/transaction";
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

export function useGetAll() {
  const queryClient = useQueryClient();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expenseMonthTotal, setExpenseMonthTotal] = useState<number>(0);
  const [incomeMonthTotal, setIncomeMonthTotal] = useState<number>(0);
  const [enconomyMonthTotal, setEconomyMonthTotal] = useState<number>(0);
  const [transactions, setGetAllTransaction] = useState<TransactionResponse[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [month, setMonth] = useState<string>("all");
  const [year, setYear] = useState<string>("");

  async function getAllExpenseAndIncome() {
    try {
      setIsRefreshing(true);

      const expense = await Promise.all([await getExpenseValue(), await getIncomeValue(), await getEconomy()]);

      setExpenseMonthTotal(Number(expense[0]) || 0);
      setIncomeMonthTotal(Number(expense[1]) || 0);
      setEconomyMonthTotal(Number(expense[2]) || 0);
    } catch (error) {
      console.error("Erro no service:", error);
      throw error;
    } finally {
      setIsRefreshing(false);
    }
  }

  function applyPagedResult(backend: PagedBackendResponse<any>) {
    const mapped: TransactionResponse[] = backend.items.map((x) => ({
      ...x,
      recurrence: x.recurrence == null ? "-" : recurrenceResponse(x.recurrence),
    }));

    setGetAllTransaction(mapped);
    setCurrentPage(backend.pageNumber);
    setPageSize(backend.pageSize);
    setTotalRecords(backend.totalRecords);
    setTotalPages(Math.max(1, Math.ceil(backend.totalRecords / backend.pageSize)));
  }

  function prefetchIfPossible(queryKeyBase: readonly unknown[], nextPage: number, queryFn: () => Promise<PagedBackendResponse<any>>) {
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
      let m = monthResponse(month);
      let y = Number(year);

      if (m === 0 && y === 0) {
        const ym = getDefaultYearMonth();
        m = ym.month;
        y = ym.year;
      }
      const keyBase = ["transactions", "type", typeName, m, y] as const;

      const backend = await queryClient.fetchQuery({
        queryKey: [...keyBase, pageNumber],
        queryFn: async () => await getTransactionsByTypePaged(typeName, m, y, pageNumber),
        staleTime: 60_000,
      });

      applyPagedResult(backend);

      prefetchIfPossible(keyBase, pageNumber + 1, async () => await getTransactionsByTypePaged(typeName, m, y, pageNumber + 1));
    } finally {
      setIsRefreshing(false);
    }
  }
  async function getByContactAndType(contactName: string, typeName: string, pageNumber = 1) {
    setIsRefreshing(true);
    try {
      let m = monthResponse(month);
      let y = Number(year);

      if (m === 0 && y === 0) {
        const ym = getDefaultYearMonth();
        m = ym.month;
        y = ym.year;
      }
      const keyBase = ["transactions", "type", "contact", typeName, contactName, m, y] as const;

      const backend = await queryClient.fetchQuery({
        queryKey: [...keyBase, pageNumber],
        queryFn: async () => await getTransactionsByTypeAndContactPaged(typeName, contactName, m, y, pageNumber),
        staleTime: 60_000,
      });

      applyPagedResult(backend);

      prefetchIfPossible(keyBase, pageNumber + 1, async () => await getTransactionsByTypePaged(typeName, m, y, pageNumber + 1));
    } finally {
      setIsRefreshing(false);
    }
  }
  async function getByCategoryAndType(category: string, typeName: string, pageNumber = 1) {
    setIsRefreshing(true);
    try {
      let m = monthResponse(month);
      let y = Number(year);

      if (m === 0 && y === 0) {
        const ym = getDefaultYearMonth();
        m = ym.month;
        y = ym.year;
      }

      const keyBase = ["transactions", "categoryType", category, typeName, m, y];

      const backend = await queryClient.fetchQuery({
        queryKey: [...keyBase, pageNumber],
        queryFn: async () => await getTransactionsByCategoryPaged(category, typeName, m, y, pageNumber),
        staleTime: 60_000,
      });

      applyPagedResult(backend);

      prefetchIfPossible(
        keyBase,
        pageNumber + 1,
        async () => await getTransactionsByCategoryPaged(category, typeName, m, y, pageNumber + 1),
      );
    } finally {
      setIsRefreshing(false);
      setGetAllTransaction([]);
    }
  }

  async function getByMontAndYear(pageNumber = 1) {
    setIsRefreshing(true);
    try {
      let m = monthResponse(month);
      let y = Number(year);

      if (m === 0 && y === 0) {
        const ym = getDefaultYearMonth();
        m = ym.month;
        y = ym.year;
      }
      const keyBase = ["transactions", "monthYear", m, y] as const;

      const backend = await queryClient.fetchQuery({
        queryKey: [...keyBase, pageNumber],
        queryFn: async () => await getTransactionsByMonthAndYear(m, y, pageNumber),
        staleTime: 60_000,
      });

      applyPagedResult(backend);

      prefetchIfPossible(keyBase, pageNumber + 1, async () => await getTransactionsByMonthAndYear(m, y, pageNumber + 1));
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
    enconomyMonthTotal,
    transactions,
    year,
    month,

    setMonth,
    setYear,
  };
}
