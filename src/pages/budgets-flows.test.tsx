import type { BudgetLimit, PagedBudgetLimitsResponse } from "@/helper/budget";
import { createBudgetLimit, getBudgetLimitsByAccountPage } from "@/services/budget";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";
import Budgets from "./Budgets";

vi.mock("@/services/budget", () => ({
  createBudgetLimit: vi.fn(async () => undefined),
  getBudgetLimitsByAccountPage: vi.fn(),
}));

const mockedCreateBudgetLimit = vi.mocked(createBudgetLimit);
const mockedGetBudgetLimitsByAccountPage = vi.mocked(getBudgetLimitsByAccountPage);

const budgetItems: BudgetLimit[] = Array.from({ length: 11 }, (_, index) => ({
  id: index + 1,
  month: index === 10 ? 2 : 1,
  year: 2026,
  accountId: 7,
  limitAmount: index === 10 ? 999 : 100 + index,
  percentage: index + 1,
  isLimit: index % 2 === 0,
  category: {
    id: index + 1,
    name: index === 10 ? "Saúde" : index === 0 ? "Alimentação" : `Moradia ${index + 1}`,
  },
}));

function createPaged(items: BudgetLimit[], pageNumber = 1): PagedBudgetLimitsResponse {
  return {
    pageNumber,
    pageSize: items.length,
    totalRecords: items.length,
    items,
  };
}

function renderWithProviders(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        {ui}
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("budgets page flows", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetBudgetLimitsByAccountPage.mockResolvedValue(createPaged(budgetItems));
  });

  it("loads budgets, filters by name and category, and paginates", async () => {
    renderWithProviders(<Budgets />);

    await waitFor(() => {
      expect(mockedGetBudgetLimitsByAccountPage).toHaveBeenCalledWith(1);
    });

    expect(await screen.findByText("Alimentação")).toBeInTheDocument();
    expect(screen.queryByText("Saúde")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("link", { name: "2" }));

    await waitFor(() => {
      expect(screen.getByText("Saúde")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Filtrar por nome"), { target: { value: "Saú" } });

    await waitFor(() => {
      expect(screen.getByText("Saúde")).toBeInTheDocument();
      expect(screen.queryByText("Alimentação")).not.toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Filtrar por nome"), { target: { value: "" } });
    fireEvent.click(screen.getByRole("combobox", { name: "Filtrar por categoria" }));
    fireEvent.click(await screen.findByRole("option", { name: "Alimentação" }));

    // "Alimentação" também aparece no trigger do Select, então verificamos a célula da tabela.
    await waitFor(() => {
      expect(screen.getByRole("cell", { name: "Alimentação" })).toBeInTheDocument();
      expect(screen.queryByRole("cell", { name: "Saúde" })).not.toBeInTheDocument();
    });
  });

  it("opens the budget creation flow from the header action", async () => {
    renderWithProviders(<Budgets />);

    await waitFor(() => {
      expect(mockedGetBudgetLimitsByAccountPage).toHaveBeenCalledWith(1);
    });

    fireEvent.click(screen.getByRole("button", { name: "Novo Orçamento" }));

    expect(await screen.findByRole("heading", { name: "Novo Orçamento" })).toBeInTheDocument();
    expect(screen.getByLabelText("Categoria")).toBeInTheDocument();
    expect(screen.getByLabelText("Mês")).toBeInTheDocument();
    expect(screen.getByLabelText("Ano")).toBeInTheDocument();
    expect(screen.getByLabelText("Limite")).toBeInTheDocument();
    expect(mockedCreateBudgetLimit).not.toHaveBeenCalled();
  });

  it("shows inline validation errors and blocks submit when required fields are empty", async () => {
    renderWithProviders(<Budgets />);

    await waitFor(() => {
      expect(mockedGetBudgetLimitsByAccountPage).toHaveBeenCalledWith(1);
    });

    fireEvent.click(screen.getByRole("button", { name: "Novo Orçamento" }));
    fireEvent.click(await screen.findByRole("button", { name: "Criar" }));

    expect(await screen.findByText("Categoria é obrigatória")).toBeInTheDocument();
    expect(await screen.findByText("Limite deve ser maior que zero")).toBeInTheDocument();
    expect(mockedCreateBudgetLimit).not.toHaveBeenCalled();
  });
});
