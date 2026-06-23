import type { Category } from "@/helper/category";
import { getJson } from "@/lib/api";

export async function getAll(): Promise<Category[]> {
  const data = await getJson<unknown>("/Category/GetAll", undefined, "Falha ao buscar categorias");
  return Array.isArray(data) ? (data as Category[]) : [];
}
