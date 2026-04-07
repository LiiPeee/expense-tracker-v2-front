import {
  TransactionForm,
  TransactionResponse,
  mapTransactionFormToRequest,
  mapTransactionResponseToForm,
  transactionFormDefaults,
  validateTransactionForm,
} from "@/helper/transaction";
import { createTransaction, deleteTransactions } from "@/services/transaction";
import { useState } from "react";
import { toast } from "sonner";

export function useTransaction() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<TransactionResponse | null>(null);
  const [formData, setFormData] = useState<TransactionForm>(transactionFormDefaults);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingTransaction) {
      toast.success("Transação atualizada com sucesso!");
    } else {
      const errors = validateTransactionForm(formData);
      if (errors.length) {
        errors.forEach((message) => toast.error(message));
        return;
      }

      const response = await createTransaction(mapTransactionFormToRequest(formData));
      if (!response) toast.error("Erro ao criar a transação!");
      else toast.success("Transação criada com sucesso!");
    }

    setIsDialogOpen(false);

    setEditingTransaction(null);

    setFormData(transactionFormDefaults);
  };

  const handleEdit = (transaction: TransactionResponse) => {
    setEditingTransaction(transaction);
    setFormData(mapTransactionResponseToForm(transaction));
    setIsDialogOpen(true);
  };

  async function handleDelete(id: number) {
    const backendTransactions = await deleteTransactions(id);

    if (backendTransactions) {
      toast.success("Transação excluída com sucesso!");
    } else {
      toast.error("Erro ao excluir a transação");
    }
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingTransaction(null);
    setFormData(transactionFormDefaults);
  };

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
