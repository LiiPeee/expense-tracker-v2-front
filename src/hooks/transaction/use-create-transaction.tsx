import {
  TransactionForm,
  TransactionResponse,
  mapTransactionFormToEditRequest,
  mapTransactionFormToRequest,
  mapTransactionResponseToForm,
  transactionFormDefaults,
} from "@/helper/transaction";
import { BUDGET_LIMITS_QUERY_KEY } from "@/hooks/budget/use-budget-limits";
import { getErrorMessage } from "@/lib/api";
import { createTransaction, deleteTransactions, setTransactionPaid, updateTransaction } from "@/services/transaction";
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
          await updateTransaction(editingTransaction.id, mapTransactionFormToEditRequest(data));
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

  const handleTogglePaid = useCallback(
    async (transaction: TransactionResponse) => {
      try {
        await setTransactionPaid(transaction.id, !transaction.paid);
        await invalidateTransactionQueries();
        toast.success("Status de pagamento atualizado com sucesso!");
      } catch (error: unknown) {
        toast.error(getErrorMessage(error, "Erro inesperado ao atualizar status de pagamento."));
      }
    },
    [invalidateTransactionQueries],
  );

  return {
    handleDelete,
    handleEdit,
    handleTogglePaid,
    submitTransaction,
    onOpenChange,
    transactionDefaults,
    isDialogOpen,
    editingTransaction: Boolean(editingTransaction),
  };
}
