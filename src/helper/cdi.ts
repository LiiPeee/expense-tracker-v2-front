export interface CdiInputs {
  principal: number;
  cdbRate: number;
  cdiAnnualRate: number;
  months: number;
}

export interface CdiSummary {
  effectiveAnnualRate: number;
  dailyRate: number;
  dailyEarnings: number;
  monthlyEarnings: number;
  annualEarnings: number;
  grossValue: number;
  totalGrossEarnings: number;
}

export interface CdiMonthRow {
  month: number;
  accumulatedValue: number;
  monthEarnings: number;
}

function isValid(inputs: CdiInputs): boolean {
  return (
    Number.isFinite(inputs.principal) && inputs.principal > 0 &&
    Number.isFinite(inputs.cdbRate) && inputs.cdbRate > 0 &&
    Number.isFinite(inputs.cdiAnnualRate) && inputs.cdiAnnualRate > 0 &&
    Number.isFinite(inputs.months) && inputs.months > 0
  );
}

export function calcCdiSummary(inputs: CdiInputs): CdiSummary {
  if (!isValid(inputs)) {
    return { effectiveAnnualRate: 0, dailyRate: 0, dailyEarnings: 0, monthlyEarnings: 0, annualEarnings: 0, grossValue: inputs.principal, totalGrossEarnings: 0 };
  }

  const effectiveAnnualRate = (inputs.cdiAnnualRate / 100) * (inputs.cdbRate / 100);
  const dailyRate = Math.pow(1 + effectiveAnnualRate, 1 / 252) - 1;

  return {
    effectiveAnnualRate,
    dailyRate,
    dailyEarnings: inputs.principal * dailyRate,
    monthlyEarnings: inputs.principal * (Math.pow(1 + dailyRate, 21) - 1),
    annualEarnings: inputs.principal * (Math.pow(1 + dailyRate, 252) - 1),
    grossValue: inputs.principal * Math.pow(1 + dailyRate, inputs.months * 21),
    totalGrossEarnings: inputs.principal * Math.pow(1 + dailyRate, inputs.months * 21) - inputs.principal,
  };
}

export function calcCdiMonthlyProjection(inputs: CdiInputs): CdiMonthRow[] {
  if (!isValid(inputs)) return [];

  const effectiveAnnualRate = (inputs.cdiAnnualRate / 100) * (inputs.cdbRate / 100);
  const dailyRate = Math.pow(1 + effectiveAnnualRate, 1 / 252) - 1;

  const rows: CdiMonthRow[] = [];
  let previousValue = inputs.principal;

  for (let month = 1; month <= inputs.months; month++) {
    const accumulatedValue = inputs.principal * Math.pow(1 + dailyRate, month * 21);
    rows.push({ month, accumulatedValue, monthEarnings: accumulatedValue - previousValue });
    previousValue = accumulatedValue;
  }

  return rows;
}
