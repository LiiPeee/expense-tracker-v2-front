import { getExpense } from "@/services/api";
import { useState } from "react";

export function useGetAll() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  async function getAllExpense() {
    try {
      setIsRefreshing(true);
      const expense = await getExpense();
      return expense;
    } catch (error) {
      setIsRefreshing(false);
      console.error("Erro no service:", error);
      throw error;
    }
  }

  return { getAllExpense, isRefreshing };
}
