import { getDefaultYearMonth } from "@/helper/utils";
import { getErrorMessage } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { getCategoryBreakdown, type CategoryChartData } from "./category-breakdown";

export type { CategoryChartData } from "./category-breakdown";

export function useExpenseByCategory(month?: number, year?: number) {
  const ym = getDefaultYearMonth();
  const resolvedMonth = month ?? ym.month;
  const resolvedYear = year ?? ym.year;

  const query = useQuery({
    queryKey: ["transactions", "categoryBreakdown", "Expense", resolvedMonth, resolvedYear],
    queryFn: () => getCategoryBreakdown("Expense", resolvedMonth, resolvedYear),
    staleTime: 60_000,
  });

  return {
    chartData: (query.data?.chartData ?? []) as CategoryChartData[],
    totalExpense: query.data?.total ?? 0,
    isLoading: query.isPending || query.isFetching,
    error: query.error ? getErrorMessage(query.error, "Não foi possível carregar os gastos por categoria.") : null,
    refetch: () => query.refetch(),
  };
}
