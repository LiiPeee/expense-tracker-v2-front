import { resolveQueryPeriod, type TransactionListQuery } from "@/hooks/transaction/use-get-transactions";
import { monthNames } from "@/helper/utils";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

type ActiveQueryKind =
  | { kind: "all" }
  | { kind: "type"; typeName: string }
  | { kind: "categoryType"; category: string; typeName: string }
  | { kind: "contactType"; contactId: string; typeName: string }
  | { kind: "paid"; paid: boolean };

export type TransactionFilterPreset = ActiveQueryKind & { period: { month: number; year: number } };

export function isTransactionFilterPreset(value: unknown): value is TransactionFilterPreset {
  if (typeof value !== "object" || value === null) return false;
  const preset = value as Record<string, unknown>;

  const period = preset.period as Record<string, unknown> | undefined;
  if (typeof period !== "object" || period === null || typeof period.month !== "number" || typeof period.year !== "number") {
    return false;
  }

  switch (preset.kind) {
    case "all":
      return true;
    case "type":
      return typeof preset.typeName === "string";
    case "categoryType":
      return typeof preset.category === "string" && typeof preset.typeName === "string";
    case "contactType":
      return typeof preset.contactId === "string" && typeof preset.typeName === "string";
    case "paid":
      return typeof preset.paid === "boolean";
    default:
      return false;
  }
}

export interface UseTransactionFiltersResult {
  month: string;
  year: string;
  filterCategory: string;
  filterType: string;
  filterContact: string;
  filterPaid: string;
  setMonth: (value: string) => void;
  setYear: (value: string) => void;
  setFilterCategory: (value: string) => void;
  setFilterType: (value: string) => void;
  setFilterContact: (value: string) => void;
  setFilterPaid: (value: string) => void;

  transactionQuery: TransactionListQuery;
  currentPage: number;
  activePeriod: { month: number; year: number };

  applyFilters: () => void;
  goToPage: (page: number) => void;
  resetToFirstPage: () => void;
}

export function useTransactionFilters(preset?: TransactionFilterPreset): UseTransactionFiltersResult {
  const [filterCategory, setFilterCategory] = useState<string>(preset?.kind === "categoryType" ? preset.category : "all");
  const [filterType, setFilterType] = useState<string>(
    preset?.kind === "type" || preset?.kind === "categoryType" || preset?.kind === "contactType" ? preset.typeName : "all",
  );
  const [filterContact, setFilterContact] = useState<string>(preset?.kind === "contactType" ? preset.contactId : "all");
  const [filterPaid, setFilterPaid] = useState<string>("all");
  const [activeQueryKind, setActiveQueryKind] = useState<ActiveQueryKind>(() => preset ?? { kind: "all" });
  const [currentPage, setCurrentPage] = useState(1);
  const [month, setMonth] = useState<string>(() => (preset ? monthNames[preset.period.month - 1] : "all"));
  const [year, setYear] = useState<string>(() => (preset ? String(preset.period.year) : ""));

  const [activePeriod, setActivePeriod] = useState<{ month: number; year: number }>(() =>
    preset ? preset.period : resolveQueryPeriod("all", ""),
  );

  const transactionQuery = useMemo((): TransactionListQuery => {
    if (activeQueryKind.kind === "paid") {
      return { kind: "paid", paid: activeQueryKind.paid, month: activePeriod.month, year: activePeriod.year };
    }
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
    const commit = (kind: ActiveQueryKind) => {
      setActivePeriod(committed);
      setActiveQueryKind(kind);
      setCurrentPage(1);
    };

    if (filterPaid !== "all") {
      setFilterCategory("all");
      setFilterType("all");
      setFilterContact("all");
      commit({ kind: "paid", paid: filterPaid === "true" });
      return;
    }

    if (filterCategory === "all" && filterType === "all" && filterContact === "all") {
      commit({ kind: "all" });
      return;
    }

    if (filterContact !== "all" && filterType !== "all") {
      setFilterPaid("all");
      commit({ kind: "contactType", contactId: filterContact, typeName: filterType });
      return;
    }

    if (filterCategory === "all" && filterType !== "all") {
      setFilterPaid("all");
      commit({ kind: "type", typeName: filterType });
      return;
    }

    if (filterCategory !== "all" && filterType !== "all") {
      setFilterPaid("all");
      commit({ kind: "categoryType", category: filterCategory, typeName: filterType });
      return;
    }

    toast.error("Selecione também o tipo para filtrar.");
  }, [month, year, filterPaid, filterCategory, filterType, filterContact]);

  const goToPage = useCallback((page: number) => setCurrentPage(page), []);
  const resetToFirstPage = useCallback(() => setCurrentPage(1), []);

  return {
    month,
    year,
    filterCategory,
    filterType,
    filterContact,
    filterPaid,
    setMonth,
    setYear,
    setFilterCategory,
    setFilterType,
    setFilterContact,
    setFilterPaid,
    transactionQuery,
    currentPage,
    activePeriod,
    applyFilters,
    goToPage,
    resetToFirstPage,
  };
}
