import {
  TransactionForm,
  TransactionResponse,
  mapTransactionFormToRequest,
  mapTransactionResponseToForm,
  transactionFormDefaults,
} from "@/helper/transaction";
import { BUDGET_LIMITS_QUERY_KEY } from "@/hooks/budget/use-budget-limits";
import { getErrorMessage } from "@/lib/api";
import { createTransaction, deleteTransactions, updateTransaction } from "@/services/transaction";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

export function useTransaction() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<TransactionResponse | null>(null);

  // Stable per editing entity so the dialog only resets when the target changes, not on every keystroke.
  const transactionDefaults = useMemo<TransactionForm>(
    () => (editingTransaction ? mapTransactionResponseToForm(editingTransaction) : transactionFormDefaults),
    [editingTransaction],
  );

  const invalidateTransactionQueries = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["transactions"], refetchType: "none" });
    await queryClient.invalidateQueries({ queryKey: BUDGET_LIMITS_QUERY_KEY });
  }, [queryClient]);

  const onOpenChange = useCallback((open: boolean) => {
    setIsDialogOpen(open);
    if (!open) setEditingTransaction(null);
  }, []);

  const submitTransaction = useCallback(
    async (data: TransactionForm) => {
      try {
        if (editingTransaction) {
          await updateTransaction(editingTransaction.id, mapTransactionFormToRequest(data));
          toast.success("Transação atualizada com sucesso!");
        } else {
          await createTransaction(mapTransactionFormToRequest(data));
          toast.success("Transação criada com sucesso!");
        }
        setIsDialogOpen(false);
        setEditingTransaction(null);
        void invalidateTransactionQueries();
      } catch (error: unknown) {
        toast.error(getErrorMessage(error, "Erro inesperado ao salvar transação."));
      }
    },
    [editingTransaction, invalidateTransactionQueries],
  );

  const handleEdit = useCallback((transaction: TransactionResponse) => {
    setEditingTransaction(transaction);
    setIsDialogOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (id: number) => {
      try {
        await deleteTransactions(id);
        await invalidateTransactionQueries();
        toast.success("Transação excluída com sucesso!");
      } catch (error: unknown) {
        toast.error(getErrorMessage(error, "Erro inesperado ao excluir transação."));
      }
    },
    [invalidateTransactionQueries],
  );

  return {
    handleDelete,
    handleEdit,
    submitTransaction,
    onOpenChange,
    transactionDefaults,
    isDialogOpen,
    editingTransaction: Boolean(editingTransaction),
  };
}
