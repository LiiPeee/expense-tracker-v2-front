import { CategoryRequest } from "@/helper/category";
import { authFetch, BASE_URL, readJsonOrThrow } from "@/lib/api";

export async function getAll() {
  const response = await authFetch(`${BASE_URL}/Category/GetAll`);
  const data = await readJsonOrThrow<unknown>(response, "Falha ao buscar categorias");
  return Array.isArray(data) ? data : [];
}

export async function create(input: CategoryRequest) {
  const response = await authFetch(`${BASE_URL}/Category/Create`, {
    method: "POST",
    body: JSON.stringify(input),
  });

  return readJsonOrThrow<unknown>(response, "Falha ao criar categoria");
}
