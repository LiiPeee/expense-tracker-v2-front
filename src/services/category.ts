import { CategoryRequest } from "@/helper/category";

export const BASE_URL = import.meta.env.VITE_API_URL;

export async function getAll() {
  try {
    const url = `${BASE_URL}/Category/GetAll}`;

    const response = await fetch(url);
    return Array.isArray(response.json()) ? response.json() : [];
  } catch (error) {
    console.error("Erro na API:", error);
    throw error;
  }
}
export async function create(input: CategoryRequest) {
  const response = await fetch(`${BASE_URL}/Category/Create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  return response.json() ? response.json() : null;
}
