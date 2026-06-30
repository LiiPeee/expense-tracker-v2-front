import { resolveQueryPeriod, type TransactionListQuery } from "@/hooks/transaction/use-get-transactions";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

type ActiveQueryKind =
  | { kind: "all" }
  | { kind: "type"; typeName: string }
  | { kind: "categoryType"; category: string; typeName: string }
  | { kind: "contactType"; contactId: string; typeName: string };

export interface UseTransactionFiltersResult {
  month: string;
  year: string;
  filterCategory: string;
  filterType: string;
  filterContact: string;
  setMonth: (value: string) => void;
  setYear: (value: string) => void;
  setFilterCategory: (value: string) => void;
  setFilterType: (value: string) => void;
  setFilterContact: (value: string) => void;

  transactionQuery: TransactionListQuery;
  currentPage: number;
  activePeriod: { month: number; year: number };

  applyFilters: () => void;
  goToPage: (page: number) => void;
  resetToFirstPage: () => void;
}

export function useTransactionFilters(): UseTransactionFiltersResult {
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterContact, setFilterContact] = useState<string>("all");
  const [activeQueryKind, setActiveQueryKind] = useState<ActiveQueryKind>({ kind: "all" });
  const [currentPage, setCurrentPage] = useState(1);
  const [month, setMonth] = useState<string>("all");
  const [year, setYear] = useState<string>("");

  const [activePeriod, setActivePeriod] = useState<{ month: number; year: number }>(() => resolveQueryPeriod("all", ""));

  const transactionQuery = useMemo((): TransactionListQuery => {
    if (activeQueryKind.kind === "type") {
      return { kind: "type", typeName: activeQueryKind.typeName, month: activePeriod.month, year: activePeriod.year };
    }
    if (activeQueryKind.kind === "categoryType") {
      return {
        kind: "categoryType",
        category: activeQueryKind.category,
        typeName: activeQueryKind.typeName,
        month: activePeriod.month,
        year: activePeriod.year,
      };
    }
    if (activeQueryKind.kind === "contactType") {
      return {
        kind: "contactType",
        contactId: activeQueryKind.contactId,
        typeName: activeQueryKind.typeName,
        month: activePeriod.month,
        year: activePeriod.year,
      };
    }
    return { kind: "all", month: activePeriod.month, year: activePeriod.year };
  }, [activeQueryKind, activePeriod]);

  const applyFilters = useCallback(() => {
    const committed = resolveQueryPeriod(month, year);

    if (filterCategory === "all" && filterType === "all") {
      setActivePeriod(committed);
      setActiveQueryKind({ kind: "all" });
      setCurrentPage(1);
      return;
    }

    if (filterContact !== "all" && filterType !== "all") {
      setActivePeriod(committed);
      setActiveQueryKind({ kind: "contactType", contactId: filterContact, typeName: filterType });
      setCurrentPage(1);
      return;
    }

    if (filterCategory === "all" && filterType !== "all") {
      setActivePeriod(committed);
      setActiveQueryKind({ kind: "type", typeName: filterType });
      setCurrentPage(1);
      return;
    }

    if (filterCategory !== "all" && filterType !== "all") {
      setActivePeriod(committed);
      setActiveQueryKind({ kind: "categoryType", category: filterCategory, typeName: filterType });
      setCurrentPage(1);
      return;
    }

    toast.error("Selecione também o tipo para filtrar.");
  }, [month, year, filterCategory, filterType, filterContact]);

  const goToPage = useCallback((page: number) => setCurrentPage(page), []);
  const resetToFirstPage = useCallback(() => setCurrentPage(1), []);

  return {
    month,
    year,
    filterCategory,
    filterType,
    filterContact,
    setMonth,
    setYear,
    setFilterCategory,
    setFilterType,
    setFilterContact,
    transactionQuery,
    currentPage,
    activePeriod,
    applyFilters,
    goToPage,
    resetToFirstPage,
  };
}
