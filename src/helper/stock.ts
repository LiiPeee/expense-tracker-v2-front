import { z } from "zod";

export interface StockRequest {
  ticker: string;
  title: string;
  price: number;
  quantity: number;
  description?: string;
}

export interface StockResponse {
  ticker: string;
  priceMarket: number;
  priceBuyed: number;
  percentage: string;
}

export type PagedStocksResponse = {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  items: StockResponse[];
};

export interface StockForm {
  ticker: string;
  title: string;
  price: string;
  quantity: string;
  description: string;
}

export const stockFormDefaults: StockForm = {
  ticker: "",
  title: "",
  price: "",
  quantity: "",
  description: "",
};

export const stockFormSchema = z.object({
  ticker: z.string().trim().min(1, "Ticker é obrigatório"),
  title: z.string().trim().min(1, "Nome é obrigatório"),
  price: z.string().refine((v) => v.trim() !== "" && !Number.isNaN(Number(v.replace(",", "."))), "Preço inválido"),
  quantity: z.string().refine((v) => v.trim() !== "" && Number.isInteger(Number(v)) && Number(v) > 0, "Quantidade inválida"),
  description: z.string(),
});

export function mapStockFormToRequest(form: StockForm): StockRequest {
  return {
    ticker: form.ticker.trim().toUpperCase(),
    title: form.title.trim(),
    price: Number.parseFloat(form.price.replace(",", ".")),
    quantity: Number.parseInt(form.quantity, 10),
    description: form.description.trim() || undefined,
  };
}
