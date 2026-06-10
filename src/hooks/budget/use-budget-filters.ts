import { type BudgetLimit, getBudgetCategoryName } from "@/helper/budget";
import { useCallback, useMemo, useState } from "react";

const PAGE_SIZE = 10;

export interface UseBudgetFiltersResult {
  filterName: string;
  filterCategory: string;
  setFilterName: (value: string) => void;
  setFilterCategory: (value: string) => void;
  clearFilters: () => void;

  paginatedBudgets: BudgetLimit[];
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  pageSize: number;
  goToPage: (page: number) => void;
}

/**
 * Filtro (por nome/categoria) e paginação client-side sobre a lista de orçamentos.
 * Recebe a lista já carregada — a fonte de dados (useBudgetLimits) fica na página.
 */
export function useBudgetFilters(budgets: BudgetLimit[]): UseBudgetFiltersResult {
  const [filterName, setFilterNameRaw] = useState("");
  const [filterCategory, setFilterCategoryRaw] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredBudgets = useMemo(() => {
    const normalizedFilter = filterName.trim().toLowerCase();
    return budgets.filter((budget) => {
      const categoryName = getBudgetCategoryName(budget);
      const matchesName = !normalizedFilter || categoryName.toLowerCase().includes(normalizedFilter);
      const matchesCategory = filterCategory === "all" || categoryName === filterCategory;
      return matchesName && matchesCategory;
    });
  }, [budgets, filterCategory, filterName]);

  const totalRecords = filteredBudgets.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedBudgets = useMemo(() => {
    const start = (safeCurrentPage - 1) * PAGE_SIZE;
    return filteredBudgets.slice(start, start + PAGE_SIZE);
  }, [filteredBudgets, safeCurrentPage]);

  // Alterar um filtro volta para a primeira página (substitui o useEffect de reset).
  const setFilterName = useCallback((value: string) => {
    setFilterNameRaw(value);
    setCurrentPage(1);
  }, []);

  const setFilterCategory = useCallback((value: string) => {
    setFilterCategoryRaw(value);
    setCurrentPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilterNameRaw("");
    setFilterCategoryRaw("all");
    setCurrentPage(1);
  }, []);

  const goToPage = useCallback((page: number) => setCurrentPage(page), []);

  return {
    filterName,
    filterCategory,
    setFilterName,
    setFilterCategory,
    clearFilters,
    paginatedBudgets,
    currentPage: safeCurrentPage,
    totalPages,
    totalRecords,
    pageSize: PAGE_SIZE,
    goToPage,
  };
}
