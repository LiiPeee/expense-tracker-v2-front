import { type BudgetLimit, getBudgetUsageStatus, summarizeBudgetAlerts } from "./budget";

describe("getBudgetUsageStatus", () => {
  it("classifies usage by threshold", () => {
    expect(getBudgetUsageStatus(50)).toBe("ok");
    expect(getBudgetUsageStatus(79.9)).toBe("ok");
    expect(getBudgetUsageStatus(80)).toBe("warning");
    expect(getBudgetUsageStatus(99.9)).toBe("warning");
    expect(getBudgetUsageStatus(100)).toBe("over");
    expect(getBudgetUsageStatus(150)).toBe("over");
    expect(getBudgetUsageStatus("85")).toBe("warning");
  });

  it("treats missing/invalid percentage as ok", () => {
    expect(getBudgetUsageStatus(null)).toBe("ok");
    expect(getBudgetUsageStatus("")).toBe("ok");
    expect(getBudgetUsageStatus("abc")).toBe("ok");
  });
});

describe("summarizeBudgetAlerts", () => {
  it("counts over and near-limit budgets", () => {
    const budgets = [{ percentage: 120 }, { percentage: 90 }, { percentage: 10 }, { percentage: 100 }] as BudgetLimit[];
    expect(summarizeBudgetAlerts(budgets)).toEqual({ over: 2, warning: 1 });
  });
});
