import { TransactionInsert } from "@/helper/transaction";
import { api } from "@/services/api";

export async function createTransaction(data: TransactionInsert) {
  try {
    const response = await api.post(`/api/Transaction/Create`, data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
