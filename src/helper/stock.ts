import { z } from "zod";
import { calcCdiAccruedSummary, hasValidRates } from "./cdi";

export const FIXED_INCOME_TYPES = [
  "CDB",
  "LCI",
  "LCA",
  "CRI",
  "CRA",
  "Debênture",
  "Tesouro Prefixado",
  "Tesouro Selic",
  "LC",
  "LIG",
  "RDB",
  "DPGE",
  "FIDC",
  "Poupança",
  "CCB",
] as const;

export type FixedIncomeType = (typeof FIXED_INCOME_TYPES)[number];

export interface StockRequest {
  ticker: string;
  title: string;
  price: number;
  quantity: number;
  description?: string;
  cdiRate?: number;
  investmentDate?: string;
  isStock?: boolean;
  fixedIncomeType?: string;
}

export interface StockResponse {
  ticker: string;
  quantity: number;
  priceMarket: number;
  priceBuyed: number;
  percentage: string;
  cdiRate?: number | null;
  investmentDate?: string | null;
  isStock?: boolean;
  fixedIncomeType?: string | null;
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
  cdiRate: string;
  investmentDate: string;
  isStock: string;
  fixedIncomeType: string;
}

export const stockFormDefaults: StockForm = {
  ticker: "",
  title: "",
  price: "",
  quantity: "",
  description: "",
  cdiRate: "",
  investmentDate: "",
  isStock: "true",
  fixedIncomeType: "",
};

export const stockFormSchema = z.object({
  ticker: z.string().trim().min(1, "validation:tickerRequired"),
  title: z.string().trim().min(1, "validation:nameRequired"),
  price: z.string().refine((v) => v.trim() !== "" && !Number.isNaN(Number(v.replace(",", "."))), "validation:priceInvalid"),
  quantity: z.string().refine((v) => v.trim() !== "" && Number.isInteger(Number(v)) && Number(v) > 0, "validation:quantityInvalid"),
  description: z.string(),
  cdiRate: z.string().refine(
    (v) => v === "" || (!Number.isNaN(Number(v.replace(",", "."))) && Number(v.replace(",", ".")) > 0 && Number(v.replace(",", ".")) <= 500),
    "validation:cdiRateInvalid",
  ),
  investmentDate: z.string(),
  isStock: z.enum(["true", "false"]),
  fixedIncomeType: z.string(),
});

const RENDA_FIXA_PREFIXES = ["CDB", "LCI", "LCA", "CRI", "CRA", "LFT", "LTN", "NTN", "DEB", "COE", "RDB", "LC", "TD", "TESOURO", "POUP", "LIG"];

export function isRendaFixa(ticker: string): boolean {
  const upper = ticker.toUpperCase().trim();
  return RENDA_FIXA_PREFIXES.some((prefix) => upper.startsWith(prefix));
}

export function canViewCdiHistory(
  stock: StockResponse,
): stock is StockResponse & { cdiRate: number; investmentDate: string } {
  return stock.isStock === false && typeof stock.cdiRate === "number" && !!stock.investmentDate;
}

// Fixed-income assets have no market quote — the backend's `percentage` field compares
// priceMarket (always 0) against priceBuyed, producing a bogus -100% instead of real CDI earnings.
export function calcFixedIncomeChangePercentage(stock: StockResponse, cdiAnnualRate: number, today: Date): string | null {
  if (!canViewCdiHistory(stock)) return null;

  const principal = stock.priceBuyed * stock.quantity;
  if (!hasValidRates(principal, stock.cdiRate, cdiAnnualRate)) return null;

  const { totalEarnings } = calcCdiAccruedSummary(
    { principal, cdbRate: stock.cdiRate, cdiAnnualRate, investmentDate: stock.investmentDate },
    today,
  );

  return `${((totalEarnings / principal) * 100).toFixed(2)}%`;
}

export function mapStockFormToRequest(form: StockForm): StockRequest {
  const isRendaFixa = form.isStock === "false";
  return {
    ticker: form.ticker.trim().toUpperCase(),
    title: form.title.trim(),
    price: Number.parseFloat(form.price.replace(",", ".")),
    quantity: Number.parseInt(form.quantity, 10),
    description: form.description.trim() || undefined,
    isStock: !isRendaFixa,
    fixedIncomeType: isRendaFixa ? (form.fixedIncomeType || undefined) : undefined,
    cdiRate: isRendaFixa && form.cdiRate.trim() ? Number.parseFloat(form.cdiRate.replace(",", ".")) : undefined,
    investmentDate: isRendaFixa ? (form.investmentDate.trim() || undefined) : undefined,
  };
}
