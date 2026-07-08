process.env.TZ = "America/Sao_Paulo";

import {
  aggregateDailyToMonthly,
  calcCdiAccruedSummary,
  calcCdiDailyHistory,
  calcElapsedCalendarDays,
  hasValidRates,
  parseCdiRateInput,
} from "./cdi";

const RATES = { cdbRate: 120, cdiAnnualRate: 13.65 };

describe("parseCdiRateInput", () => {
  it("parses a comma-decimal rate", () => {
    expect(parseCdiRateInput("14,15")).toBe(14.15);
  });

  it("parses a dot-decimal rate", () => {
    expect(parseCdiRateInput("14.15")).toBe(14.15);
  });

  it("rejects zero, negative and non-numeric input", () => {
    expect(parseCdiRateInput("0")).toBeNull();
    expect(parseCdiRateInput("-5")).toBeNull();
    expect(parseCdiRateInput("")).toBeNull();
    expect(parseCdiRateInput("abc")).toBeNull();
  });
});

describe("hasValidRates", () => {
  it("accepts finite positive rates", () => {
    expect(hasValidRates(1000, 120, 13.65)).toBe(true);
  });

  it("rejects zero, negative, NaN and Infinity", () => {
    expect(hasValidRates(0, 120, 13.65)).toBe(false);
    expect(hasValidRates(1000, -1, 13.65)).toBe(false);
    expect(hasValidRates(1000, 120, NaN)).toBe(false);
    expect(hasValidRates(Infinity, 120, 13.65)).toBe(false);
  });
});

describe("calcElapsedCalendarDays", () => {
  it("returns 0 for an investment made today, even in a negative-UTC-offset timezone", () => {
    const today = new Date();
    const investmentDate = today.toISOString().slice(0, 10);
    expect(calcElapsedCalendarDays(investmentDate, today)).toBe(0);
  });

  it("counts full calendar days elapsed", () => {
    const today = new Date("2026-07-16T15:00:00Z");
    expect(calcElapsedCalendarDays("2026-07-06", today)).toBe(10);
  });

  it("never returns a negative count for a future date", () => {
    const today = new Date("2026-07-06T12:00:00Z");
    expect(calcElapsedCalendarDays("2026-08-01", today)).toBe(0);
  });
});

describe("calcCdiAccruedSummary", () => {
  it("reports no earnings for an investment made today", () => {
    const today = new Date();
    const investmentDate = today.toISOString().slice(0, 10);
    const summary = calcCdiAccruedSummary({ principal: 1000, investmentDate, ...RATES }, today);
    expect(summary.elapsedDays).toBe(0);
    expect(summary.accruedValue).toBe(1000);
    expect(summary.totalEarnings).toBe(0);
  });

  it("compounds principal over the elapsed days", () => {
    const today = new Date("2026-07-16T12:00:00Z");
    const summary = calcCdiAccruedSummary({ principal: 1000, investmentDate: "2026-07-06", ...RATES }, today);
    expect(summary.elapsedDays).toBe(10);
    expect(summary.accruedValue).toBeGreaterThan(1000);
    expect(summary.totalEarnings).toBeCloseTo(summary.accruedValue - 1000, 10);
  });
});

describe("calcCdiDailyHistory", () => {
  it("returns no rows for an investment made today", () => {
    const today = new Date();
    const investmentDate = today.toISOString().slice(0, 10);
    expect(calcCdiDailyHistory({ principal: 1000, investmentDate, ...RATES }, today)).toEqual([]);
  });

  it("returns one row per elapsed day with increasing accumulated value", () => {
    const today = new Date("2026-07-09T12:00:00Z");
    const rows = calcCdiDailyHistory({ principal: 1000, investmentDate: "2026-07-06", ...RATES }, today);

    expect(rows).toHaveLength(3);
    expect(rows.map((row) => row.date)).toEqual(["2026-07-07", "2026-07-08", "2026-07-09"]);
    expect(rows[2].accumulatedValue).toBeGreaterThan(rows[0].accumulatedValue);
  });
});

describe("aggregateDailyToMonthly", () => {
  it("groups daily rows into calendar months, keeping the last accumulated value", () => {
    const today = new Date("2026-08-02T12:00:00Z");
    const daily = calcCdiDailyHistory({ principal: 1000, investmentDate: "2026-07-30", ...RATES }, today);

    const monthly = aggregateDailyToMonthly(daily);

    expect(monthly).toEqual([
      { year: 2026, month: 7, earnings: expect.any(Number), accumulatedValue: expect.any(Number) },
      { year: 2026, month: 8, earnings: expect.any(Number), accumulatedValue: expect.any(Number) },
    ]);
    expect(monthly[1].accumulatedValue).toBe(daily[daily.length - 1].accumulatedValue);
  });
});
