import { QUERY_STALE_TIME } from "@/constants/query";
import { type BudgetLimit, type BudgetLimitForm, mapBudgetFormToRequest } from "@/helper/budget";
import { getErrorMessage } from "@/lib/api";
import { createBudgetLimit, getBudgetLimitsByAccountPage } from "@/services/budget";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";

async function fetchAllBudgetLimits(): Promise<BudgetLimit[]> {
  const firstPage = await getBudgetLimitsByAccountPage(1);
  const firstItems = (firstPage.items ?? []).filter((item): item is BudgetLimit => item != null);
  const safePageSize = Math.max(firstPage.pageSize || 0, firstItems.length, 1);
  const totalPages = Math.max(1, Math.ceil((firstPage.totalRecords || firstItems.length) / safePageSize));

  if (totalPages === 1) return firstItems;

  const remainingPages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
  const responses = await Promise.all(remainingPages.map((page) => getBudgetLimitsByAccountPage(page)));

  return [...firstItems, ...responses.flatMap((r) => (r.items ?? []).filter((item): item is BudgetLimit => item != null))];
}

export function useBudgetLimits() {
  const queryClient = useQueryClient();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const query = useQuery({
    queryKey: ["budgetLimits"],
    queryFn: fetchAllBudgetLimits,
    staleTime: QUERY_STALE_TIME,
  });

  const createMutation = useMutation({
    mutationFn: createBudgetLimit,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["budgetLimits"] });
    },
  });

  const handleDialogClose = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  const submitBudget = useCallback(
    async (data: BudgetLimitForm) => {
      try {
        await createMutation.mutateAsync(mapBudgetFormToRequest(data));
        toast.success("Orçamento criado com sucesso!");
        handleDialogClose();
      } catch (error: unknown) {
        toast.error(getErrorMessage(error, "Erro inesperado ao criar orçamento."));
      }
    },
    [createMutation, handleDialogClose],
  );

  return {
    budgets: (query.data ?? []) as BudgetLimit[],
    error: query.error ? getErrorMessage(query.error, "Não foi possível carregar os orçamentos.") : null,
    isDialogOpen,
    isRefreshing: query.isFetching || createMutation.isPending,
    refetchBudgets: () => query.refetch(),
    handleDialogClose,
    submitBudget,
    setIsDialogOpen,
  };
}
