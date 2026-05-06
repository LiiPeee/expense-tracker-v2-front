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
import { type FormEvent, useCallback, useState } from "react";
import { toast } from "sonner";

export function useTransaction() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<TransactionResponse | null>(null);
  const [formData, setFormData] = useState<TransactionForm>(transactionFormDefaults);

  const resetFormState = useCallback(() => {
    setIsDialogOpen(false);
    setEditingTransaction(null);
    setFormData(transactionFormDefaults);
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      try {
        const errors = validateTransactionForm(formData);
        if (errors.length) {
          errors.forEach((message) => toast.error(message));
          return;
        }

        if (editingTransaction) {
          const updated = await updateTransaction(editingTransaction.id, mapTransactionFormToRequest(formData));
          if (!updated) {
            toast.error("Erro ao atualizar a transação!");
            return;
          }

          toast.success("Transação atualizada com sucesso!");
          resetFormState();
          return;
        }

        const created = await createTransaction(mapTransactionFormToRequest(formData));
        if (!created) {
          toast.error("Erro ao criar a transação!");
          return;
        }

        toast.success("Transação criada com sucesso!");
        resetFormState();
      } catch (error: unknown) {
        toast.error(getErrorMessage(error, "Erro inesperado ao salvar transação."));
      }
    },
    [editingTransaction, formData, resetFormState],
  );

  const handleEdit = useCallback((transaction: TransactionResponse) => {
    setEditingTransaction(transaction);
    setFormData(mapTransactionResponseToForm(transaction));
    setIsDialogOpen(true);
  }, []);

  const handleDelete = useCallback(async (id: number) => {
    try {
      const backendTransactions = await deleteTransactions(id);

      if (backendTransactions) {
        toast.success("Transação excluída com sucesso!");
      } else {
        toast.error("Erro ao excluir a transação");
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Erro inesperado ao excluir transação."));
    }
  }, []);

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
    editingTransaction,
  };
}
