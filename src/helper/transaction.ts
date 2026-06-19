import { Category } from "@/helper/category";
import { Contact } from "@/helper/contact";

export const TRANSACTION_TYPE = { EXPENSE: 1, INCOME: 2 } as const;

export type PaidValue = "Sim" | "Não" | "";
export type TransactionType = "Income" | "Expense";
export type RecurrenceLabel = "Não" | "Semanal" | "Quinzenal" | "Mensal" | "-";

export interface TransactionRequest {
  transactionName: string;
  subCategory?: string;
  numberOfInstallment?: number | null;
  dateOfInstallment?: number | null;
  paid: boolean;
  contactName: string;
  recurrence: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date?: string;
}

export interface TransactionForm {
  id: number;
  transactionName: string;
  subCategory: string;
  numberOfInstallment: string;
  dateOfInstallment: string;
  paid: PaidValue;
  contactName: string;
  recurrence: string;
  description: string;
  amount: string;
  type: TransactionType;
  category: string;
  date?: string;
}

export interface TransactionResponse {
  id: number;
  name?: string;
  createdDate?: string;
  subCategory?: string;
  numberOfInstallment?: string;
  dateOfInstallment?: string;
  paid?: string;
  contact: Contact;
  recurrence: string;
  description: string;
  amount: string;
  typeTransaction: number;
  category: Category;
  date?: string;
}
export type PagedTransactionsResponse = {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  items: TransactionResponse[];
};

export const transactionFormDefaults: TransactionForm = {
  recurrence: "NONE",
  contactName: "",
  dateOfInstallment: "",
  numberOfInstallment: "",
  paid: "",
  subCategory: "",
  transactionName: "",
  description: "",
  amount: "",
  type: "Expense",
  category: "",
  date: new Date().toISOString().split("T")[0],
  id: 0,
};

export function mapTransactionFormToRequest(form: TransactionForm): TransactionRequest {
  const amount = Number.parseFloat(form.amount.replace(",", "."));
  const numberOfInstallment = form.numberOfInstallment.trim() ? Number.parseInt(form.numberOfInstallment, 10) : null;
  const dateOfInstallment = form.dateOfInstallment.trim() ? Number.parseInt(form.dateOfInstallment, 10) : null;

  return {
    transactionName: form.transactionName.trim(),
    description: form.description.trim(),
    category: form.category.trim(),
    subCategory: form.subCategory.trim() || undefined,
    amount: Number.isNaN(amount) ? 0 : amount,
    type: form.type,
    paid: form.paid === "Sim",
    numberOfInstallment,
    dateOfInstallment,
    recurrence: form.recurrence,
    contactName: form.contactName.trim(),
    date: form.date,
  };
}

export function validateTransactionForm(form: TransactionForm): string[] {
  const errors: string[] = [];

  if (!form.transactionName.trim()) errors.push("Nome da transação é obrigatório");
  if (!form.category.trim()) errors.push("Categoria é obrigatória");
  if (!form.amount.trim() || Number.isNaN(Number(form.amount))) errors.push("Valor inválido");
  if (!form.contactName.trim()) errors.push("Contato é obrigatório");
  if (!form.recurrence) errors.push("Recorrência é obrigatória");
  if (!form.paid) errors.push("Status de pagamento é obrigatório");

  return errors;
}

export function mapTransactionResponseToForm(transaction: TransactionResponse): TransactionForm {
  return {
    ...transactionFormDefaults,
    transactionName: transaction.name ?? "",
    description: transaction.description ?? "",
    category: transaction.category?.name ?? "",
    subCategory: transaction.subCategory ?? "",
    amount: String(transaction.amount ?? ""),
    type: transaction.typeTransaction === TRANSACTION_TYPE.EXPENSE ? "Expense" : "Income",
    paid: transaction.paid === "true" ? "Sim" : transaction.paid === "false" ? "Não" : "",
    numberOfInstallment: transaction.numberOfInstallment ?? "",
    dateOfInstallment: transaction.dateOfInstallment ?? "",
    recurrence: transaction.recurrence ?? "NONE",
    contactName: transaction.contact?.name ?? "",
    date: transaction.date,
    id: transaction.id,
  };
}
