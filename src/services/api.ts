/**
 * API Service
 * 
 * Configure aqui as chamadas para seu backend existente.
 * Substitua a BASE_URL pela URL da sua API.
 */

const BASE_URL = process.env.VITE_API_URL || 'http://localhost:3000/api';

interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: string;
}

interface Balance {
  total: number;
  income: number;
  expenses: number;
  savings: number;
}

/**
 * Exemplo de chamada GET para buscar o saldo
 */
export const getBalance = async (userId: string): Promise<Balance> => {
  try {
    const response = await fetch(`${BASE_URL}/balance/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Adicione headers de autenticação se necessário
        // 'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar saldo');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
};

/**
 * Exemplo de chamada GET para buscar transações
 */
export const getTransactions = async (userId: string): Promise<Transaction[]> => {
  try {
    const response = await fetch(`${BASE_URL}/transactions/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar transações');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
};

/**
 * Exemplo de chamada POST para criar uma transação
 */
export const createTransaction = async (
  userId: string,
  transaction: Omit<Transaction, 'id'>
): Promise<Transaction> => {
  try {
    const response = await fetch(`${BASE_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        ...transaction,
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao criar transação');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
};
