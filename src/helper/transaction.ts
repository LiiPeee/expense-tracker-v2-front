export type RecurrenceLabel = "Não" | "Semanal" | "Quinzenal" | "Mensal";

export interface TransactionInsert {
  id: number;
  transactionName?: string;
  subCategory?: string;
  numberOfInstallment?: number;
  dateOfInstallment?: number;
  paid?: boolean;
  contactName: string;
  recurrence: number;
  description: string;
  amount: number;
  type: string;
  category: string;
  date?: string;
}
export interface Transaction {
  id: number;
  transactionName?: string;
  subCategory?: string;
  numberOfInstallment?: string;
  dateOfInstallment?: string;
  paid?: string;
  contactName: string;
  recurrence: RecurrenceLabel;
  description: string;
  amount: string;
  type: string;
  category: string;
  date?: string;
}

export interface TransactionResponse {
  id: number;
  name?: string;
  subCategory?: string;
  numberOfInstallment?: string;
  dateOfInstallment?: string;
  paid?: string;
  contact: Contact;
  recurrence: RecurrenceLabel;
  description: string;
  amount: string;
  typeTransaction: number;
  category: Category;
  date?: string;
}
export interface Category {
  name?: string;
}
export interface Contact {
  email: string;
  name: string;
  phone: string;
}
