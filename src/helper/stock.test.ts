process.env.TZ = "America/Sao_Paulo";

import { calcFixedIncomeChangePercentage } from "./stock";
import type { StockResponse } from "./stock";

const CDI_ANNUAL_RATE = 14.15;

function buildCdb(overrides: Partial<StockResponse> = {}): StockResponse {
  return {
    ticker: "CDB MERCADO PAGO",
    quantity: 1,
    priceMarket: 0,
    priceBuyed: 554.16,
    percentage: "-100.00%",
    isStock: false,
    cdiRate: 100,
    investmentDate: "2026-06-06",
    ...overrides,
  };
}

describe("calcFixedIncomeChangePercentage", () => {
  it("returns null for equities (isStock true)", () => {
    const stock = buildCdb({ isStock: true });
    expect(calcFixedIncomeChangePercentage(stock, CDI_ANNUAL_RATE, new Date("2026-07-06"))).toBeNull();
  });

  it("returns null when cdiRate is missing", () => {
    const stock = buildCdb({ cdiRate: null });
    expect(calcFixedIncomeChangePercentage(stock, CDI_ANNUAL_RATE, new Date("2026-07-06"))).toBeNull();
  });

  it("returns null when investmentDate is missing", () => {
    const stock = buildCdb({ investmentDate: null });
    expect(calcFixedIncomeChangePercentage(stock, CDI_ANNUAL_RATE, new Date("2026-07-06"))).toBeNull();
  });

  it("returns null when principal is zero or negative", () => {
    const stock = buildCdb({ priceBuyed: 0 });
    expect(calcFixedIncomeChangePercentage(stock, CDI_ANNUAL_RATE, new Date("2026-07-06"))).toBeNull();
  });

  it("returns null (not a fake 0.00%) when cdiAnnualRate is invalid", () => {
    const stock = buildCdb();
    expect(calcFixedIncomeChangePercentage(stock, 0, new Date("2026-07-06"))).toBeNull();
    expect(calcFixedIncomeChangePercentage(stock, -1, new Date("2026-07-06"))).toBeNull();
    expect(calcFixedIncomeChangePercentage(stock, NaN, new Date("2026-07-06"))).toBeNull();
  });

  it("returns 0.00% for an investment made today", () => {
    const today = new Date("2026-06-06T12:00:00Z");
    const stock = buildCdb({ investmentDate: "2026-06-06" });
    expect(calcFixedIncomeChangePercentage(stock, CDI_ANNUAL_RATE, today)).toBe("0.00%");
  });

  it("returns a positive percentage for elapsed days, replacing the broken backend value", () => {
    const today = new Date("2026-07-06T12:00:00Z");
    const stock = buildCdb();
    const result = calcFixedIncomeChangePercentage(stock, CDI_ANNUAL_RATE, today);
    expect(result).not.toBeNull();
    expect(result).not.toBe(stock.percentage);
    expect(result?.startsWith("-")).toBe(false);
    expect(Number(result?.replace("%", ""))).toBeGreaterThan(0);
  });
});
