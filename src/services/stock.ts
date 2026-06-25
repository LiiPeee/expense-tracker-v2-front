import { PagedStocksResponse, StockRequest } from "@/helper/stock";
import { getJson, postVoid } from "@/lib/api";

export async function createStock(data: StockRequest): Promise<void> {
  await postVoid("/Stock/Create", data, { fallback: "Falha ao criar ativo" });
}

export async function getAllStocks(pageNumber = 1): Promise<PagedStocksResponse> {
  // Backend binds [FromQuery] int page, so the query key must be `page` (not `pageNumber`).
  return getJson<PagedStocksResponse>("/Stock/GetAllStock", { page: pageNumber }, "Falha ao buscar ativos");
}
