import { PagedStocksResponse, StockRequest } from "@/helper/stock";
import { getJson, postVoid } from "@/lib/api";

export async function createStock(data: StockRequest): Promise<void> {
  await postVoid("/Stock/Create", data, { fallback: "Falha ao criar ativo" });
}

export async function getAllStocks(pageNumber = 1): Promise<PagedStocksResponse> {
  return getJson<PagedStocksResponse>("/Stock/GetAllStock", { pageNumber }, "Falha ao buscar ativos");
}
