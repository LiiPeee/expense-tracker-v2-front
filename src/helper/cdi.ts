export function parseCdiRateInput(value: string): number | null {
  const rate = parseFloat(value.replace(",", "."));
  return Number.isFinite(rate) && rate > 0 ? rate : null;
}

export function hasValidRates(principal: number, cdbRate: number, cdiAnnualRate: number): boolean {
  return (
    Number.isFinite(principal) && principal > 0 &&
    Number.isFinite(cdbRate) && cdbRate > 0 &&
    Number.isFinite(cdiAnnualRate) && cdiAnnualRate > 0
  );
}

export interface CdiAccruedInputs {
  principal: number;
  cdbRate: number;
  cdiAnnualRate: number;
  investmentDate: string;
}

export interface CdiAccruedSummary {
  elapsedDays: number;
  accruedValue: number;
  totalEarnings: number;
  currentDailyEarnings: number;
}

export interface CdiDailyRow {
  dayIndex: number;
  date: string;
  year: number;
  month: number;
  earnings: number;
  accumulatedValue: number;
}

export interface CdiMonthHistoryRow {
  year: number;
  month: number;
  earnings: number;
  accumulatedValue: number;
}

function isAccruedValid(inputs: CdiAccruedInputs): boolean {
  return hasValidRates(inputs.principal, inputs.cdbRate, inputs.cdiAnnualRate) && !Number.isNaN(new Date(inputs.investmentDate).getTime());
}

function calcDailyRate(cdbRate: number, cdiAnnualRate: number): number {
  const effectiveAnnualRate = (cdiAnnualRate / 100) * (cdbRate / 100);
  return Math.pow(1 + effectiveAnnualRate, 1 / 252) - 1;
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

// `investmentDate` (string "YYYY-MM-DD") is parsed as UTC midnight per the ECMAScript spec, but `today`
// is a real local Date — comparing them with local setHours() shifts `start` back a day in any
// negative-UTC-offset zone (e.g. Brazil, GMT-3), the same pitfall already fixed in getMonthNames (utils.ts).
// Normalizing both sides to a UTC-midnight timestamp of their own calendar date avoids that entirely.
function toUtcMidnight(year: number, month: number, day: number): number {
  return Date.UTC(year, month, day);
}

export function calcElapsedCalendarDays(investmentDate: string, today: Date): number {
  const start = new Date(investmentDate);
  const startUtcMidnight = toUtcMidnight(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate());
  const endUtcMidnight = toUtcMidnight(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.max(0, Math.floor((endUtcMidnight - startUtcMidnight) / MS_PER_DAY));
}

export function calcCdiAccruedSummary(inputs: CdiAccruedInputs, today: Date): CdiAccruedSummary {
  if (!isAccruedValid(inputs)) {
    return { elapsedDays: 0, accruedValue: inputs.principal, totalEarnings: 0, currentDailyEarnings: 0 };
  }

  const dailyRate = calcDailyRate(inputs.cdbRate, inputs.cdiAnnualRate);
  const elapsedDays = calcElapsedCalendarDays(inputs.investmentDate, today);
  const accruedValue = inputs.principal * Math.pow(1 + dailyRate, elapsedDays);

  return {
    elapsedDays,
    accruedValue,
    totalEarnings: accruedValue - inputs.principal,
    currentDailyEarnings: accruedValue * dailyRate,
  };
}

export function calcCdiDailyHistory(inputs: CdiAccruedInputs, today: Date): CdiDailyRow[] {
  if (!isAccruedValid(inputs)) return [];

  const dailyRate = calcDailyRate(inputs.cdbRate, inputs.cdiAnnualRate);
  const elapsedDays = calcElapsedCalendarDays(inputs.investmentDate, today);
  const start = new Date(inputs.investmentDate);
  const startUtcMidnight = toUtcMidnight(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate());

  const rows: CdiDailyRow[] = [];
  let previousValue = inputs.principal;

  for (let day = 1; day <= elapsedDays; day++) {
    const accumulatedValue = inputs.principal * Math.pow(1 + dailyRate, day);
    const date = new Date(startUtcMidnight + day * MS_PER_DAY);
    rows.push({
      dayIndex: day,
      date: date.toISOString().slice(0, 10),
      year: date.getUTCFullYear(),
      month: date.getUTCMonth() + 1,
      earnings: accumulatedValue - previousValue,
      accumulatedValue,
    });
    previousValue = accumulatedValue;
  }

  return rows;
}

export function aggregateDailyToMonthly(daily: CdiDailyRow[]): CdiMonthHistoryRow[] {
  const rows: CdiMonthHistoryRow[] = [];
  const indexByKey = new Map<string, number>();

  for (const day of daily) {
    const key = `${day.year}-${day.month}`;
    const index = indexByKey.get(key);
    if (index !== undefined) {
      rows[index].earnings += day.earnings;
      rows[index].accumulatedValue = day.accumulatedValue;
    } else {
      indexByKey.set(key, rows.length);
      rows.push({ year: day.year, month: day.month, earnings: day.earnings, accumulatedValue: day.accumulatedValue });
    }
  }

  return rows;
}

export interface CdbHistoryPreset {
  ticker: string;
  principal: number;
  cdbRate: number;
  investmentDate: string;
}

export function isCdbHistoryPreset(value: unknown): value is CdbHistoryPreset {
  if (typeof value !== "object" || value === null) return false;
  const preset = value as Record<string, unknown>;
  return (
    typeof preset.ticker === "string" &&
    typeof preset.principal === "number" &&
    typeof preset.cdbRate === "number" &&
    typeof preset.investmentDate === "string"
  );
}
