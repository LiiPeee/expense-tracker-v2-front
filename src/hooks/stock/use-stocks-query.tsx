import { PagedStocksResponse } from "@/helper/stock";
import { QUERY_STALE_TIME } from "@/constants/query";
import { getAllStocks } from "@/services/stock";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useStocksList(page: number) {
  const { data, isLoading, isFetching, refetch } = useQuery<PagedStocksResponse>({
    queryKey: ["stocks", "list", page],
    queryFn: () => getAllStocks(page),
    staleTime: QUERY_STALE_TIME,
    placeholderData: keepPreviousData,
  });

  const pageSize = data?.pageSize ?? 10;
  const totalRecords = data?.totalRecords ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

  return {
    stocks: data?.items ?? [],
    currentPage: data?.pageNumber ?? page,
    pageSize,
    totalRecords,
    totalPages,
    isLoading,
    isRefreshing: isFetching,
    refetch,
  };
}
