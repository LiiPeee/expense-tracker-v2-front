import { TransactionResponse } from "@/helper/transaction";
import { monthResponse, recurrenceResponse } from "@/helper/utils";
import {
  getAllTransactions,
  getEconomy,
  getExpenseValue,
  getIncomeValue,
  getTransactionsByCategory,
  getTransactionsByMonthAndYear,
} from "@/services/get-transaction";
import { useState } from "react";

export function useGetAll() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expenseMonthTotal, setExpenseMonthTotal] = useState<number>(0);
  const [incomeMonthTotal, setIncomeMonthTotal] = useState<number>(0);
  const [enconomyMonthTotal, setEconomyMonthTotal] = useState<number>(0);
  const [transactions, setGetAllTransaction] = useState<TransactionResponse[]>([]);
  const [month, setMonth] = useState<string>("all");
  const [year, setYear] = useState<string>("");

  async function getAllExpenseAndIncome() {
    try {
      setIsRefreshing(true);

      const expense = await Promise.all([await getExpenseValue(), await getIncomeValue(), await getEconomy()]);

      if (!expense) {
        setIsRefreshing(false);
      }
      setExpenseMonthTotal(expense[0]);
      setIncomeMonthTotal(expense[1]);
      setEconomyMonthTotal(expense[2]);
      setIsRefreshing(false);
    } catch (error) {
      setIsRefreshing(false);
      console.error("Erro no service:", error);
      throw error;
    }
  }

  async function getAllTransaction() {
    setIsRefreshing(true);

    try {
      const backendTransactions = await getAllTransactions();

      const transactions = backendTransactions.map((x) => ({
        ...x,
        recurrence: recurrenceResponse(x.recurrence),
      }));

      console.log("Array", transactions);

      setGetAllTransaction(Array.isArray(transactions) ? transactions : []);

      setIsRefreshing(false);
    } catch (error) {
      setGetAllTransaction([]);
      console.error("Erro no service:", error);
      setIsRefreshing(false);
      throw error;
    }
  }

  async function getByCategory(category: string) {
    setGetAllTransaction([]);
    try {
      const backendTransactions = await getTransactionsByCategory(category, monthResponse(month), Number(year));

      setGetAllTransaction(Array.isArray(backendTransactions) ? backendTransactions : []);
    } catch (error) {
      setGetAllTransaction([]);
      console.error("Erro no service:", error);
      throw error;
    }
  }

  async function getByMontAndYear() {
    try {
      const backendTransactions = await getTransactionsByMonthAndYear(monthResponse(month), Number(year));

      setGetAllTransaction(Array.isArray(backendTransactions) ? backendTransactions : []);
    } catch (error) {
      setMonth("");
      setYear("");
      throw error;
    }
  }

  return {
    getAllExpenseAndIncome,
    getAllTransaction,
    getByCategory,
    getByMontAndYear,
    setMonth,
    setYear,
    transactions,
    isRefreshing,
    expenseMonthTotal,
    incomeMonthTotal,
    enconomyMonthTotal,
    year,
    month,
  };
}
