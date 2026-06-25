import type { BudgetLimit } from "@/helper/budget";
import { getBudgetLimitsByAccountPage } from "@/services/budget";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Budgets from "./Budgets";

vi.mock("@/services/budget", () => ({
  createBudgetLimit: vi.fn(async () => undefined),
  getBudgetLimitsByAccountPage: vi.fn(),
}));

const mockedGetBudgets = vi.mocked(getBudgetLimitsByAccountPage);

const overBudget: BudgetLimit = {
  id: 1,
  month: 1,
  year: 2026,
  accountId: 7,
  limitAmount: 100,
  percentage: 120,
  isLimit: true,
  category: { id: 1, name: "Alimentação" },
};

function renderBudgets() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Budgets />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("budget alerts", () => {
  beforeEach(() => vi.clearAllMocks());

  it("flags an over-limit budget with a badge and a summary banner", async () => {
    mockedGetBudgets.mockResolvedValue({ pageNumber: 1, pageSize: 1, totalRecords: 1, items: [overBudget] });

    renderBudgets();

    expect(await screen.findByText("Acima do limite")).toBeInTheDocument();
    expect(screen.getByText("Atenção aos seus orçamentos")).toBeInTheDocument();
    expect(screen.getByText("1 acima do limite.")).toBeInTheDocument();
  });

  it("renders the flat categoryName and spentAmount from BudgetLimitOutput", async () => {
    const output: BudgetLimit = { id: 2, month: 1, year: 2026, limitAmount: 200, spentAmount: 150, percentage: 75, isLimit: false, categoryName: "Transporte" };
    mockedGetBudgets.mockResolvedValue({ pageNumber: 1, pageSize: 1, totalRecords: 1, items: [output] });

    renderBudgets();

    expect(await screen.findByText("Transporte")).toBeInTheDocument();
    expect(screen.getByText("R$ 150,00")).toBeInTheDocument();
  });
});
