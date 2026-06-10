import { QUERY_STALE_TIME } from "@/constants/query";
import { getEconomy, getExpenseValue, getIncomeValue } from "@/services/transaction";
import { useQuery } from "@tanstack/react-query";

async function getFinancialSummary(month?: number, year?: number) {
  const [expenseMonthTotal, incomeMonthTotal, economyMonthTotal] = await Promise.all([
    getExpenseValue(month, year),
    getIncomeValue(month, year),
    getEconomy(month, year),
  ]);

  return {
    expenseMonthTotal: Number(expenseMonthTotal) || 0,
    incomeMonthTotal: Number(incomeMonthTotal) || 0,
    economyMonthTotal: Number(economyMonthTotal) || 0,
  };
}

export function useFinancialSummary(month?: number, year?: number) {
  const query = useQuery({
    queryKey: ["transactions", "summary", month, year],
    queryFn: () => getFinancialSummary(month, year),
    staleTime: QUERY_STALE_TIME,
  });

  return {
    ...query,
    expenseMonthTotal: query.data?.expenseMonthTotal ?? 0,
    incomeMonthTotal: query.data?.incomeMonthTotal ?? 0,
    economyMonthTotal: query.data?.economyMonthTotal ?? 0,
  };
}
