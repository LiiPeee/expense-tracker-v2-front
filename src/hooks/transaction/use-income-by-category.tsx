import { TransactionResponse } from "@/helper/transaction";
import { getDefaultYearMonth } from "@/helper/utils";
import { getTransactionsByTypePaged } from "@/services/transaction";
import { useState } from "react";
import { CategoryChartData, CHART_COLORS } from "./use-expense-by-category";

async function fetchAllIncomeTransactions(month: number, year: number): Promise<TransactionResponse[]> {
  const firstPage = await getTransactionsByTypePaged("Income", month, year, 1);
  const totalPages = Math.ceil(firstPage.totalRecords / firstPage.pageSize);
  const allItems = [...firstPage.items];

  if (totalPages > 1) {
    const remainingPages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
    const results = await Promise.all(remainingPages.map((p) => getTransactionsByTypePaged("Income", month, year, p)));
    results.forEach((r) => allItems.push(...r.items));
  }

  return allItems;
}

function aggregateByCategory(transactions: TransactionResponse[]): CategoryChartData[] {
  const map = new Map<string, number>();

  for (const t of transactions) {
    const cat = t.category?.name ?? "Outros";
    const amount = parseFloat(String(t.amount).replace(",", ".")) || 0;
    map.set(cat, (map.get(cat) ?? 0) + amount);
  }

  const grandTotal = Array.from(map.values()).reduce((a, b) => a + b, 0);

  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([category, total], i) => ({
      category,
      total,
      percentage: grandTotal > 0 ? (total / grandTotal) * 100 : 0,
      fill: CHART_COLORS[i % CHART_COLORS.length],
    }));
}

export function useIncomeByCategory() {
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState<CategoryChartData[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);

  async function loadData(month?: number, year?: number) {
    setIsLoading(true);
    try {
      const ym = getDefaultYearMonth();
      const m = month ?? ym.month;
      const y = year ?? ym.year;

      const transactions = await fetchAllIncomeTransactions(m, y);
      const data = aggregateByCategory(transactions);
      const total = data.reduce((sum, d) => sum + d.total, 0);

      setChartData(data);
      setTotalIncome(total);
    } finally {
      setIsLoading(false);
    }
  }

  return { isLoading, chartData, totalIncome, loadData };
}
