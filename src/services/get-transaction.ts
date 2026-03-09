import { api } from "@/services/api";

type YearMonth = { year?: number; month?: number };

function getDefaultYearMonth(): Required<YearMonth> {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}
export async function getExpenseValue() {
  try {
    const ym = getDefaultYearMonth();

    const response = await api.get(`/api/Transaction/GetExpenseByMonthAndYear`, {
      params: {
        year: ym.year,
        month: ym.month,
      },
    });

    return response.data ? response.data : 0;
  } catch (error) {
    console.error("Erro na API:", error);
    throw error;
  }
}

export async function getIncomeValue() {
  try {
    const ym = getDefaultYearMonth();

    const response = await api.get(`/api/Transaction/GetIncomeByMonthAndYear`, {
      params: {
        year: ym.year,
        month: ym.month,
      },
    });

    return response.data ? response.data : 0;
  } catch (error) {
    console.error("Erro na API:", error);
    throw error;
  }
}
export async function getEconomy() {
  try {
    const ym = getDefaultYearMonth();

    const response = await api.get(`/api/Transaction/GetEconomy`, {
      params: {
        year: ym.year,
        month: ym.month,
      },
    });

    return response.data ? response.data : 0;
  } catch (error) {
    console.error("Erro na API:", error);
    throw error;
  }
}

export async function getAllTransactions() {
  try {
    const ym = getDefaultYearMonth();

    const { data } = await api.get(`/api/Transaction/GetAllTransaction`, {
      params: {
        year: ym.year,
        month: ym.month,
      },
    });

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Erro na API:", error);
    throw error;
  }
}

export async function getTransactionsByCategory(category: string, month: number, year: number) {
  try {
    const { data } = await api.get(`/api/Transaction/GetByCategory`, {
      params: {
        categoryName: category,
        year: year,
        month: month,
      },
    });

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Erro na API:", error);
    throw error;
  }
}

export async function getTransactionsByMonthAndYear(month: number, year: number) {
  try {
    console.log("entrei no service", month, year);

    const { data } = await api.get(`/api/Transaction/GetByMonthAndYear`, {
      params: {
        year: year,
        month: month,
      },
    });

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Erro na API:", error);
    throw error;
  }
}
