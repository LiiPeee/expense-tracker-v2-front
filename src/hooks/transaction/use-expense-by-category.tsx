import { TransactionResponse } from "@/helper/transaction";
import { getDefaultYearMonth } from "@/helper/utils";
import { getTransactionsByTypePaged } from "@/services/transaction";
import { useState } from "react";

export type CategoryChartData = {
  category: string;
  total: number;
  percentage: number;
  fill: string;
};

const CHART_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
  "#f43f5e",
  "#64748b",
  "#f59e0b",
  "#10b981",
];

async function fetchAllExpenseTransactions(month: number, year: number): Promise<TransactionResponse[]> {
  const firstPage = await getTransactionsByTypePaged("Expense", month, year, 1);
  const totalPages = Math.ceil(firstPage.totalRecords / firstPage.pageSize);
  const allItems = [...firstPage.items];

  if (totalPages > 1) {
    const remainingPages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
    const results = await Promise.all(remainingPages.map((p) => getTransactionsByTypePaged("Expense", month, year, p)));
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

export function useExpenseByCategory() {
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState<CategoryChartData[]>([]);
  const [totalExpense, setTotalExpense] = useState(0);

  async function loadData(month?: number, year?: number) {
    setIsLoading(true);
    try {
      const ym = getDefaultYearMonth();
      const m = month ?? ym.month;
      const y = year ?? ym.year;

      const transactions = await fetchAllExpenseTransactions(m, y);
      const data = aggregateByCategory(transactions);
      const total = data.reduce((sum, d) => sum + d.total, 0);

      setChartData(data);
      setTotalExpense(total);
    } finally {
      setIsLoading(false);
    }
  }

  return { isLoading, chartData, totalExpense, loadData };
}
