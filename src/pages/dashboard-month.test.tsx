import type { BudgetLimit } from "@/helper/budget";
import { getDefaultYearMonth } from "@/helper/utils";
import { getBudgetLimitsByAccountPage } from "@/services/budget";
import { getExpenseValue } from "@/services/transaction";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "./Dashboard";

vi.mock("@/services/contact", () => ({
  getAllContacts: vi.fn(async () => []),
  createContact: vi.fn(async () => true),
  editContact: vi.fn(async () => true),
  deleteContact: vi.fn(async () => undefined),
}));

vi.mock("@/services/budget", () => ({
  getBudgetLimitsByAccountPage: vi.fn(async () => ({ pageNumber: 1, pageSize: 10, totalRecords: 0, items: [] })),
  createBudgetLimit: vi.fn(async () => undefined),
}));

vi.mock("@/services/transaction", async () => {
  const actual = await vi.importActual<typeof import("@/services/transaction")>("@/services/transaction");
  return {
    ...actual,
    getExpenseValue: vi.fn(async () => 0),
    getIncomeValue: vi.fn(async () => 0),
    getEconomy: vi.fn(async () => 0),
    getTransactionsByTypePaged: vi.fn(async () => ({ pageNumber: 1, pageSize: 10, totalRecords: 0, items: [] })),
    createTransaction: vi.fn(async () => undefined),
  };
});

const mockedGetExpenseValue = vi.mocked(getExpenseValue);
const mockedGetBudgets = vi.mocked(getBudgetLimitsByAccountPage);

function overBudget(month: number, year: number): BudgetLimit {
  return { id: 1, month, year, accountId: 7, limitAmount: 100, percentage: 120, isLimit: true, category: { id: 1, name: "Lazer" } };
}

function renderDashboard() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Dashboard />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

function nextMonth(month: number, year: number) {
  const shifted = new Date(year, month, 1);
  return { month: shifted.getMonth() + 1, year: shifted.getFullYear() };
}

describe("Dashboard month navigation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads the current month on mount and re-queries when stepping to the next month", async () => {
    const { month, year } = getDefaultYearMonth();
    renderDashboard();

    await waitFor(() => {
      expect(mockedGetExpenseValue).toHaveBeenCalledWith(month, year);
    });

    fireEvent.click(screen.getByLabelText("Próximo mês"));

    const next = nextMonth(month, year);
    await waitFor(() => {
      expect(mockedGetExpenseValue).toHaveBeenCalledWith(next.month, next.year);
    });
  });

  it("shows a budget alert when the selected month has an over-limit budget", async () => {
    const { month, year } = getDefaultYearMonth();
    mockedGetBudgets.mockResolvedValue({ pageNumber: 1, pageSize: 1, totalRecords: 1, items: [overBudget(month, year)] });

    renderDashboard();

    expect(await screen.findByText("Atenção aos orçamentos")).toBeInTheDocument();
    expect(screen.getByText("1 orçamento acima do limite neste mês.")).toBeInTheDocument();
  });

  it("does not show a budget alert when the over-limit budget belongs to another month", async () => {
    const { month, year } = getDefaultYearMonth();
    const other = nextMonth(month, year);
    mockedGetBudgets.mockResolvedValue({ pageNumber: 1, pageSize: 1, totalRecords: 1, items: [overBudget(other.month, other.year)] });

    renderDashboard();

    await waitFor(() => {
      expect(mockedGetExpenseValue).toHaveBeenCalledWith(month, year);
    });
    expect(screen.queryByText("Atenção aos orçamentos")).not.toBeInTheDocument();
  });
});
