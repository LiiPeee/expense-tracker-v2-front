import { Transaction, TransactionInsert } from "@/helper/transaction";
import { recurrence } from "@/helper/utils";
import { createTransaction } from "@/services/create-transaction";
import { useState } from "react";
import { toast } from "sonner";

export function useTransaction() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<TransactionInsert | null>(null);
  const [formData, setFormData] = useState<Transaction>({
    recurrence: "Não",
    contactName: "",
    dateOfInstallment: "",
    numberOfInstallment: "",
    paid: "",
    subCategory: "",
    transactionName: "",
    description: "",
    amount: "",
    type: "expense" as "income" | "expense",
    category: "",
    date: new Date().toISOString().split("T")[0],
    id: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingTransaction) {
      toast.success("Transação atualizada com sucesso!");
    } else {
      if (!formData.recurrence) {
        toast.error("Selecione uma recorrência");
        return;
      }

      const amount = parseFloat(formData.amount);
      const installment = parseInt(formData.numberOfInstallment);
      const paid = formData.paid == "Sim" ? true : false;
      const recorrencia = recurrence(formData.recurrence);
      const dateOfInstallment = Number(formData.dateOfInstallment);

      const response = await createTransaction({
        ...formData,
        numberOfInstallment: installment,
        amount: amount,
        paid: paid,
        recurrence: recorrencia,
        dateOfInstallment: dateOfInstallment,
      });
      if (!response) toast.error("Erro ao criar a transação!");
      else toast.success("Transação criada com sucesso!");
    }

    setIsDialogOpen(false);

    setEditingTransaction(null);

    setFormData({
      recurrence: "Não",
      contactName: "",
      dateOfInstallment: "",
      numberOfInstallment: "",
      paid: "",
      subCategory: "",
      transactionName: "",
      description: "",
      amount: "",
      type: "expense" as "income" | "expense",
      category: "",
      date: new Date().toISOString().split("T")[0],
      id: 0,
    });
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      recurrence: transaction.recurrence,
      contactName: transaction.contactName,
      dateOfInstallment: transaction.dateOfInstallment,
      numberOfInstallment: transaction.numberOfInstallment,
      paid: transaction.paid,
      subCategory: transaction.subCategory,
      transactionName: transaction.transactionName,
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      date: transaction.date,
      id: transaction.id,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    toast.success("Transação excluída com sucesso!");
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingTransaction(null);
    setFormData({
      recurrence: "Não",
      dateOfInstallment: "",
      contactName: "",
      numberOfInstallment: "",
      paid: "",
      subCategory: "",
      transactionName: "",
      description: "",
      amount: "",
      type: "expense" as "income" | "expense",
      category: "",
      date: new Date().toISOString().split("T")[0],
      id: 0,
    });
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
