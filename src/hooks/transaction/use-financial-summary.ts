import { getEconomy, getExpenseValue, getIncomeValue } from "@/services/transaction";
import { useQuery } from "@tanstack/react-query";

async function getFinancialSummary() {
  const [expenseMonthTotal, incomeMonthTotal, economyMonthTotal] = await Promise.all([
    getExpenseValue(),
    getIncomeValue(),
    getEconomy(),
  ]);

  return {
    expenseMonthTotal: Number(expenseMonthTotal) || 0,
    incomeMonthTotal: Number(incomeMonthTotal) || 0,
    economyMonthTotal: Number(economyMonthTotal) || 0,
  };
}

export function useFinancialSummary() {
  const query = useQuery({
    queryKey: ["transactions", "summary"],
    queryFn: getFinancialSummary,
    staleTime: 60_000,
  });

  return {
    ...query,
    expenseMonthTotal: query.data?.expenseMonthTotal ?? 0,
    incomeMonthTotal: query.data?.incomeMonthTotal ?? 0,
    economyMonthTotal: query.data?.economyMonthTotal ?? 0,
  };
}
