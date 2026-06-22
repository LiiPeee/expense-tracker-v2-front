import { authFetch, BASE_URL, readJsonOrThrow } from "@/lib/api";

export async function getAll() {
  const response = await authFetch(`${BASE_URL}/Category/GetAll`);
  const data = await readJsonOrThrow<unknown>(response, "Falha ao buscar categorias");
  return Array.isArray(data) ? data : [];
}
