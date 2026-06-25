import { toCsv } from "@/helper/csv";
import type { TransactionResponse } from "@/helper/transaction";
import { TRANSACTION_TYPE } from "@/helper/transaction";

export const TRANSACTION_CSV_HEADERS = ["Data", "Nome", "Descrição", "Categoria", "Tipo", "Valor", "Contato", "Recorrência", "Pago"];

function formatType(typeTransaction: number): string {
  if (typeTransaction === TRANSACTION_TYPE.EXPENSE) return "Despesa";
  if (typeTransaction === TRANSACTION_TYPE.INCOME) return "Receita";
  return "-";
}

function formatDate(transaction: TransactionResponse): string {
  const raw = transaction.competenceDate ?? transaction.createdDate;
  if (!raw) return "";
  // Parse the date-only part as local (avoids the UTC→local off-by-one that
  // `new Date("2026-07-15")` causes in negative-offset timezones).
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw);
  if (match) {
    const [, year, month, day] = match;
    return `${day}/${month}/${year}`;
  }
  return new Date(raw).toLocaleDateString("pt-BR");
}

function formatAmount(amount: number): string {
  return (Number(amount) || 0).toFixed(2).replace(".", ",");
}

export function transactionToCsvRow(transaction: TransactionResponse): string[] {
  return [
    formatDate(transaction),
    transaction.name ?? "",
    transaction.description ?? "",
    transaction.category?.name ?? "",
    formatType(transaction.typeTransaction),
    formatAmount(transaction.amount),
    transaction.contact?.name ?? "",
    String(transaction.recurrence ?? ""),
    transaction.paid ? "Sim" : "Não",
  ];
}

export function buildTransactionsCsv(transactions: TransactionResponse[]): string {
  return toCsv(TRANSACTION_CSV_HEADERS, transactions.map(transactionToCsvRow));
}
