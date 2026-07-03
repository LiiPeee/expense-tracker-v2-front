import { Category } from "@/helper/category";
import { Contact } from "@/helper/contact";
import { z } from "zod";

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

export type EditTransactionRequest = Omit<TransactionRequest, "description" | "dateOfInstallment" | "date">;

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
  competenceDate?: string;
  subCategory?: string;
  numberOfInstallment?: string;
  dateOfInstallment?: string;
  paid?: boolean;
  contact: Contact;
  recurrence: string;
  description: string;
  amount: number;
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

// Raw backend shape before normalization: recurrence arrives as a numeric code, a label string, or null.
export type TransactionResponseRaw = Omit<TransactionResponse, "recurrence"> & { recurrence: number | string | null };
export type PagedTransactionsResponseRaw = Omit<PagedTransactionsResponse, "items"> & { items: TransactionResponseRaw[] };

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

export function mapTransactionFormToEditRequest(form: TransactionForm): EditTransactionRequest {
  const { description, dateOfInstallment, date, ...editRequest } = mapTransactionFormToRequest(form);
  return editRequest;
}

export const transactionFormSchema = z.object({
  id: z.number(),
  transactionName: z.string().trim().min(1, "validation:transactionNameRequired"),
  subCategory: z.string(),
  numberOfInstallment: z.string(),
  dateOfInstallment: z.string(),
  paid: z.enum(["", "Sim", "Não"]).refine((value) => value !== "", "validation:paymentStatusRequired"),
  contactName: z.string().trim().min(1, "validation:contactRequired"),
  recurrence: z.string().min(1, "validation:recurrenceRequired"),
  description: z.string(),
  amount: z.string().refine((value) => value.trim() !== "" && !Number.isNaN(Number(value)), "validation:amountInvalid"),
  type: z.enum(["Income", "Expense"]),
  category: z.string().trim().min(1, "validation:categoryRequired"),
  date: z.string().optional(),
});

export function mapTransactionResponseToForm(transaction: TransactionResponse): TransactionForm {
  return {
    ...transactionFormDefaults,
    transactionName: transaction.name ?? "",
    description: transaction.description ?? "",
    category: transaction.category?.name ?? "",
    subCategory: transaction.subCategory ?? "",
    amount: transaction.amount == null ? "" : String(transaction.amount),
    type: transaction.typeTransaction === TRANSACTION_TYPE.EXPENSE ? "Expense" : "Income",
    paid: transaction.paid === true ? "Sim" : transaction.paid === false ? "Não" : "",
    numberOfInstallment: transaction.numberOfInstallment ?? "",
    dateOfInstallment: transaction.dateOfInstallment ?? "",
    recurrence: transaction.recurrence ?? "NONE",
    contactName: transaction.contact?.name ?? "",
    date: transaction.date,
    id: transaction.id,
  };
}
