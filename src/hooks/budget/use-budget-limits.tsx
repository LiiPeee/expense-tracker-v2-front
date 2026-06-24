import { QUERY_STALE_TIME } from "@/constants/query";
import { type BudgetLimit, type BudgetLimitForm, mapBudgetFormToRequest } from "@/helper/budget";
import { getErrorMessage } from "@/lib/api";
import { fetchAllPages } from "@/lib/paginate";
import { createBudgetLimit, getBudgetLimitsByAccountPage } from "@/services/budget";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";

function fetchAllBudgetLimits(): Promise<BudgetLimit[]> {
  return fetchAllPages<BudgetLimit>((page) => getBudgetLimitsByAccountPage(page));
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
