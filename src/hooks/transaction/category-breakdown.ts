import type { TransactionResponse } from "@/helper/transaction";
import { fetchAllPages } from "@/lib/paginate";
import { getTransactionsByTypePaged } from "@/services/transaction";

export type CategoryChartData = {
  category: string;
  total: number;
  percentage: number;
  fill: string;
};

export const CHART_COLORS = [
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

function fetchAllTransactionsByType(typeName: "Expense" | "Income", month: number, year: number): Promise<TransactionResponse[]> {
  return fetchAllPages<TransactionResponse>((page) => getTransactionsByTypePaged(typeName, month, year, page));
}

function aggregateByCategory(transactions: TransactionResponse[]): CategoryChartData[] {
  const totalsByCategory = new Map<string, number>();

  for (const transaction of transactions) {
    const category = transaction.category?.name ?? "Outros";
    const amount = Number.parseFloat(String(transaction.amount).replace(",", ".")) || 0;
    totalsByCategory.set(category, (totalsByCategory.get(category) ?? 0) + amount);
  }

  const grandTotal = Array.from(totalsByCategory.values()).reduce((total, amount) => total + amount, 0);

  return Array.from(totalsByCategory.entries())
    .sort((left, right) => right[1] - left[1])
    .map(([category, total], index) => ({
      category,
      total,
      percentage: grandTotal > 0 ? (total / grandTotal) * 100 : 0,
      fill: CHART_COLORS[index % CHART_COLORS.length],
    }));
}

export async function getCategoryBreakdown(typeName: "Expense" | "Income", month: number, year: number) {
  const transactions = await fetchAllTransactionsByType(typeName, month, year);
  const chartData = aggregateByCategory(transactions);
  const total = chartData.reduce((sum, entry) => sum + entry.total, 0);

  return {
    chartData,
    total,
  };
}
