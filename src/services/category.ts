import { CategoryRequest } from "@/helper/category";
import { authFetch, BASE_URL } from "@/lib/api";

export async function getAll() {
  const response = await authFetch(`${BASE_URL}/Category/GetAll`);
  if (!response.ok) throw new Error("Falha ao buscar categorias");

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function create(input: CategoryRequest) {
  const response = await authFetch(`${BASE_URL}/Category/Create`, {
    method: "POST",
    body: JSON.stringify(input),
  });
  if (!response.ok) throw new Error("Falha ao criar categoria");

  return response.json();
}
