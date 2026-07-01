import { QUERY_STALE_TIME } from "@/constants/query";
import { CHART_COLORS, type CategoryChartData } from "@/hooks/transaction/category-breakdown";
import { fetchAllPages } from "@/lib/paginate";
import { getAllFunds, getAllStocks } from "@/services/stock";
import { useQuery } from "@tanstack/react-query";

function toChartData(entries: { ticker: string; total: number }[], grandTotal: number): CategoryChartData[] {
  return entries
    .sort((a, b) => b.total - a.total)
    .map(({ ticker, total }, index) => ({
      category: ticker,
      total,
      percentage: grandTotal > 0 ? (total / grandTotal) * 100 : 0,
      fill: CHART_COLORS[index % CHART_COLORS.length],
    }));
}

async function computePortfolioAllocation() {
  const [stocks, funds] = await Promise.all([
    fetchAllPages((page) => getAllStocks(page)),
    fetchAllPages((page) => getAllFunds(page)),
  ]);

  const allAssets = [...stocks, ...funds];

  const rvEntries: { ticker: string; total: number }[] = [];
  const rfEntries: { ticker: string; total: number }[] = [];

  for (const asset of allAssets) {
    const value = asset.quantity * asset.priceMarket;
    (asset.isStock === false ? rfEntries : rvEntries).push({ ticker: asset.ticker, total: value });
  }

  const totalRV = rvEntries.reduce((sum, e) => sum + e.total, 0);
  const totalRF = rfEntries.reduce((sum, e) => sum + e.total, 0);
  const totalValue = totalRV + totalRF;

  const overview: CategoryChartData[] = totalValue > 0
    ? [
        { category: "Renda Variável", total: totalRV, percentage: (totalRV / totalValue) * 100, fill: CHART_COLORS[0] },
        { category: "Renda Fixa", total: totalRF, percentage: (totalRF / totalValue) * 100, fill: CHART_COLORS[4] },
      ].filter((e) => e.total > 0)
    : [];

  return {
    rendaVariavel: toChartData(rvEntries, totalRV),
    rendaFixa: toChartData(rfEntries, totalRF),
    overview,
    totalRV,
    totalRF,
    totalValue,
  };
}

export function usePortfolioAllocation() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["stocks", "portfolio-allocation"],
    queryFn: computePortfolioAllocation,
    staleTime: QUERY_STALE_TIME,
  });

  return {
    rendaVariavel: data?.rendaVariavel ?? [],
    rendaFixa: data?.rendaFixa ?? [],
    overview: data?.overview ?? [],
    totalRV: data?.totalRV ?? 0,
    totalRF: data?.totalRF ?? 0,
    totalValue: data?.totalValue ?? 0,
    isLoading,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
}
