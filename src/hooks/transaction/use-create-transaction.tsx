import {
  TransactionForm,
  TransactionResponse,
  mapTransactionFormToRequest,
  mapTransactionResponseToForm,
  transactionFormDefaults,
  validateTransactionForm,
} from "@/helper/transaction";
import { getErrorMessage } from "@/lib/api";
import { createTransaction, deleteTransactions, updateTransaction } from "@/services/transaction";
import { useQueryClient } from "@tanstack/react-query";
import { type FormEvent, useCallback, useState } from "react";
import { toast } from "sonner";

export function useTransaction() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<TransactionResponse | null>(null);
  const [formData, setFormData] = useState<TransactionForm>(transactionFormDefaults);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetFormState = useCallback(() => {
    setIsDialogOpen(false);
    setEditingTransaction(null);
    setFormData(transactionFormDefaults);
  }, []);

  const invalidateTransactionQueries = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["transactions"], refetchType: "none" });
  }, [queryClient]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (isSubmitting) return;

      try {
        setIsSubmitting(true);
        const errors = validateTransactionForm(formData);
        if (errors.length) {
          errors.forEach((message) => toast.error(message));
          return;
        }

        if (editingTransaction) {
          await updateTransaction(editingTransaction.id, mapTransactionFormToRequest(formData));
          toast.success("Transação atualizada com sucesso!");
          resetFormState();
          void invalidateTransactionQueries();
          return;
        }

        await createTransaction(mapTransactionFormToRequest(formData));
        toast.success("Transação criada com sucesso!");
        resetFormState();
        void invalidateTransactionQueries();
      } catch (error: unknown) {
        toast.error(getErrorMessage(error, "Erro inesperado ao salvar transação."));
      } finally {
        setIsSubmitting(false);
      }
    },
    [editingTransaction, formData, invalidateTransactionQueries, isSubmitting, resetFormState],
  );

  const handleEdit = useCallback((transaction: TransactionResponse) => {
    setEditingTransaction(transaction);
    setFormData(mapTransactionResponseToForm(transaction));
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

  const handleDialogClose = useCallback(() => {
    resetFormState();
  }, [resetFormState]);

  return {
    handleDelete,
    handleDialogClose,
    handleEdit,
    handleSubmit,
    setIsDialogOpen,
    setFormData,
    setEditingTransaction,
    formData,
    isDialogOpen,
    isSubmitting,
    editingTransaction,
  };
}
