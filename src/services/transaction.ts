import { PagedTransactionsResponse, TransactionRequest } from "@/helper/transaction";
import { getDefaultYearMonth } from "@/helper/utils";

export const BASE_URL = import.meta.env.VITE_API_URL;
export async function createTransaction(data: TransactionRequest) {
  try {
    const response = await fetch(`${BASE_URL}/Transaction/Create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(data),
    });
    return response.ok;
  } catch (error) {
    console.log(error);
  }
}

export async function getExpenseValue() {
  try {
    const ym = getDefaultYearMonth();
    const url = `${BASE_URL}/Transaction/GetExpenseByMonthAndYear?month=${encodeURIComponent(ym.month)}&year=${encodeURIComponent(ym.year)}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
    });

    return (await response.json()) ?? 0;
  } catch (error) {
    console.error("Erro na API:", error);
    throw error;
  }
}

export async function getIncomeValue() {
  try {
    const ym = getDefaultYearMonth();

    const url = `${BASE_URL}/Transaction/GetIncomeByMonthAndYear?month=${encodeURIComponent(ym.month)}&year=${encodeURIComponent(ym.year)}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
    });

    return (await response.json()) ?? 0;
  } catch (error) {
    console.error("Erro na API:", error);
    throw error;
  }
}

export async function getEconomy() {
  try {
    const ym = getDefaultYearMonth();

    const url = `${BASE_URL}/Transaction/GetEconomy?month=${encodeURIComponent(ym.month)}&year=${encodeURIComponent(ym.year)}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
    });

    return (await response.json()) ?? 0;
  } catch (error) {
    console.error("Erro na API:", error);
    throw error;
  }
}

export async function getAllTransactionsPaged(pageNumber: number) {
  const ym = getDefaultYearMonth();

  const url = `${BASE_URL}/Transaction/GetByMonthAndYear?month=${encodeURIComponent(ym.month)}&year=${encodeURIComponent(ym.year)}&pageNumber=${encodeURIComponent(pageNumber)}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "Content-Type": "application/json",
    },
  });

  return (await response.json()) as unknown as PagedTransactionsResponse;
}

export async function getAllTransactions(pageNumber: number) {
  try {
    const paged = await getAllTransactionsPaged(pageNumber);
    return Array.isArray(paged.items) ? paged.items : [];
  } catch (error) {
    console.error("Erro na API:", error);
    throw error;
  }
}

export async function getTransactionsByCategoryPaged(category: string, typeName: string, month: number, year: number, pageNumber: number) {
  const url = `${BASE_URL}/Transaction/GetByCategory?categoryName=${category}&type=${typeName}&month=${encodeURIComponent(month)}&year=${encodeURIComponent(year)}&pageNumber=${encodeURIComponent(pageNumber)}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "Content-Type": "application/json",
    },
  });

  return (await response.json()) as unknown as PagedTransactionsResponse;
}

export async function getTransactionsByTypePaged(typeName: string, month: number, year: number, pageNumber: number) {
  const url = `${BASE_URL}/Transaction/GetByType?type=${typeName}&month=${encodeURIComponent(month)}&year=${encodeURIComponent(year)}&pageNumber=${encodeURIComponent(pageNumber)}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "Content-Type": "application/json",
    },
  });

  return (await response.json()) as unknown as PagedTransactionsResponse;
}

export async function getTransactionsByMonthAndYear(month: number, year: number, pageNumber: number) {
  const url = `${BASE_URL}/Transaction/GetByMonthAndYear?month=${encodeURIComponent(month)}&year=${encodeURIComponent(year)}&pageNumber=${encodeURIComponent(pageNumber)}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "Content-Type": "application/json",
    },
  });

  return (await response.json()) as unknown as PagedTransactionsResponse;
}

export async function deleteTransactions(id: number) {
  try {
    const url = `${BASE_URL}/Transaction/DeleteTransaction?id=${encodeURIComponent(id)}}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
    });

    return response.ok;
  } catch (error) {
    console.error("Erro na API:", error);
    throw error;
  }
}
