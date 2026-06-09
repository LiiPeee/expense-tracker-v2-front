import { QUERY_STALE_TIME } from "@/constants/query";
import { getDefaultYearMonth } from "@/helper/utils";
import { getErrorMessage } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { getCategoryBreakdown, type CategoryChartData } from "./category-breakdown";

export function useIncomeByCategory(month?: number, year?: number) {
  const ym = getDefaultYearMonth();
  const resolvedMonth = month ?? ym.month;
  const resolvedYear = year ?? ym.year;

  const query = useQuery({
    queryKey: ["transactions", "categoryBreakdown", "Income", resolvedMonth, resolvedYear],
    queryFn: () => getCategoryBreakdown("Income", resolvedMonth, resolvedYear),
    staleTime: QUERY_STALE_TIME,
  });

  return {
    chartData: (query.data?.chartData ?? []) as CategoryChartData[],
    totalIncome: query.data?.total ?? 0,
    isLoading: query.isPending || query.isFetching,
    error: query.error ? getErrorMessage(query.error, "Não foi possível carregar as receitas por categoria.") : null,
    refetch: () => query.refetch(),
  };
}
